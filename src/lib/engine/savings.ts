/**
 * Income tax on savings interest, 2026/27 and 2027/28. Pure functions; every figure comes from
 * params-2026.json. Tested in tests/engine.test.ts against the worked examples of GOV.UK.
 *
 * Order of the calculation (Income Tax Act 2007):
 *  1. adjusted net income above £100,000 tapers the Personal Allowance (s.35, s.58), and Gift Aid or
 *     relief-at-source pension contributions lower adjusted net income and extend the basic and higher
 *     rate limits (s.10(6), FA 2004 s.192(4));
 *  2. the allowance is set against non-savings income first (s.25), then against savings;
 *  3. savings sit on top of non-savings income: the part inside the lowest £5,000 of taxable income is
 *     taxed at the 0 % starting rate (s.12, starting rate limit frozen by FA 2026 s.9);
 *  4. the Personal Savings Allowance, £1,000, £500 or nil according to the highest band reached
 *     (s.12B), is taxed at the savings nil rate (s.12A); it still uses up band space;
 *  5. what is left is taxed at the savings basic, higher or additional rate according to its place in
 *     the bands (s.11D): 20/40/45 % in 2026/27 (FA 2026 s.3), 22/42/47 % in 2027/28 (FA 2026 s.5).
 *  Scottish taxpayers: savings use the UK bands and the UK test for the allowance (s.11D(6),
 *  s.12B(8)), so the tax on interest is the same; only the knock-on of a tapered allowance on wages is
 *  priced at Scottish rates.
 */
import { P } from './params';

export type YearKey = '2026/27' | '2027/28';
export const YEARS: YearKey[] = ['2026/27', '2027/28'];
export type Nation = 'ruk' | 'scotland';
export const NATION_NAME: Record<Nation, string> = { ruk: 'England, Wales or Northern Ireland', scotland: 'Scotland' };
export type Y = (typeof P.years)['2026/27'];
export const yr = (y: YearKey): Y => P.years[y] as Y;

const clamp0 = (x: number) => (x > 0 ? x : 0);
const overlap = (a: number, b: number, lo: number, hi: number) => clamp0(Math.min(b, hi) - Math.max(a, lo));

export interface TaxInput {
  year: YearKey;
  /** Wages, pension, profits, rent: everything that is not savings or dividends, before tax. */
  nonSavings: number;
  /** Taxable savings interest of the year (all accounts outside ISAs). */
  savings: number;
  /** Gross Gift Aid and relief-at-source pension contributions. */
  extension?: number;
  nation?: Nation;
}

/** Personal Allowance after the taper: £1 lost for each £2 of adjusted net income above £100,000. */
export function personalAllowance(year: YearKey, adjustedNetIncome: number): number {
  const Y = yr(year);
  const excess = clamp0(adjustedNetIncome - Y.taperThreshold);
  return clamp0(Math.ceil(Y.personalAllowance - excess / 2));
}

/** Tax on non-savings income at the main rates (rest of the UK) or Scottish rates; null when not yet set. */
export function nonSavingsTax(year: YearKey, taxable: number, nation: Nation, extension = 0): number | null {
  const Y = yr(year);
  if (nation === 'scotland') {
    if (!Y.scotland) return null;
    let tax = 0, lo = 0;
    for (const b of Y.scotland) {
      const hi = b.upTo === null ? Infinity : b.upTo + (b.name === 'starter' ? 0 : extension);
      tax += overlap(0, taxable, lo, hi) * b.rate; lo = hi;
    }
    return tax;
  }
  const brl = Y.basicRateLimit + extension, hrl = Y.higherRateLimit + extension;
  return overlap(0, taxable, 0, brl) * Y.mainRates.basic + overlap(0, taxable, brl, hrl) * Y.mainRates.higher + overlap(0, taxable, hrl, Infinity) * Y.mainRates.additional;
}

export interface TaxResult {
  year: YearKey;
  personalAllowance: number;
  nonSavingsTaxable: number;
  savingsTaxable: number;
  /** Allowance left over from other income and set against interest. */
  allowanceOnSavings: number;
  startingAvailable: number;
  psa: number;
  band: 'basic' | 'higher' | 'additional';
  atStarting: number;
  atNil: number;
  atBasic: number;
  atHigher: number;
  atAdditional: number;
  savingsTax: number;
  nonSavingsTax: number | null;
}

export function incomeTax(i: TaxInput): TaxResult {
  const Y = yr(i.year);
  const ext = clamp0(i.extension ?? 0);
  const nonSav = clamp0(i.nonSavings), sav = clamp0(i.savings);
  const pa = personalAllowance(i.year, nonSav + sav - ext);
  const nsT = clamp0(nonSav - pa);
  const paLeft = clamp0(pa - nonSav);
  const allowanceOnSavings = Math.min(paLeft, sav);
  const sT = clamp0(sav - paLeft);
  const brl = Y.basicRateLimit + ext, hrl = Y.higherRateLimit + ext;
  const total = nsT + sT;
  const band = total > hrl ? 'additional' : total > brl ? 'higher' : 'basic';
  const psa = Y.psa[band];
  const startingAvailable = clamp0(Y.startingRateLimit - nsT);
  const atStarting = Math.min(sT, startingAvailable);
  const atNil = Math.min(sT - atStarting, psa);
  const rest = sT - atStarting - atNil;
  const p0 = nsT + atStarting + atNil, p1 = p0 + rest;
  const atBasic = overlap(p0, p1, 0, brl), atHigher = overlap(p0, p1, brl, hrl), atAdditional = overlap(p0, p1, hrl, Infinity);
  const R = Y.savingsRates;
  return {
    year: i.year, personalAllowance: pa, nonSavingsTaxable: nsT, savingsTaxable: sT, allowanceOnSavings, startingAvailable, psa, band,
    atStarting, atNil, atBasic, atHigher, atAdditional,
    savingsTax: atBasic * R.basic + atHigher * R.higher + atAdditional * R.additional,
    nonSavingsTax: nonSavingsTax(i.year, nsT, i.nation ?? 'ruk', ext),
  };
}

export interface InterestTax {
  year: YearKey;
  interest: number;
  /** Extra income tax caused by this interest: tax on the savings slice plus the knock-on of a smaller allowance. */
  tax: number;
  savingsPart: number;
  /** Extra tax on other income because the interest tapered the Personal Allowance (null if not yet priceable). */
  knockOn: number | null;
  allowanceLost: number;
  /** True when the knock-on uses this year's main rates because next year's have not been set. */
  ratesAssumed: boolean;
  net: number;
  /** Breakdown of the interest itself, after any other interest already received. */
  free: number;
  atBasic: number;
  atHigher: number;
  atAdditional: number;
  atStarting: number;
  atNil: number;
  allowanceOnSavings: number;
  psa: number;
  startingAvailable: number;
  band: TaxResult['band'];
}

/** Tax caused by `interest` for someone with `nonSavings` income and `otherInterest` already taxable. */
export function interestTax(year: YearKey, nonSavings: number, interest: number, opts: { otherInterest?: number; extension?: number; nation?: Nation } = {}): InterestTax {
  const other = clamp0(opts.otherInterest ?? 0), x = clamp0(interest);
  const base = { year, nonSavings, extension: opts.extension, nation: opts.nation ?? 'ruk' };
  const a = incomeTax({ ...base, savings: other });
  const b = incomeTax({ ...base, savings: other + x });
  const lost = a.personalAllowance - b.personalAllowance;
  let knockOn: number | null = 0;
  if (lost > 0 || a.nonSavingsTaxable !== b.nonSavingsTaxable) knockOn = a.nonSavingsTax === null || b.nonSavingsTax === null ? null : b.nonSavingsTax - a.nonSavingsTax;
  const savingsPart = b.savingsTax - a.savingsTax;
  const tax = savingsPart + (knockOn ?? 0);
  const d = (k: 'atBasic' | 'atHigher' | 'atAdditional' | 'atStarting' | 'atNil' | 'allowanceOnSavings') => clamp0(b[k] - a[k]);
  const atBasic = d('atBasic'), atHigher = d('atHigher'), atAdditional = d('atAdditional');
  return {
    year, interest: x, tax, savingsPart, knockOn, allowanceLost: clamp0(lost),
    ratesAssumed: !yr(year).mainRatesSet && (knockOn ?? 0) !== 0,
    net: x - tax, free: clamp0(x - atBasic - atHigher - atAdditional), atBasic, atHigher, atAdditional,
    atStarting: d('atStarting'), atNil: d('atNil'), allowanceOnSavings: d('allowanceOnSavings'), psa: b.psa, startingAvailable: a.startingAvailable, band: b.band,
  };
}

/** Largest interest that causes no tax at all (bisection on the engine, to the penny). */
export function taxFreeInterest(year: YearKey, nonSavings: number, opts: { otherInterest?: number; extension?: number; nation?: Nation } = {}): number {
  let lo = 0, hi = 200_000;
  if (interestTax(year, nonSavings, hi, opts).tax <= 0.004) return hi;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (interestTax(year, nonSavings, mid, opts).tax > 0.004) hi = mid; else lo = mid; }
  return Math.floor(lo * 100) / 100;
}

/** Tax on the next £100 of interest, as a rate: the marginal rate on savings. */
export function marginalSavingsRate(year: YearKey, nonSavings: number, interest: number, opts: { otherInterest?: number; extension?: number; nation?: Nation } = {}) {
  const t0 = interestTax(year, nonSavings, interest, opts).tax, t1 = interestTax(year, nonSavings, interest + 100, opts).tax;
  return (t1 - t0) / 100;
}

export type Account = 'taxable' | 'cash-isa' | 'investment-isa-cash';
export const ACCOUNT_LABEL: Record<Account, string> = { taxable: 'Taxable savings account', 'cash-isa': 'Cash ISA', 'investment-isa-cash': 'Cash held in a stocks and shares ISA' };

/** Tax on interest inside the chosen account: nothing in a cash ISA, the flat charge on cash in an investment ISA. */
export function accountTax(year: YearKey, account: Account, nonSavings: number, interest: number, opts: { otherInterest?: number; extension?: number; nation?: Nation } = {}): number {
  if (account === 'cash-isa') return 0;
  if (account === 'investment-isa-cash') return clamp0(interest) * yr(year).cashInvestmentIsaCharge;
  return interestTax(year, nonSavings, interest, opts).tax;
}

export interface CompareInput { nonSavings: number; balance: number; rate: number; otherInterest?: number; extension?: number; nation?: Nation; account?: Account }
export interface CompareYear { year: YearKey; interest: number; taxable: InterestTax; accountTax: number; isaGain: number }
/** The main comparison: the same balance and rate in a taxable account and in the chosen account, both years. */
export function compare(i: CompareInput): CompareYear[] {
  const interest = clamp0(i.balance) * clamp0(i.rate);
  const opts = { otherInterest: i.otherInterest, extension: i.extension, nation: i.nation };
  return YEARS.map((year) => {
    const taxable = interestTax(year, i.nonSavings, interest, opts);
    const acc = accountTax(year, i.account ?? 'cash-isa', i.nonSavings, interest, opts);
    return { year, interest, taxable, accountTax: acc, isaGain: taxable.tax - acc };
  });
}

/** Balance that can sit in a taxable account at `rate` before any tax is due. */
export function taxFreeBalance(year: YearKey, nonSavings: number, rate: number, opts: { otherInterest?: number; extension?: number; nation?: Nation } = {}): number {
  if (rate <= 0) return Infinity;
  return taxFreeInterest(year, nonSavings, opts) / rate;
}

/** Gross rate a taxable account must pay to leave `target` net of tax on `balance`. */
export function grossEquivalentRate(year: YearKey, nonSavings: number, balance: number, target: number, opts: { otherInterest?: number; nation?: Nation } = {}): number {
  if (balance <= 0 || target <= 0) return 0;
  let lo = 0, hi = 1;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (interestTax(year, nonSavings, balance * mid, opts).net < target) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
