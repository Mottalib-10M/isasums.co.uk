import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-income-over-100k',
  group: 'tax',
  order: 18,
  tool: { kind: 'mini:trap100' },
  related: ['personal-savings-allowance', 'savings-tax-rates-2027', 'tax-on-savings-interest', 'savings-tax-scotland'],
  sources: ['leg_ita_35', 'gov_rates', 'leg_ita_12b', 'leg_fa26_s5'],
  slug: 'savings-income-over-100k',
  nav: 'Savings income over £100,000',
  card: 'How interest above £100,000 of income shrinks the Personal Allowance and raises the tax on your pay.',
  title: 'Savings Income Over £100,000: Interest and the 60 % Zone',
  description: 'Savings income over £100,000: each £2 of interest removes £1 of Personal Allowance, so interest up to £125,140 costs 60 %, then 45 % with no allowance.',
  h1: 'Savings interest above £100,000: the allowance taper',
  intro: 'Enter your other income, your taxable interest and any gross Gift Aid or relief-at-source pension contributions. The tool shows the full cost of the interest, including the tax it adds to your pay.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const t = h.tax(h.Y1, 100000, 5000);
    return `Above ${h.m(Y1.taperThreshold)} of adjusted net income the Personal Allowance is withdrawn at £1 for every £2, and it has gone completely at ${h.m(Y1.higherRateLimit)}. Interest counts towards adjusted net income like any other income, so in this zone each pound of interest does two things: it is taxed itself, at ${h.pc(Y1.savingsRates.higher)} after a ${h.m(Y1.psa.higher)} allowance, and it removes 50p of Personal Allowance, which exposes 50p of salary to the ${h.pc(Y1.mainRates.higher)} rate. The combined cost of interest falling in the zone is ${h.pc(Y1.savingsRates.higher + Y1.mainRates.higher / 2)} in ${h.Y1}. Someone with ${h.m(100000)} of salary and ${h.m(5000)} of interest loses ${h.m(t.allowanceLost)} of allowance, and the interest costs ${h.m2(t.tax)} in all, ${h.pc(t.tax / t.interest, 1)} of it. Above the zone there is no Personal Savings Allowance and interest is taxed at the additional rate. Gift Aid and relief-at-source pension contributions are deducted, grossed up, when adjusted net income is worked out, and so reduce the taper.`;
  },
  faqs: (h) => [
    { q: 'Does savings interest count towards the £100,000 Personal Allowance limit?', a: `Yes. The taper looks at adjusted net income, which starts from all taxable income, interest included. Interest inside an ISA is not taxable and so does not count. A saver whose salary is ${h.m(98000)} can therefore cross the limit through interest alone, and lose part of the allowance on the excess.` },
    { q: 'What is the effective tax rate on interest between £100,000 and £125,140?', a: `In ${h.Y1} it is ${h.pc(h.y(h.Y1).savingsRates.higher + h.y(h.Y1).mainRates.higher / 2)}: ${h.pc(h.y(h.Y1).savingsRates.higher)} on the interest and a further ${h.pc(h.y(h.Y1).mainRates.higher / 2)} from the allowance it takes away. In ${h.Y2} the savings part rises to ${h.pc(h.y(h.Y2).savingsRates.higher)}. The second part depends on the main higher rate for ${h.Y2}, which Parliament has not yet set; at today’s rate the total would be ${h.pc(h.y(h.Y2).savingsRates.higher + h.y(h.Y1).mainRates.higher / 2)}.` },
    { q: 'Do I get a Personal Savings Allowance with income over £125,140?', a: `No. Once taxable income passes the additional rate threshold of ${h.m(h.y(h.Y1).higherRateLimit)}, the allowance is nil under section 12B, and the Personal Allowance has gone too. Every pound of interest is then taxed at ${h.pc(h.y(h.Y1).savingsRates.additional)} in ${h.Y1} and ${h.pc(h.y(h.Y2).savingsRates.additional)} from 6 April 2027, unless part of it falls in a lower band.` },
    { q: 'How do pension contributions change the tax on interest above £100,000?', a: `Contributions paid with basic rate relief at source, and Gift Aid donations, are deducted from net income at their grossed-up value, £1.25 for every £1 paid, when adjusted net income is worked out. That lowers the figure the taper looks at, so less Personal Allowance is lost to the interest. The tool includes a box for these amounts.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const incomes = [95000, 100000, 105000, 115000, 121000, 130000];
    const rows = incomes.map((ns) => { const a = h.tax(h.Y1, ns, 5000); return [h.m(ns), h.m(a.allowanceLost), h.m2(a.savingsPart), h.m2(a.knockOn ?? 0), h.m2(a.tax), h.pc(a.tax / a.interest, 1)]; });
    const ext = h.tax(h.Y1, 100000, 5000, { extension: 5000 });
    return `<h2>Where the taper comes from</h2>
<p>${h.src('leg_ita_35', 'Section 35 of the Income Tax Act 2007')} reduces the Personal Allowance by half of the amount by which adjusted net income exceeds ${h.m(Y1.taperThreshold)}. With the standard ${h.m(Y1.personalAllowance)} allowance, nothing is left at ${h.m(Y1.higherRateLimit)}. The ${h.src('gov_rates', 'GOV.UK Income Tax rates page')} gives the same figures. Because interest is income, it pushes adjusted net income up in the same way as a bonus would.</p>
<p>The salary is taxed first, so the allowance it would have used is the one that disappears. The extra tax therefore shows up on pay rather than on the interest line, and is easy to miss when looking only at the savings figures. The tool and the table below add the two together.</p>
${h.table(['Salary', 'Allowance lost', 'Tax on the interest itself', 'Extra tax on salary', 'Total', 'Effective rate'], rows, `Cost of ${h.m(5000)} of taxable interest by salary, ${h.Y1}, no pension or Gift Aid deductions. Computed by this site's engine.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Below ${h.m(Y1.taperThreshold)} the interest is simply a higher rate taxpayer’s interest. From ${h.m(Y1.taperThreshold)} the second column appears, and the effective rate climbs towards ${h.pc(Y1.savingsRates.higher + Y1.mainRates.higher / 2)} for interest that sits entirely inside the zone. Above ${h.m(Y1.higherRateLimit)} the allowance has already gone before any interest arrives, so there is nothing more to lose; the interest is then taxed at ${h.pc(Y1.savingsRates.additional)} with no Personal Savings Allowance, as ${h.src('leg_ita_12b', 'section 12B')} gives additional rate taxpayers none.</p>
<h2>Adjusted net income, not salary</h2>
<p>Adjusted net income starts from taxable income and subtracts certain reliefs. GOV.UK lists Gift Aid donations and pension contributions that receive basic rate relief at source: both are deducted at their grossed-up value, £1.25 for every £1 paid. Pension payments made gross, without relief at source, are taken off at the first step of the same calculation. So two savers with the same salary and the same interest can face different bills. With ${h.m(100000)} of salary, ${h.m(5000)} of interest and ${h.m(5000)} of gross relief-at-source contributions, the tool finds an allowance loss of ${h.m(ext.allowanceLost)} and a total cost of ${h.m2(ext.tax)}, against ${h.m2(h.tax(h.Y1, 100000, 5000).tax)} without them.</p>
<h2>From 6 April 2027</h2>
<p>Section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')} raises the higher and additional savings rates to ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)}. The taper and its thresholds stay as they are. The extra tax on salary depends on the main rates for ${h.Y2}, not yet set by Parliament: the tool prices that part at the ${h.Y1} rates and says so in a note. On the same assumption interest inside the zone would cost ${h.pc(h.y(h.Y2).savingsRates.higher + Y1.mainRates.higher / 2)}.</p>
<p>Scottish taxpayers face the same taper. Their interest follows UK rates, but the salary exposed by the lost allowance is taxed at Scottish rates, so the second part of the cost differs; the ${h.a('savings-tax-scotland', 'Scotland page')} explains the split. For the allowance cliff lower down, at ${h.m(Y1.personalAllowance + Y1.basicRateLimit)}, see the ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')}.</p>`;
  },
});
