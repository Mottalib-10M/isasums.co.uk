import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'childrens-savings-tax',
  group: 'junior',
  order: 51,
  tool: { kind: 'mini:child-100' },
  related: ['junior-isa', 'junior-isa-at-18', 'personal-savings-allowance', 'home'],
  sources: ['gov_children', 'leg_ittoia_629', 'gov_savings_free'],
  slug: 'childrens-savings-tax',
  nav: 'Tax on children’s savings',
  card: 'The £100 rule on money from a parent, why grandparents’ gifts are different, and the child’s own allowances.',
  title: 'Children’s Savings Tax: the £100 Rule on a Parent’s Gift',
  description: 'Children’s savings tax: interest over £100 a year on money from a parent is taxed as the parent’s income. Grandparents’ gifts and Junior ISAs are outside it.',
  h1: 'Children’s savings tax: when a parent pays tax on the child’s interest',
  intro: 'Enter what one parent has given the child, the rate on the account and that parent’s income. The tool tests the £100 limit and, when it is passed, works out the tax on the parent for this year and next.',
  resume: (h) => {
    const J = h.P.junior;
    const free = h.S.taxFreeInterest(h.Y1, 0);
    const t = h.tax(h.Y1, 60000, 200);
    return `Interest on a child's savings is normally the child's own income, and a child has the same allowances as an adult: the ${h.m(h.y(h.Y1).personalAllowance)} Personal Allowance, the ${h.m(h.y(h.Y1).startingRateLimit)} starting rate for savings and the ${h.m(h.y(h.Y1).psa.basic)} Personal Savings Allowance, so a child with no other income can receive ${h.m(free)} of interest a year before any tax. The exception is money given by a parent. Under section 629 of the Income Tax (Trading and Other Income) Act 2005, if money from one parent produces more than ${h.m(J.parentalInterestLimit)} of interest in a tax year, the whole of that interest is taxed as the parent's income, not only the part above ${h.m(J.parentalInterestLimit)}. The limit applies to each parent separately. Gifts from grandparents, other relatives or friends are not caught, and neither is money in a Junior ISA or a Child Trust Fund. A higher rate parent with ${h.m(60000)} of income whose gift earns ${h.m(200)} pays ${h.m2(t.tax)} on it in ${h.Y1}.`;
  },
  faqs: (h) => [
    { q: 'Is the £100 limit on a child’s interest per parent or per child?', a: `Per parent, and per child. Each parent has their own ${h.m(h.P.junior.parentalInterestLimit)} limit for the interest produced by what they gave, so a child with two parents can receive up to ${h.m(h.P.junior.parentalInterestLimit)} from each parent's money before either is taxed. The test in the Act is applied to each child's income, so a parent with two children looks at each child's interest separately. Interest is counted gross, for the tax year.` },
    { q: 'Do grandparents pay tax on interest from money they give a grandchild?', a: `No. The ${h.m(h.P.junior.parentalInterestLimit)} rule covers only money that comes from a parent. Interest on a grandparent's gift is the grandchild's own income, set against the child's Personal Allowance, starting rate and Personal Savings Allowance. A child with no earnings can receive ${h.m(h.S.taxFreeInterest(h.Y1, 0))} of interest a year in ${h.Y1} without any tax, whatever the size of the gift.` },
    { q: 'Can a parent’s own Personal Savings Allowance cover a child’s interest?', a: `Yes. Once the interest passes ${h.m(h.P.junior.parentalInterestLimit)}, it is added to the parent's income and taxed like the parent's own interest. Any Personal Savings Allowance, starting rate or Personal Allowance the parent has left is used first. A basic rate parent who has no other interest pays nothing on up to ${h.m(h.y(h.Y1).psa.basic)} of it; a higher rate parent, nothing on the first ${h.m(h.y(h.Y1).psa.higher)}.` },
    { q: 'What must a parent tell HMRC about a child’s savings interest?', a: `GOV.UK asks parents to tell HMRC when money they gave earns the child more than ${h.m(h.P.junior.parentalInterestLimit)} of interest in a tax year, which runs from 6 April to 5 April. A child whose own income, for example from a trust, goes above their Personal Allowance must also be reported, and the child pays the tax on that income.` },
  ],
  body: (h) => {
    const J = h.P.junior;
    const gifts = [2000, 2500, 3000, 5000, 10000];
    const rate = 0.04;
    const rows = gifts.map((g) => { const i = g * rate; const over = i > J.parentalInterestLimit;
      const b = over ? h.tax(h.Y1, 35000, i).tax : 0, hi = over ? h.tax(h.Y1, 60000, i).tax : 0, hi2 = over ? h.tax(h.Y2, 60000, i).tax : 0;
      return [h.m(g), h.m(i), over ? 'Parent' : 'Child', h.m2(b), h.m2(hi), h.m2(hi2)]; });
    const used = [0, 300, 500].map((o) => { const t1 = h.tax(h.Y1, 60000, 400, { otherInterest: o }); const t2 = h.tax(h.Y2, 60000, 400, { otherInterest: o });
      return [h.m(o), h.m2(t1.tax), h.m2(t2.tax)]; });
    return `<h2>The rule in law</h2>
<p>Section 629 of the ${h.src('leg_ittoia_629', 'Income Tax (Trading and Other Income) Act 2005')} treats income from a settlement made by a parent on their own child under 18 who is not married or in a civil partnership, as the parent's income; a stepchild counts as a child for this purpose. A gift of money to a child counts as such a settlement. A de minimis limit of ${h.m(J.parentalInterestLimit)} a year applies, but it works as a threshold, not as an allowance: at ${h.m(101)} of interest, all ${h.m(101)} belongs to the parent for tax.</p>
<h2>Where the £100 falls at today's rates</h2>
<p>At 4 % a year, the limit is crossed once a parent's gift is above ${h.m(J.parentalInterestLimit / rate)}. The table shows what happens next for a basic rate parent on ${h.m(35000)} and a higher rate parent on ${h.m(60000)}, with no other interest of their own.</p>
${h.table(['Parent’s gift', 'Interest a year', 'Taxed as', 'Basic rate parent 2026/27', 'Higher rate parent 2026/27', 'Higher rate parent 2027/28'], rows, 'Interest at 4 % on money from one parent in an ordinary children’s account. Worked out by the engine of this site.', ['r', 'r', 'l', 'r', 'r', 'r'])}
<p>For many parents the result is no tax at all, even after the limit is passed, because the child's interest falls inside the parent's own Personal Savings Allowance. The bill appears when the parent's allowance is already used by their own savings, or when the parent pays tax at the higher or additional rate. GOV.UK sets out the allowances in ${h.src('gov_savings_free', 'how much savings interest is tax free')}.</p>
<p>Because each parent's money is tested on its own, a child's account can hold more parental money than the first figure suggests. At 4 %, a mother and a father can each give ${h.m(J.parentalInterestLimit / rate)} before the interest from either gift reaches ${h.m(J.parentalInterestLimit)}, so ${h.m(2 * J.parentalInterestLimit / rate)} in all stays the child's for tax. A stepparent is treated as a parent under the Act, so money from a stepparent is tested in the same way. A higher rate on the account lowers these amounts: at 5 %, each parent's limit is reached at ${h.m(J.parentalInterestLimit / 0.05)}.</p>
<h2>When the parent has savings too</h2>
<p>The child's interest is added to everything else the parent earns in interest. Below, a higher rate parent on ${h.m(60000)} has ${h.m(400)} of the child's interest attributed to them, alongside different amounts of their own. The rate rises from ${h.pc(h.y(h.Y1).savingsRates.higher)} to ${h.pc(h.y(h.Y2).savingsRates.higher)} on 6 April 2027 under the Finance Act 2026.</p>
${h.table(['Parent’s own interest', 'Tax on the child’s £400, 2026/27', 'Same, 2027/28'], used, 'Tax caused by £400 of a child’s interest attributed to a parent on £60,000, by the parent’s own interest.', ['r', 'r', 'r'])}
<h2>Outside the rule</h2>
<p>Money from grandparents, godparents and friends is the child's, and its interest is set against the child's own allowances (${h.src('gov_children', 'GOV.UK, interest on savings for children')}). So is money a child earns. Money a parent puts in a ${h.a('junior-isa', 'Junior ISA')} or a Child Trust Fund is exempt from the parental rule because no tax is charged on interest inside those accounts. What happens to that money when the child grows up is on the ${h.a('junior-isa-at-18', 'Junior ISA at 18 page')}.</p>`;
  },
});
