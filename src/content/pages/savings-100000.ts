import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-100000',
  group: 'amounts',
  order: 73,
  tool: { kind: 'isa', props: { balance: 100000, income: 30000, rate: 4 } },
  related: ['savings-tax-pensioners', 'isa-over-65', 'starting-rate-for-savings', 'savings-50000'],
  sources: ['fscs', 'gov_savings_free', 'leg_fa26_s5', 'leg_si_1018'],
  slug: 'savings-100000',
  nav: '£100,000 of savings',
  card: 'A basic rate saver or pensioner with £100,000: tax on £4,000 of interest, the FSCS limit and the years needed to reach ISAs.',
  title: '£100,000 Savings: Tax, the FSCS £120,000 Limit and ISAs',
  description: '£100,000 savings at 4 % earn £4,000: tax for a basic rate saver or pensioner, the FSCS £120,000 limit per banking licence and the years to move it into ISAs.',
  h1: '£100,000 in savings: tax on the interest, protection and the road into ISAs',
  intro: 'The calculator is set to £100,000 at 4 % and £30,000 of other income, for example a state and private pension together. It shows the tax in a taxable account and in a cash ISA, both years.',
  resume: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const i = 4000, t1 = h.tax(h.Y1, 30000, i), t2 = h.tax(h.Y2, 30000, i);
    return `${h.m(100000)} at 4 % earns ${h.m(i)} a year, far more than any Personal Savings Allowance. For someone with ${h.m(30000)} of pension or wages, a basic rate taxpayer, the first ${h.m(Y1.psa.basic)} of interest is tax free and the remaining ${h.m(i - Y1.psa.basic)} is taxed at ${h.pc(Y1.savingsRates.basic)} in ${h.Y1}, which is ${h.m(t1.tax)}. From 6 April 2027 the basic savings rate is ${h.pc(Y2.savingsRates.basic)}, set by the Finance Act 2026, and the bill becomes ${h.m(t2.tax)}. A lower pension leaves room in the ${h.m(Y1.startingRateLimit)} starting rate band and cuts the tax sharply. The whole sum fits under the deposit protection of the Financial Services Compensation Scheme, ${h.m(h.P.fscs.limit)} per person per banking licence since ${h.date(h.P.fscs.from)}, if it sits with one bank. Moving it all into cash ISAs takes five tax years for a saver aged 65 or more, and eight for one who is 64 or under on each 5 April, because the cash limit falls to ${h.m(Y2.isa.cashUnder65)} from ${h.Y2}.`;
  },
  faqs: (h) => [
    { q: 'Is £100,000 in one bank covered by the FSCS?', a: `Yes, up to ${h.m(h.P.fscs.limit)} per person per banking licence since ${h.date(h.P.fscs.from)}. The limit counts all your eligible deposits under the same licence, and some brands share one. At 4 % with the interest added, ${h.m(100000)} passes ${h.m(h.P.fscs.limit)} after about five years. NS&I products sit outside the scheme because they are backed by HM Treasury.` },
    { q: 'How much tax does a pensioner pay on £4,000 of savings interest?', a: `It depends on the pension. With ${h.m(30000)} the tax is ${h.m(h.tax(h.Y1, 30000, 4000).tax)} in ${h.Y1}. With ${h.m(16000)} part of the interest falls in the ${h.m(h.y(h.Y1).startingRateLimit)} starting rate band and the tax is ${h.m(h.tax(h.Y1, 16000, 4000).tax)}. With a pension at or below the ${h.m(h.y(h.Y1).personalAllowance)} Personal Allowance, ${h.m(4000)} of interest is entirely tax free.` },
    { q: 'How does HMRC collect tax on £4,000 of interest from a pensioner?', a: 'Banks report the interest they paid after the tax year ends. For someone who does not file Self Assessment, HMRC usually collects what is due through the tax code of a later year, applied to a private or workplace pension, or by sending a Simple Assessment calculation. Interest has been paid without tax taken off since April 2016.' },
    { q: 'Can a saver over 65 move £100,000 into cash ISAs faster from 2027?', a: `Faster than a younger saver, yes. Anyone who is 65 or over at the end of a tax year keeps the ${h.m(h.y(h.Y2).isa.cashFrom65)} cash ISA limit from ${h.Y2}, so five full years of allowance cover ${h.m(100000)}. Someone 64 or under is limited to ${h.m(h.y(h.Y2).isa.cashUnder65)} a year in cash from 6 April 2027 and needs eight tax years in all.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const i = 4000;
    const pensions = [12570, 16000, 20000, 30000, 45000];
    const rows = pensions.map((p) => { const a = h.tax(h.Y1, p, i), b = h.tax(h.Y2, p, i); return [h.m(p), h.m(a.atStarting + a.allowanceOnSavings), h.m(a.atNil), h.m2(a.tax), h.m2(b.tax)]; });
    const years = Array.from({ length: 8 }, (_, k) => k + 1);
    const inIsa = (n: number, later: number) => Math.min(100000, Y1.isa.cashUnder65 + (n - 1) * later);
    const yRows = years.map((n) => { const u = inIsa(n, Y2.isa.cashUnder65), o = inIsa(n, Y2.isa.cashFrom65); return [String(n), h.m(u), h.m2(h.tax(n === 1 ? h.Y1 : h.Y2, 30000, (100000 - u) * 0.04).tax), h.m(o), h.m2(h.tax(n === 1 ? h.Y1 : h.Y2, 30000, (100000 - o) * 0.04).tax)]; });
    return `<h2>Pension income decides most of the bill</h2>
<p>At this size the Personal Savings Allowance covers only a quarter of the interest, so the other layers of tax-free income matter more. A retired saver whose pension leaves part of the Personal Allowance unused, or whose taxable pension is under ${h.m(Y1.startingRateLimit)}, can receive much of the ${h.m(i)} at 0 %. The table shows the tax on ${h.m(i)} of interest at five pension levels (${h.src('gov_savings_free', 'GOV.UK, how much interest is tax free')}).</p>
${h.table(['Pension or other income', 'At 0 % (Personal Allowance left, starting rate)', 'Covered by the £1,000 allowance', `Tax ${h.Y1}`, `Tax ${h.Y2}`], rows, `${h.m(i)} of interest, ${h.m(100000)} at 4 %. Engine of this site; ${h.Y2} savings rates from the Finance Act 2026.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At ${h.m(12570)} the whole ${h.m(i)} falls into the starting rate band and the allowance is not even needed. At ${h.m(16000)} the starting rate band has shrunk by ${h.m(16000 - Y1.personalAllowance)} and some interest becomes taxable. From ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} upwards the band is gone and only the ${h.m(Y1.psa.basic)} allowance is left. In each taxed case the ${h.Y2} bill rises by two pence for every taxable pound (${h.src('leg_fa26_s5', 'Finance Act 2026, section 5')}). The ${h.a('starting-rate-for-savings', 'starting rate page')} explains that band in detail.</p>
<h2>Deposit protection on a six-figure balance</h2>
<p>The ${h.src('fscs', 'Financial Services Compensation Scheme')} protects up to ${h.m(h.P.fscs.limit)} of deposits per person per banking licence; the limit rose to that level on ${h.date(h.P.fscs.from)}. ${h.m(100000)} is under it, but interest left to build up takes the balance over the limit within about five years at 4 %. Two trading names can share one licence, so the limit is checked against the licence, not the brand. Premium Bonds and other NS&I products are not covered by the scheme; they are backed by HM Treasury instead.</p>
<h2>How many years to move £100,000 into cash ISAs</h2>
<p>Under ${h.src('leg_si_1018', 'SI 2026/1018')}, a person who is 64 or under at the end of a tax year can put at most ${h.m(Y2.isa.cashUnder65)} into cash ISAs that year from ${h.Y2}, while someone 65 or over keeps ${h.m(Y2.isa.cashFrom65)}. The table counts tax years from ${h.Y1}, when everyone can still pay ${h.m(Y1.isa.cashUnder65)} into cash, and shows the tax on the interest still outside an ISA for someone with ${h.m(30000)} of other income. Years after ${h.Y2} use the ${h.Y2} rules, the latest set by law.</p>
${h.table(['Tax years used', 'Under 65: in cash ISAs', 'Tax on the rest', '65 or over: in cash ISAs', 'Tax on the rest'], yRows, `${h.m(100000)} of new cash moved in at the start of each year from ${h.Y1}; interest at 4 % spent, not added. Engine of this site.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The yearly tax falls quickly once the taxable part drops below ${h.m(Y1.psa.basic / 0.04)}, the amount whose interest the allowance still covers at 4 %. The ${h.a('isa-over-65', 'page for savers over 65')} explains how the age test on 5 April works, and the ${h.a('savings-tax-pensioners', 'pensioners page')} covers the interaction with pension income.</p>`;
  },
});
