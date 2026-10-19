import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-tax-pensioners',
  group: 'tax',
  order: 19,
  tool: { kind: 'mini:pensioner' },
  related: ['starting-rate-for-savings', 'isa-over-65', 'savings-interest-tax-code', 'savings-100000'],
  sources: ['gov_state_pension', 'gov_savings_free', 'leg_fa26_s9', 'leg_fa26_s10', 'leg_si_1018', 'fscs'],
  slug: 'savings-tax-pensioners',
  nav: 'Savings tax for pensioners',
  card: 'State Pension, private pension and interest: how much retired savers can earn before any tax.',
  title: 'Savings Tax for Pensioners 2026/27: State Pension, Interest',
  description: 'Savings tax for pensioners: with the State Pension close to the £12,570 allowance, the £5,000 starting rate and £1,000 allowance cover over £6,000 of interest.',
  h1: 'Tax on savings for pensioners: the allowances retirement brings back',
  intro: 'Enter your pensions before tax, the savings you hold outside ISAs and the rate they earn. The tool shows the tax on that interest this year and next, and how much is covered at 0 %.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const sp = Math.round(h.P.statePension.fullNewWeekly * 52);
    const free = h.S.taxFreeInterest(h.Y1, sp);
    const t = h.tax(h.Y1, 19000, 2400);
    return `Retirement often brings back allowances that a salary used up. The full new State Pension is ${h.m2(h.P.statePension.fullNewWeekly)} a week in ${h.Y1}, about ${h.m(sp)} over 52 weeks, which sits just below the ${h.m(Y1.personalAllowance)} Personal Allowance. A pensioner with only that income still has a few pounds of Personal Allowance, the whole ${h.m(Y1.startingRateLimit)} starting rate for savings and the ${h.m(Y1.psa.basic)} Personal Savings Allowance, so ${h.m(free)} of interest can be received with no tax, the interest on about ${h.m(free / 0.04)} at ${h.pc(0.04)}. Each pound of pension income above the Personal Allowance removes a pound of the starting rate, and at ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} of pensions only the ${h.m(Y1.psa.basic)} allowance is left. With ${h.m(19000)} of pensions and ${h.m(60000)} earning ${h.pc(0.04)}, the tax on ${h.m(2400)} of interest is ${h.m2(t.tax)} in ${h.Y1}. The Personal Allowance and the starting rate limit are both frozen until 2030/31, and from 6 April 2027 savers aged 65 or over keep a £20,000 cash ISA limit.`;
  },
  faqs: (h) => [
    { q: 'Is the State Pension counted when working out tax on my savings interest?', a: `Yes. The State Pension is taxable income, even though no tax is taken from it when it is paid. It uses the Personal Allowance first, and any part above the allowance reduces the starting rate for savings. Private and workplace pensions are added to it in the same way, before the interest is considered.` },
    { q: 'How do pensioners with no tax code pay tax on savings interest?', a: `Where there is no private or workplace pension carrying a tax code, HMRC cannot adjust a code to collect the tax. GOV.UK says it may then send a Simple Assessment letter setting out what is owed and how to pay. Someone who owes tax on interest but has no letter by 31 March after the tax year is asked to contact HMRC.` },
    { q: 'Do savers over 65 still get the £20,000 cash ISA limit after April 2027?', a: `Yes. Under SI 2026/1018 the ${h.m(h.y(h.Y2).isa.cashUnder65)} cash limit applies only in a tax year in which the saver is 64 or under on 5 April. From the tax year in which you reach 65, the whole ${h.m(h.y(h.Y2).isa.cashFrom65)} can go into cash ISAs, and transfers from stocks and shares ISAs into cash remain possible.` },
    { q: 'Will a rising pension make my savings interest taxable?', a: `It can. The Personal Allowance and the ${h.m(h.y(h.Y1).startingRateLimit)} starting rate limit are frozen to 2030/31, so each increase in pensions uses up a little more of the 0 % band. A saver whose interest was fully covered one year can find part of it taxable a few years later, with no change in the savings themselves.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const sp = Math.round(h.P.statePension.fullNewWeekly * 52);
    const incomes = [sp, 15000, 17570, 19000, 25000, 35000];
    const rows = incomes.map((ns) => { const a = h.tax(h.Y1, ns, 2400), b = h.tax(h.Y2, ns, 2400); const f = h.S.taxFreeInterest(h.Y1, ns); return [h.m(ns), h.m(f), h.m(f / 0.04), h.m2(a.tax), h.m2(b.tax)]; });
    return `<h2>The three layers in retirement</h2>
<p>For a working saver, only the Personal Savings Allowance usually matters. In retirement the earlier layers often return. Any Personal Allowance not used by pensions covers interest first. The ${h.a('starting-rate-for-savings', 'starting rate for savings')} then taxes up to ${h.m(Y1.startingRateLimit)} of interest at 0 %, cut by every pound of pension above the Personal Allowance. Then comes the allowance of ${h.m(Y1.psa.basic)} for a basic rate taxpayer. GOV.UK sets out the order on its ${h.src('gov_savings_free', 'page on tax-free interest')}.</p>
${h.table(['Pensions a year', 'Interest tax free in all', 'Balance at 4 % that earns it', `Tax on ${h.m(2400)}, ${h.Y1}`, `Same, ${h.Y2}`], rows, `Tax-free interest and tax on ${h.m(2400)} of interest (for example ${h.m(60000)} at 4 %) by pension income. The first row is the full new State Pension over 52 weeks. Computed by this site's engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The first row is a pensioner on the full new State Pension and nothing else: more than ${h.m(6000)} of interest is tax free, so ${h.m(2400)} costs nothing in either year. At ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} of pensions the starting rate has gone, but the ${h.m(Y1.psa.basic)} allowance still covers part of the interest. Beyond that, interest above ${h.m(Y1.psa.basic)} is taxed at ${h.pc(Y1.savingsRates.basic)}, and at ${h.pc(h.y(h.Y2).savingsRates.basic)} from 6 April 2027.</p>
<h2>Frozen thresholds and rising pensions</h2>
<p>${h.src('leg_fa26_s10', 'Section 10 of the Finance Act 2026')} keeps the Personal Allowance and the basic rate limit where they are until 2030/31, and ${h.src('leg_fa26_s9', 'section 9')} does the same for the ${h.m(Y1.startingRateLimit)} starting rate limit. Pensions that are uprated each year therefore take a little more of the Personal Allowance and of the starting rate each April. A retired saver with the same deposits can move from paying nothing to paying a small amount, without any change in their savings.</p>
<h2>Collection without a payslip</h2>
<p>When a pensioner has a private or workplace pension, tax on interest is normally collected through the tax code on that pension, in the same way as for an employee. When the only income is the State Pension, there may be no code to change, and HMRC uses a Simple Assessment letter instead. The ${h.a('savings-interest-tax-code', 'tax code page')} sets out both routes and their timing.</p>
<h2>The ISA rules from April 2027</h2>
<p>The cash ISA reform of ${h.src('leg_si_1018', 'SI 2026/1018')} treats savers differently by age. In any tax year in which you are 64 or under on 5 April, at most ${h.m(h.y(h.Y2).isa.cashUnder65)} can go into cash ISAs. From the tax year in which you turn 65, the full ${h.m(h.y(h.Y2).isa.cashFrom65)} can be paid into cash. The ${h.a('isa-over-65', 'page for savers over 65')} gives birth dates and the first year that applies. Cash already in ISAs stays tax free.</p>
<h2>Large deposits</h2>
<p>Retired savers often hold larger cash balances than working ones. Deposits are protected by the ${h.src('fscs', 'Financial Services Compensation Scheme')} up to ${h.m(h.P.fscs.limit)} per person per banking licence, a limit that is separate from any tax question. The ${h.a('savings-100000', 'page on £100,000 of savings')} follows a retired basic rate taxpayer with that sum through both tax years.</p>`;
  },
});
