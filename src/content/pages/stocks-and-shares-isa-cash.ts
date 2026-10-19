import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'stocks-and-shares-isa-cash',
  group: 'isa',
  order: 36,
  tool: { kind: 'mini:investment-cash' },
  related: ['cash-isa-changes', 'cash-isa-limit', 'isa-transfer', 'isa-over-65'],
  sources: ['leg_si_1018', 'gov_tfs22', 'leg_isa_regs'],
  slug: 'stocks-and-shares-isa-cash',
  nav: 'Cash in a stocks and shares ISA',
  card: 'The 22 % charge on interest earned by cash inside an investment ISA from April 2027.',
  title: 'Stocks and Shares ISA Cash: the 22 % Charge From April 2027',
  description: 'Stocks and shares ISA cash: from 6 April 2027 the ISA manager pays a flat 22 % of any interest on it to HMRC, at every age. Money market funds face a new limit.',
  h1: 'Cash inside a stocks and shares ISA: the 22 % charge from 2027',
  intro: 'Enter the cash waiting in your investment ISA and the interest rate paid on it. The tool shows the charge in 2026/27 and 2027/28 and what interest is left.',
  resume: (h) => {
    const c = h.y(h.Y2).cashInvestmentIsaCharge;
    const i = 6000 * 0.035;
    return `Until 5 April 2027, interest earned on uninvested cash inside a stocks and shares ISA is as tax free as everything else in the account. From 6 April 2027, a new regulation 22A, inserted by SI 2026/1018, makes the ISA manager pay HMRC a flat charge of ${h.pc(c)} on any interest paid or credited on cash deposits held in a stocks and shares or innovative finance ISA. The rate is described as representative of the basic savings rate for ${h.Y2}. It is taken whatever your age and tax band, and your Personal Savings Allowance plays no part, because the charge falls on the account, not on your tax return. On ${h.m(6000)} of cash earning 3.5 %, that is ${h.m2(i * c)} of a ${h.m2(i)} interest payment. The same reform makes money market funds eligible for a stocks and shares ISA but forbids them from forming 100 % of its non-cash investments. Junior ISAs are excluded from the charge.`;
  },
  faqs: (h) => [
    { q: 'Do I pay the 22 % charge on stocks and shares ISA cash through my tax return?', a: 'No. Regulation 22A puts the obligation on the ISA manager, who pays the charge to HMRC and reports it in its returns. In practice it reduces the interest credited to the account. It is not income tax charged on you, so there is nothing for you to declare about it and your own allowances do not reduce it.' },
    { q: 'Does the 22 % charge apply to dividends or fund growth in my ISA?', a: 'No. It only concerns interest, or the equivalent alternative finance return, paid or credited on cash deposits held in a stocks and shares or innovative finance ISA. Dividends from shares and funds and any capital growth on investments stay sheltered inside the ISA as before. The charge is aimed only at the cash deposit part of the account.' },
    { q: 'Can a stocks and shares ISA hold only money market funds after April 2027?', a: 'No. SI 2026/1018 names money market funds as qualifying investments for a stocks and shares ISA, but they may not make up 100 % of the value of the non-cash investments in it. An account invested entirely in such funds would act like a cash ISA, which is what the rule is designed to prevent.' },
  ],
  body: (h) => {
    const rate = 0.035, c2 = h.y(h.Y2).cashInvestmentIsaCharge;
    const cash = [2000, 6000, 15000, 40000];
    const rows = cash.map((x) => {
      const i = x * rate;
      return [h.m(x), h.m2(i), h.m2(h.S.accountTax(h.Y1, 'investment-isa-cash', 0, i)), h.m2(h.S.accountTax(h.Y2, 'investment-isa-cash', 0, i)), h.m2(h.tax(h.Y2, 30000, i).tax), h.m2(h.tax(h.Y2, 60000, i).tax)];
    });
    return `<h2>Why the charge exists</h2>
<p>From ${h.Y2}, savers under 65 can put only ${h.m(h.y(h.Y2).isa.cashUnder65)} a year into cash ISAs. Without another rule, the remaining ${h.m(h.y(h.Y2).isa.overall - h.y(h.Y2).isa.cashUnder65)} could be paid into a stocks and shares ISA and simply left in cash, earning interest that no one taxes. The explanatory memorandum to ${h.src('leg_si_1018', 'SI 2026/1018')} names large cash balances in non-cash ISAs as one of the ways the lower limit could be avoided, and the flat charge is the answer. The ${h.src('gov_tfs22', 'HMRC newsletter of June 2026')} announced it alongside the ban on transfers from investment ISAs into cash.</p>
<h2>The charge against ordinary tax</h2>
${h.table(['Cash held', 'Interest at 3.5 %', `Charge ${h.Y1}`, `Charge ${h.Y2}`, 'Tax in a taxable account, £30,000 income', 'Same, £60,000 income'], rows, `Charge on interest from cash held in a stocks and shares ISA, against the income tax the same interest would cost in an ordinary account in ${h.Y2} (no other taxable interest assumed). Worked out by the engine of this site.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The comparison shows an odd result for small balances. On ${h.m(2000)} or ${h.m(6000)} of cash, a basic rate taxpayer would pay nothing if the same interest arrived in an ordinary savings account, because it sits inside the ${h.m(h.y(h.Y2).psa.basic)} Personal Savings Allowance. Inside the ISA, the flat ${h.pc(c2)} applies from the first penny. For a higher rate taxpayer the charge is lower than the ${h.pc(h.y(h.Y2).savingsRates.higher)} they would pay on interest above a ${h.m(h.y(h.Y2).psa.higher)} allowance once the balance grows. None of this changes the fact that a cash ISA, within its own ceiling, carries no charge at all.</p>
<h2>Who it reaches</h2>
<p>The charge applies to stocks and shares ISAs and innovative finance ISAs, at every age. A saver aged 70, who could pay ${h.m(h.y(h.Y2).isa.cashFrom65)} into a cash ISA, still sees it on cash left inside an investment ISA. Junior ISAs are taken out of it: the amended regulation 2D of the ${h.src('leg_isa_regs', 'ISA Regulations 1998')} lists regulation 22A among the rules that do not apply to them. Cash ISAs themselves are unaffected.</p>
<h2>Money market funds</h2>
<p>Money market funds are the investment closest to cash, which is why the explanatory memorandum calls them cash-like. From April 2027 they are named as qualifying investments for stocks and shares ISAs, but the regulations bar them from making up 100 % of the value of the non-cash investments in an account. Managers will report to HMRC the value held in such funds. The 22 % charge deals with cash deposits; the 100 % test deals with portfolios that would otherwise be cash in all but name.</p>
<h2>Related rules</h2>
<p>The full list of changes is on the ${h.a('cash-isa-changes', 'page on the April 2027 reform')}. The ceiling that sits behind all of this is on the ${h.a('cash-isa-limit', 'cash ISA limit page')}, and the limits on moving money between ISA types are on the ${h.a('isa-transfer', 'transfer page')}.</p>`;
  },
});
