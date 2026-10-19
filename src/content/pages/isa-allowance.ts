import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'isa-allowance',
  group: 'isa',
  order: 30,
  tool: { kind: 'mini:allowance' },
  related: ['cash-isa-limit', 'flexible-isa', 'isa-transfer', 'lifetime-isa'],
  sources: ['gov_isa_how', 'gov_tfs19', 'leg_si_1018', 'gov_stats'],
  slug: 'isa-allowance',
  nav: 'ISA allowance',
  card: 'How much of the £20,000 you have used this year, and how much of it can still go into cash.',
  title: 'ISA Allowance 2026/27 and 2027/28: £20,000 and Its Split',
  description: 'The ISA allowance stays at £20,000 a year until April 2031. See how it splits between cash, stocks and shares and a Lifetime ISA, and the cash cap from 2027.',
  h1: 'ISA allowance: the £20,000 a year and how it can be shared out',
  intro: 'Enter what you have already paid into each kind of ISA this tax year and your age on the coming 5 April. The tool shows what is left of the £20,000 and how much of it may still go into cash.',
  resume: (h) => {
    const A = h.y(h.Y1).isa, B = h.y(h.Y2).isa;
    return `Every adult who is resident in the UK can pay up to ${h.m(A.overall)} into ISAs in the ${h.Y1} tax year, which runs from 6 April 2026 to 5 April 2027. The same ${h.m(B.overall)} applies in ${h.Y2}, and the Budget of 26 November 2025 froze the figure until April 2031. The allowance is one pot shared by every adult ISA you pay into: cash, stocks and shares, innovative finance and Lifetime ISA, the last limited to ${h.m(A.lisa)} a year within the total. Since April 2024 you can pay into several ISAs of the same type in one year. From 6 April 2027 a new sub-limit applies inside the ${h.m(B.overall)}: no more than ${h.m(B.cashUnder65)} of it may go into cash ISAs if you are 64 or under on 5 April 2028, while savers aged 65 or more keep ${h.m(B.cashFrom65)} for cash. Money paid in during earlier years, and transfers of it, never count against the current allowance. Junior ISAs have their own separate ${h.m(A.junior)}.`;
  },
  faqs: (h) => [
    { q: 'Does a Lifetime ISA payment reduce my £20,000 ISA allowance?', a: `Yes. What you pay into a Lifetime ISA, up to ${h.m(h.P.lisa.annual)} a year, is part of the ${h.m(h.y(h.Y1).isa.overall)} and not on top of it. The 25 % government bonus is not counted, because it is paid by the government and not by you. So a saver who puts the full ${h.m(h.P.lisa.annual)} into a Lifetime ISA has ${h.m(h.y(h.Y1).isa.overall - h.P.lisa.annual)} left for the other kinds of ISA in that year.` },
    { q: 'Can I open two cash ISAs with different providers in the same tax year?', a: `Yes, since 6 April 2024. GOV.UK gives the example of ${h.m(10000)} in one cash ISA, ${h.m(3000)} in another and ${h.m(7000)} in a stocks and shares ISA in a single year. The only limits are the overall ${h.m(h.y(h.Y1).isa.overall)}, one Lifetime ISA a year, and from April 2027 the cash ceiling that applies to savers under 65.` },
    { q: 'What happens to unused ISA allowance on 5 April?', a: 'It is lost. The allowance cannot be carried forward to the next tax year, and there is no way to make up for a year in which you paid in little or nothing. On 6 April a fresh allowance starts, whatever you hold in ISAs already. Money you saved in earlier years stays in its ISA and keeps its tax-free status without using any of the new allowance.' },
    { q: 'Does interest earned inside an ISA count towards the yearly limit?', a: 'No. The limit only measures the money you put in, called subscriptions. Interest, dividends and growth added inside the account are ignored, so an ISA that has grown from £20,000 to £21,000 has not broken any rule. The same goes for money moved between providers by a proper transfer, which keeps its original year.' },
  ],
  body: (h) => {
    const A = h.y(h.Y1).isa, B = h.y(h.Y2).isa;
    const cases: Array<[string, typeof h.Y1, number, number, number, number]> = [
      ['All in cash', h.Y1, 20000, 0, 0, 40],
      ['Cash and investments', h.Y2, 12000, 8000, 0, 40],
      ['Cash plus a Lifetime ISA', h.Y2, 12000, 0, 4000, 30],
      ['Three types, room left', h.Y2, 6000, 6000, 4000, 30],
      ['Saver aged 66', h.Y2, 20000, 0, 0, 66],
      ['Too much cash at 45', h.Y2, 15000, 0, 0, 45],
    ];
    const rows = cases.map(([label, year, cash, shares, lisa, age]) => {
      const r = h.I.allowance({ year, cash, investments: shares, lifetime: lisa, ageAtEnd: age });
      return [label, year, h.m(cash), h.m(shares), h.m(lisa), `${age}`, h.m(r.left), r.cashOverBy > 0 ? `${h.m(r.cashOverBy)} over` : h.m(r.cashLeft)];
    });
    const st = h.P.stats;
    return `<h2>One allowance, four kinds of account</h2>
<p>The yearly limit is not a separate amount per account. It is a single ceiling on the money you subscribe across all adult ISAs, and ${h.src('gov_isa_how', 'GOV.UK describes it')} as something you can use in one account or spread over several. The four kinds are cash ISAs, stocks and shares ISAs, innovative finance ISAs and Lifetime ISAs. You can only pay into one Lifetime ISA in a year, and it takes at most ${h.m(A.lisa)} of the total. Everything else can be divided in any proportion you like in ${h.Y1}.</p>
<p>The figure will not move for a while: the ${h.src('gov_tfs19', 'HMRC tax-free savings newsletter that followed the November 2025 Budget')} confirms ${h.m(A.overall)} for adults, ${h.m(A.lisa)} for the Lifetime ISA and ${h.m(A.junior)} for Junior ISAs until April 2031.</p>
<h2>The cash sub-limit from April 2027</h2>
<p>What changes on 6 April 2027 is the share that may go into cash. ${h.src('leg_si_1018', 'SI 2026/1018')} caps cash ISA subscriptions at ${h.m(B.cashUnder65)} for anyone who is 64 or under at the end of the tax year. The other ${h.m(B.overall - B.cashUnder65)} remains available, but only for stocks and shares, innovative finance or Lifetime ISAs. From the year in which you reach 65 the cash ceiling goes back to ${h.m(B.cashFrom65)}. The ${h.a('cash-isa-limit', 'cash ISA limit page')} works out the year that applies to your date of birth.</p>
${h.table(['Case', 'Year', 'Cash', 'Stocks and shares', 'Lifetime ISA', 'Age on 5 April', 'Allowance left', 'Cash still allowed'], rows, 'What is left of the allowance in six situations. Worked out by the engine of this site from the limits of SI 2026/1018.', ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Two lines deserve a closer look. The saver who puts ${h.m(12000)} in cash and ${h.m(4000)} in a Lifetime ISA in ${h.Y2} still has ${h.m(4000)} of allowance, yet none of it can go into cash. And the 45-year-old who pays ${h.m(15000)} into cash ISAs is ${h.m(3000)} over the new ceiling: the amended rules give providers a separate repair process for cash paid in above the cash limit, so the excess will not stay in the account as a valid subscription.</p>
<h2>What does not use the allowance</h2>
<p>Several movements of money leave the ${h.m(A.overall)} untouched. Moving an existing ISA to another provider through the ${h.a('isa-transfer', 'transfer process')} keeps the money's original year. Interest, dividends and growth credited inside the account are not subscriptions. The Lifetime ISA bonus is paid by the government. And money taken out of a ${h.a('flexible-isa', 'flexible ISA')} can be put back in the same tax year without counting twice. By contrast, withdrawing from an ordinary ISA and paying the same sum in again later is a new subscription.</p>
<h2>How many people use it</h2>
<p>According to the ${h.src('gov_stats', 'annual savings statistics published in September 2026')}, ${h.num(st.adultAccounts2425)} adult ISAs were subscribed to in 2024/25, with £${(st.subscribed2425 / 1e9).toFixed(1)} billion paid in, and ${h.pc(st.cashShareAccounts2425)} of those accounts were cash ISAs. The market value of all adult ISAs stood at about £${h.num(st.marketValue2425 / 1e9)} billion. The cash ceiling of ${h.m(B.cashUnder65)} only bites for a saver under 65 who would otherwise pay more than that into cash in one year; below it, nothing changes in practice.</p>
<p>For the tax an ISA saves on a given balance, compare both kinds of account in the ${h.a('home', 'main ISA calculator')}.</p>`;
  },
});
