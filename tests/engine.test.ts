/**
 * Engine tests. Official cases first (GOV.UK worked examples, read on 19 October 2026), then the edges
 * of each rule: the starting rate, the £1,000 / £500 / nil allowance, the band cliff, the £100,000 taper,
 * Scotland, the 2027/28 rates and the ISA rules of SI 2026/1018.
 */
import { describe, it, expect } from 'vitest';
import { interestTax, incomeTax, taxFreeInterest, personalAllowance, compare, grossEquivalentRate, accountTax } from '../src/lib/engine/savings';
import { ageAtEndOfYear, cashLimit, firstYearFullCash, allowance, flexibleRoom, lisaProjection, lisaCharge, lisaGrossFor, juniorProjection } from '../src/lib/engine/isa';
import { impliedRate, prizeChance, odds, simulate, ELIGIBLE } from '../src/lib/engine/premium';
import { P } from '../src/lib/engine/params';

const t = (y: '2026/27' | '2027/28', ns: number, i: number, o = {}) => Math.round(interestTax(y, ns, i, o).tax * 100) / 100;

describe('GOV.UK worked examples (Tax on savings interest)', () => {
  it('starting rate: £16,000 wages and £200 interest leave £1,570 of starting rate and no tax', () => {
    const r = interestTax('2026/27', 16000, 200);
    expect(r.startingAvailable).toBe(1570);
    expect(r.tax).toBe(0);
  });
  it('allowance: a basic rate taxpayer with £1,300 interest pays £60', () => {
    expect(t('2026/27', 30000, 1300)).toBe(60);
  });
  it('the same interest in 2027/28 is taxed at 22 %: £66', () => {
    expect(t('2027/28', 30000, 1300)).toBe(66);
  });
});

describe('Personal Savings Allowance by band (ITA 2007 s.12B)', () => {
  it('higher rate: £500 free, then 40 % (42 % in 2027/28)', () => {
    expect(t('2026/27', 60000, 2000)).toBe(600);
    expect(t('2027/28', 60000, 2000)).toBe(630);
    expect(interestTax('2026/27', 60000, 2000).psa).toBe(500);
  });
  it('additional rate: no allowance, 45 % then 47 %', () => {
    expect(t('2026/27', 150000, 1000)).toBe(450);
    expect(t('2027/28', 150000, 1000)).toBe(470);
  });
  it('the cliff: interest that crosses £50,270 halves the allowance', () => {
    // £49,000 wages: taxable 36,430; £2,000 interest takes the total to 38,430, above the 37,700 limit.
    const r = interestTax('2026/27', 49000, 2000);
    expect(r.psa).toBe(500);
    expect(Math.round(r.tax * 100) / 100).toBe(770 * 0.2 + 730 * 0.4);
  });
  it('£1,000 of interest is all tax free for a basic rate taxpayer', () => {
    expect(t('2026/27', 35000, 1000)).toBe(0);
    expect(t('2026/27', 35000, 1001)).toBe(0.2);
  });
});

describe('Starting rate and Personal Allowance on savings', () => {
  it('£12,570 of pension and £6,000 interest: all tax free (starting rate + allowance)', () => {
    expect(t('2026/27', 12570, 6000)).toBe(0);
    expect(t('2026/27', 12570, 7000)).toBe(200);
  });
  it('unused allowance shelters interest first: £10,000 income lets £8,570 of interest through', () => {
    expect(taxFreeInterest('2026/27', 10000)).toBeCloseTo(8570, 1);
  });
  it('the starting rate is gone at £17,570 of other income', () => {
    expect(incomeTax({ year: '2026/27', nonSavings: 17570, savings: 0 }).startingAvailable).toBe(0);
    expect(incomeTax({ year: '2026/27', nonSavings: 17000, savings: 0 }).startingAvailable).toBe(570);
  });
});

describe('Taper above £100,000 (ITA 2007 s.35)', () => {
  it('allowance lost £1 for £2, nil at £125,140', () => {
    expect(personalAllowance('2026/27', 100000)).toBe(12570);
    expect(personalAllowance('2026/27', 110000)).toBe(7570);
    expect(personalAllowance('2026/27', 125140)).toBe(0);
  });
  it('£2,000 interest on £100,000 wages costs £1,000: £600 on the interest and £400 knock-on', () => {
    const r = interestTax('2026/27', 100000, 2000);
    expect(r.allowanceLost).toBe(1000);
    expect(Math.round(r.knockOn!)).toBe(400);
    expect(Math.round(r.savingsPart)).toBe(600);
  });
  it('Gift Aid or relief-at-source pension contributions lower adjusted net income', () => {
    expect(interestTax('2026/27', 100000, 2000, { extension: 2000 }).allowanceLost).toBe(0);
  });
});

describe('Scotland (ITA 2007 s.11D(6), s.12B(8))', () => {
  it('interest is taxed exactly as in the rest of the UK', () => {
    for (const ns of [20000, 45000, 60000, 160000]) expect(t('2026/27', ns, 3000, { nation: 'scotland' })).toBe(t('2026/27', ns, 3000));
  });
  it('a Scottish higher rate payer on £45,000 keeps the £1,000 allowance (UK bands decide)', () => {
    expect(interestTax('2026/27', 45000, 800, { nation: 'scotland' }).psa).toBe(1000);
  });
  it('2026/27 Scottish rates price the knock-on of the taper; 2027/28 is not yet set', () => {
    const a = interestTax('2026/27', 100000, 2000, { nation: 'scotland' });
    expect(Math.round(a.knockOn!)).toBe(450); // £1,000 more taxable at the 45 % advanced rate
    expect(interestTax('2027/28', 100000, 2000, { nation: 'scotland' }).knockOn).toBeNull();
  });
});

describe('Accounts and comparison', () => {
  it('cash ISA pays no tax; cash in a stocks and shares ISA pays the 22 % charge only from 2027/28', () => {
    expect(accountTax('2026/27', 'cash-isa', 60000, 1000)).toBe(0);
    expect(accountTax('2026/27', 'investment-isa-cash', 60000, 1000)).toBe(0);
    expect(accountTax('2027/28', 'investment-isa-cash', 60000, 1000)).toBe(220);
  });
  it('compare returns both years', () => {
    const c = compare({ nonSavings: 60000, balance: 50000, rate: 0.04, account: 'cash-isa' });
    expect(c.map((x) => Math.round(x.isaGain))).toEqual([600, 630]);
  });
  it('gross equivalent rate: a higher rate payer needs more than the net target', () => {
    const g = grossEquivalentRate('2026/27', 60000, 50000, 2000);
    expect(g).toBeGreaterThan(0.04);
    expect(Math.round(interestTax('2026/27', 60000, 50000 * g).net)).toBe(2000);
  });
});

describe('ISA rules (GOV.UK, SI 2026/1018)', () => {
  it('flexible ISA, GOV.UK example: £10,000 in, £3,000 out', () => {
    expect(flexibleRoom('2026/27', 10000, 3000, true).room).toBe(13000);
    expect(flexibleRoom('2026/27', 10000, 3000, false).room).toBe(10000);
  });
  it('GOV.UK example 2: £11,000 cash, £2,000 shares, £3,000 innovative, £4,000 Lifetime ISA uses the £20,000', () => {
    const r = allowance({ year: '2026/27', cash: 11000, investments: 2000, innovative: 3000, lifetime: 4000, ageAtEnd: 40 });
    expect(r.left).toBe(0); expect(r.overBy).toBe(0);
  });
  it('cash limit from 6 April 2027: £12,000 if 64 or under on 5 April 2028', () => {
    expect(cashLimit('2027/28', ageAtEndOfYear('2027/28', 1963, 4, 5))).toBe(20000);
    expect(cashLimit('2027/28', ageAtEndOfYear('2027/28', 1963, 4, 6))).toBe(12000);
    expect(cashLimit('2026/27', 30)).toBe(20000);
    expect(firstYearFullCash(1970, 6).label).toBe('2035/36');
  });
  it('£15,000 into cash in 2027/28 at 50 is £3,000 over', () => {
    expect(allowance({ year: '2027/28', cash: 15000, investments: 0, lifetime: 0, ageAtEnd: 50 }).cashOverBy).toBe(3000);
  });
});

describe('Lifetime ISA (GOV.UK examples)', () => {
  it('£800 + £200 bonus withdrawn early leaves £750', () => {
    expect(lisaCharge(1000).received).toBe(750);
    expect(lisaCharge(1000).ownMoneyLoss).toBeCloseTo(0.0625, 10);
  });
  it('to cover a £120 bill you withdraw £160', () => {
    expect(lisaGrossFor(120)).toBe(160);
  });
  it('£4,000 a year earns £1,000; payments stop at 50; no new account from 40', () => {
    const r = lisaProjection(45, 4000, 8, 0, 1000);
    expect(r.paid).toBe(20000); expect(r.bonus).toBe(5000); expect(r.stoppedAt50).toBe(true);
    expect(lisaProjection(40, 4000, 3, 0).tooOldToOpen).toBe(true);
  });
});

describe('Junior ISA', () => {
  it('contributions capped at £9,000 a year', () => {
    expect(juniorProjection(0, 1000, 10, 0).paid).toBe(8 * P.junior.annual);
  });
});

describe('Premium Bonds (NS&I October 2026 draw)', () => {
  it('the draw table implies the published 4.35 % rate', () => {
    expect(impliedRate).toBeCloseTo(P.premiumBonds.rate, 4);
  });
  it('£1 has a 1 in 21,000 chance per draw', () => {
    expect(odds(1).perMonthAny).toBeCloseTo(1 / 21000, 12);
    expect(prizeChance(1000000) * ELIGIBLE).toBe(2);
  });
  it('£50,000 wins about 28.6 prizes a year; the median is below the average', () => {
    const o = odds(50000);
    expect(o.expectedPrizesYear).toBeCloseTo(28.57, 1);
    const s = simulate(50000);
    expect(s.median).toBeLessThan(s.mean);
    expect(simulate(50000).median).toBe(s.median); // deterministic
  });
});
