import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'fixed-rate-bond-tax',
  group: 'tax',
  order: 15,
  tool: { kind: 'mini:bond-timing' },
  related: ['savings-tax-rates-2027', 'personal-savings-allowance', 'savings-interest-tax-code', 'tax-on-savings-interest'],
  sources: ['hmrc_saim2440', 'gov_savings_pay', 'leg_fa26_s5', 'gov_savings_free'],
  slug: 'fixed-rate-bond-tax',
  nav: 'Tax on fixed rate bonds',
  card: 'When bond interest is taxed, and what a maturity date either side of 6 April 2027 does to the bill.',
  title: 'Fixed Rate Bond Tax: the Year Your Interest Is Taxed In',
  description: 'Fixed rate bond tax: interest counts in the year it is paid or made available, so a bond paying at maturity can use a whole allowance, then 22 % from 2027.',
  h1: 'Tax on fixed rate bonds: annual interest or one payment at the end',
  intro: 'Enter your other income, the interest the bond pays at maturity and any other taxable interest in that year. The tool prices the same payment in 2026/27 and in 2027/28.',
  resume: (h) => {
    const a = h.tax(h.Y1, 48000, 900) .tax + h.tax(h.Y2, 48000, 900).tax;
    const b = h.tax(h.Y2, 48000, 1800).tax;
    return `Interest on a fixed rate bond is taxed in the tax year in which it is paid to you or made available to you, not the years in which it builds up. HMRC’s Savings and Investment Manual (SAIM2440) treats interest as made available when it is credited to an account the holder is free to draw on. For a bond that credits interest every year and lets you reach it, even with a penalty, each year’s interest is taxed in that year. For a bond that locks everything until the end, all the interest is taxed in the year it matures. On a two-year bond of ${h.m(20000)} at ${h.pc(0.045)}, a basic rate taxpayer on ${h.m(48000)} pays ${h.m2(a)} in total if ${h.m(900)} is credited in each of ${h.Y1} and ${h.Y2}, but ${h.m2(b)} if all ${h.m(1800)} arrives at maturity in ${h.Y2}, because one year’s ${h.m(h.y(h.Y1).psa.basic)} allowance has to cover two years of interest and the rest meets the ${h.pc(h.y(h.Y2).savingsRates.basic)} rate.`;
  },
  faqs: (h) => [
    { q: 'Is interest on a fixed rate bond taxed each year if it cannot be withdrawn?', a: `HMRC’s manual draws the line on access. Where the terms let you take the interest, even at a cost, it is taxable each year as it is credited. Where no access is allowed until maturity, the interest arises and is taxed when the bond ends. The bond’s terms and conditions say which kind it is.` },
    { q: 'Does a fixed rate bond maturing on 5 April 2027 get the old rates?', a: `Interest paid or made available on or before 5 April 2027 belongs to ${h.Y1}, taxed at ${h.pc(h.y(h.Y1).savingsRates.basic)}, ${h.pc(h.y(h.Y1).savingsRates.higher)} or ${h.pc(h.y(h.Y1).savingsRates.additional)}. A payment on 6 April 2027 or later falls into ${h.Y2}, taxed at ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} or ${h.pc(h.y(h.Y2).savingsRates.additional)}. The date the provider actually pays or credits the interest is what counts, not the date you opened the bond.` },
    { q: 'Is a fixed rate cash ISA taxed the same way as a fixed rate bond?', a: `No. Interest on a fixed rate cash ISA is free of income tax whenever it is paid, so the timing question disappears. The ISA does use part of the yearly allowance when the money goes in, and from 6 April 2027 savers aged 64 or under on 5 April can put at most ${h.m(h.y(h.Y2).isa.cashUnder65)} a year into cash ISAs.` },
    { q: 'Can maturity interest from a bond push me into the higher rate band?', a: `Yes. A lump of interest counts in full towards your income for that one year. If several years of interest arrive at once and your total goes over ${h.m(h.y(h.Y1).personalAllowance + h.y(h.Y1).basicRateLimit)}, the Personal Savings Allowance falls from ${h.m(h.y(h.Y1).psa.basic)} to ${h.m(h.y(h.Y1).psa.higher)} and part of the interest is taxed at the higher savings rate.` },
  ],
  body: (h) => {
    const incomes = [15000, 35000, 48000, 60000];
    const rows = incomes.map((ns) => {
      const yearly = h.tax(h.Y1, ns, 900).tax + h.tax(h.Y2, ns, 900).tax;
      const early = h.tax(h.Y1, ns, 1800).tax, late = h.tax(h.Y2, ns, 1800).tax;
      return [h.m(ns), h.m2(yearly), h.m2(early), h.m2(late)];
    });
    const Y1 = h.y(h.Y1);
    return `<h2>Three ways a bond can pay</h2>
<p>Fixed rate bonds differ less in their rate than in how they hand over the interest. Some pay it monthly or yearly into another account. Some add it to the bond each year but let you withdraw it. Others hold everything until the end of the term. For income tax the question is always the same: when was the interest paid to you, or made available to you? Monthly and yearly payments are taxed as they arrive. Interest credited to the bond each year is taxed each year if you could draw it. Interest locked away until maturity is taxed all at once, in the year the term ends.</p>
<p>No tax is taken off by the provider in any of these cases. The provider reports the interest to HMRC for the year in which it was paid, and HMRC collects any tax due through the routes set out on the ${h.src('gov_savings_pay', 'GOV.UK page on paying tax on savings interest')}, usually a later tax code (see the ${h.a('savings-interest-tax-code', 'tax code page')}).</p>
<h2>Two years of interest, one allowance</h2>
<p>The allowances are yearly and cannot be carried forward. A bond that pays at maturity therefore squeezes two, three or five years of interest into one year’s ${h.m(Y1.psa.basic)} or ${h.m(Y1.psa.higher)} allowance. The table takes a two-year bond of ${h.m(20000)} at ${h.pc(0.045)}, earning ${h.m(900)} a year with no compounding, and compares three patterns: interest credited and accessible each year across ${h.Y1} and ${h.Y2}, all ${h.m(1800)} paid at maturity by 5 April 2027, and all ${h.m(1800)} paid at maturity from 6 April 2027.</p>
${h.table(['Other income', 'Credited each year (total)', 'At maturity, by 5 April 2027', 'At maturity, from 6 April 2027'], rows, `Total tax on ${h.m(1800)} of bond interest over two years, assuming no other taxable interest. Computed by this site's engine.`, ['l', 'r', 'r', 'r'])}
<p>At ${h.m(15000)} of other income the unused starting rate and the allowance absorb everything, whatever the pattern. At ${h.m(35000)} the starting rate has gone, so a single payment of ${h.m(1800)} goes ${h.m(800)} beyond the allowance. On ${h.m(48000)}, interest spread over two years stays inside two separate allowances and costs nothing, while the same interest in a single year exceeds one allowance. On ${h.m(60000)} the higher rate taxpayer’s ${h.m(Y1.psa.higher)} allowance is the constraint, and a single payment in ${h.Y2} is taxed at ${h.pc(h.y(h.Y2).savingsRates.higher)} instead of ${h.pc(Y1.savingsRates.higher)}.</p>
<h2>A maturity date either side of 6 April 2027</h2>
<p>Section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')} sets the savings rates for ${h.Y2} at ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)}. A bond whose interest is paid on 5 April 2027 and one paid a day later can therefore produce different bills on the same sum. The tool at the top prices both dates for your own figures, including other interest you expect that year, since several accounts share the same allowance.</p>
<p>The year of payment also decides which year’s other income is used. A saver who retires during the term may have a much lower income in the year the bond matures, freeing the Personal Allowance or the starting rate described on the ${h.src('gov_savings_free', 'GOV.UK page on tax-free interest')}. A saver whose pay rises may see the opposite. The ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')} explains the band test that decides which allowance applies, and the ${h.a('savings-tax-rates-2027', 'page on the 2027/28 rates')} the size of the increase.</p>`;
  },
});
