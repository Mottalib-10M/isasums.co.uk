import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-on-savings-interest',
  group: 'tax',
  order: 10,
  tool: { kind: 'mini:interest-tax' },
  related: ['home', 'personal-savings-allowance', 'starting-rate-for-savings', 'savings-tax-rates-2027'],
  sources: ['gov_savings_free', 'gov_savings_pay', 'leg_ita_12a', 'leg_fa26_s5'],
  slug: 'tax-on-savings-interest',
  nav: 'Tax on savings interest',
  card: 'What a year of interest costs in tax at your income, now and at the 2027/28 rates.',
  title: 'Tax on Savings Interest 2026/27: Your Bill, and 2027/28',
  description: 'Tax on savings interest worked out for your income: Personal Allowance, £5,000 starting rate, £1,000 or £500 allowance, then 20 % now and 22 % from April 2027.',
  h1: 'Tax on savings interest: what you will owe this year and next',
  intro: 'Type your income and the interest your taxable accounts pay in the tax year. The calculator applies the four layers of tax-free interest in the order the law sets, then the rate of your band.',
  resume: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const ex = h.tax(h.Y1, 30000, 1300), ex2 = h.tax(h.Y2, 30000, 1300);
    return `Interest from bank and building society accounts outside an ISA is taxed as income, but most savers pay nothing because four layers come first. Any Personal Allowance left over from wages or pension (${h.m(Y1.personalAllowance)} in all) covers interest first. Then the starting rate for savings taxes up to ${h.m(Y1.startingRateLimit)} of interest at 0 %, shrinking by £1 for each £1 of other taxable income. Then the Personal Savings Allowance takes ${h.m(Y1.psa.basic)} for a basic rate taxpayer, ${h.m(Y1.psa.higher)} for a higher rate taxpayer and nothing at the additional rate. Only what is left is taxed: ${h.pc(Y1.savingsRates.basic)}, ${h.pc(Y1.savingsRates.higher)} or ${h.pc(Y1.savingsRates.additional)} in ${h.Y1}, rising to ${h.pc(Y2.savingsRates.basic)}, ${h.pc(Y2.savingsRates.higher)} and ${h.pc(Y2.savingsRates.additional)} from 6 April 2027 under the Finance Act 2026. With ${h.m(30000)} of wages and ${h.m(1300)} of interest, the tax is ${h.m2(ex.tax)} this year and ${h.m2(ex2.tax)} in ${h.Y2}.`;
  },
  faqs: (h) => [
    { q: 'Do I have to tell HMRC about my savings interest?', a: `Usually not. Banks and building societies report the interest they paid to HMRC after 5 April. If tax is due and you are employed or retired, HMRC sends a calculation and normally collects it through a later tax code. You must declare it yourself only if you already file Self Assessment, or if your interest goes above ${h.m(10000)} in a year.` },
    { q: 'Is interest taxed when it is paid or when it builds up?', a: 'When it is paid to you or made available. Monthly interest counts in the tax year of each payment. A fixed-rate bond that pays everything at maturity puts the whole amount into the year it matures, which can use up the allowance at once and, after 6 April 2027, meets the higher savings rates.' },
    { q: 'Does savings interest count towards the £50,270 higher rate threshold?', a: `Yes. Interest is added on top of your other income, and if the total crosses the basic rate limit the Personal Savings Allowance falls from ${h.m(h.y(h.Y1).psa.basic)} to ${h.m(h.y(h.Y1).psa.higher)}. The interest tax-free under the allowance still uses up band space, which is why a little extra interest can tip part of the rest into the higher rate.` },
    { q: 'Why is the tax on my interest higher than my band suggests?', a: 'Two reasons are common. Interest that pushes total income across the higher rate threshold halves your allowance. And between £100,000 and £125,140, each £2 of interest removes £1 of Personal Allowance, so the interest also raises the tax on your wages; the calculator shows that extra line separately.' },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    return `<h2>The order of the layers matters</h2>
<p>The four tax-free layers are not added up and set against the interest as one lump. Income tax works through income in a fixed order: wages, pensions and rent first, then savings, then dividends. Your Personal Allowance is used by the first slice, so a full-time worker has none left for interest. The ${h.m(Y1.startingRateLimit)} starting rate then applies only to savings that fall within the lowest ${h.m(Y1.startingRateLimit)} of taxable income: with wages of ${h.m(Y1.personalAllowance + Y1.startingRateLimit)} or more, that band is already full before the first pound of interest arrives (${h.src('leg_ita_12a', 'Income Tax Act 2007, section 12A')}). The Personal Savings Allowance comes next, and it is a nil rate band rather than a deduction, so the interest it covers still counts when your band is worked out.</p>
${h.taxByIncome([12570, 16000, 25000, 40000, 49000, 60000, 110000, 150000], 1500)}
<p>The table shows a pattern people do not expect. On ${h.m(1500)} of interest, a pensioner on ${h.m(16000)} pays nothing because the starting rate still has room, while someone on ${h.m(49000)} pays more than someone on ${h.m(40000)} by more than the change in rate alone would explain: the interest takes their total over the basic rate limit, their allowance halves to ${h.m(Y1.psa.higher)} and part of what is left is taxed at the higher rate.</p>
<h2>From April 2027</h2>
<p>Section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')} sets the savings rates for ${h.Y2} at ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)}. The allowances do not move: the starting rate limit is frozen at ${h.m(Y1.startingRateLimit)} until 2030/31 and the Personal Savings Allowance stays at ${h.m(Y1.psa.basic)} and ${h.m(Y1.psa.higher)}. So nobody who pays no tax on interest today starts paying because of the new rates; those who already pay see each taxable pound cost two pence more. The ${h.a('savings-tax-rates-2027', 'page on the 2027/28 rates')} works through who is affected most.</p>
<h2>How it is collected</h2>
<p>There is no tax deducted by the bank: interest has been paid gross since April 2016. HMRC uses the figures banks send after the year ends and, for most employees and pensioners, adds an estimate to the tax code or sends a Simple Assessment letter (${h.src('gov_savings_pay', 'GOV.UK, how you pay tax on savings interest')}). The ${h.a('savings-interest-tax-code', 'tax code page')} explains the timing, and the ${h.a('reclaim-tax-on-savings', 'refund page')} what to do when too much was taken.</p>
<p>To compare the same balance in a cash ISA, where interest is never taxed, use the ${h.a('home', 'ISA against taxable account calculator')}.</p>`;
  },
});
