import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cash-isa-changes',
  group: 'isa',
  order: 32,
  mini: { kind: 'mini:cash-overflow' },
  related: ['cash-isa-limit', 'isa-over-65', 'stocks-and-shares-isa-cash', 'isa-transfer'],
  sources: ['leg_si_1018', 'gov_tfs19', 'gov_tfs22', 'gov_isa_regs_consult', 'leg_isa_regs', 'leg_fa26_s5'],
  slug: 'cash-isa-changes',
  nav: 'Cash ISA changes 2027',
  card: 'The whole April 2027 reform in one place: dates, the £12,000 ceiling, the transfer ban, the 22 % charge.',
  title: 'Cash ISA Changes April 2027: Rules, Dates and Tax Effect',
  description: 'Cash ISA changes from 6 April 2027 under SI 2026/1018: the £12,000 limit under 65, no transfers from investment ISAs, a 22 % charge on cash held in them.',
  h1: 'Cash ISA changes from April 2027: what the new regulations do',
  intro: 'The reform of cash ISAs was announced in the November 2025 Budget and became law in September 2026. This guide goes through each rule, the dates, and what the savings that no longer fit would cost in tax.',
  resume: (h) => {
    const B = h.y(h.Y2).isa, R2 = h.y(h.Y2).savingsRates;
    return `From 6 April 2027, SI 2026/1018 changes four things for cash ISAs. First, anyone who is 64 or under at the end of a tax year may pay no more than ${h.m(B.cashUnder65)} into cash ISAs in that year, inside an overall allowance that stays at ${h.m(B.overall)}; from the year you reach 65 the cash ceiling is ${h.m(B.cashFrom65)}. Second, under-65s can no longer transfer money from a stocks and shares or innovative finance ISA into a cash ISA. Third, interest paid on cash held inside those investment ISAs bears a flat charge of ${h.pc(h.y(h.Y2).cashInvestmentIsaCharge)}, paid by the ISA manager to HMRC, at every age. Fourth, a portfolio made only of money market funds no longer counts as a stocks and shares holding. Cash already in ISAs stays tax free. Savings that no longer fit fall into taxable accounts, where interest above your allowances is taxed at ${h.pc(R2.basic)}, ${h.pc(R2.higher)} or ${h.pc(R2.additional)} in ${h.Y2}.`;
  },
  faqs: (h) => [
    { q: 'Do the April 2027 ISA rules affect cash I already hold in a cash ISA?', a: 'No. The regulations limit new subscriptions, not balances. Money paid into cash ISAs up to 5 April 2027, and in any earlier year, stays where it is and its interest remains free of income tax. It can also still be moved between cash ISAs by transfer without using any allowance. Only the yearly amount of fresh cash you can add is reduced for savers under 65.' },
    { q: 'Was the cash ISA reform passed by Parliament or only announced?', a: 'It is law. The Individual Savings Account (Amendment) (No. 2) Regulations 2026 were made on 10 September 2026 and laid before Parliament on 14 September 2026 under the negative procedure, which means they stand unless annulled. They take effect on 6 April 2027. The higher savings tax rates for 2027/28 were set separately by section 5 of the Finance Act 2026.' },
    { q: 'Why did the government lower the cash ISA limit?', a: 'The explanatory memorandum to SI 2026/1018 states the aim as encouraging investment in stocks and shares over cash and better returns for savers. It adds that the transfer ban, the charge on cash in investment ISAs and the money market fund test exist so that the £12,000 ceiling cannot be got round by holding cash or cash-like funds inside a non-cash ISA.' },
    { q: 'Do the 2027 changes apply to Junior ISAs and Lifetime ISAs?', a: 'The Junior ISA allowance stays at £9,000 and the memorandum states that the new charge on interest from cash held in investment ISAs does not apply to Junior ISAs. The Lifetime ISA keeps its £4,000 yearly limit and 25 % bonus. Both still sit beside the adult cash ceiling: what a person under 65 pays into adult cash ISAs is capped at £12,000.' },
  ],
  body: (h) => {
    const B = h.y(h.Y2).isa, A = h.y(h.Y1).isa, R = h.P.reform;
    const charge = h.y(h.Y2).cashInvestmentIsaCharge;
    const timeline: Array<[string, string]> = [
      [h.date(R.budget), 'Budget: cash ISA limit of £12,000 under 65 from April 2027 announced; allowances frozen until April 2031'],
      [h.date(R.financeActAssent), 'Finance Act 2026 receives Royal Assent, setting the 2027/28 savings rates'],
      [h.date('2026-06-23'), 'Government announces the anti-avoidance rules: transfer ban, 22 % charge, money market fund test'],
      [`${h.date('2026-06-25')} to ${h.date('2026-08-02')}`, 'Technical consultation on the draft regulations'],
      [h.date(R.isaRegsMade), 'SI 2026/1018 made'],
      [h.date(R.isaRegsLaid), 'SI 2026/1018 laid before Parliament'],
      [h.date(R.inForce), 'All the new ISA rules and the 22/42/47 % savings rates take effect'],
    ];
    const incomes = [18000, 30000, 45000, 60000, 130000];
    const extra = 8000, rate = 0.04;
    const rows = incomes.map((inc) => [h.m(inc), ...[1, 3, 5].map((n) => h.m2(h.tax(h.Y2, inc, extra * n * rate).tax))]);
    return `<h2>The rules one by one</h2>
<h3>A cash ceiling inside the £20,000</h3>
<p>Until 5 April 2027, the ${h.m(A.overall)} ISA allowance can be split in any proportion, including all in cash. From 6 April 2027, regulation 4ZA of the ${h.src('leg_isa_regs', 'ISA Regulations 1998')}, as amended by ${h.src('leg_si_1018', 'SI 2026/1018')}, adds a second ceiling of ${h.m(B.cashUnder65)} on cash ISA subscriptions for anyone who is 64 or under at the end of the year. The end of the year is 5 April, so in ${h.Y2} the question is your age on 5 April 2028. Those aged 65 or more on that date keep ${h.m(B.cashFrom65)} in cash. The ${h.a('cash-isa-limit', 'cash ISA limit page')} turns this into a ceiling for each year of birth, and the ${h.a('isa-over-65', 'page on savers aged 65 and over')} covers birthdays close to 5 April.</p>
<p>Providers will have to watch subscriptions. The regulations extend the repair procedure of regulation 4A so that it treats cash paid in above the cash ceiling separately from money paid in above the overall limit. A deposit that takes an under-65 saver past ${h.m(B.cashUnder65)} in cash is therefore not a valid ISA subscription.</p>
<h3>No transfers from investment ISAs into cash under 65</h3>
<p>Without a second rule, a saver could pay ${h.m(B.overall)} into a stocks and shares ISA, leave it in cash and move it to a cash ISA days later. Regulation 21 is amended so that a transfer from a stocks and shares or innovative finance ISA into a cash ISA is only possible if the account holder is 65 or over at the end of the tax year. Transfers in the other direction, from cash into investments, are not restricted, and transfers between two cash ISAs carry on as before. The ${h.a('isa-transfer', 'transfer page')} explains the timings.</p>
<h3>A flat charge on cash held in investment ISAs</h3>
<p>Investment ISAs often hold some uninvested cash, and managers may pay interest on it. A new regulation 22A makes the ISA manager pay HMRC a flat ${h.pc(charge)} of any interest paid or credited on cash deposits in a stocks and shares or innovative finance ISA. The rate is described as representative of the basic savings rate for ${h.Y2}. It applies whatever your age and whatever your own tax band, and it comes out of the account rather than through your tax return. The ${h.a('stocks-and-shares-isa-cash', 'page on cash inside a stocks and shares ISA')} has the sums.</p>
<h3>Money market funds</h3>
<p>Money market funds become a named qualifying investment for stocks and shares ISAs, but they may not make up 100 % of the value of the non-cash investments in the account. An ISA that holds nothing but money market funds would act like a cash ISA paying tax-free interest, which is exactly what the ceiling is meant to stop. Managers will also report to HMRC the value held in money market funds.</p>
<h3>Flexible ISAs</h3>
<p>Under a flexible cash ISA, money taken out can be replaced in the same tax year without counting as a new subscription. From April 2027 regulation 5DDB is amended so that money put back into a cash ISA in this way may not take you above the cash ceiling. The ${h.a('flexible-isa', 'flexible ISA page')} works through examples.</p>
<h2>The timeline</h2>
${h.table(['Date', 'Step'], timeline, 'From announcement to entry into force. Dates from the Budget documents, the Finance Act 2026 and SI 2026/1018 with its explanatory memorandum.')}
<p>The draft regulations were published for ${h.src('gov_isa_regs_consult', 'technical consultation')} in the summer of 2026. According to the explanatory memorandum, most responses concerned the policy itself rather than the drafting, and the final text was adjusted only where technical points were raised. The ${h.src('gov_tfs22', 'HMRC newsletter of June 2026')} had already described the transfer ban, the charge and the money market fund test, and the ${h.src('gov_tfs19', 'newsletter of November 2025')} confirmed the freeze of the overall, Lifetime and Junior limits until April 2031.</p>
<h2>What savings that no longer fit would cost in tax</h2>
<p>The reform does not tax anyone directly. Its effect comes through the savings that an under-65 saver can no longer put into a cash ISA: if they stay in cash, they sit in an ordinary account and their interest enters the income tax calculation. Most people will still pay nothing on that interest thanks to the Personal Savings Allowance and, on low incomes, the ${h.m(h.y(h.Y2).startingRateLimit)} starting rate for savings. The table follows a saver who would have liked to put ${h.m(B.cashUnder65 + extra)} into cash each year but can only shelter ${h.m(B.cashUnder65)}, so ${h.m(extra)} a year builds up outside an ISA at ${h.pc(rate)}.</p>
${h.table(['Other income', 'Tax after 1 year', 'After 3 years', 'After 5 years'], rows, `Yearly tax on the interest of ${h.m(extra)} a year left outside an ISA, earning ${h.pc(rate)} without compounding, at the ${h.Y2} rates and allowances held constant. No other taxable interest assumed. Worked out by the engine of this site.`, ['l', 'r', 'r', 'r'])}
<p>For a basic rate taxpayer on ${h.m(30000)}, the overflow produces ${h.m(extra * rate)} of interest after one year, well inside the ${h.m(h.y(h.Y2).psa.basic)} allowance, and still less than it after three years. The tax only starts once the pile outside the ISA is large enough for its interest to pass the allowance. A higher rate taxpayer has only ${h.m(h.y(h.Y2).psa.higher)} of allowance, so tax appears sooner and at ${h.pc(h.y(h.Y2).savingsRates.higher)}. At ${h.m(130000)} there is no allowance at all and every pound of interest is taxed at ${h.pc(h.y(h.Y2).savingsRates.additional)}, a rate set by section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')}. Any other interest you already receive outside ISAs would use the allowance first and bring these figures forward.</p>
<h2>What the reform leaves alone</h2>
<p>It is easy to read more into the change than the regulations contain. The overall allowance stays at ${h.m(B.overall)} for every adult, and the freeze announced in November 2025 keeps it there until April 2031. The Lifetime ISA keeps its ${h.m(B.lisa)} yearly limit inside that total, and the Junior ISA keeps its own ${h.m(B.junior)}. Interest earned inside a cash ISA remains outside income tax whatever the balance, and nothing in SI 2026/1018 limits how much a cash ISA may hold in total. Savers who already pay no more than ${h.m(B.cashUnder65)} a year into cash ISAs will notice no difference in what they can pay in, although the higher savings rates still apply to any interest they earn outside ISAs.</p>
<h2>Points to know before 6 April 2027</h2>
<p>A few facts follow directly from the dates. The ${h.Y1} tax year still allows ${h.m(A.overall)} in cash at any age, and anything paid in by 5 April 2027 keeps its tax-free status afterwards. Moving money from an investment ISA into a cash ISA remains possible for everyone until that date, and after it only for those who are 65 or over at the end of the year. Cash ISA balances can still be moved between providers at any time. None of this says what any individual ought to do: the right mix of cash and investments depends on circumstances this site does not assess.</p>
<p>Several matters are still open. The main income tax rates for ${h.Y2} have not been set, and neither have the Scottish rates. The First Time Buyer ISA is at the consultation stage only, with no price cap and no launch date. The explanatory memorandum says HMRC's guidance notes for ISA managers will be amended to reflect the new limit and its associated rules, so some operational details will only be published closer to April 2027.</p>
<p>To compare a cash ISA and a taxable account for your own balance, income and rate in both years, use the ${h.a('home', 'main calculator')}.</p>`;
  },
});
