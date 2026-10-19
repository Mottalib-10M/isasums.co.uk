import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cash-isa-limit',
  group: 'isa',
  order: 31,
  tool: { kind: 'mini:cash-limit' },
  related: ['cash-isa-changes', 'isa-over-65', 'isa-allowance', 'savings-20000'],
  sources: ['leg_si_1018', 'gov_tfs22', 'gov_isa'],
  slug: 'cash-isa-limit',
  nav: 'Cash ISA limit',
  card: 'Your cash ISA ceiling in 2026/27 and 2027/28 from your year of birth, and the cash that will not fit.',
  title: 'Cash ISA Limit 2027/28: £12,000 Under 65, £20,000 After',
  description: 'The cash ISA limit is £20,000 in 2026/27, then £12,000 from 6 April 2027 for anyone 64 or under on 5 April. Find your limit from your birth year and birthday.',
  h1: 'Cash ISA limit: £20,000 this year, £12,000 under 65 from April 2027',
  intro: 'Give your year of birth, say whether your birthday falls after 5 April, and enter the cash you would like to put away each year. The tool returns your cash ceiling for both tax years and the part that would not fit.',
  resume: (h) => {
    const A = h.y(h.Y1).isa, B = h.y(h.Y2).isa;
    return `In the ${h.Y1} tax year, ending on 5 April 2027, the whole ${h.m(A.overall)} ISA allowance may go into cash ISAs, whatever your age. From 6 April 2027 the Individual Savings Account (Amendment) (No. 2) Regulations 2026, SI 2026/1018, cap cash ISA subscriptions at ${h.m(B.cashUnder65)} a year for anyone who is 64 or under at the end of the tax year, which means on 5 April. For ${h.Y2} the test date is 5 April 2028: if you are 65 or older on that day, you keep a cash ceiling of ${h.m(B.cashFrom65)}. Someone born on 5 April 1963 is 65 that day and keeps it; someone born a day later is 64 and does not. The overall allowance stays ${h.m(B.overall)}, so an under-65 saver can still place ${h.m(B.overall - B.cashUnder65)} in stocks and shares, innovative finance or Lifetime ISAs. Cash already held in ISAs is not affected.`;
  },
  faqs: (h) => [
    { q: 'Is the £12,000 cash ISA limit per account or per person?', a: `Per person and per tax year. It covers everything you pay into all your cash ISAs together, even if they are with different banks or building societies. Paying ${h.m(6000)} into each of two cash ISAs uses the whole ${h.m(h.y(h.Y2).isa.cashUnder65)} for someone under 65 in ${h.Y2}. The overall ${h.m(h.y(h.Y2).isa.overall)} allowance still applies on top as a separate ceiling.` },
    { q: 'Which day decides whether I get the £12,000 or the £20,000 cash limit?', a: 'The last day of the tax year, 5 April. The regulations ask whether you are 64 or under at the end of that year, not on the day you pay in. A person who turns 65 in January 2028 is 65 on 5 April 2028 and so has the higher ceiling for the whole of 2027/28, including deposits made in the summer of 2027 while still 64.' },
    { q: 'Can I still pay £20,000 into a cash ISA before April 2027?', a: `Yes. The lower ceiling only starts with the ${h.Y2} tax year on 6 April 2027. Until 5 April 2027 the full ${h.m(h.y(h.Y1).isa.overall)} can go into cash ISAs at any age, and whatever is paid in during that time stays tax free in later years. The new rules do not reach back to money already held in a cash ISA.` },
    { q: 'Does the cash limit apply to a Junior ISA held by a teenager?', a: `No. A Junior ISA has its own allowance of ${h.m(h.y(h.Y2).isa.junior)} a year, which can be held in cash in full. The adult cash ceiling starts once the young person holds adult ISAs, which is only possible from 18. An 18-year-old in ${h.Y2} is well under 65, so the adult cash ceiling for them is ${h.m(h.y(h.Y2).isa.cashUnder65)}.` },
  ],
  body: (h) => {
    const B = h.y(h.Y2).isa;
    const people: Array<[string, number, number]> = [
      ['Born in 1960', 1960, 9], ['Born March 1963', 1963, 3], ['Born October 1963', 1963, 10], ['Born February 1966', 1966, 2],
      ['Born July 1970', 1970, 7], ['Born 1980', 1980, 8], ['Born 1995', 1995, 8], ['Born 2008', 2008, 8],
    ];
    const rows = people.map(([label, by, bm]) => {
      const age = h.I.ageAtEndOfYear(h.Y2, by, bm);
      const lim = h.I.cashLimit(h.Y2, age);
      const fy = lim === B.cashFrom65 ? h.Y2 : h.I.firstYearFullCash(by, bm).label;
      return [label, `${age}`, h.m(lim), h.m(h.y(h.Y2).isa.overall - lim), fy];
    });
    return `<h2>Where the rule comes from</h2>
<p>The lower ceiling was announced at the Budget of 26 November 2025 and is now law. ${h.src('leg_si_1018', 'SI 2026/1018')} was made on 10 September 2026, laid before Parliament on 14 September 2026 and takes effect on 6 April 2027. It amends regulation 4ZA of the ISA Regulations 1998 so that a person who is 64 or under at the end of a year may subscribe only ${h.m(B.cashUnder65)} to cash ISAs in that year. The ${h.src('gov_tfs22', 'HMRC newsletter of June 2026')} set out the same design before the regulations were made.</p>
<h2>Your ceiling by date of birth</h2>
${h.table(['Born', 'Age on 5 April 2028', `Cash limit ${h.Y2}`, 'Room left for other ISAs', 'First year at £20,000 cash'], rows, 'Cash ISA ceiling in 2027/28 by date of birth. Worked out by the engine of this site from the age test of SI 2026/1018.', ['l', 'r', 'r', 'r', 'l'])}
<p>The two rows for 1963 show how much the birthday matters. A saver born in March 1963 is already 65 on 5 April 2028 and never meets the ${h.m(B.cashUnder65)} ceiling. One born in October of the same year is still 64 on that date, so ${h.Y2} is capped and the full cash allowance only returns in 2028/29. Anyone born after 5 April 1963 faces at least one year at the lower figure.</p>
<h2>What the ceiling does not touch</h2>
<p>The rule is about new money paid in each year. A cash ISA that already holds ${h.m(80000)} built up over many years keeps all of it, and the interest on it stays outside income tax. Interest added inside the account does not count as a subscription either. Nor does the ceiling reduce the overall allowance: an under-65 saver keeps ${h.m(B.overall)} in total, with ${h.m(B.overall - B.cashUnder65)} reserved for the other kinds of ISA. The ${h.a('isa-allowance', 'allowance page')} shows how the pieces add up.</p>
<p>Two linked rules stop the ceiling being sidestepped. Under 65, money can no longer be moved from a stocks and shares ISA into a cash ISA, and interest on cash held inside an investment ISA meets a flat 22 % charge. Both are covered on the ${h.a('cash-isa-changes', 'page on the April 2027 changes')}, which also works out the tax on savings that will no longer fit.</p>
<h2>Savers close to 65</h2>
<p>Because the test is your age on 5 April, someone who turns 65 at any point in a tax year is treated as 65 for the whole of it. The ${h.a('isa-over-65', 'page for savers aged 65 and over')} goes through birth dates either side of 5 April. Residence and the minimum age of 18 for adult ISAs stay as described on ${h.src('gov_isa', 'GOV.UK')}.</p>
<p>To see what the interest on cash that does not fit would cost in tax at your income, run the ${h.a('home', 'full ISA against taxable account calculator')}.</p>`;
  },
});
