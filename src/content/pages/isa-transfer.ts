import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'isa-transfer',
  group: 'isa',
  order: 35,
  tool: { kind: 'mini:transfer' },
  related: ['cash-isa-changes', 'flexible-isa', 'isa-allowance', 'isa-over-65'],
  sources: ['gov_isa_transfer', 'leg_si_1018', 'gov_tfs22'],
  slug: 'isa-transfer',
  nav: 'ISA transfer',
  card: 'What moving an ISA to a better rate is worth, how long it should take, and the 2027 limits.',
  title: 'ISA Transfer Rules: 15 Working Days and the 2027 Ban',
  description: 'ISA transfers move savings to a new provider without using allowance: 15 working days between cash ISAs, 30 days for others. From 2027, none into cash under 65.',
  h1: 'ISA transfers: moving your savings without losing the tax shelter',
  intro: 'Enter the balance you want to move, the rate it earns now and the rate on offer elsewhere. The tool shows the extra tax-free interest a year and the time limit for the move.',
  resume: (h) => {
    const T = h.P.transfers;
    return `An ISA transfer moves money from one ISA to another, with the same or a different provider, without it leaving the tax shelter and without using the current year’s allowance. GOV.UK says the investment can have been made this year or in previous years, and that all or part of an ISA can be moved at any time. The new provider handles it: you fill in its transfer form rather than withdrawing the money yourself. If you withdraw instead, that money loses its ISA status and putting it back in counts as a new payment, unless the account is flexible and you replace it in the same tax year. Transfers between cash ISAs should take no longer than ${T.cashDays} working days, other transfers no longer than ${T.otherDays} calendar days. From 6 April 2027, SI 2026/1018 stops anyone who is under 65 at the end of the tax year moving money from a stocks and shares or innovative finance ISA into a cash ISA. Moves from cash into investments stay open.`;
  },
  faqs: (h) => [
    { q: 'Does transferring an old cash ISA use this year’s ISA allowance?', a: `No. A transfer of money from earlier years keeps its original status and leaves the ${h.m(h.y(h.Y1).isa.overall)} untouched, however large the balance. A saver with ${h.m(90000)} built up over many years can move all of it to a new cash ISA and still pay in the full yearly amount, within the cash ceiling that applies to them, on top.` },
    { q: 'What can I do if my ISA transfer takes longer than 15 working days?', a: 'GOV.UK says to contact your provider first. If you are still unhappy with the answer, the complaint can go to the Financial Ombudsman Service. The 15 working days apply between cash ISAs; for other combinations, such as cash into stocks and shares, the period is 30 calendar days.' },
    { q: 'Can I still move a stocks and shares ISA into cash after April 2027?', a: `Only if you are 65 or over at the end of the tax year. For ${h.Y2}, that means being 65 on 5 April 2028. Below that age the amended regulation 21 forbids transfers from stocks and shares or innovative finance ISAs into cash ISAs, so the ${h.m(h.y(h.Y2).isa.cashUnder65)} cash ceiling cannot be got round by paying into an investment ISA first.` },
    { q: 'Can a provider charge me for transferring my ISA out?', a: 'Some do. GOV.UK notes that providers may have their own restrictions on transfers and may charge a fee for them. Any such charge, or any condition on leaving a fixed term early, is set by the terms of the account rather than by the ISA rules. Lifetime ISAs and Junior ISAs also have specific transfer restrictions. The terms of the account set out what applies.' },
  ],
  body: (h) => {
    const balances = [10000, 25000, 50000, 85000];
    const rows = balances.map((b) => {
      const one = b * 0.01, two = b * 0.02;
      const taxable = h.tax(h.Y2, 45000, b * 0.04).tax;
      return [h.m(b), h.m(one), h.m(two), h.m2(taxable)];
    });
    const T = h.P.transfers;
    return `<h2>How a transfer works</h2>
<p>The ${h.src('gov_isa_transfer', 'GOV.UK page on transferring an ISA')} sets the sequence. You contact the provider you want to move to and fill in its ISA transfer form. The providers then deal with each other, which is what keeps the money inside the shelter: GOV.UK warns that withdrawing it yourself means you cannot reinvest that part of your tax-free allowance. You can move the whole ISA or only part of it, to the same type of ISA or a different one.</p>
<p>The time limits are set out by GOV.UK: ${T.cashDays} working days for transfers between cash ISAs and ${T.otherDays} calendar days for the other kinds. Innovative finance ISAs can transfer their cash, but some of their investments may not be movable. Lifetime ISAs and Junior ISAs have their own transfer limits.</p>
<h2>What a better rate is worth</h2>
${h.table(['Balance', 'Extra interest at +1 point', 'At +2 points', `Tax if left outside an ISA (${h.Y2})`], rows, `Extra tax-free interest a year from a higher rate after a transfer, and for comparison the tax on 4 % interest on the same balance in a taxable account for someone with £45,000 of other income in ${h.Y2}. Worked out by the engine of this site.`, ['r', 'r', 'r', 'r'])}
<p>The last column shows why the route matters. Withdrawing the money to chase a rate means the balance leaves the ISA. At ${h.m(10000)} the interest would still be inside a basic rate taxpayer’s ${h.m(h.y(h.Y2).psa.basic)} allowance and cost nothing. At ${h.m(50000)} or ${h.m(85000)}, the same interest would cost hundreds of pounds a year at the ${h.pc(h.y(h.Y2).savingsRates.basic)} rate that applies from April 2027. And rebuilding that shelter would take years of allowances, since an under-65 saver can only put ${h.m(h.y(h.Y2).isa.cashUnder65)} of new cash into ISAs each year from ${h.Y2}.</p>
<h2>The 2027 restriction</h2>
<p>From 6 April 2027, ${h.src('leg_si_1018', 'SI 2026/1018')} amends regulation 21 of the ISA Regulations. A transfer of funds from a stocks and shares or innovative finance ISA to a cash ISA may only take place if the account holder is 65 or over at the end of the tax year. The ${h.src('gov_tfs22', 'HMRC newsletter of June 2026')} described the same rule when the anti-avoidance measures were announced. The directions that stay open are these.</p>
<ul>
<li>Cash ISA to cash ISA: open at every age.</li>
<li>Cash ISA to stocks and shares or innovative finance ISA: open at every age.</li>
<li>Stocks and shares or innovative finance ISA to cash ISA: from ${h.Y2}, only for those who are 65 or over on 5 April at the end of the year; see the ${h.a('isa-over-65', 'page for savers over 65')}.</li>
</ul>
<p>Until 5 April 2027 the current rules apply, so transfers from investment ISAs into cash remain possible at any age before that date. The wider reform is explained on the ${h.a('cash-isa-changes', 'page on the April 2027 changes')}.</p>
<h2>Transfer or flexible withdrawal</h2>
<p>A ${h.a('flexible-isa', 'flexible ISA')} lets you take cash out and put it back in the same tax year, but only into that account. Moving money to another provider is always a transfer if the shelter is to be kept. The ${h.a('isa-allowance', 'allowance page')} shows what remains of the current year once transfers are set aside.</p>`;
  },
});
