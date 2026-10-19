import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'starting-rate-for-savings',
  group: 'tax',
  order: 12,
  tool: { kind: 'mini:starting-rate' },
  related: ['savings-tax-pensioners', 'personal-savings-allowance', 'tax-on-savings-interest', 'reclaim-tax-on-savings'],
  sources: ['gov_savings_free', 'leg_fa26_s9', 'gov_rates'],
  slug: 'starting-rate-for-savings',
  nav: 'Starting rate for savings',
  card: 'The £5,000 band of interest taxed at 0 %, and how much of it your other income leaves you.',
  title: 'Starting Rate for Savings 2026/27: £5,000 Taxed at 0 %',
  description: 'Starting rate for savings: up to £5,000 of interest at 0 %, cut by £1 for each £1 of other income above £12,570 and gone at £17,570, frozen to 2030/31.',
  h1: 'Starting rate for savings: the £5,000 band and who keeps it',
  intro: 'Enter your income other than savings, such as pension, wages or trading profit, and the interest you expect this tax year. The tool shows how much of the 0 % band is still yours and which layer covers each pound of interest.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const gone = Y1.personalAllowance + Y1.startingRateLimit;
    const left16 = h.tax(h.Y1, 16000, 200).startingAvailable;
    const all = h.S.taxFreeInterest(h.Y1, 0);
    return `The starting rate for savings is a band of up to ${h.m(Y1.startingRateLimit)} of interest taxed at 0 %. It exists for people whose other income is low: it shrinks by £1 for every £1 of taxable non-savings income, meaning wages, pensions, trading profit and rent above the ${h.m(Y1.personalAllowance)} Personal Allowance. Someone with ${h.m(Y1.personalAllowance)} or less keeps the whole ${h.m(Y1.startingRateLimit)}; at ${h.m(16000)} of wages ${h.m(left16)} remains, which is the example GOV.UK gives; at ${h.m(gone)} it has gone. Dividends do not reduce it, because they are taxed after savings. The band is applied automatically and sits before the Personal Savings Allowance, so a saver with no other income can receive ${h.m(all)} of interest in ${h.Y1} with no tax at all. Section 9 of the Finance Act 2026 freezes the limit at ${h.m(Y1.startingRateLimit)} for every tax year up to 2030/31, so the ${h.Y2} rise in savings rates does not touch interest inside it.`;
  },
  faqs: (h) => [
    { q: 'Do I need to apply for the starting rate for savings?', a: `No form exists for it. HMRC applies the band when it works out your tax from the figures banks send. Where tax has wrongly been collected through a tax code because the band was overlooked, for example after a fall in income during the year, you can ask HMRC to correct the code or claim the money back for up to four years.` },
    { q: 'Does a self-employed person with low profits get the starting rate?', a: `Yes. Trading profit counts as non-savings income in the same way as wages, so a sole trader whose taxable profit after the Personal Allowance is under ${h.m(h.y(h.Y1).startingRateLimit)} keeps part of the band. Self-employed people report interest on their Self Assessment return, and the calculation applies the 0 % band there.` },
    { q: 'Do dividends use up the £5,000 starting rate band?', a: `No. Income tax takes non-savings income first, savings second and dividends last. Dividend income therefore arrives after the starting rate band has been used or lost, and it neither reduces the band nor benefits from it. Someone with a small pension, some interest and some dividends therefore has the band set by the pension alone.` },
    { q: 'Is the starting rate for savings the same for a Scottish taxpayer?', a: `Yes. The ${h.m(h.y(h.Y1).startingRateLimit)} limit and the way it shrinks are set for the whole of the UK, and savings income of Scottish taxpayers is taxed on UK rates and bands. A Scottish pensioner with the same income as one in England keeps exactly the same amount of the band.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const incomes = [0, 12570, 14000, 15500, 16000, 17000, 17570, 20000];
    const rows = incomes.map((ns) => { const a = h.tax(h.Y1, ns, 3000), b = h.tax(h.Y2, ns, 3000); return [h.m(ns), h.m(a.startingAvailable), h.m(h.S.taxFreeInterest(h.Y1, ns)), h.m2(a.tax), h.m2(b.tax)]; });
    const ex15 = h.tax(h.Y1, 15000, 3000);
    return `<h2>How the band shrinks</h2>
<p>The band is measured against taxable income, not total income. First the Personal Allowance is used by your non-savings income. Whatever non-savings income remains taxable then eats into the ${h.m(Y1.startingRateLimit)} band pound for pound. So the band does not start shrinking at zero income but only once wages, pension or profit pass ${h.m(Y1.personalAllowance)}, and it is gone at ${h.m(Y1.personalAllowance + Y1.startingRateLimit)}. GOV.UK sets out the same test with worked figures on its ${h.src('gov_savings_free', 'page on how much interest is tax free')}.</p>
${h.table(['Other income', 'Starting rate left', 'Tax-free interest in all', `Tax on ${h.m(3000)}, ${h.Y1}`, `Same, ${h.Y2}`], rows, `Starting rate left and tax on ${h.m(3000)} of interest by other income before tax. Computed by this site's engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The table shows three zones. Below ${h.m(Y1.personalAllowance)} part of the Personal Allowance is still free and covers interest before the band is even touched. Between ${h.m(Y1.personalAllowance)} and ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} the band shrinks and the ${h.m(Y1.psa.basic)} Personal Savings Allowance stacks on top. Above that, only the allowance remains. Take ${h.m(15000)} of pension and ${h.m(3000)} of interest: ${h.m(ex15.atStarting)} falls in the starting rate, ${h.m(ex15.atNil)} under the allowance, and the tax is ${h.m2(ex15.tax)}.</p>
<h2>Who still has the band</h2>
<p>Most full-time employees have no starting rate left, because a salary above ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} fills it before any interest arrives. The people who keep some of it fall into a few groups:</p>
<ul>
<li>retired people living on the State Pension with a small private pension, covered in detail on the ${h.a('savings-tax-pensioners', 'page for pensioners')};</li>
<li>part-time workers, carers and people between jobs whose pay for the year is low;</li>
<li>self-employed people in a lean year, since the test uses taxable profit after expenses;</li>
<li>people whose income is mostly interest, for example after selling a business or a home, who can use the whole band.</li>
</ul>
<p>Because the band depends on income for the whole tax year, a year in which someone stops work in the autumn can give a starting rate that a full year of salary would have used up. The tax code during the year will not always reflect that; any excess collected is put right once HMRC reconciles the year, or can be reclaimed as described on the ${h.a('reclaim-tax-on-savings', 'refund page')}.</p>
<h2>Frozen until 2030/31</h2>
<p>${h.src('leg_fa26_s9', 'Section 9 of the Finance Act 2026')} keeps the limit at ${h.m(Y1.startingRateLimit)} for each year to 2030/31. The Personal Allowance is frozen too (listed on the ${h.src('gov_rates', 'Income Tax rates page')}), so the point at which the band disappears stays at ${h.m(Y1.personalAllowance + Y1.startingRateLimit)}. Pensions that rise each year push more retired savers past it over time. In ${h.Y2} the rates on interest above all the allowances go up by two points, but interest inside the starting rate stays at 0 %. For the rest of the order, see the ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')}.</p>`;
  },
});
