import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-tax-rates-2027',
  group: 'tax',
  order: 13,
  tool: { kind: 'mini:rates-2027' },
  related: ['tax-on-savings-interest', 'cash-isa-changes', 'stocks-and-shares-isa-cash', 'fixed-rate-bond-tax'],
  sources: ['leg_fa26_s5', 'leg_fa26_s3', 'gov_tfs19', 'leg_fa26_s9'],
  slug: 'savings-tax-rates-2027',
  nav: 'Savings tax rates 2027/28',
  card: 'The 22 %, 42 % and 47 % savings rates from 6 April 2027, and the extra tax they mean at your income.',
  title: 'Savings Tax Rates 2027/28: 22 %, 42 % and 47 % From April',
  description: 'Savings tax rates rise to 22 %, 42 % and 47 % on 6 April 2027 under the Finance Act 2026. See who pays more, how much more, and what stays the same for savers.',
  h1: 'Savings tax rates for 2027/28: two points more in every band',
  intro: 'Enter your other income and the taxable interest you expect in a year. The tool runs the same figures through the 2026/27 and 2027/28 rules and shows the difference.',
  resume: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const a = h.tax(h.Y1, 65000, 2500), b = h.tax(h.Y2, 65000, 2500);
    return `From 6 April 2027 interest that is not covered by any allowance is taxed at ${h.pc(Y2.savingsRates.basic)} in the basic rate band, ${h.pc(Y2.savingsRates.higher)} in the higher rate band and ${h.pc(Y2.savingsRates.additional)} in the additional rate band, against ${h.pc(Y1.savingsRates.basic)}, ${h.pc(Y1.savingsRates.higher)} and ${h.pc(Y1.savingsRates.additional)} in ${h.Y1}. The new rates were announced at the Budget of 26 November 2025 and are already law: section 5 of the Finance Act 2026 sets them for ${h.Y2}. Nothing else in the calculation moves. The Personal Allowance stays at ${h.m(Y2.personalAllowance)}, the starting rate limit at ${h.m(Y2.startingRateLimit)} and the Personal Savings Allowance at ${h.m(Y2.psa.basic)} or ${h.m(Y2.psa.higher)}, so the change only touches interest above them, which costs 2p more per pound. A higher rate taxpayer on ${h.m(65000)} with ${h.m(2500)} of interest pays ${h.m2(a.tax)} on it in ${h.Y1} and ${h.m2(b.tax)} in ${h.Y2}. The main rates on wages and pensions for ${h.Y2} have not yet been set.`;
  },
  faqs: (h) => [
    { q: 'Do the 2027/28 savings rates apply to interest earned before 6 April 2027?', a: `No. Interest is taxed in the tax year in which it is paid or credited to you. Interest paid on or before 5 April 2027 belongs to ${h.Y1} and is taxed at the old rates, even if HMRC collects it later through a tax code. Only interest paid from 6 April 2027 meets the new rates, which matters most for bonds that pay at maturity.` },
    { q: 'Are the main income tax rates also rising in 2027/28?', a: `Nothing has been decided about them. The Finance Act 2026 sets separate rates for savings income in ${h.Y2}; the basic, higher and additional rates on wages, pensions and rent for that year will be set by a later Finance Act. Until then this site prices any effect on wages at the ${h.Y1} rates and says so next to the figure.` },
    { q: 'Who pays nothing extra under the 2027/28 savings rates?', a: `Anyone whose interest is fully covered by the Personal Allowance left over, the ${h.m(h.y(h.Y2).startingRateLimit)} starting rate and the Personal Savings Allowance. Their tax is nil now and stays nil. Interest inside cash ISAs, Premium Bond prizes and ISA investments are outside income tax and are not affected either, so many savers will see no change at all.` },
    { q: 'Why is the 22 % rate also mentioned for stocks and shares ISAs?', a: `From 6 April 2027 interest on cash held inside a stocks and shares or innovative finance ISA bears a flat charge equal to the savings basic rate, ${h.pc(h.y(h.Y2).cashInvestmentIsaCharge)}. The ISA manager pays it out of the account. It applies whatever the saver’s own band, and no Personal Savings Allowance can be set against it.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const incomes = [30000, 45000, 60000, 90000, 150000];
    const amounts = [2000, 5000, 10000];
    const rows = incomes.map((ns) => [h.m(ns), ...amounts.map((i) => { const a = h.tax(h.Y1, ns, i), b = h.tax(h.Y2, ns, i); return `${h.m2(b.tax - a.tax)} (${h.m(b.tax)})`; })]);
    const big = h.tax(h.Y2, 45000, 10000), big1 = h.tax(h.Y1, 45000, 10000);
    return `<h2>What the law changes, and what it leaves alone</h2>
<p>${h.src('leg_fa26_s3', 'Section 3 of the Finance Act 2026')} sets the savings rates for ${h.Y1} at ${h.pc(Y1.savingsRates.basic)}, ${h.pc(Y1.savingsRates.higher)} and ${h.pc(Y1.savingsRates.additional)}, the same as the main rates. ${h.src('leg_fa26_s5', 'Section 5')} then sets ${h.pc(Y2.savingsRates.basic)}, ${h.pc(Y2.savingsRates.higher)} and ${h.pc(Y2.savingsRates.additional)} for ${h.Y2}. From that year, interest will be taxed at a different rate from salary in the same band. The Budget announcement and its link with the ISA reform appear in ${h.src('gov_tfs19', 'HMRC’s tax-free savings newsletter 19')}.</p>
<p>The allowances are fixed separately. ${h.src('leg_fa26_s9', 'Section 9')} freezes the ${h.m(Y2.startingRateLimit)} starting rate limit to 2030/31, and the Personal Savings Allowance has not been touched. The bands are frozen as well, so the higher rate still starts at ${h.m(Y2.personalAllowance + Y2.basicRateLimit)} of total income and the additional rate at ${h.m(Y2.higherRateLimit)} of taxable income.</p>
<h2>Extra tax by income and interest</h2>
${h.table(['Other income', `Interest ${h.m(amounts[0])}`, `Interest ${h.m(amounts[1])}`, `Interest ${h.m(amounts[2])}`], rows, `Extra tax in ${h.Y2} compared with ${h.Y1}, with the ${h.Y2} total in brackets. Computed by this site's engine from the Finance Act 2026 rates.`, ['l', 'r', 'r', 'r'])}
<p>The extra cost is always two pence for each pound of interest that is actually taxed, so it scales with the interest left after the allowances, not with the balance. A basic rate taxpayer with ${h.m(amounts[0])} of interest has ${h.m(Y1.psa.basic)} taxable and pays ${h.m(20)} more a year. The largest increases fall on people with large balances in taxable accounts: ${h.m(10000)} of interest on top of ${h.m(45000)} of salary costs ${h.m2(big1.tax)} in ${h.Y1} and ${h.m2(big.tax)} in ${h.Y2}, partly because the interest pushes much of itself into the higher rate band.</p>
<h2>Who feels it most</h2>
<p>In practice the people affected are those with interest above their allowances: higher rate taxpayers with more than about ${h.m(Y1.psa.higher / 0.04)} in taxable accounts at ${h.pc(0.04)}, retired savers with large deposits and modest pensions, and anyone who receives a large lump of interest in one year, such as from a bond that pays at maturity. The ${h.a('fixed-rate-bond-tax', 'page on fixed rate bonds')} shows how a maturity date either side of 6 April 2027 changes the bill.</p>
<p>The same date brings the ${h.a('cash-isa-changes', 'cash ISA reform')}: savers aged 64 or under at the end of the tax year can put at most ${h.m(Y2.isa.cashUnder65)} a year into cash ISAs, so some cash that would have gone into an ISA ends up in a taxable account just as the rate on it rises. Cash waiting inside investment ISAs meets a flat charge at the new basic savings rate, explained on the ${h.a('stocks-and-shares-isa-cash', 'stocks and shares ISA cash page')}.</p>
<h2>What is not yet known</h2>
<p>Parliament has not fixed the main income tax rates for ${h.Y2}, nor the Scottish rates for that year. Neither affects the tax on interest itself, since savings have their own rates and are taxed on UK bands everywhere. They matter only where interest reduces the Personal Allowance above ${h.m(Y2.taperThreshold)}; in that case the tool uses the ${h.Y1} main rates and labels the figure as an assumption.</p>`;
  },
});
