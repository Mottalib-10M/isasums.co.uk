import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'isa-over-65',
  group: 'isa',
  order: 33,
  tool: { kind: 'mini:over65' },
  related: ['cash-isa-limit', 'cash-isa-changes', 'savings-tax-pensioners', 'isa-transfer'],
  sources: ['leg_si_1018', 'gov_tfs22', 'gov_stats'],
  slug: 'isa-over-65',
  nav: 'ISAs over 65',
  card: 'Whether your date of birth keeps the £20,000 cash ISA limit in 2027/28, and from which year.',
  title: 'ISA Rules Over 65 From 2027: Keep the £20,000 Cash Limit',
  description: 'ISA rules for savers aged 65 and over from April 2027: £20,000 in cash, transfers into cash allowed. The test is your age on 5 April, with birth date examples.',
  h1: 'ISAs over 65: keeping the full £20,000 cash limit from April 2027',
  intro: 'Enter your date of birth. The tool tells you your age on 5 April 2028, your cash ISA ceiling in 2027/28, and the first tax year in which you have the full £20,000 for cash.',
  resume: (h) => {
    const B = h.y(h.Y2).isa;
    const late = h.I.firstYearFullCash(1963, 4, 6);
    return `Savers aged 65 or over are left out of the main change to cash ISAs. From 6 April 2027, SI 2026/1018 limits cash ISA subscriptions to ${h.m(B.cashUnder65)} a year only for people who are 64 or under at the end of the tax year. If you are 65 or older on 5 April, which closes the tax year, your cash ceiling for that whole year is ${h.m(B.cashFrom65)}, the same as the overall ISA allowance. In ${h.Y2} the test date is 5 April 2028, so anyone born on or before 5 April 1963 keeps the full cash limit, while a person born on 6 April 1963 is 64 that day and has the lower ceiling until ${late.label}. The same age test decides whether money can be transferred from a stocks and shares or innovative finance ISA into a cash ISA: allowed at 65 or over, barred below. The flat 22 % charge on interest earned by cash inside investment ISAs applies at every age.`;
  },
  faqs: (h) => [
    { q: 'If I turn 65 in February 2028, can I put £20,000 in a cash ISA in May 2027?', a: `Yes. The regulations look at your age at the end of the tax year, and on 5 April 2028 you will be 65. So the whole of ${h.Y2}, from 6 April 2027, carries the ${h.m(h.y(h.Y2).isa.cashFrom65)} cash ceiling even though you are still 64 when you pay in. Providers will need your date of birth to apply this.` },
    { q: 'Can a 66-year-old move a stocks and shares ISA into a cash ISA after April 2027?', a: 'Yes. The ban on transfers from stocks and shares or innovative finance ISAs into cash ISAs only covers people who are under 65 at the end of the tax year. The explanatory memorandum links this exception to the needs of people approaching retirement who want to reduce risk. The usual transfer process through the new provider still applies.' },
    { q: 'Does the 22 % charge on cash in a stocks and shares ISA apply after 65?', a: 'Yes. The flat charge on interest paid on cash held inside a stocks and shares or innovative finance ISA does not depend on age. A saver aged 70 who keeps part of an investment ISA in cash sees the manager pay 22 % of that interest to HMRC, even though the same saver could put that money into a cash ISA with no charge at all.' },
  ],
  body: (h) => {
    const B = h.y(h.Y2).isa;
    const dates: Array<[string, number, number, number]> = [
      ['1 March 1960', 1960, 3, 1], ['5 April 1963', 1963, 4, 5], ['6 April 1963', 1963, 4, 6], ['31 December 1963', 1963, 12, 31],
      ['10 January 1964', 1964, 1, 10], ['20 August 1964', 1964, 8, 20], ['2 February 1966', 1966, 2, 2],
    ];
    const rows = dates.map(([label, y, mo, d]) => {
      const age = h.I.ageAtEndOfYear(h.Y2, y, mo, d), lim = h.I.cashLimit(h.Y2, age);
      const fy = lim === B.cashFrom65 ? h.Y2 : h.I.firstYearFullCash(y, mo, d).label;
      return [label, `${age}`, h.m(lim), fy, lim === B.cashFrom65 ? 'allowed' : 'not allowed'];
    });
    const st = h.P.stats;
    return `<h2>Why 5 April decides everything</h2>
<p>The wording in ${h.src('leg_si_1018', 'SI 2026/1018')} is that the lower ceiling applies to an individual who is 64 or under at the end of the year. A tax year ends on 5 April, so your age on that date governs every subscription made between the previous 6 April and then. This gives an advantage to people whose birthday falls early in the calendar year: they are treated as 65 for months before they actually reach it.</p>
${h.table(['Date of birth', 'Age on 5 April 2028', `Cash limit ${h.Y2}`, 'First year at £20,000', 'Transfer into cash in 2027/28'], rows, 'Cash ISA position in 2027/28 by date of birth. Worked out by the engine of this site from the age test of SI 2026/1018.', ['l', 'r', 'r', 'l', 'l'])}
<p>The pairs of rows either side of 5 April show the edge of the rule. Born on 5 April 1963, you reach 65 on the very last day of ${h.Y2} and keep ${h.m(B.cashFrom65)}. Born a day later, you are 64 on 5 April 2028 and have ${h.m(B.cashUnder65)} for that year, then ${h.m(B.cashFrom65)} from 2028/29. Someone born on 10 January 1964 is also capped in ${h.Y2} but returns to the full figure a year later, while a birthday of 20 August 1964 means two capped years.</p>
<h2>What stays the same for older savers</h2>
<p>For a saver who is 65 or over at the end of the year, cash ISAs work in ${h.Y2} much as they do in ${h.Y1}: ${h.m(B.overall)} can be paid in, in cash or any mix of ISA types, and money can be moved between any kinds of ISA. The ${h.src('gov_tfs22', 'HMRC newsletter of June 2026')} and the explanatory memorandum present this as a deliberate choice to let people near retirement hold less risk. Cash already in ISAs, at any age, stays tax free.</p>
<p>Two parts of the reform do reach savers over 65. The flat ${h.pc(h.y(h.Y2).cashInvestmentIsaCharge)} charge on interest from cash held inside stocks and shares or innovative finance ISAs applies regardless of age. And the higher savings rates of ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)} apply to interest on savings held outside ISAs. For many pensioners that interest is covered anyway by the starting rate for savings and the Personal Savings Allowance; the ${h.a('savings-tax-pensioners', 'page on pensioners and savings tax')} shows when it is not.</p>
<h2>Couples with different ages</h2>
<p>ISAs are individual. In a couple where one partner is 66 and the other 62 in ${h.Y2}, the older one can put ${h.m(B.cashFrom65)} into cash ISAs and the younger one ${h.m(B.cashUnder65)}, giving the household ${h.m(B.cashFrom65 + B.cashUnder65)} of fresh cash ISA room that year. Neither can use the other's allowance while both are alive. When one partner dies, the survivor gains an extra allowance equal to the value of the deceased's ISAs, described on the ${h.a('isa-inheritance-spouse', 'page on inherited ISAs')}.</p>
<h2>How many ISA holders are older</h2>
<p>The ${h.src('gov_stats', 'annual savings statistics of September 2026')} count about ${h.num(st.holders2324 / 1e6)} million people holding ISAs and ${(st.adultAccounts2425 / 1e6).toFixed(1)} million adult accounts subscribed in 2024/25, of which ${h.pc(st.cashShareAccounts2425)} were cash ISAs. For anyone who reaches 65 in the next few years, the ${h.a('cash-isa-limit', 'cash ISA limit page')} gives the ceiling year by year from a year of birth.</p>`;
  },
});
