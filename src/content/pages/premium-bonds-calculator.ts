import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'premium-bonds-calculator',
  group: 'premium',
  order: 60,
  tool: { kind: 'mini:pb-calc', props: { holding: 25000, income: 55000, rate: 4 } },
  related: ['premium-bonds-odds', 'premium-bonds-prize-rate', 'personal-savings-allowance', 'home'],
  sources: ['nsi_pb', 'nsi_alloc', 'leg_fa26_s5', 'gov_savings_free'],
  slug: 'premium-bonds-calculator',
  nav: 'Premium Bonds calculator',
  card: 'Typical prizes for your holding, the spread from a lean year to a lucky one, and a taxed account beside them.',
  title: 'Premium Bonds Calculator: Median Prizes Against Interest',
  description: 'Premium Bonds prizes for your holding: median and average from the October 2026 prize table, lean and lucky years, against a taxable account after 2027/28 tax.',
  h1: 'Premium Bonds calculator: what a typical year of prizes looks like',
  intro: 'Enter the Bonds you hold, your other income and the rate a taxable account would pay. The tool draws 4,000 simulated years from the current prize table and puts the after-tax interest beside them.',
  resume: (h) => {
    const PBp = h.P.premiumBonds;
    const s = h.PB.simulate(25000);
    const net = h.tax(h.Y2, 55000, 1000).net;
    return `Premium Bonds pay no interest: each £1 Bond goes into a monthly draw, and NS&I sets the size of the prize fund so that it averages ${h.pc(PBp.rate)} a year across all Bonds, with odds of ${h.num(PBp.odds)} to 1 per Bond per month (${h.src('nsi_pb', 'NS&I, Premium Bonds')}). That average is not what a typical holder receives. On ${h.m(25000)}, the prize fund rate works out at about ${h.m(s.mean)} a year, but in our simulation of the ${PBp.drawMonth} prize table the median year brings ${h.m(s.median)}, one year in ten brings ${h.m(s.p10)} or less and one in ten brings ${h.m(s.p90)} or more. Prizes are free of income tax, so the fair comparison is with interest after tax: ${h.m(25000)} at 4 % for someone earning ${h.m(55000)} leaves ${h.m(net)} in ${h.Y2}, when savings rates rise under the Finance Act 2026. Prizes are never guaranteed, and the money itself is backed by HM Treasury.`;
  },
  faqs: (h) => [
    { q: 'Why does the Premium Bonds calculator show a median below the prize fund rate?', a: `Because a handful of very large prizes pull the average up. The top prizes of ${h.m(1000000)} and ${h.m(100000)} are counted in the ${h.pc(h.P.premiumBonds.rate)} rate, yet almost nobody wins them. Strip them out and the remaining prizes, mostly ${h.m(25)} to ${h.m(100)}, are what a typical holding collects, so the middle result sits below the average every year.` },
    { q: 'How many simulated years does this Premium Bonds tool draw?', a: 'Four thousand for each holding. Each simulated year counts how many prizes the Bonds win over twelve draws and picks the value of each prize from the share of prizes in the published table. The random sequence uses a fixed seed, so the same holding always gives the same figures on this page. It is a way to show the spread, not a forecast of your own draws.' },
    { q: 'Which tax figure is used for the savings account comparison?', a: `The 2027/28 tax on the interest, because a holding kept for a while will meet the savings rates of ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)} that come into force on 6 April 2027. The tax is worked out with your Personal Allowance, starting rate and Personal Savings Allowance, so a saver with room left in those pays nothing and the account keeps its full rate.` },
    { q: 'Can a large holding of Premium Bonds go a whole year without a prize?', a: `It becomes very unlikely. At ${h.num(h.P.premiumBonds.odds)} to 1 per Bond each month, ${h.m(1000)} has about a ${h.pc(h.PB.simulate(1000).chanceNothing, 0)} chance of no prize in twelve draws, while ${h.m(10000)} drops below ${h.pc(0.01, 0)}. What a large holding cannot escape is a low year: the amount won can still fall well under the average.` },
  ],
  body: (h) => {
    const PBp = h.P.premiumBonds;
    const holdings = [1000, 5000, 10000, 25000, 50000];
    const rows = holdings.map((x) => { const s = h.PB.simulate(x); return [h.m(x), h.m(s.mean), h.m(s.median), h.m(s.p10), h.m(s.p90), h.pc(s.chanceNothing, 1)]; });
    const incomes = [30000, 55000, 130000];
    const s25 = h.PB.simulate(25000);
    const cmp = incomes.map((i) => { const t = h.tax(h.Y2, i, 1000); return [h.m(i), h.m(t.net), h.m(s25.median), t.net > s25.median ? 'Account' : 'Bonds (median)']; });
    const nHigh = h.tax(h.Y2, 55000, 1000).net, nBasic = h.tax(h.Y2, 30000, 1000).net;
    return `<h2>Average and typical are two different numbers</h2>
<p>A prize draw has a lopsided spread. Most months a Bond wins nothing; when it does win, the prize is usually one of the three smallest values. The large prizes are so rare that they hardly ever arrive, yet they carry a real slice of the fund. The table below runs the same simulation as the tool for five holdings. The second column is the prize fund rate applied to the holding; the third is the year that sits in the middle of the 4,000 draws.</p>
${h.table(['Holding', 'Average a year', 'Median year', '1 year in 10, below', '1 year in 10, above', 'No prize at all'], rows, `Simulated prizes over twelve draws, ${PBp.drawMonth} prize table (${h.num(PBp.totalPrizes)} prizes worth ${h.m(PBp.totalValue)}), odds ${h.num(PBp.odds)} to 1. Worked out by the engine of this site; not a forecast.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Two patterns stand out. Small holdings often end the year with nothing: the median for ${h.m(1000)} is ${h.m(h.PB.simulate(1000).median)}. And the gap between the median and the average narrows as a share of the holding when the holding grows, but it never closes, because a ${h.m(25)} or ${h.m(50)} prize is far more common than anything above ${h.m(1000)}. NS&I publishes how each month's fund is shared out in its ${h.src('nsi_alloc', 'monthly prize allocation')}; the table here uses the ${PBp.drawMonth} figures.</p>
<h2>Against a taxable account, after tax</h2>
<p>Interest on an ordinary savings account is taxable once your allowances are used up, while Premium Bond prizes are not taxed at all. Comparing a prize figure with a headline interest rate therefore flatters the account for anyone who pays tax on savings. The next table sets a ${h.m(25000)} holding against the same sum earning 4 %, which is ${h.m(1000)} of interest a year, at three levels of other income, with the ${h.Y2} rates from section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')}.</p>
${h.table(['Other income', 'Account at 4 % after tax, ' + h.Y2, 'Bonds, median year', 'Higher of the two'], cmp, `${h.m(25000)} in each. Interest tax from the engine of this site; prizes from the simulation above.`, ['l', 'r', 'r', 'l'])}
<p>A basic rate taxpayer keeps ${h.m(nBasic)} of the interest because the ${h.m(h.y(h.Y1).psa.basic)} Personal Savings Allowance covers it all (${h.src('gov_savings_free', 'GOV.UK, how much interest is tax free')}). At ${h.m(55000)} the allowance halves and the rest is taxed at ${h.pc(h.y(h.Y2).savingsRates.higher)}, leaving ${h.m(nHigh)}. The result depends on the rate you can find, which changes often, and on the prize fund rate, which NS&I has moved before (it stood at ${h.pc(PBp.previousRate)} with odds of ${h.num(PBp.previousOdds)} to 1); the ${h.a('premium-bonds-prize-rate', 'page on the prize fund rate')} turns this into a single taxable rate for your band.</p>
<h2>What the tool does not cover</h2>
<p>Bonds can be bought from ${h.m(PBp.min)} up to ${h.m(PBp.max)} per person, by anyone aged ${PBp.minAge} or over, or by a parent or guardian for a younger child. Every pound is backed by HM Treasury, which is why the Financial Services Compensation Scheme limit does not apply to them. The tool ignores inflation and assumes the current rate and odds hold for a year. For the chance of winning in a given month rather than the amount, see the ${h.a('premium-bonds-odds', 'odds page')}; to set a cash ISA against a taxable account instead, use the ${h.a('home', 'main ISA calculator')}.</p>`;
  },
});
