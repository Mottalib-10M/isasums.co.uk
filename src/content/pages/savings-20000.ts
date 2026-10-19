import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-20000',
  group: 'amounts',
  order: 71,
  tool: { kind: 'isa', props: { balance: 20000, income: 45000, rate: 4 } },
  related: ['cash-isa-limit', 'isa-allowance', 'stocks-and-shares-isa-cash', 'savings-50000'],
  sources: ['gov_isa_how', 'leg_si_1018', 'gov_savings_free'],
  slug: 'savings-20000',
  nav: '£20,000 of savings',
  card: 'One full ISA allowance in cash: what fits in 2026/27, what fits from 2027/28 and what the rest costs in tax.',
  title: '£20,000 Savings: One ISA Allowance, Only £12,000 in Cash',
  description: '£20,000 savings fill one ISA allowance in cash in 2026/27. From 6 April 2027 under-65s can put only £12,000 in cash ISAs: the tax on the other £8,000.',
  h1: '£20,000 in savings: one year of ISA allowance, and what changes in 2027',
  intro: 'The calculator is set to £20,000 at 4 % with £45,000 of other income. It compares a taxable account with a cash ISA in both tax years; change any figure to match your case.',
  resume: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const rest = Y2.isa.overall - Y2.isa.cashUnder65;
    const t45 = h.tax(h.Y2, 45000, rest * 0.04), t55 = h.tax(h.Y2, 55000, rest * 0.04);
    return `${h.m(20000)} is exactly one year's ISA allowance, and in ${h.Y1} the whole sum can go into cash ISAs, split between several accounts if wanted (${h.src('gov_isa_how', 'GOV.UK, how ISAs work')}). From 6 April 2027 the overall allowance stays at ${h.m(Y2.isa.overall)}, but the Individual Savings Account (Amendment) (No. 2) Regulations 2026 cap cash ISA payments at ${h.m(Y2.isa.cashUnder65)} a year for anyone aged 64 or under at the end of the tax year. A saver under 65 with ${h.m(20000)} of new cash therefore has ${h.m(rest)} that cannot go into a cash ISA that year. At 4 %, that ${h.m(rest)} earns ${h.m(rest * 0.04)}. On ${h.m(45000)} of income the tax on it is ${h.m2(t45.tax)}, because the ${h.m(Y1.psa.basic)} Personal Savings Allowance covers it. On ${h.m(55000)}, a higher rate taxpayer with a ${h.m(Y1.psa.higher)} allowance, it is ${h.m2(t55.tax)}. Savers who are 65 or over by 5 April keep the full ${h.m(Y2.isa.cashFrom65)} cash limit.`;
  },
  faqs: (h) => [
    { q: 'Can I put £20,000 into a cash ISA before April 2027?', a: `Yes, in ${h.Y1} the cash limit equals the full ${h.m(h.y(h.Y1).isa.overall)} allowance, until 5 April 2027. Money paid in during that year stays tax free afterwards: the new ${h.m(h.y(h.Y2).isa.cashUnder65)} limit only restricts new payments from 6 April 2027. Since April 2024 the sum can be spread across more than one cash ISA in the same tax year.` },
    { q: 'Where can the other £8,000 go from 2027/28 if I am under 65?', a: 'It can still use the ISA allowance in a stocks and shares or innovative finance ISA, or it can stay in a taxable account. The regulations add two rules for those wrappers from 6 April 2027: cash cannot be transferred from them into a cash ISA by under-65s, and interest on cash held inside them bears a flat 22 % charge, paid by the ISA manager.' },
    { q: 'Does £20,000 at 4 % push a £45,000 earner into the higher rate?', a: `No. The ${h.m(800)} of interest takes total income to ${h.m(45800)}, still below the ${h.m(h.y(h.Y1).personalAllowance + h.y(h.Y1).basicRateLimit)} higher rate threshold, so the Personal Savings Allowance stays at ${h.m(h.y(h.Y1).psa.basic)} and covers it all. The band would change only with a rate above about ${h.pc((h.y(h.Y1).personalAllowance + h.y(h.Y1).basicRateLimit - 45000) / 20000, 0)}, or with other income above ${h.m(h.y(h.Y1).personalAllowance + h.y(h.Y1).basicRateLimit - 800)}.` },
    { q: 'Which birthday keeps the £20,000 cash ISA limit in 2027/28?', a: 'The test is your age at the end of the tax year, 5 April 2028 for 2027/28. Anyone who is 65 on that date, or older, keeps the full cash limit for the whole year, even if the birthday falls late in the year. Someone who turns 65 on 6 April 2028 or later is under the lower limit for 2027/28.' },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const r = 0.04;
    const cases: Array<[string, typeof h.Y1, number]> = [
      [`${h.Y1}, any age`, h.Y1, Y1.isa.cashUnder65],
      [`${h.Y2}, 64 or under on 5 April`, h.Y2, Y2.isa.cashUnder65],
      [`${h.Y2}, 65 or over on 5 April`, h.Y2, Y2.isa.cashFrom65],
    ];
    const rows = cases.map(([label, yk, cash]) => { const left = 20000 - cash; return [label, h.m(cash), h.m(left), h.m(left * r), h.m2(h.tax(yk, 45000, left * r).tax), h.m2(h.tax(yk, 55000, left * r).tax), h.m2(h.tax(yk, 130000, left * r).tax)]; });
    const allTax = h.tax(h.Y2, 55000, 20000 * r).tax;
    return `<h2>Three ways the same £20,000 is treated</h2>
<p>The table follows a single deposit of ${h.m(20000)} of new cash, with as much as possible placed in a cash ISA and the rest left in a taxable account at the same 4 %. It shows what stays taxable and what that costs at three incomes. The only thing that changes between the rows is the cash ISA limit, which depends on the tax year and on age at its end.</p>
${h.table(['Year and age', 'Into cash ISAs', 'Left taxable', 'Interest on it', `Tax, ${h.m(45000)}`, `Tax, ${h.m(55000)}`, `Tax, ${h.m(130000)}`], rows, `${h.m(20000)} of new cash at 4 %, no other savings. Limits from SI 2026/1018; tax from the engine of this site.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>For the ${h.m(45000)} earner, the new limit costs nothing at this rate: the ${h.m(320)} of interest on the uncovered part is inside the allowance. The ${h.m(55000)} earner pays a small sum, and the additional rate taxpayer pays ${h.pc(Y2.savingsRates.additional)} on every pound. Without any ISA, the same higher rate taxpayer would pay ${h.m2(allTax)} on the full ${h.m(800)} in ${h.Y2}.</p>
<h2>What the regulations actually say</h2>
<p>The cap comes from ${h.src('leg_si_1018', 'SI 2026/1018')}, made on ${h.date(h.P.reform.isaRegsMade)} and in force from ${h.date(h.P.reform.inForce)}. It limits subscriptions to cash ISAs to ${h.m(Y2.isa.cashUnder65)} in a tax year for someone who is 64 or under at the end of that year. It does not touch money already saved: a cash ISA filled in ${h.Y1} keeps paying tax-free interest. It also leaves the overall ${h.m(Y2.isa.overall)} unchanged, and the Lifetime ISA keeps its ${h.m(Y2.isa.lisa)} inside that total. The ${h.a('cash-isa-limit', 'cash ISA limit page')} has a tool to test a date of birth.</p>
<h2>The timing of a £20,000 deposit</h2>
<p>Because the limit is per tax year, the date of payment matters more than the amount. ${h.m(20000)} paid into cash ISAs on or before 5 April 2027 is fully sheltered under the current rules. The same sum paid on or after 6 April 2027 by someone under 65 is split: ${h.m(Y2.isa.cashUnder65)} in cash and ${h.m(Y2.isa.overall - Y2.isa.cashUnder65)} either elsewhere in the ISA family or outside it. Withdrawing and paying back in is a separate question: only a flexible ISA lets money taken out be replaced in the same tax year without using fresh allowance.</p>
<p>Interest is counted for tax in the year it is paid, so the interest of a taxable account is compared with the allowance of that year (${h.src('gov_savings_free', 'GOV.UK, tax-free interest')}). The calculator above shows both tax years side by side for your own figures. For the rules on investment ISAs holding cash, see the ${h.a('stocks-and-shares-isa-cash', 'page on cash in a stocks and shares ISA')}, and for a larger balance the ${h.a('savings-50000', '£50,000 page')}.</p>`;
  },
});
