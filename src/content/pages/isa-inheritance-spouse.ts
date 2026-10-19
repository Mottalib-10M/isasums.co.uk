import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'isa-inheritance-spouse',
  group: 'isa',
  order: 37,
  mini: { kind: 'mini:aps' },
  related: ['isa-allowance', 'isa-over-65', 'cash-isa-limit', 'isa-transfer'],
  sources: ['gov_isa_death', 'gov_aps', 'leg_isa_regs', 'gov_isa_how', 'leg_fa26_s5'],
  slug: 'isa-inheritance-spouse',
  nav: 'Inheriting an ISA',
  card: 'The extra ISA allowance a widow, widower or surviving civil partner receives, and the deadlines.',
  title: 'ISA Inheritance for a Spouse: the Extra Allowance (APS)',
  description: 'ISA inheritance for a surviving spouse or civil partner: an extra allowance equal to the ISA value at death or at closure, its deadlines, and worked sums.',
  h1: 'Inheriting an ISA from a spouse or civil partner',
  intro: 'When an ISA holder dies, the account does not simply disappear, and a surviving spouse or civil partner receives an extra allowance to keep the same amount sheltered. This guide explains the continuing account, the additional permitted subscription and its time limits.',
  resume: (h) => {
    const v = 60000, r = 0.04;
    return `When someone dies on or after 6 April 2018, their ISA becomes a "continuing account of a deceased investor": it keeps its tax-free status until the executor closes it, the administration of the estate is completed, or three years have passed since the death, and no new money can be paid in. Separately, a surviving spouse or civil partner who was living with the deceased at the date of death can pay an additional permitted subscription, often called an APS, into their own ISAs. It is worth up to the higher of the value of the deceased's ISAs at the date of death and their value when the continuing account ended. This allowance comes on top of the survivor's own ${h.m(h.y(h.Y1).isa.overall)} a year. The money itself goes to the beneficiary named in the will; the APS belongs to the spouse even if someone else inherits the savings. With an APS of ${h.m(v)} kept at ${h.pc(r)}, ${h.m(v * r)} of yearly interest stays out of income tax.`;
  },
  faqs: (h) => [
    { q: 'How long does a surviving spouse have to use the additional ISA allowance?', a: 'For cash, until 3 years after the date of death or, if later, 180 days after the administration of the estate is complete, according to HMRC guidance for ISA managers. Investments transferred in their existing form, called in specie, must be subscribed within 180 days of beneficial ownership passing to the spouse or civil partner. After those dates the extra allowance is lost.' },
    { q: 'Can I use the inherited ISA allowance if my spouse left the money to our children?', a: 'Yes. The additional permitted subscription is attached to the survivor, not to the savings. Even if the will gives the ISA money to children or anyone else, the spouse or civil partner can still pay the same value of their own money into an ISA on top of the normal allowance, provided the couple were living together when the death occurred.' },
    { q: 'Do separated spouses receive the additional permitted subscription?', a: 'No. HMRC guidance requires the couple to have been living together at the date of death. Spouses separated under a court order, under a deed of separation, or in circumstances where the marriage or civil partnership had broken down do not qualify. A divorced former spouse does not qualify either, since the person must be a surviving spouse or civil partner.' },
    { q: 'Is the inherited ISA allowance affected by the £12,000 cash ISA limit from 2027?', a: 'HMRC guidance treats an additional permitted subscription as a previous year subscription for every type of ISA except the Lifetime ISA, so it does not use the current year allowance. When checked on 19 October 2026, that guidance did not yet address the cash ceiling that starts on 6 April 2027, so its exact interaction is not yet published.' },
  ],
  body: (h) => {
    const values = [20000, 60000, 150000];
    const incomes = [22000, 45000, 70000];
    const r = 0.04;
    const rows = values.map((v) => [h.m(v), h.m(v * r), ...incomes.map((inc) => h.m2(h.tax(h.Y2, inc, v * r).tax))]);
    const A = h.y(h.Y1).isa;
    const steps: Array<[string, string]> = [
      ['Date of death', 'ISA becomes a continuing account of a deceased investor; tax free; no new payments'],
      ['During administration', 'Interest and growth in the account stay tax free until it ends'],
      ['Closure, completion of the estate, or 3 years after death', 'Continuing account ends; later income is no longer sheltered'],
      ['Up to 3 years after death, or 180 days after the estate is complete if later', 'Last day for a cash APS'],
      ['Within 180 days of the investments passing to the survivor', 'Last day for an in specie APS'],
    ];
    return `<h2>Two separate things: the account and the allowance</h2>
<p>People often speak of "inheriting an ISA", but two different mechanisms are involved. The first concerns the deceased's own account and what happens to its tax treatment while the estate is dealt with. The second is an allowance given to the surviving spouse or civil partner, which lets them shelter an amount equal to what the deceased held. ${h.src('gov_isa_death', 'GOV.UK')} covers both, and the detailed conditions are in the ${h.src('leg_isa_regs', 'ISA Regulations 1998')} and in ${h.src('gov_aps', 'HMRC guidance for ISA managers')}.</p>
<p>The money in the account goes to the beneficiary named in the will. The allowance does not follow it: it belongs to the surviving spouse or civil partner whatever the will says. This is what makes the rule useful even when the savings themselves go to children, a charity or anyone else.</p>
<h2>The continuing account</h2>
<p>For deaths on or after 6 April 2018, the ISA does not close at death. It becomes a continuing account of a deceased investor, and the interest, dividends and growth inside it remain tax free. Nobody can add money to it. The account ends at the earliest of three events: the executor or administrator closes it, the administration of the estate is completed, or three years pass from the date of death. After that, income earned by the money is no longer sheltered by the ISA rules.</p>
<p>For deaths between 3 December 2014 and 5 April 2018, the rules were older and simpler: the ISA ended on the date of death, and the spouse's extra allowance was the value at that date. There is no extra allowance at all for deaths before 3 December 2014. GOV.UK also notes, for that earlier period, that the investments form part of the estate for Inheritance Tax. This site does not cover Inheritance Tax.</p>
${h.table(['When', 'What happens'], steps, 'The sequence after the death of an ISA holder, for deaths on or after 6 April 2018. From GOV.UK and HMRC guidance for ISA managers, read on 19 October 2026.')}
<h2>The additional permitted subscription</h2>
<h3>Who qualifies</h3>
<p>The APS is open to the surviving spouse or civil partner of an ISA holder who has died, if the couple were living together at the date of death. HMRC guidance excludes couples separated under a court order or a deed of separation, and those whose marriage or civil partnership had broken down. Unmarried partners do not qualify, however long they lived together, because the rule refers only to spouses and civil partners.</p>
<h3>How much</h3>
<p>The limit is the value of all the deceased's ISAs, taken at whichever moment is higher: the date of death, or the date on which the continuing account ended. If the investments rose during administration, the later figure gives a bigger allowance; if they fell, the value at death still counts. There is one trap in the guidance: a survivor who chooses to use the value at death and starts subscribing on that basis cannot later switch to the closure value.</p>
<p>This sits beside the survivor's own allowance. A widow who has already paid ${h.m(15000)} into ISAs this year still has ${h.m(A.overall - 15000)} of her own allowance plus the full APS. HMRC guidance treats the APS as a previous year subscription for every type of ISA except the Lifetime ISA, where it counts towards the ${h.m(A.lisa)} yearly payment limit. Payments can be split into several instalments, so long as the total stays within the limit.</p>
<h3>Where it can be paid</h3>
<p>The APS can go into a cash ISA, a stocks and shares ISA, an innovative finance ISA or, for a UK resident, a Lifetime ISA. It cannot go into a Junior ISA. The survivor can use the provider that held the deceased's ISA or another provider that agrees to accept it, but providers are not obliged to accept additional permitted subscriptions. Once instalments have started with one provider, further payments up to the limit must be made with the same one, and an unused balance cannot be taken elsewhere.</p>
<h3>Cash or investments</h3>
<p>Most APS payments are in cash. For cash, the deadline is three years after the date of death or, if later, 180 days after the administration of the estate is complete. Non-cash assets can also be subscribed in their existing form, called an in specie subscription, once they pass to the survivor; the deadline is 180 days from that distribution, and each interim or final distribution starts its own 180 days. These deadlines come from HMRC's guidance for ISA managers rather than from the GOV.UK page for the public.</p>
<h2>What the extra allowance is worth each year</h2>
<p>The value of the APS lies in keeping a sum of money out of the income tax calculation for the rest of the survivor's life. The table shows the tax that the interest on three sizes of APS would cost in ${h.Y2} if the money sat in an ordinary account instead, at three levels of other income.</p>
${h.table(['APS', 'Interest at 4 %', 'Tax if taxable, income £22,000', 'Income £45,000', 'Income £70,000'], rows, `Yearly tax on 4 % interest that an APS can shelter, at the ${h.Y2} savings rates of the Finance Act 2026 and with no other taxable interest assumed. Worked out by the engine of this site.`, ['r', 'r', 'r', 'r', 'r'])}
<p>A survivor on a state and private pension of ${h.m(22000)} with an APS of ${h.m(20000)} would pay nothing even outside an ISA, since ${h.m(20000 * r)} of interest is within the ${h.m(h.y(h.Y2).psa.basic)} Personal Savings Allowance. The picture changes with larger sums. On ${h.m(150000)}, the interest of ${h.m(150000 * r)} would cost ${h.m(h.tax(h.Y2, 22000, 150000 * r).tax)} a year at ${h.m(22000)} of other income and ${h.m(h.tax(h.Y2, 70000, 150000 * r).tax)} at ${h.m(70000)}, at the ${h.pc(h.y(h.Y2).savingsRates.basic)} and ${h.pc(h.y(h.Y2).savingsRates.higher)} rates that ${h.src('leg_fa26_s5', 'section 5 of the Finance Act 2026')} sets for ${h.Y2}. Without the APS, moving ${h.m(150000)} into ISAs through the normal allowance alone would take years, and from April 2027 an under-65 survivor could put no more than ${h.m(h.y(h.Y2).isa.cashUnder65)} a year of it into cash ISAs.</p>
<h2>The 2027 cash ceiling and the APS</h2>
<p>The reform that starts on 6 April 2027 limits cash ISA subscriptions to ${h.m(h.y(h.Y2).isa.cashUnder65)} a year for anyone who is 64 or under at the end of the year. Because an APS counts as a previous year subscription for cash, stocks and shares and innovative finance ISAs, it does not use the current year's allowance in the usual way. HMRC's guidance on additional permitted subscriptions, as read on 19 October 2026, says nothing yet about the new cash ceiling, and the ISA manager guidance is due to be updated before April 2027. Until it is, how a cash APS paid after 6 April 2027 interacts with the ${h.m(h.y(h.Y2).isa.cashUnder65)} limit for an under-65 survivor is not set out in published guidance, and this page does not guess. Survivors aged 65 or over at the end of the year have a ${h.m(h.y(h.Y2).isa.cashFrom65)} cash ceiling in any case; the ${h.a('isa-over-65', 'page for savers over 65')} covers the age test.</p>
<h2>Practical sequence</h2>
<p>Put together, the rules give a clear order of events. The continuing account keeps the deceased's savings sheltered while the estate is dealt with. Its value at death and at closure fixes the size of the APS. The survivor then pays the APS, in one go or in instalments, into an ISA of their own with the provider that held the deceased's ISA or with another one that accepts it, before the deadline. GOV.UK suggests asking the ISA provider for the figures that apply in a particular case. Throughout, the survivor's own ${h.src('gov_isa_how', 'yearly allowance')} continues as normal beside the APS. For the survivor's own room this year, see the ${h.a('isa-allowance', 'ISA allowance page')}; for moving an existing ISA once the APS is in place, the ${h.a('isa-transfer', 'transfer page')}.</p>`;
  },
});
