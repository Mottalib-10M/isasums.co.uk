import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'flexible-isa',
  group: 'isa',
  order: 34,
  tool: { kind: 'mini:flexible' },
  related: ['isa-allowance', 'isa-transfer', 'cash-isa-limit', 'cash-isa-changes'],
  sources: ['gov_isa_withdraw', 'leg_isa_regs', 'leg_si_1018'],
  slug: 'flexible-isa',
  nav: 'Flexible ISA',
  card: 'How much you can still pay in after a withdrawal, with and without the flexible rule.',
  title: 'Flexible ISA Rules: Withdraw and Replace in the Same Year',
  description: 'A flexible ISA lets you take money out and put it back in the same tax year without using more allowance. See the GOV.UK example and the cash rule from 2027.',
  h1: 'Flexible ISA: putting back what you took out',
  intro: 'Enter what you have paid in this tax year, what you have taken out, and whether the account is flexible. The tool shows how much you can still pay in, and the figure for the other kind of account.',
  resume: (h) => {
    const ex = h.I.flexibleRoom(h.Y1, 10000, 3000, true), nx = h.I.flexibleRoom(h.Y1, 10000, 3000, false);
    return `A flexible ISA is one whose terms allow you to withdraw cash and replace it later in the same tax year without the replacement counting as a new subscription. Any ISA lets you take money out at any time without losing the tax benefit on what remains, but only a flexible one gives back the allowance used by the money withdrawn. GOV.UK gives the standard example: with the ${h.m(h.y(h.Y1).isa.overall)} allowance, you pay in ${h.m(10000)} and take out ${h.m(3000)}. If the ISA is flexible you can still pay in ${h.m(ex.room)}; if it is not, only ${h.m(nx.room)}, because the ${h.m(3000)} withdrawn has used allowance for good. The money must be put back before 5 April of the same tax year; after that date the room is lost. Flexibility is an option for the provider, not a right, and from 6 April 2027 money replaced in a cash ISA may not take a saver past the cash ISA ceiling.`;
  },
  faqs: (h) => [
    { q: 'How do I know whether my ISA is flexible?', a: 'Only the provider can say. The ISA Regulations allow flexibility but do not require it, so it depends on the terms and conditions of each account. GOV.UK says your ISA provider can tell you whether your ISA is flexible. Two accounts with the same provider can follow different terms, so the answer belongs to the account, not to the bank or building society as a whole.' },
    { q: 'Can I take money out of a flexible ISA in March and put it back in May?', a: `Not without using new allowance. The replacement has to happen in the same tax year as the withdrawal. Money taken out in March 2027 belongs to ${h.Y1}, which ends on 5 April 2027; putting it back in May 2027 counts as a fresh payment against the ${h.Y2} allowance, and from April 2027 against the cash ceiling for savers under 65.` },
    { q: 'Does replacing money in a flexible ISA count towards the £12,000 cash limit from 2027?', a: `It can. The amended regulation 5DDB says that money replaced in a cash ISA must not take you above the cash subscription limit. So for an under-65 saver in ${h.Y2}, withdrawals put back into a flexible cash ISA must stay within the ${h.m(h.y(h.Y2).isa.cashUnder65)} ceiling as set out in the regulations.` },
    { q: 'Is a withdrawal from a non-flexible ISA taxed?', a: 'No. Taking money out of any ISA does not create a tax charge, and the interest or growth earned while it was inside stays tax free. What you lose is the shelter for that money from then on, plus, in a non-flexible ISA, the part of the year’s allowance it used. Lifetime ISAs are the exception, with a 25 % charge on most withdrawals.' },
  ],
  body: (h) => {
    const cases: Array<[number, number]> = [[10000, 3000], [20000, 5000], [20000, 20000], [15000, 2000], [6000, 6000]];
    const rows = cases.map(([paid, out]) => {
      const f = h.I.flexibleRoom(h.Y1, paid, out, true), n = h.I.flexibleRoom(h.Y1, paid, out, false);
      return [h.m(paid), h.m(out), h.m(f.room), h.m(n.room), h.m(f.room - n.room)];
    });
    return `<h2>The rule in the regulations</h2>
<p>Flexibility comes from regulation 5DDB of the ${h.src('leg_isa_regs', 'ISA Regulations 1998')}. It lets the terms of an ISA provide for cash withdrawn to be replaced, in whole or in part, without affecting the saver’s subscription limit. ${h.src('gov_isa_withdraw', 'GOV.UK')} sums it up as being able to take cash out and put it back in the same tax year without reducing the current year’s allowance. The word that matters is cash: the rule concerns money withdrawn from the account, so it fits naturally with cash ISAs and with the cash part of other ISAs that offer it.</p>
<h2>Five withdrawals compared</h2>
${h.table(['Paid in this year', 'Taken out', 'Room left if flexible', 'Room left if not', 'Difference'], rows, `Room left in the ${h.Y1} allowance of £20,000 after one payment and one withdrawal. Worked out by the engine of this site from the GOV.UK example.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The third line is the extreme case. A saver who has paid the whole ${h.m(20000)} and then takes all of it out has the full allowance back if the account is flexible, and nothing at all if it is not. In the last line, ${h.m(6000)} paid in and fully withdrawn leaves ${h.m(20000)} of room with flexibility against ${h.m(14000)} without it. The difference column is always the amount withdrawn, capped at what was paid in.</p>
<h2>Same tax year, and what that means in practice</h2>
<p>The window for putting money back closes on 5 April. A withdrawal on 1 April leaves five days. There is no carry-over: if the money returns on 6 April, it uses the new year’s allowance like any other deposit. For an under-65 saver crossing into ${h.Y2}, that new allowance carries the ${h.m(h.y(h.Y2).isa.cashUnder65)} cash ceiling of ${h.src('leg_si_1018', 'SI 2026/1018')}.</p>
<p>The replacement is governed by the terms of the account the money came from. Moving an ISA between providers without losing its status is a different process, done by ${h.a('isa-transfer', 'a transfer')} through the new provider.</p>
<h2>The cash ceiling from April 2027</h2>
<p>The amending regulations change regulation 5DDB so that replacing money in a cash ISA may not exceed the cash subscription limit. Take an under-65 saver who pays ${h.m(12000)} into a flexible cash ISA in ${h.Y2}, withdraws ${h.m(4000)} and then wants to put it back. Under the old logic, the ${h.m(4000)} replacement would not count at all. The amended rule ties the replacement to the cash limit, so the saver can only rely on what the regulations allow within the ${h.m(h.y(h.Y2).isa.cashUnder65)}. Detailed guidance for providers is still to be published; the ${h.a('cash-isa-changes', 'page on the April 2027 changes')} keeps track of what is known.</p>
<h2>Where flexibility does not reach</h2>
<p>Lifetime ISAs have their own withdrawal rules, with a 25 % charge when money is taken out for a purpose other than a first home, reaching 60 or terminal illness. Money in a Junior ISA is locked until the child is 18. And whatever the account, flexibility only restores allowance: it does not undo the fact that money outside the ISA earns interest that enters your tax calculation. The ${h.a('isa-allowance', 'ISA allowance page')} shows the whole year’s position, and the ${h.a('home', 'main calculator')} the tax on savings held outside.</p>`;
  },
});
