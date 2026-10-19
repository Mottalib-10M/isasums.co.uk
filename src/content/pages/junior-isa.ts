import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'junior-isa',
  group: 'junior',
  order: 50,
  tool: { kind: 'mini:junior' },
  related: ['childrens-savings-tax', 'junior-isa-at-18', 'lifetime-isa', 'home'],
  sources: ['gov_jisa', 'gov_jisa_add', 'gov_stats', 'gov_children'],
  slug: 'junior-isa',
  nav: 'Junior ISA',
  card: 'The £9,000 yearly limit, who can open and pay into the account, and what regular payments grow to by 18.',
  title: 'Junior ISA 2026/27: the £9,000 Limit and the Value at 18',
  description: 'Junior ISA for 2026/27: £9,000 a year in cash or stocks and shares, opened by a parent, paid into by anyone, locked until 18. See what monthly payments reach.',
  h1: 'Junior ISA: the £9,000 limit and what the account can reach by 18',
  intro: 'Enter the child’s age, what the family pays in each month and what is already saved. The tool grows the account to the 18th birthday and keeps the yearly total within the limit.',
  resume: (h) => {
    const J = h.P.junior;
    const r = h.I.juniorProjection(0, 100, 0, 0.04);
    return `A Junior ISA is a tax-free savings account for a child under ${J.accessAge} who lives in the UK. It comes in two types, cash and stocks and shares, and a child can hold one of each. In ${h.Y1} up to ${h.m(J.annual)} can be paid in across the child's Junior ISAs, by anyone: parents, grandparents, other relatives or friends. Only a parent or guardian with parental responsibility can open the account and manage it, but the money belongs to the child. The child can take over the running of it at ${J.controlAge} and can withdraw the money only from ${J.accessAge}, when the account turns into an adult ISA in their name. Interest, dividends and growth inside it are never taxed, and the parental £100 rule does not apply. Paying ${h.m(100)} a month from birth, with growth of 4 % a year, gives about ${h.m(r.value)} at ${J.accessAge} for ${h.m(r.paid)} paid in.`;
  },
  faqs: (h) => [
    { q: 'Can grandparents pay into a Junior ISA they did not open?', a: `Yes. GOV.UK states that anyone can pay money into a Junior ISA, so grandparents, aunts, uncles and family friends can add to an account a parent opened. The only limit is the total: all payments into the child's Junior ISAs together cannot go over ${h.m(h.P.junior.annual)} in the ${h.Y1} tax year. The provider can explain how payments from people other than the registered contact are made.` },
    { q: 'Can a child have a Junior ISA and a Child Trust Fund at the same time?', a: 'No. A child can hold either a Child Trust Fund or a Junior ISA, not both. Child Trust Funds were given to children born between 1 September 2002 and 2 January 2011. A parent who wants a Junior ISA instead asks the provider of the new Junior ISA to transfer the trust fund into it, and the Child Trust Fund then closes as a separate account.' },
    { q: 'How does the £9,000 Junior ISA limit split between cash and shares?', a: `It is one limit for both. The ${h.m(h.P.junior.annual)} can sit entirely in a cash Junior ISA, entirely in a stocks and shares Junior ISA, or be divided in any proportion, as long as the total for the tax year stays within it. The limit belongs to each tax year, which runs from 6 April to 5 April, so the count starts again on 6 April.` },
    { q: 'Can money come out of a Junior ISA before the child is 18?', a: `In general no: GOV.UK states the child cannot withdraw the money until they turn ${h.P.junior.accessAge}, and taking control at ${h.P.junior.controlAge} lets them manage the account, not empty it. GOV.UK gives separate rules for a child who is terminally ill or who dies, set out in its guidance on those cases.` },
  ],
  body: (h) => {
    const J = h.P.junior;
    const monthly = [25, 50, 100, 250, 750].map((mo) => { const r = h.I.juniorProjection(0, mo, 0, 0.04);
      return [h.m(mo), h.m(r.perYear), h.m(r.paid), h.m(r.growth), h.m(r.value)]; });
    const start = [0, 5, 10, 15].map((age) => { const r = h.I.juniorProjection(0, 100, age, 0.04);
      return [`${age}`, `${J.accessAge - age}`, h.m(r.paid), h.m(r.value)]; });
    return `<h2>Who does what</h2>
<p>The rules separate three roles (${h.src('gov_jisa', 'GOV.UK, Junior Individual Savings Accounts')}). A parent or guardian with parental responsibility opens the account and is its registered contact. Anyone may pay in, within the yearly total (${h.src('gov_jisa_add', 'GOV.UK, adding money to a Junior ISA')}). The child owns the money from the first payment. At ${J.controlAge} the child can become the registered contact; at ${J.accessAge} the account becomes an adult ISA and the money can come out.</p>
<h2>What regular payments grow to</h2>
<p>The table assumes payments start at birth and growth of 4 % a year, a round figure for illustration. In a cash Junior ISA growth is the interest rate offered; in a stocks and shares one it is not guaranteed and the value can fall.</p>
${h.table(['Each month', 'Each year', 'Paid in by 18', 'Growth', 'Value at 18'], monthly, 'Junior ISA from birth to 18, 4 % growth a year assumed. £750 a month is the full £9,000 a year. Worked out by the engine of this site.', ['r', 'r', 'r', 'r', 'r'])}
<p>The top line, ${h.m(750)} a month, is the most the account can take: ${h.m(J.annual)} a year. Few families come close. HMRC counted ${h.num(h.P.stats.juniorAccounts2425)} Junior ISAs subscribed to in 2024/25, with an average of ${h.m(h.P.stats.juniorAvgSubscription2425)} paid in each (${h.src('gov_stats', 'HMRC annual savings statistics, September 2026')}), which is about ${h.m(h.P.stats.juniorAvgSubscription2425 / 12)} a month.</p>
<h2>Starting later</h2>
<p>A Junior ISA can be opened at any age before 18. The later it starts, the fewer years of payments and growth remain. Here ${h.m(100)} a month goes in from the age shown.</p>
${h.table(['Age at first payment', 'Years to 18', 'Paid in', 'Value at 18'], start, '£100 a month from the age shown to 18, 4 % growth a year assumed.', ['l', 'r', 'r', 'r'])}
<h2>Cash or stocks and shares</h2>
<p>A child can have one Junior ISA of each type, or only one of them. In a cash Junior ISA no tax is paid on the interest; in a stocks and shares Junior ISA the money is invested and no tax is paid on capital growth or dividends. The ${h.m(J.annual)} limit covers both together. The choice is the registered contact's until the child takes over at ${J.controlAge}. A child who lives outside the UK can hold a Junior ISA only if their parent is a Crown servant and the child depends on that parent for care.</p>
<h2>Why the wrapper matters for a child</h2>
<p>A child has their own Personal Allowance, starting rate for savings and Personal Savings Allowance, so interest in an ordinary children's account is rarely taxed in the child's name. The issue is money from a parent: once it earns more than ${h.m(J.parentalInterestLimit)} of interest in a tax year, all of that interest is taxed as the parent's income (${h.src('gov_children', 'GOV.UK, interest on savings for children')}). Money in a Junior ISA or a Child Trust Fund is outside that rule. The ${h.a('childrens-savings-tax', 'page on children’s savings tax')} works the rule through with the parent's tax band, and the ${h.a('junior-isa-at-18', 'page on Junior ISAs at 18')} covers what the young adult inherits on their birthday.</p>`;
  },
});
