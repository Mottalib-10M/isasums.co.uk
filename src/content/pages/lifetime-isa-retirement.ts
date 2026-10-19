import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'lifetime-isa-retirement',
  group: 'lifetime',
  order: 43,
  mini: { kind: 'mini:lisa-60' },
  related: ['lifetime-isa', 'lifetime-isa-withdrawal-penalty', 'lifetime-isa-house-price-limit', 'isa-allowance'],
  sources: ['gov_lisa', 'gov_pension_relief', 'gov_lisa_withdraw', 'gov_isa_how'],
  slug: 'lifetime-isa-retirement',
  nav: 'Lifetime ISA for retirement',
  card: 'Payments until 50, free access at 60, and how the bonus compares with pension tax relief in broad terms.',
  title: 'Lifetime ISA Retirement: Tax-Free at 60, Payments Until 50',
  description: 'Lifetime ISA retirement: the 25 % bonus until 50, money free of charge and tax at 60, and how it sits beside pension tax relief. See the pot you could reach.',
  h1: 'Lifetime ISA for retirement: what the pot can reach by 60',
  intro: 'A Lifetime ISA that is never used for a home becomes a retirement account at 60. This guide follows the account through its three phases, payments, waiting and access, and puts it next to a pension without ranking either.',
  resume: (h) => {
    const L = h.P.lisa;
    const r = h.I.lisaProjection(30, L.annual, L.accessAge - 30, 0.04);
    return `A Lifetime ISA kept until age ${L.accessAge} can be emptied in full with no withdrawal charge and no income tax on what comes out. Payments are possible from opening, between ${L.openMinAge} and ${L.openBeforeAge - 1}, until the day before the ${L.payUntilAge}th birthday; each one attracts a ${h.pc(L.bonusRate)} government bonus, capped at ${h.m(L.maxBonus)} a year on ${h.m(L.annual)} paid in. After ${L.payUntilAge} nothing new can go in, but the pot stays invested or on deposit and keeps its tax-free status. A saver who opens the account at 30 and pays the maximum every year puts in ${h.m(r.paid)}, receives ${h.m(r.bonus)} of bonus and, if the pot grows by 4 % a year, has about ${h.m(r.value)} at 60. Before 60, money taken out for anything other than a qualifying first home or terminal illness loses ${h.pc(L.withdrawalCharge)} of the withdrawal. Unlike most pensions, the account carries no employer contributions and no tax relief beyond the bonus.`;
  },
  faqs: (h) => [
    { q: 'Do I pay income tax on Lifetime ISA money taken out after 60?', a: `No. A Lifetime ISA is an ISA, so neither interest, dividends nor growth inside it are taxed, and the money is not counted as income when it is withdrawn at ${h.P.lisa.accessAge} or later. From that age GOV.UK simply says you can take your savings out; money you leave in the account carries on growing free of tax until you need it.` },
    { q: 'Can I keep paying into my Lifetime ISA after my 50th birthday?', a: `No. GOV.UK states that when you turn ${h.P.lisa.payUntilAge} you can no longer pay into a Lifetime ISA or earn the bonus. The account does not close: what is already in it stays tax free and can keep growing for the years until ${h.P.lisa.accessAge}. Money you want to save after ${h.P.lisa.payUntilAge} has to go into another ISA or elsewhere.` },
    { q: 'Is a Lifetime ISA bonus the same as basic rate pension tax relief?', a: `On the way in, for a basic rate taxpayer, the arithmetic is the same: ${h.m(80)} of your money becomes ${h.m(100)} either way, through a ${h.pc(h.P.lisa.bonusRate)} bonus or through 20 % relief claimed by the pension provider. The difference comes later. Pension income is usually taxed when it is drawn, while Lifetime ISA withdrawals from 60 are not. Higher rate taxpayers can claim extra pension relief; the bonus does not change with your band.` },
    { q: 'What happens to a Lifetime ISA kept for retirement if I die before 60?', a: 'GOV.UK says there is no charge to withdraw the funds or assets after the holder dies. The account ends on the date of death, and the money becomes part of the estate. With no charge to pay, the bonus already added stays in the pot along with the holder’s own payments and any growth.' },
  ],
  body: (h) => {
    const L = h.P.lisa;
    const ages = [18, 25, 30, 35, 39].map((age) => { const r = h.I.lisaProjection(age, L.annual, L.accessAge - age, 0.04);
      return [`${age}`, `${L.payUntilAge - age}`, h.m(r.paid), h.m(r.bonus), h.m(r.value)]; });
    const growth = [0, 0.02, 0.04, 0.06].map((g) => { const r = h.I.lisaProjection(30, L.annual, L.accessAge - 30, g);
      return [h.pc(g), h.m(r.paid + r.bonus), h.m(r.growth), h.m(r.value)]; });
    const at50 = h.I.lisaProjection(30, L.annual, L.payUntilAge - 30, 0.04).value;
    const at60 = h.I.lisaProjection(30, L.annual, L.accessAge - 30, 0.04).value;
    const monthly = [100, 200, 333.33].map((m) => { const r = h.I.lisaProjection(30, m * 12, L.accessAge - 30, 0.04);
      return [h.m(m), h.m(Math.min(m * 12, L.annual)), h.m(r.bonus), h.m(r.value)]; });
    return `<h2>Three phases of the account</h2>
<p>Seen as a retirement product, a Lifetime ISA has a shape of its own. It starts with a paying phase that can last at most ${L.payUntilAge - L.openMinAge} years for someone who opens it at ${L.openMinAge}, and only ${L.payUntilAge - L.openBeforeAge + 1} for someone who opens it at ${L.openBeforeAge - 1}. A waiting phase follows from ${L.payUntilAge} to ${L.accessAge}, ten years in which the pot can grow but receives nothing new. The access phase begins at ${L.accessAge} and has no end date (${h.src('gov_lisa', 'GOV.UK, Lifetime ISA')}).</p>
<p>The bonus only arrives during the first phase. The amounts below assume the full ${h.m(L.annual)} every year and 4 % growth, a round figure chosen for illustration and not a forecast of any fund or account.</p>
${h.table(['Opened at', 'Years of payments', 'Own payments', 'Bonus', 'Pot at 60'], ages, 'Lifetime ISA kept until 60, £4,000 a year until 50, 4 % growth a year assumed. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>Starting early matters twice: there are more years of bonus, and every payment has longer to grow. Someone opening at 18 pays in for 32 years against 11 for someone opening at 39, but the gap in the final pot is much wider than three to one.</p>
<h2>The ten quiet years</h2>
<p>For an account opened at 30, the pot at 50 under the same assumptions is about ${h.m(at50)}. By 60, with no further payments, it reaches about ${h.m(at60)}. The growth of those last ten years comes only from what is already inside, which is why the choice between cash and investments inside the account weighs more in a Lifetime ISA kept for retirement than in one emptied after three or four years for a home. A cash Lifetime ISA pays the interest its provider offers; a stocks and shares one can rise or fall in value, and nothing protects it from a fall in the years just before 60.</p>
${h.table(['Growth a year', 'Payments and bonus', 'Growth', 'Pot at 60'], growth, 'Lifetime ISA opened at 30, £4,000 a year until 50, held to 60, by growth rate. Rates are assumptions.', ['r', 'r', 'r', 'r'])}
<h2>Smaller regular payments</h2>
<p>Many people pay in monthly rather than in one sum. The bonus follows the payments, so a smaller monthly amount gives a proportionally smaller bonus. The table keeps the opening age at 30 and changes only the monthly amount; ${h.m(333.33)} a month is just under the ${h.m(L.annual)} yearly limit.</p>
${h.table(['Each month', 'Each year', 'Bonus to 50', 'Pot at 60'], monthly, 'Monthly payments from 30 to 50, 4 % growth a year assumed.', ['r', 'r', 'r', 'r'])}
<h2>Reading the projections</h2>
<p>All of the figures on this page are in pounds of the day they are reached, not in today's money. Thirty years of rising prices reduce what a sum at 60 will buy, so a pot that looks large in the tables may cover much less than its face value suggests. The growth rates are assumptions to compare cases with each other; they are not the return of any particular account, and a stocks and shares Lifetime ISA can end below what was paid in.</p>
<p>The account can hold cash, stocks and shares, or a mix of both (${h.src('gov_lisa', 'GOV.UK')}). That choice can differ between the years of payments and the years of waiting, and the tool above lets you test the effect of a lower or higher rate on the pot at 60.</p>
<h2>A late start at 39</h2>
<p>Someone who opens a Lifetime ISA just before turning 40 has ${L.payUntilAge - L.openBeforeAge + 1} tax years of payments. At the full ${h.m(L.annual)} a year, that is ${h.m(h.I.lisaProjection(39, L.annual, 11, 0).paid)} of their own money and ${h.m(h.I.lisaProjection(39, L.annual, 11, 0).bonus)} of bonus. With 4 % growth a year the pot at 60 is about ${h.m(h.I.lisaProjection(39, L.annual, L.accessAge - 39, 0.04).value)}. The bonus is the same 25 % at every age; what a late start gives up is the number of years in which it is paid and the time for it to grow.</p>
<h2>Beside a pension, in general terms</h2>
<p>A comparison with a pension depends on facts this site cannot see: your employer's scheme, your tax band now and later, and how you will draw the money. What can be stated are the rules each one follows.</p>
<p><strong>Money going in.</strong> In a personal pension using relief at source, the provider claims basic rate tax relief of 20 % on your payment, so ${h.m(80)} from you becomes ${h.m(100)}. In a Lifetime ISA, the ${h.pc(L.bonusRate)} bonus on ${h.m(80)} is ${h.m(20)}, which also makes ${h.m(100)}. For a basic rate taxpayer the two are level at this stage. A higher or additional rate taxpayer can claim further pension relief through Self Assessment, while the Lifetime ISA bonus stays at ${h.pc(L.bonusRate)} for everyone. Pension relief is available on payments up to 100 % of your earnings, subject to the pension allowances, whereas the Lifetime ISA stops at ${h.m(L.annual)} a year.</p>
<p>GOV.UK also limits relief at source to ${h.m(2880)} a year for someone with no earnings in that year, while the Lifetime ISA bonus depends only on what is paid in, within ${h.m(L.annual)}, whatever the saver earns.</p>
<p><strong>Employer money.</strong> In a workplace pension under automatic enrolment, the employer must pay in at least 3 % of your earnings, with a minimum total of 8 %. Employers have no such duty towards a Lifetime ISA, and the bonus is the only money added to your own.</p>
<p><strong>Money coming out.</strong> GOV.UK states that you will usually pay tax on income from your pensions. Lifetime ISA withdrawals from ${L.accessAge} are tax free in full, and they are not counted as income for tax.</p>
<p><strong>Timing.</strong> The Lifetime ISA has one fixed access age of ${L.accessAge}. Leaving earlier for any reason other than a first home or terminal illness costs ${h.pc(L.withdrawalCharge)} of the amount withdrawn, which removes the bonus and part of your own money; the ${h.a('lifetime-isa-withdrawal-penalty', 'withdrawal penalty page')} works through that loss (${h.src('gov_lisa_withdraw', 'GOV.UK, withdrawing money from your Lifetime ISA')}).</p>
<p>These points describe the rules; they do not say which product suits a particular person, and the two are not exclusive. A person can hold both at the same time; the Lifetime ISA's ${h.m(L.annual)} is counted inside the ${h.m(h.y(h.Y1).isa.overall)} ISA allowance, not against any pension limit.</p>
<h2>Payments that stop early</h2>
<p>Nothing obliges a saver to pay in every year. A Lifetime ISA can receive the full ${h.m(L.annual)} one year, less the next and nothing for several years after that, and the bonus simply follows what is paid. For an account opened at 30, ten years of full payments followed by ten years without any give ${h.m(h.I.lisaProjection(30, L.annual, 10, 0).paid)} of own money and ${h.m(h.I.lisaProjection(30, L.annual, 10, 0).bonus)} of bonus; at 4 % growth, that money would be worth about ${h.m(h.I.lisaProjection(30, L.annual, 10, 0.04).value * Math.pow(1.04, L.accessAge - 40))} at 60. Compared with the full twenty years of payments shown earlier, the bonus is halved, but the early payments still carry most of the growth because they stay invested longest.</p>
<h2>Its place in the ISA allowance</h2>
<p>Each pound paid into a Lifetime ISA uses a pound of the yearly ISA allowance (${h.src('gov_isa_how', 'GOV.UK, how ISAs work')}). A saver who pays the full ${h.m(L.annual)} has ${h.m(h.y(h.Y1).isa.overall - L.annual)} left for cash, stocks and shares or innovative finance ISAs in the same tax year. The allowance and the Lifetime ISA limit are both the same in ${h.Y1} and ${h.Y2}, and are frozen until April 2031. The ${h.a('isa-allowance', 'ISA allowance page')} sets out how the total is split.</p>
<h2>A home after all</h2>
<p>Plans change in both directions. Someone who opened the account for retirement can still use it for a first home if the conditions are met on the day: a price of ${h.m(L.priceCap)} or less, a mortgage, a conveyancer, and at least ${L.monthsBeforePurchase} months since the first payment. Those conditions are on the ${h.a('lifetime-isa-house-price-limit', 'house price limit page')}, and the ${h.a('lifetime-isa', 'Lifetime ISA page')} projects the pot for a shorter horizon.</p>`;
  },
});
