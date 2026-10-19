import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'personal-savings-allowance',
  group: 'tax',
  order: 11,
  tool: { kind: 'mini:psa' },
  related: ['tax-on-savings-interest', 'starting-rate-for-savings', 'savings-income-over-100k', 'joint-account-interest'],
  sources: ['gov_savings_free', 'leg_ita_12b', 'leg_ita_12a', 'gov_rates'],
  slug: 'personal-savings-allowance',
  nav: 'Personal Savings Allowance',
  card: 'Which of the £1,000, £500 or nil allowances applies to you, and the balance it covers at your rate.',
  title: 'Personal Savings Allowance 2026/27: £1,000, £500 or Nil',
  description: 'Personal Savings Allowance for 2026/27 and 2027/28: £1,000 at basic rate, £500 at higher rate, nil above £125,140, and why interest can tip you over £50,270.',
  h1: 'Personal Savings Allowance: £1,000, £500 or nothing',
  intro: 'Enter your income before tax and the rate your savings pay. The tool finds which allowance the law gives you once your interest is counted, and the balance that stays clear of tax.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const threshold = Y1.personalAllowance + Y1.basicRateLimit;
    const a = h.tax(h.Y1, 49000, 1000), b = h.tax(h.Y1, 49500, 1000);
    return `The Personal Savings Allowance lets a saver receive some interest at a 0 % rate on top of any Personal Allowance and starting rate left. Its size depends on the highest income tax band you reach: ${h.m(Y1.psa.basic)} if you stay within the basic rate band, ${h.m(Y1.psa.higher)} if any of your income is taxed at the higher rate, and ${h.m(Y1.psa.additional)} once your taxable income goes past the additional rate threshold of ${h.m(Y1.higherRateLimit)}. The figures are written into section 12B of the Income Tax Act 2007 and are the same in ${h.Y1} and ${h.Y2}. The test counts interest as part of your income, so the allowance can halve because of the interest itself. With a full Personal Allowance the higher rate starts above ${h.m(threshold)}: someone on ${h.m(49000)} of salary with ${h.m(1000)} of interest pays ${h.m2(a.tax)} on it, while ${h.m(500)} more salary gives a bill of ${h.m2(b.tax)} on the same interest. The allowance is applied automatically; nothing has to be claimed.`;
  },
  faqs: (h) => [
    { q: 'Does the Personal Savings Allowance cover interest from a cash ISA?', a: 'It does not need to. Interest inside any ISA is outside income tax altogether and is not counted when your band is tested, so it uses none of the allowance. The allowance only matters for interest from ordinary bank and building society accounts, fixed-rate bonds and similar taxable sources held outside an ISA.' },
    { q: 'Is the Personal Savings Allowance £1,000 for each account?', a: `No. It is one allowance per person per tax year, shared by every taxable account you hold. A saver with three accounts paying ${h.m(400)} each has ${h.m(1200)} of interest to set against a single ${h.m(h.y(h.Y1).psa.basic)} allowance at the basic rate, and the rest is taxable. A couple has two allowances, one each, which is why joint accounts are split between the holders.` },
    { q: 'Can unused Personal Savings Allowance be carried forward or given to a partner?', a: 'Neither is possible. An allowance not used by 5 April is lost, and section 12B gives no way to pass it to a spouse or civil partner. Each allowance depends only on its holder’s own income, so in a couple with very different earnings one partner can pay tax on interest while the other still has room left over.' },
    { q: 'Will the Personal Savings Allowance rise when the savings rates go up in April 2027?', a: `No change has been made to it. The Finance Act 2026 raises the savings rates for ${h.Y2} but leaves section 12B of the Income Tax Act 2007 untouched, so the allowance stays at ${h.m(h.y(h.Y2).psa.basic)}, ${h.m(h.y(h.Y2).psa.higher)} and nil. Its value in tax saved does rise a little, because each pound it covers would otherwise be taxed at the higher rates.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const threshold = Y1.personalAllowance + Y1.basicRateLimit;
    const salaries = [45000, 48500, 49000, 49270, 49500, 50000, 52000];
    const rows = salaries.map((s) => { const x = h.tax(h.Y1, s, 1000); return [h.m(s), h.m(s + 1000), x.band === 'basic' ? 'basic' : x.band === 'higher' ? 'higher' : 'additional', h.m(x.psa), h.m2(x.tax)]; });
    const freeBasic = h.S.taxFreeInterest(h.Y1, 40000), freeHigher = h.S.taxFreeInterest(h.Y1, 70000);
    return `<h2>A band test that includes the interest</h2>
<p>Section 12B of the ${h.src('leg_ita_12b', 'Income Tax Act 2007')} does not look at your salary alone. It asks whether any of your income, savings included, is charged at the higher or additional rate. That makes the allowance different from most reliefs: it is decided after the interest has been added, not before. Wages, pensions, rental profit and interest are stacked together, the Personal Allowance is taken off, and the result is compared with the ${h.m(Y1.basicRateLimit)} basic rate band. For someone with the standard allowance of ${h.m(Y1.personalAllowance)}, that places the line at ${h.m(threshold)} of total income.</p>
<p>The interest covered by the allowance is taxed at the savings nil rate under section 12A (${h.src('leg_ita_12a', 'Income Tax Act 2007, section 12A')}), but it still fills band space. That detail produces the cliff shown below.</p>
${h.table(['Salary', 'Total with interest', 'Band reached', 'Allowance', 'Tax on the interest'], rows, `Tax on ${h.m(1000)} of interest in ${h.Y1} for salaries near the higher rate threshold. Computed by this site's engine.`, ['l', 'r', 'l', 'r', 'r'])}
<p>Up to a total of ${h.m(threshold)}, the full ${h.m(Y1.psa.basic)} covers the interest and nothing is due. Once the total passes that point by even a pound, the allowance falls to ${h.m(Y1.psa.higher)}. The other half of the interest is then taxed: first at ${h.pc(Y1.savingsRates.basic)} for whatever basic rate band is left, then at ${h.pc(Y1.savingsRates.higher)}. So a small pay rise can add more to the tax on interest than to the tax on the pay itself.</p>
<h2>How much balance each allowance shelters</h2>
<p>Read the other way round, the allowance sets a ceiling on how much cash can sit in taxable accounts before tax appears. On a ${h.m(40000)} salary the tool finds ${h.m(freeBasic)} of tax-free interest, which at ${h.pc(0.04)} corresponds to a balance of about ${h.m(freeBasic / 0.04)}. On ${h.m(70000)} it is ${h.m(freeHigher)}, or about ${h.m(freeHigher / 0.04)} at the same rate. At the additional rate there is no allowance at all and every pound of interest is taxed, which is also where the Personal Allowance has gone (see the ${h.a('savings-income-over-100k', 'page on income above £100,000')}).</p>
<p>When rates fall, the same allowance covers a larger balance; when they rise, a balance that was tax free can start to create a bill without the saver adding a penny. This is how savers who have never paid tax on interest can find a calculation from HMRC arriving after a year of higher rates.</p>
<h2>Where the allowance sits in the order</h2>
<p>The allowance is the third layer, after any Personal Allowance left over and the ${h.a('starting-rate-for-savings', '£5,000 starting rate for savings')}. Most employees have no Personal Allowance or starting rate left, so for them the Personal Savings Allowance is the only relief that matters. Pensioners and low earners may never reach it, because the earlier layers absorb their interest first. GOV.UK sets out the three amounts by band on its ${h.src('gov_savings_free', 'page on tax-free savings interest')}, and the main bands are listed on the ${h.src('gov_rates', 'Income Tax rates page')}.</p>
<h2>Couples and joint accounts</h2>
<p>Each person has an allowance of their own, set by their own band. A couple where one partner is a basic rate taxpayer and the other a higher rate taxpayer therefore has ${h.m(Y1.psa.basic + Y1.psa.higher)} of combined allowance, not ${h.m(2 * Y1.psa.basic)}. Interest on a joint account is shared between the holders, and each half is tested against its holder's allowance: the ${h.a('joint-account-interest', 'joint account page')} shows the split.</p>`;
  },
});
