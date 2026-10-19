/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engines of
 * `lib/engine/` (savings, isa, premium); none computes tax on its own. A page sets its defaults
 * through the `props` of its ToolDef (same ids as the inputs).
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as S from './engine/savings';
import * as I from './engine/isa';
import * as PB from './engine/premium';
import { formatMoney as fm, formatPercent, formatNumber } from './format';

const m = (n: number) => fm(Math.round(n), 0);
const m2 = (n: number) => fm(n, 2);
const pc = (x: number, d = 1) => formatPercent(x, d);
const Y1: S.YearKey = '2026/27', Y2: S.YearKey = '2027/28';
const YEAR_OPTS = [{ value: '0', label: '2026/27 (now)' }, { value: '1', label: '2027/28 (from 6 April 2027)' }];
const yk = (v: number): S.YearKey => (Math.round(v) === 1 ? Y2 : Y1);
const NATION_OPTS = [{ value: '0', label: 'England, Wales or N. Ireland' }, { value: '1', label: 'Scotland' }];
const nation = (v: number): S.Nation => (Math.round(v) === 1 ? 'scotland' : 'ruk');
const YESNO = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
const income = (def: number, label = 'Other income before tax', help = 'Wages, pensions, profits, rent: not interest') => ({ id: 'income', label, def, unit: '£', max: 5_000_000, help });
const money = (id: string, label: string, def: number, help?: string, max = 10_000_000) => ({ id, label, def, unit: '£', max, help });
const rate = (def: number, label = 'Interest rate (AER)') => ({ id: 'rate', label, def, unit: '%', max: 25, decimals: 2 });
const bandName = (b: S.TaxResult['band']) => (b === 'basic' ? 'basic rate' : b === 'higher' ? 'higher rate' : 'additional rate');
const free = (x: S.InterestTax) => x.interest - x.atBasic - x.atHigher - x.atAdditional;

const SPECS: Record<string, MiniSpec> = {
  'interest-tax': {
    title: 'Tax on your interest, this year and next', cta: 'Compare a cash ISA with a taxable account', ctaPage: 'home',
    inputs: [income(42000), money('interest', 'Interest earned in the tax year', 1800, 'All taxable accounts together')],
    run: (v) => { const a = S.interestTax(Y1, v.income, v.interest), b = S.interestTax(Y2, v.income, v.interest);
      return { head: [`Tax in ${Y1}`, m2(a.tax)], rows: [[`Tax in ${Y2} at the new rates`, m2(b.tax)], ['Interest taxed at 0 %', m(free(a))], ['Your allowance on savings', `${m(a.psa)} (${bandName(a.band)})`], ['Interest kept after tax, 2027/28', m2(b.net)]],
        note: a.knockOn ? `Includes ${m2(a.knockOn)} of tax on your other income: the interest reduced your Personal Allowance.` : undefined }; },
  },
  psa: {
    title: 'Your Personal Savings Allowance and what it covers', cta: 'Work out the tax on a whole balance', ctaPage: 'home',
    inputs: [income(55000), rate(4)],
    run: (v) => { const x = S.interestTax(Y1, v.income, 1); const f = S.taxFreeInterest(Y1, v.income); const r = v.rate / 100;
      return { head: ['Personal Savings Allowance', m(x.psa)], rows: [['Interest you can earn tax free in all', m(f)], [`Balance that earns it at ${pc(r, 2)}`, r > 0 ? m(f / r) : 'n/a'], ['Starting rate left', m(x.startingAvailable)], ['Your band once interest is added', bandName(x.band)]],
        note: 'The allowance is £1,000, £500 or nil depending on the highest band your total income reaches, interest included.' }; },
  },
  'starting-rate': {
    title: 'How much of the £5,000 starting rate you keep', cta: 'Full tax on your savings', ctaPage: 'home',
    inputs: [income(15000, 'Income other than savings', 'Pension, wages, rent; before tax'), money('interest', 'Savings interest in the year', 3000)],
    run: (v) => { const t = S.incomeTax({ year: Y1, nonSavings: v.income, savings: v.interest }); const x = S.interestTax(Y1, v.income, v.interest);
      return { head: ['Starting rate available', m(x.startingAvailable)], rows: [['Interest covered by your Personal Allowance', m(x.allowanceOnSavings)], ['Interest taxed at the 0 % starting rate', m(x.atStarting)], ['Interest under the £1,000 or £500 allowance', m(x.atNil)], ['Tax on the interest', m2(x.tax)]],
        note: t.startingAvailable === 0 && v.income > P.years[Y1].personalAllowance + P.years[Y1].startingRateLimit ? 'Your other income is above £17,570, so the starting rate is used up before any interest arrives.' : undefined }; },
  },
  'rates-2027': {
    title: 'What the 2027/28 savings rates add to your bill', cta: 'Your balance in a cash ISA instead', ctaPage: 'home',
    inputs: [income(65000), money('interest', 'Taxable interest a year', 2500)],
    run: (v) => { const a = S.interestTax(Y1, v.income, v.interest), b = S.interestTax(Y2, v.income, v.interest);
      return { head: ['Extra tax from April 2027', m2(b.tax - a.tax)], rows: [[`Tax ${Y1} (20/40/45 %)`, m2(a.tax)], [`Tax ${Y2} (22/42/47 %)`, m2(b.tax)], ['Interest above your allowances', m(b.atBasic + b.atHigher + b.atAdditional)]] }; },
  },
  allowance: {
    title: 'What is left of your ISA allowance', cta: 'How much tax the ISA saves', ctaPage: 'home',
    inputs: [{ id: 'year', label: 'Tax year', def: 0, options: YEAR_OPTS }, money('cash', 'Paid into cash ISAs', 8000, undefined, 1_000_000), money('shares', 'Paid into stocks and shares ISAs', 5000, undefined, 1_000_000), money('lisa', 'Paid into a Lifetime ISA', 0, 'Counts towards the £20,000', 1_000_000), { id: 'age', label: 'Age on 5 April at the end of that year', def: 45, unit: 'yrs', max: 120, decimals: 0 }],
    run: (v) => { const r = I.allowance({ year: yk(v.year), cash: v.cash, investments: v.shares, lifetime: v.lisa, ageAtEnd: Math.round(v.age) });
      const rows: Array<[string, string]> = [['Used so far', m(r.used)], ['Of which you can still put in cash', m(r.cashLeft)], ['Cash limit for you this year', m(r.cashLimit)], ['Lifetime ISA room', m(r.lifetimeLeft)]];
      return { head: [r.overBy > 0 ? 'Over the allowance by' : 'Allowance left', m(r.overBy > 0 ? r.overBy : r.left)], rows,
        note: r.cashOverBy > 0 ? `Cash is ${m(r.cashOverBy)} over your cash limit: from 2027/28 the provider has to refuse or repair the excess.` : r.lifetimeOverBy > 0 ? 'A Lifetime ISA takes £4,000 a year at most.' : undefined }; },
  },
  'cash-limit': {
    title: 'Your cash ISA limit before and after April 2027', cta: 'Tax on what will not fit', ctaPage: 'cash-isa-changes',
    inputs: [{ id: 'by', label: 'Year of birth', def: 1972, max: 2010, decimals: 0 }, { id: 'late', label: 'Birthday between 6 April and 31 December?', def: 1, options: YESNO }, money('save', 'Cash you want to put away each year', 18000, undefined, 1_000_000)],
    run: (v) => { const bm = v.late === 1 ? 6 : 1; const age2 = I.ageAtEndOfYear(Y2, Math.round(v.by), bm); const l1 = I.cashLimit(Y1, age2 - 1), l2 = I.cashLimit(Y2, age2);
      const fy = I.firstYearFullCash(Math.round(v.by), bm);
      return { head: [`Cash ISA limit in ${Y2}`, m(l2)], rows: [[`Limit in ${Y1}`, m(l1)], [`Your age on 5 April 2028`, `${age2}`], ['Cash that will not fit in 2027/28', m(Math.max(0, v.save - l2))], ['First year back at £20,000 in cash', l2 === P.years[Y2].isa.cashFrom65 ? Y2 : fy.label]],
        note: 'Under SI 2026/1018 the £12,000 limit applies in any tax year in which you are 64 or under on 5 April.' }; },
  },
  'cash-overflow': {
    title: 'Tax on cash savings that no longer fit in a cash ISA', cta: 'The whole comparison, both years', ctaPage: 'home',
    inputs: [income(48000), money('extra', 'Cash saved above £12,000 a year', 8000), rate(4)],
    run: (v) => { const i1 = v.extra * v.rate / 100; const b = S.interestTax(Y2, v.income, i1);
      return { head: ['Tax on that interest in 2027/28', m2(b.tax)], rows: [['Interest on the overflow', m2(i1)], ['Taxed at 0 % (allowances)', m(free(b))], ['If you are 65 or over by 5 April 2028', 'it all fits: £20,000 limit']],
        note: 'The tax depends on all your taxable interest: add your other accounts to the full calculator.' }; },
  },
  over65: {
    title: 'Do you keep the £20,000 cash limit in 2027/28?', cta: 'Your cash ISA limit year by year', ctaPage: 'cash-isa-limit',
    inputs: [{ id: 'by', label: 'Year of birth', def: 1963, max: 2010, decimals: 0 }, { id: 'bm', label: 'Month of birth', def: 4, max: 12, decimals: 0, help: '1 = January, 12 = December' }, { id: 'bd', label: 'Day of birth', def: 6, max: 31, decimals: 0 }],
    run: (v) => { const age2 = I.ageAtEndOfYear(Y2, Math.round(v.by), Math.round(v.bm), Math.round(v.bd)); const l2 = I.cashLimit(Y2, age2); const fy = I.firstYearFullCash(Math.round(v.by), Math.round(v.bm), Math.round(v.bd));
      return { head: [`Cash limit in ${Y2}`, m(l2)], rows: [['Age on 5 April 2028', `${age2}`], ['First tax year at £20,000 in cash', fy.label], ['Transfers from investment ISAs into cash', l2 === P.years[Y2].isa.cashFrom65 ? 'allowed' : 'not allowed']],
        note: 'The test is your age on the last day of the tax year, 5 April, not on the day you pay in.' }; },
  },
  flexible: {
    title: 'Room left after taking money out', cta: 'What is left of the whole allowance', ctaPage: 'isa-allowance',
    inputs: [money('paid', 'Paid in this tax year', 10000, undefined, 1_000_000), money('out', 'Taken out this tax year', 3000, undefined, 1_000_000), { id: 'flex', label: 'Is the ISA flexible?', def: 1, options: YESNO }],
    run: (v) => { const a = I.flexibleRoom(Y1, v.paid, v.out, v.flex === 1), b = I.flexibleRoom(Y1, v.paid, v.out, v.flex !== 1);
      return { head: ['You can still pay in', m(a.room)], rows: [['Allowance not yet used', m(a.base)], ['Withdrawals you can put back', m(a.regained)], [v.flex === 1 ? 'If it were not flexible' : 'If it were flexible', m(b.room)]],
        note: 'Money taken out must go back before 5 April of the same tax year to keep this room.' }; },
  },
  transfer: {
    title: 'What switching your ISA is worth', cta: 'Tax you avoid by staying in an ISA', ctaPage: 'home',
    inputs: [money('balance', 'Amount to transfer', 25000), rate(2.5, 'Rate you get now'), { id: 'newrate', label: 'Rate at the new provider', def: 4.2, unit: '%', max: 25, decimals: 2 }, ],
    run: (v) => { const gain = v.balance * (v.newrate - v.rate) / 100; return { head: ['Extra interest a year, tax free', m(gain)], rows: [['Interest now', m(v.balance * v.rate / 100)], ['Interest after switching', m(v.balance * v.newrate / 100)], ['Longest a cash ISA transfer should take', `${P.transfers.cashDays} working days`]],
        note: 'A transfer does not use this year’s allowance. Withdrawing and paying in again does, unless the ISA is flexible.' }; },
  },
  'investment-cash': {
    title: 'The 22 % charge on cash inside a stocks and shares ISA', cta: 'Cash ISA or taxable account', ctaPage: 'home',
    inputs: [money('cash', 'Cash waiting in the investment ISA', 6000), rate(3.5, 'Interest paid on that cash')],
    run: (v) => { const i = v.cash * v.rate / 100; const c1 = S.accountTax(Y1, 'investment-isa-cash', 0, i), c2 = S.accountTax(Y2, 'investment-isa-cash', 0, i);
      return { head: [`Charge in ${Y2}`, m2(c2)], rows: [['Interest on the cash', m2(i)], [`Charge in ${Y1}`, m2(c1)], ['Interest kept from April 2027', m2(i - c2)]],
        note: 'The ISA manager pays the charge out of the account; it is not reclaimable and the Personal Savings Allowance does not apply.' }; },
  },
  aps: {
    title: 'How much you can add after a spouse dies', cta: 'Your own ISA allowance this year', ctaPage: 'isa-allowance',
    inputs: [money('value', 'Their ISA value at death (or at closure, if higher)', 60000), money('used', 'Your own ISA payments this year', 5000, undefined, 1_000_000), rate(4, 'Rate the money earns')],
    run: (v) => { const own = P.years[Y1].isa.overall;
      return { head: ['You can still pay in this year', m(Math.max(0, own - v.used) + v.value)], rows: [['Additional permitted subscription', m(v.value)], ['Your normal allowance left', m(Math.max(0, own - v.used))], ['Tax-free interest a year on the APS', m(v.value * v.rate / 100)]],
        note: 'The extra allowance sits beside your own one; it is used with the provider that held your spouse’s ISA, or another one that accepts it.' }; },
  },
  lisa: {
    title: 'Lifetime ISA: bonus and pot', cta: 'Withdrawal charge if plans change', ctaPage: 'lifetime-isa-withdrawal-penalty',
    inputs: [{ id: 'age', label: 'Your age now', def: 27, unit: 'yrs', max: 60, decimals: 0 }, money('annual', 'Paid in each year', 4000, 'Up to £4,000', 100_000), { id: 'years', label: 'Years until you use it', def: 5, unit: 'yrs', max: 40, decimals: 0 }, { id: 'growth', label: 'Growth or interest a year', def: 3.5, unit: '%', max: 20, decimals: 1 }],
    run: (v) => { const r = I.lisaProjection(Math.round(v.age), v.annual, v.years, v.growth / 100);
      return { head: ['Pot when you use it', m(r.value)], rows: [['Your payments', m(r.paid)], ['Government bonus', m(r.bonus)], ['Growth', m(r.growth)]],
        note: r.tooOldToOpen ? 'A Lifetime ISA can only be opened before your 40th birthday.' : r.stoppedAt50 ? 'Payments, and the bonus, stop at 50; the pot keeps growing.' : v.annual > P.lisa.annual ? 'Only £4,000 a year counts; the rest has been left out.' : undefined }; },
  },
  'lisa-penalty': {
    title: 'What leaving a Lifetime ISA early costs', cta: 'Pot and bonus if you stay', ctaPage: 'lifetime-isa',
    inputs: [money('own', 'Your own money paid in', 12000), money('need', 'Cash you need in hand', 5000)],
    run: (v) => { const pot = v.own * (1 + P.lisa.bonusRate); const all = I.lisaCharge(pot); const g = I.lisaGrossFor(v.need);
      return { head: ['Lost if you take it all out', m(v.own - all.received)], rows: [['Pot with bonus (no growth)', m(pot)], ['You would get back', m(all.received)], [`To have ${m(v.need)} in hand, withdraw`, m(g)], ['Share of your own money lost', pc(all.ownMoneyLoss, 2)]],
        note: 'No charge at 60 or over, for a first home of £450,000 or less, or with less than 12 months to live.' }; },
  },
  'lisa-cap': {
    title: 'Does the home fit under the Lifetime ISA price cap?', cta: 'Grow the pot to your deposit', ctaPage: 'lifetime-isa',
    inputs: [money('price', 'Purchase price', 425000, undefined, 20_000_000), money('pot', 'Lifetime ISA pot', 20000)],
    run: (v) => { const ok = I.lisaPriceOk(v.price); const c = I.lisaCharge(v.pot);
      return { head: [ok ? 'Within the cap: no charge' : 'Over the cap: 25 % charge', ok ? m(v.pot) : m(c.received)], rows: [['Price cap', m(P.lisa.priceCap)], ['Margin', ok ? m(P.lisa.priceCap - v.price) : `${m(v.price - P.lisa.priceCap)} over`], ['Charge if you still withdraw', ok ? m(0) : m(c.charge)]],
        note: 'The cap is the same everywhere in the UK and has not moved since 2017. The First Time Buyer ISA consultation leaves its own cap to a future fiscal event.' }; },
  },
  'lisa-60': {
    title: 'A Lifetime ISA kept for retirement', cta: 'Pot for a first home instead', ctaPage: 'lifetime-isa',
    inputs: [{ id: 'age', label: 'Age you open it', def: 30, unit: 'yrs', max: 39, decimals: 0 }, money('annual', 'Paid in each year until 50', 4000, undefined, 100_000), { id: 'growth', label: 'Growth a year', def: 4, unit: '%', max: 20, decimals: 1 }],
    run: (v) => { const r = I.lisaProjection(Math.round(v.age), v.annual, P.lisa.accessAge - Math.round(v.age), v.growth / 100);
      return { head: ['Pot at 60, tax free', m(r.value)], rows: [['Your payments', m(r.paid)], ['Bonus', m(r.bonus)], ['Years of payments', `${Math.max(0, P.lisa.payUntilAge - Math.round(v.age))}`]],
        note: 'Growth is your assumption, not a forecast. Taking money out before 60 for anything but a first home costs 25 %.' }; },
  },
  junior: {
    title: 'Junior ISA at 18', cta: 'Tax on a parent’s gift outside an ISA', ctaPage: 'childrens-savings-tax',
    inputs: [{ id: 'age', label: 'Child’s age now', def: 3, unit: 'yrs', max: 17, decimals: 0 }, money('monthly', 'Paid in each month', 100, 'Family and friends together', 100_000), money('start', 'Already in the account', 1500), { id: 'growth', label: 'Growth or interest a year', def: 4, unit: '%', max: 20, decimals: 1 }],
    run: (v) => { const r = I.juniorProjection(v.start, v.monthly, Math.round(v.age), v.growth / 100);
      return { head: ['Value at 18', m(r.value)], rows: [['Paid in until then', m(r.paid)], ['Growth', m(r.growth)], ['Paid in each year', m(r.perYear)]],
        note: r.capped ? 'Only £9,000 a year can go in; the rest has been left out.' : 'The money is the child’s and can be taken out from 18 only.' }; },
  },
  'child-100': {
    title: 'The £100 rule on money a parent gives a child', cta: 'A Junior ISA instead', ctaPage: 'junior-isa',
    inputs: [money('gift', 'Money from this parent in the child’s account', 5000), rate(4, 'Interest rate'), income(52000, 'Parent’s income before tax', 'Wages, pension, other income')],
    run: (v) => { const i = v.gift * v.rate / 100; const over = i > P.junior.parentalInterestLimit; const t = over ? S.interestTax(Y1, v.income, i).tax : 0; const t2 = over ? S.interestTax(Y2, v.income, i).tax : 0;
      return { head: [over ? 'Taxed as the parent’s income' : 'Under £100: the child’s', m(i)], rows: [['Parent’s tax on it, 2026/27', m2(t)], ['Parent’s tax on it, 2027/28', m2(t2)], ['Most you can give at this rate and stay under £100', v.rate > 0 ? m(P.junior.parentalInterestLimit / (v.rate / 100)) : 'n/a']],
        note: 'All of the interest counts once it passes £100, not just the part above. Grandparents’ gifts and Junior ISAs are outside the rule.' }; },
  },
  'jisa-18': {
    title: 'What a Junior ISA or Child Trust Fund becomes at 18', cta: 'Tax on that money in a taxable account', ctaPage: 'home',
    inputs: [money('value', 'Value at 18', 12000), rate(4, 'Rate in an adult cash ISA'), income(14000, 'The young adult’s income', 'Part-time job, apprenticeship')],
    run: (v) => { const i = v.value * v.rate / 100; const t = S.interestTax(Y2, v.income, i);
      return { head: ['Interest a year in an adult ISA', m(i)], rows: [['Tax if moved to a taxable account (2027/28)', m2(t.tax)], ['Tax-free interest available to them', m(S.taxFreeInterest(Y2, v.income))], ['Room in a cash ISA from 2027/28', m(P.years[Y2].isa.cashUnder65)]],
        note: 'GOV.UK: Junior ISAs automatically turn into an adult ISA when the child turns 18, and the money can then be taken out.' }; },
  },
  'tax-code': {
    title: 'How the tax on last year’s interest comes back to you', cta: 'Tax on this year’s interest', ctaPage: 'tax-on-savings-interest',
    inputs: [income(38000), money('interest', 'Interest earned in 2026/27', 2400)],
    run: (v) => { const t = S.interestTax(Y1, v.income, v.interest);
      return { head: ['Tax due for 2026/27', m2(t.tax)], rows: [['Collected through the tax code, if it fits', v.interest > 10000 ? 'no: Self Assessment' : 'usually through a later year’s code'], ['Spread over 12 months', m2(t.tax / 12)], ['Self Assessment needed', v.interest > 10000 ? 'yes, interest above £10,000' : 'no']],
        note: 'Banks report interest after 5 April; HMRC then sends a calculation and usually adjusts a later tax code.' }; },
  },
  'bond-timing': {
    title: 'Same interest, which tax year? A bond maturing either side of 6 April 2027', cta: 'Your whole savings, both years', ctaPage: 'home',
    inputs: [income(52000), money('interest', 'Interest paid at maturity', 3200), money('other', 'Other taxable interest that year', 300)],
    run: (v) => { const a = S.interestTax(Y1, v.income, v.interest, { otherInterest: v.other }), b = S.interestTax(Y2, v.income, v.interest, { otherInterest: v.other });
      return { head: ['Paid on or after 6 April 2027', m2(b.tax)], rows: [['Paid by 5 April 2027', m2(a.tax)], ['Difference', m2(b.tax - a.tax)], ['Your band with the interest', bandName(b.band)]],
        note: 'Interest is taxed in the year it is paid or made available to you, not the year it builds up.' }; },
  },
  joint: {
    title: 'Tax on a joint account, split 50/50', cta: 'One saver’s full calculation', ctaPage: 'home',
    inputs: [income(62000, 'First holder’s income', 'Before tax, without interest'), { ...income(18000, 'Second holder’s income', 'Before tax, without interest'), id: 'income2' }, money('interest', 'Interest on the joint account', 3000)],
    run: (v) => { const h = v.interest / 2; const a = S.interestTax(Y2, v.income, h), b = S.interestTax(Y2, v.income2 ?? 0, h);
      const solo = S.interestTax(Y2, Math.min(v.income, v.income2), v.interest);
      return { head: ['Tax on the joint interest, 2027/28', m2(a.tax + b.tax)], rows: [['First holder pays', m2(a.tax)], ['Second holder pays', m2(b.tax)], ['If all in the lower earner’s name', m2(solo.tax)]],
        note: 'HMRC splits joint interest equally unless you show the money is owned in other shares.' }; },
  },
  scotland: {
    title: 'Interest tax for a Scottish taxpayer', cta: 'Full comparison with a cash ISA', ctaPage: 'home',
    inputs: [income(46000, 'Scottish income other than savings'), money('interest', 'Taxable interest', 1500)],
    run: (v) => { const a = S.interestTax(Y1, v.income, v.interest, { nation: 'scotland' }), b = S.interestTax(Y2, v.income, v.interest, { nation: 'scotland' }); const r = S.incomeTax({ year: Y1, nonSavings: v.income, savings: 0, nation: 'scotland' });
      const top = P.years[Y1].scotland!.find((x) => x.upTo === null || r.nonSavingsTaxable <= x.upTo)!;
      return { head: [`Tax on the interest, ${Y1}`, m2(a.tax)], rows: [[`Tax on the interest, ${Y2}`, b.knockOn === null ? `${m2(b.savingsPart)} + allowance effect not yet known` : m2(b.tax)], ['Allowance on savings (UK bands)', m(a.psa)], ['Scottish rate on your last £ of pay', `${top.name}, ${pc(top.rate, 0)}`]],
        note: 'Savings interest is taxed at UK rates and bands even in Scotland; only wages and pensions use the Scottish rates.' }; },
  },
  trap100: {
    title: 'Interest when your income is near £100,000', cta: 'The full comparison with an ISA', ctaPage: 'home',
    inputs: [income(98000), money('interest', 'Taxable interest', 4000), money('ext', 'Gift Aid and pension contributions, gross', 0, 'Relief at source only; lowers adjusted net income')],
    run: (v) => { const a = S.interestTax(Y2, v.income, v.interest, { extension: v.ext });
      return { head: ['Tax caused by the interest, 2027/28', m2(a.tax)], rows: [['Effective rate on the interest', pc(a.interest > 0 ? a.tax / a.interest : 0)], ['Personal Allowance lost', m(a.allowanceLost)], ['Of which tax on your other income', a.knockOn === null ? 'not yet known' : m2(a.knockOn)]],
        note: a.ratesAssumed ? 'The knock-on uses the 2026/27 main rates, as Parliament sets the 2027/28 ones in the next Finance Act.' : undefined }; },
  },
  pensioner: {
    title: 'Tax on savings in retirement', cta: 'Cash ISA against taxable savings', ctaPage: 'home',
    inputs: [income(19000, 'Pensions before tax', 'State Pension and any private pension'), money('balance', 'Savings outside ISAs', 60000), rate(4)],
    run: (v) => { const i = v.balance * v.rate / 100; const a = S.interestTax(Y1, v.income, i), b = S.interestTax(Y2, v.income, i);
      return { head: [`Tax on ${m(i)} of interest, ${Y1}`, m2(a.tax)], rows: [[`Same interest, ${Y2}`, m2(b.tax)], ['Interest at the 0 % starting rate', m(a.atStarting)], ['Interest you could earn tax free', m(S.taxFreeInterest(Y1, v.income))]],
        note: 'From 2027/28 savers aged 65 or over by 5 April keep a £20,000 cash ISA limit.' }; },
  },
  refund: {
    title: 'Did you pay too much tax on interest?', cta: 'What is tax free for you', ctaPage: 'personal-savings-allowance',
    inputs: [income(11000, 'Income other than savings'), money('interest', 'Interest that year', 2500), money('paid', 'Tax already paid or collected on it', 300)],
    run: (v) => { const t = S.interestTax(Y1, v.income, v.interest);
      return { head: ['Refund due', m2(Math.max(0, v.paid - t.tax))], rows: [['Correct tax on the interest', m2(t.tax)], ['Paid or collected', m2(v.paid)], ['Time limit', '4 years after the tax year']],
        note: 'A past-year refund is claimed through Self Assessment, by contacting HMRC or on form R40, within 4 years of the end of the tax year.' }; },
  },
  'pb-calc': {
    title: 'Premium Bonds against a taxable savings account', cta: 'Your chance of a prize each month', ctaPage: 'premium-bonds-odds',
    inputs: [money('holding', 'Premium Bonds held', 25000, '£25 to £50,000', 50_000), income(55000), rate(4, 'Rate of the savings account')],
    run: (v) => { const s = PB.simulate(v.holding); const net = S.interestTax(Y2, v.income, v.holding * v.rate / 100).net;
      return { head: ['Median prizes in a year', m(s.median)], rows: [['Average (prize fund rate)', m(s.mean)], ['1 year in 10, below', m(s.p10)], ['1 year in 10, above', m(s.p90)], ['Savings account after tax, 2027/28', m(net)], ['Chance of no prize all year', pc(s.chanceNothing, 2)]],
        note: `Prize fund rate ${pc(P.premiumBonds.rate, 2)}, odds ${formatNumber(P.premiumBonds.odds, 0)} to 1, ${P.premiumBonds.drawMonth} prize table, 4,000 simulated years. Not a forecast.` }; },
  },
  'pb-odds': {
    title: 'Premium Bonds: your chance of a prize, month by month', cta: 'Prizes against a savings account', ctaPage: 'premium-bonds-calculator',
    inputs: [money('holding', 'Premium Bonds held', 10000, '£25 to £50,000', 50_000)],
    run: (v) => { const o = PB.odds(v.holding);
      return { head: ['Chance of at least one prize each month', pc(o.perMonthAny)], rows: [['In 3 months', pc(o.months[2].atLeastOne)], ['In 12 months', pc(o.perYearAny)], ['Prizes expected in a year', formatNumber(o.expectedPrizesYear, 1)], ['Months for an even chance', o.monthsForEvenChance === null ? 'n/a' : String(o.monthsForEvenChance)]],
        note: `Odds of ${formatNumber(P.premiumBonds.odds, 0)} to 1 per £1 Bond, ${P.premiumBonds.drawMonth} draw. Variable, never guaranteed.` }; },
  },
  'pb-rate': {
    title: 'The taxable rate that matches Premium Bonds for you', cta: 'Spread of results, year by year', ctaPage: 'premium-bonds-calculator',
    inputs: [money('holding', 'Premium Bonds held', 30000, undefined, 50_000), income(60000)],
    run: (v) => { const s = PB.simulate(v.holding); const gMean = S.grossEquivalentRate(Y2, v.income, v.holding, s.mean); const gMed = S.grossEquivalentRate(Y2, v.income, v.holding, s.median);
      return { head: ['Taxable rate matching the median, 2027/28', pc(gMed, 2)], rows: [['Matching the prize fund average', pc(gMean, 2)], ['Median prizes in a year', m(s.median)], ['Average prizes in a year', m(s.mean)]],
        note: 'Most holders get less than the average, because the large prizes are rare. Prizes are tax free.' }; },
  },
};

export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini-spec: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
