import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'lifetime-isa',
  group: 'lifetime',
  order: 40,
  tool: { kind: 'mini:lisa' },
  related: ['lifetime-isa-withdrawal-penalty', 'lifetime-isa-house-price-limit', 'lifetime-isa-retirement', 'home'],
  sources: ['gov_lisa', 'gov_lisa_withdraw', 'gov_stats', 'gov_ftb_isa'],
  slug: 'lifetime-isa',
  nav: 'Lifetime ISA',
  card: 'The 25 % bonus year by year, the ages that open and close the account, and what the pot can reach.',
  title: 'Lifetime ISA 2026/27: £4,000 a Year and a £1,000 Bonus',
  description: 'Lifetime ISA in 2026/27: open it between 18 and 39, pay in up to £4,000 a year until 50 and get a 25 % bonus. Work out the pot for a first home or for age 60.',
  h1: 'Lifetime ISA: the bonus, the ages and the size of the pot',
  intro: 'Enter your age, what you plan to put in each year and how long before you use the money. The tool adds the government bonus on each payment, stops it at 50 and grows the pot at the rate you choose.',
  resume: (h) => {
    const L = h.P.lisa;
    const five = h.I.lisaProjection(27, L.annual, 5, 0.035);
    return `A Lifetime ISA is an ISA for people aged ${L.openMinAge} to ${L.openBeforeAge - 1} that can hold cash, stocks and shares or both. You can pay in up to ${h.m(L.annual)} in each tax year until the day before your ${L.payUntilAge}th birthday, and the government adds a bonus of ${h.pc(L.bonusRate)} on those payments, so at most ${h.m(L.maxBonus)} a year. The ${h.m(L.annual)} counts inside the overall ${h.m(h.y(h.Y1).isa.overall)} ISA allowance, which is the same in ${h.Y1} and ${h.Y2}. The money can come out without a charge for a first home costing ${h.m(L.priceCap)} or less, bought at least ${L.monthsBeforePurchase} months after the first payment, from age ${L.accessAge}, or in case of terminal illness. Any other withdrawal loses ${h.pc(L.withdrawalCharge)} of the amount taken. Someone of 27 paying the full ${h.m(L.annual)} for five years puts in ${h.m(five.paid)}, receives ${h.m(five.bonus)} of bonus and, at 3.5 % growth a year, holds about ${h.m(five.value)}.`;
  },
  faqs: (h) => [
    { q: 'Can I open a Lifetime ISA at 39 and keep paying in after 40?', a: `Yes. The age limit applies to opening the account and making the first payment: you must be at least ${h.P.lisa.openMinAge} and under ${h.P.lisa.openBeforeAge}. Once it is open, payments and the ${h.pc(h.P.lisa.bonusRate)} bonus carry on every year until you turn ${h.P.lisa.payUntilAge}. Someone who opens it the month before turning 40 can therefore pay in for eleven tax years at most, up to ${h.m(h.P.lisa.annual * 11)} of their own money in total.` },
    { q: 'Does a Lifetime ISA payment reduce what I can put in a cash ISA?', a: `It reduces the overall total, not a separate pot. The ${h.m(h.P.lisa.annual)} paid into a Lifetime ISA is part of the ${h.m(h.y(h.Y1).isa.overall)} yearly allowance, so a full Lifetime ISA year leaves ${h.m(h.y(h.Y1).isa.overall - h.P.lisa.annual)} for other ISAs. From 6 April 2027 the separate cash ISA cap of ${h.m(h.y(h.Y2).isa.cashUnder65)} for under-65s still fits inside what remains.` },
    { q: 'Can two people buying together each use a Lifetime ISA?', a: 'Yes. GOV.UK says that when the person you buy with also has a Lifetime ISA, you can both use your savings and bonuses, as long as each of you is a first-time buyer and meets every condition. Each account has its own bonus of up to £1,000 a year, so a couple can build two pots side by side for the same home.' },
    { q: 'Will the Lifetime ISA close if the First Time Buyer ISA goes ahead?', a: `Not on what has been published so far. The government consulted from ${h.date(h.P.ftbIsa.consultationOpened)} to ${h.date(h.P.ftbIsa.consultationClosed)} on a First Time Buyer ISA that would replace the Lifetime ISA for new savers. No launch date and no price cap have been set, and meanwhile the Lifetime ISA can still be opened and paid into under its current rules.` },
  ],
  body: (h) => {
    const L = h.P.lisa;
    const rows = [1, 3, 5, 8, 10].map((n) => { const r = h.I.lisaProjection(27, L.annual, n, 0.035);
      return [`${n} ${n === 1 ? 'year' : 'years'}`, h.m(r.paid), h.m(r.bonus), h.m(r.growth), h.m(r.value)]; });
    const starts = [18, 25, 32, 39].map((age) => { const r = h.I.lisaProjection(age, L.annual, L.payUntilAge - age, 0);
      return [`${age}`, `${L.payUntilAge - age}`, h.m(r.paid), h.m(r.bonus)]; });
    return `<h2>How the bonus builds up</h2>
<p>The bonus is a quarter of what you pay in, not a quarter of the pot, and it stops growing once you have paid ${h.m(L.annual)} in a tax year (${h.src('gov_lisa', 'GOV.UK, Lifetime ISA')}). Paying more than ${h.m(L.annual)} is not possible, so the most any saver receives is ${h.m(L.maxBonus)} a year. The bonus then sits in the account and earns interest or investment growth along with your own money. The table follows a saver aged 27 who pays the full amount each year, with growth set at 3.5 % as an assumption.</p>
${h.table(['Time', 'Own payments', 'Bonus', 'Growth', 'Pot'], rows, 'Lifetime ISA opened at 27, £4,000 paid each year, 3.5 % growth a year assumed. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>After ten years the bonus alone is worth ${h.m(h.I.lisaProjection(27, L.annual, 10, 0).bonus)} before any growth on it. Growth is never guaranteed: in a cash Lifetime ISA it depends on the rate offered, and in a stocks and shares one it can be negative.</p>
<h2>The age you start decides the ceiling</h2>
<p>Because payments end at ${L.payUntilAge}, the total bonus a person can ever receive depends on when the account is opened. Opening at ${L.openMinAge} leaves ${L.payUntilAge - L.openMinAge} years of payments; opening at ${L.openBeforeAge - 1} leaves ${L.payUntilAge - L.openBeforeAge + 1}.</p>
${h.table(['Age at opening', 'Years of payments', 'Most you can pay in', 'Most bonus'], starts, 'Maximum payments and bonus by age at opening, full £4,000 every year, no growth.', ['l', 'r', 'r', 'r'])}
<h2>Who can open one</h2>
<p>Besides the age condition, you must be resident in the UK to open a Lifetime ISA and to keep paying in, unless you are a member of the armed forces or a Crown servant, or the spouse or civil partner of one, posted abroad. The account can hold cash, stocks and shares, or a combination of both, and the ${h.m(L.annual)} limit covers them together.</p>
<h2>Two uses, one account</h2>
<p>The account serves two purposes that suit different people. For a first home, the money goes straight to your conveyancer or solicitor, the home must cost no more than ${h.m(L.priceCap)}, and a mortgage is needed (${h.src('gov_lisa_withdraw', 'GOV.UK, withdrawing money from your Lifetime ISA')}). The ${h.a('lifetime-isa-house-price-limit', 'page on the house price limit')} covers those conditions in detail. Kept until ${L.accessAge}, the pot can be taken out in full with no charge and no income tax, which the ${h.a('lifetime-isa-retirement', 'retirement page')} sets beside a pension.</p>
<p>Leaving early for any other reason costs ${h.pc(L.withdrawalCharge)} of the amount withdrawn, bonus included. That takes back more than the bonus: the ${h.a('lifetime-isa-withdrawal-penalty', 'withdrawal charge page')} shows why you end up below what you paid in.</p>
<h2>How many people use it</h2>
<p>HMRC counted ${h.num(L.houseWithdrawals2526)} withdrawals to buy a home in 2025/26, with an average of ${h.m(L.avgHouseWithdrawal2526)} each (${h.src('gov_stats', 'HMRC annual savings statistics, September 2026')}). That average is close to four years of full payments plus the bonus, which matches how most buyers use the account: a few years of saving, then one withdrawal at completion.</p>
<p>A First Time Buyer ISA was put to consultation in 2026 as a possible successor for new savers (${h.src('gov_ftb_isa', 'GOV.UK, First Time Buyer ISA consultation')}). Its price cap and start date are not set, and existing Lifetime ISAs are not closed by it.</p>`;
  },
});
