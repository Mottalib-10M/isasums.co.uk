import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-10000',
  group: 'amounts',
  order: 70,
  tool: { kind: 'isa', props: { balance: 10000, income: 35000, rate: 4 } },
  related: ['personal-savings-allowance', 'savings-20000', 'joint-account-interest', 'home'],
  sources: ['gov_savings_free', 'leg_ita_12b', 'leg_fa26_s5'],
  slug: 'savings-10000',
  nav: '£10,000 of savings',
  card: 'Tax on the interest from £10,000, and the few cases where a cash ISA changes the bill.',
  title: '£10,000 Savings: Tax on the Interest and When an ISA Helps',
  description: '£10,000 savings at 4 % earn £400 a year: usually inside the £1,000 or £500 allowance. When that changes: other accounts, a higher rate, the 2027/28 rates.',
  h1: '£10,000 in savings: is any of the interest taxed?',
  intro: 'The calculator starts with £10,000 at 4 % and £35,000 of other income. Change the three figures to see the tax in a taxable account and in a cash ISA, this year and from 6 April 2027.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const i = 10000 * 0.04;
    const add = h.tax(h.Y2, 130000, i);
    return `A balance of ${h.m(10000)} earning 4 % produces ${h.m(i)} of interest a year. For most savers that is tax free without any ISA: a basic rate taxpayer has a Personal Savings Allowance of ${h.m(Y1.psa.basic)} and a higher rate taxpayer ${h.m(Y1.psa.higher)}, both above ${h.m(i)} (${h.src('gov_savings_free', 'GOV.UK, how much savings interest is tax free')}). On the default figures, ${h.m(35000)} of wages and ${h.m(10000)} at 4 %, the tax is ${h.m2(h.tax(h.Y1, 35000, i).tax)} in ${h.Y1} and ${h.m2(h.tax(h.Y2, 35000, i).tax)} in ${h.Y2}. The picture changes in three cases: when other accounts already use up the allowance, when the rate is high enough to pass it (above 10 % for a basic rate taxpayer, above 5 % at the higher rate), and for additional rate taxpayers, who have no allowance at all. Someone on ${h.m(130000)} would pay ${h.m2(add.tax)} on the same ${h.m(i)} in ${h.Y2}, which a cash ISA would avoid.`;
  },
  faqs: (h) => [
    { q: 'Do I pay tax on £10,000 of savings if I earn £35,000?', a: `Not on its own at 4 %. The ${h.m(400)} of interest sits inside the ${h.m(h.y(h.Y1).psa.basic)} Personal Savings Allowance, and ${h.m(35000)} plus ${h.m(400)} stays well below the higher rate threshold. Tax would appear only if your other taxable accounts already earned around ${h.m(600)} or more in the same tax year, because the allowance covers all your interest together, not each account.` },
    { q: 'At what interest rate does £10,000 start to be taxed?', a: `It depends on your band. A basic rate taxpayer with no other savings reaches the ${h.m(h.y(h.Y1).psa.basic)} allowance at a rate of 10 %, a higher rate taxpayer reaches ${h.m(h.y(h.Y1).psa.higher)} at 5 %, and an additional rate taxpayer pays from the first pound. Someone with little other income can go further, because the Personal Allowance and the starting rate for savings come first.` },
    { q: 'Is a cash ISA worth opening for only £10,000?', a: 'This site does not say what anyone should do, but it shows the sums. For a basic or higher rate taxpayer whose interest is all inside the allowance, a cash ISA and a taxable account at the same rate leave the same amount. The difference opens when the allowance is full, when income rises into another band, or when the rate on offer is very different between the two accounts.' },
    { q: 'Does the 2027 cash ISA limit of £12,000 affect a £10,000 deposit?', a: `No. From 6 April 2027 savers who are 64 or under at the end of the tax year can pay up to ${h.m(h.y(h.Y2).isa.cashUnder65)} a year into cash ISAs, and ${h.m(10000)} fits inside that. The overall ISA allowance stays at ${h.m(h.y(h.Y2).isa.overall)}, and money already held in cash ISAs keeps its tax-free status.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const i = 400;
    const others = [0, 400, 800, 1500];
    const rows = others.map((o) => [h.m(o), h.m2(h.tax(h.Y2, 35000, i, { otherInterest: o }).tax), h.m2(h.tax(h.Y2, 60000, i, { otherInterest: o }).tax), h.m2(h.tax(h.Y2, 130000, i, { otherInterest: o }).tax)]);
    const incomes = [20000, 35000, 60000, 130000];
    const limits = incomes.map((n) => { const f = h.S.taxFreeInterest(h.Y2, n); return [h.m(n), h.m(f), f >= 10000 * 0.25 ? 'above 25 %' : h.pc(f / 10000, 1)]; });
    return `<h2>The allowance covers all your interest, not each account</h2>
<p>A common mistake is to look at one account in isolation. The Personal Savings Allowance is a single amount per person for the tax year, set by ${h.src('leg_ita_12b', 'section 12B of the Income Tax Act 2007')}. Interest from a current account, an easy access account, a fixed-rate bond and your share of a joint account all count against it. So ${h.m(10000)} that looks safe alone may be the account that tips you over.</p>
<p>The table adds the ${h.m(i)} from ${h.m(10000)} at 4 % on top of interest already received from other taxable accounts, and shows the extra tax it causes in ${h.Y2}, for three incomes.</p>
${h.table(['Other interest already received', `Tax on the ${h.m(i)}, income ${h.m(35000)}`, `Income ${h.m(60000)}`, `Income ${h.m(130000)}`], rows, `Extra tax caused by ${h.m(i)} of interest in ${h.Y2}, after interest from other taxable accounts. Engine of this site, Finance Act 2026 rates.`, ['l', 'r', 'r', 'r'])}
<p>At ${h.m(35000)} nothing is due until the other accounts pass ${h.m(Y1.psa.basic - i)}. At ${h.m(60000)} the room is only ${h.m(Y1.psa.higher - i)}, so a second account of a similar size is enough to create a bill. At ${h.m(130000)} every pound of interest is taxed at ${h.pc(h.y(h.Y2).savingsRates.additional)}, whatever the other accounts hold.</p>
<h2>How much interest is tax free at your income</h2>
<p>The second table turns the rules round: it shows the largest amount of interest a person can receive in ${h.Y2} with no tax, and the rate on ${h.m(10000)} that would produce it. Low incomes gain from the Personal Allowance and the ${h.m(Y1.startingRateLimit)} starting rate; higher ones only from the allowance.</p>
${h.table(['Other income', 'Interest tax free', 'Rate on £10,000 to reach it'], limits, `Largest interest with no tax in ${h.Y2}, from the engine of this site.`, ['l', 'r', 'r'])}
<h2>What the 2027/28 rates change at this size</h2>
<p>From 6 April 2027 savings rates rise to ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)} (${h.src('leg_fa26_s5', 'Finance Act 2026, section 5')}), but the allowances stay the same. For a ${h.m(10000)} balance that means no change for anyone whose interest stays inside the allowance, and two pence more per taxable pound for the rest. In practice the added cost at this size is a few pounds a year at most, except for additional rate taxpayers.</p>
<h2>When the rate matters more than the wrapper</h2>
<p>At ${h.m(10000)}, a difference of half a point in the rate is worth ${h.m(50)} a year, which is more than the tax most savers would ever pay on this balance. For a basic rate taxpayer with no other savings, a taxable account at 4.5 % leaves more after tax than a cash ISA at 4 %, because the allowance covers both. The comparison can flip only once the interest passes the allowance, and the calculator shows where that point sits for your income.</p>
<p>The calculator above uses your own figures and shows the same comparison year by year. How interest on an account held with someone else is split between the holders is set out on the ${h.a('joint-account-interest', 'joint account page')}. For a larger sum, see the ${h.a('savings-20000', '£20,000 page')}, and for the full rules on the allowance, the ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')}.</p>`;
  },
});
