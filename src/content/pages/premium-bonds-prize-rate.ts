import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'premium-bonds-prize-rate',
  group: 'premium',
  order: 62,
  tool: { kind: 'mini:pb-rate', props: { holding: 30000, income: 60000 } },
  related: ['premium-bonds-calculator', 'premium-bonds-odds', 'savings-tax-rates-2027', 'savings-income-over-100k'],
  sources: ['nsi_pb', 'nsi_alloc', 'leg_fa26_s5', 'leg_ita_12b'],
  slug: 'premium-bonds-prize-rate',
  nav: 'Premium Bonds prize rate',
  card: 'What the 4.35 % prize fund rate means, and the taxable interest rate that would match it in your band.',
  title: 'Premium Bonds Prize Rate 4.35 %: Taxable Rate It Matches',
  description: 'Premium Bonds prize fund rate of 4.35 % explained: an average, not a return, the earlier 3.30 %, and the taxable rate that would match it in each tax band.',
  h1: 'Premium Bonds prize fund rate: what 4.35 % is worth in your tax band',
  intro: 'Enter your Bonds and your other income. The tool finds the rate a taxable account would have to pay to leave you, after tax, what the prize fund average and the median year bring.',
  resume: (h) => {
    const PBp = h.P.premiumBonds;
    const s = h.PB.simulate(30000);
    const gB = h.S.grossEquivalentRate(h.Y2, 40000, 30000, s.mean), gH = h.S.grossEquivalentRate(h.Y2, 60000, 30000, s.mean);
    return `The prize fund rate of Premium Bonds, ${h.pc(PBp.rate)} a year since NS&I raised it from ${h.pc(PBp.previousRate)}, is the total value of prizes paid each month, multiplied by twelve and divided by all the Bonds in the draw (${h.src('nsi_pb', 'NS&I, Premium Bonds')}). It is an average across about ${h.num(Math.round(h.PB.ELIGIBLE / 1e9))} billion Bonds, not a rate paid to anyone: no holder is credited ${h.pc(PBp.rate)}, and the typical holder wins less because a few large prizes take a share of the fund. Prizes are free of income tax, so the rate is often compared with a taxable account. For ${h.m(30000)} of Bonds, a taxable account would need about ${h.pc(gB, 2)} to match the average after ${h.Y2} tax for someone on ${h.m(40000)}, and about ${h.pc(gH, 2)} for someone on ${h.m(60000)}, whose Personal Savings Allowance is ${h.m(h.y(h.Y1).psa.higher)} and whose interest beyond it is taxed at ${h.pc(h.y(h.Y2).savingsRates.higher)}. Measured against the median year, the matching rates are lower.`;
  },
  faqs: (h) => [
    { q: 'Is the Premium Bonds prize fund rate the same as an interest rate?', a: `No. An interest rate is paid on every pound in an account. The prize fund rate only fixes how much money goes into the monthly prize pot, ${h.m(h.P.premiumBonds.totalValue)} in ${h.P.premiumBonds.drawMonth}. How that pot is shared among holders is left to the draw, so two people with the same holding can receive very different amounts, and either can receive nothing in a given month.` },
    { q: 'Why does the matching taxable rate jump for a higher rate taxpayer?', a: `Two things change at the higher rate threshold. The Personal Savings Allowance falls from ${h.m(h.y(h.Y1).psa.basic)} to ${h.m(h.y(h.Y1).psa.higher)} under section 12B of the Income Tax Act 2007, and the interest above it is taxed at ${h.pc(h.y(h.Y2).savingsRates.higher)} in ${h.Y2} instead of ${h.pc(h.y(h.Y2).savingsRates.basic)}. A taxable account must therefore pay noticeably more before tax to leave the same amount as a tax-free prize.` },
    { q: 'Does the prize fund rate of 4.35 % apply to every prize value?', a: `It applies to the fund as a whole. NS&I then splits the fund between bands of prize values, roughly ${h.pc(h.P.premiumBonds.bandShares.lower, 0)} for the lower values and ${h.pc(h.P.premiumBonds.bandShares.higher, 0)} each for the medium and higher values. A holder who wins only the common ${h.m(25)} to ${h.m(100)} prizes earns at a lower rate than the headline figure, which is why the median result falls below it.` },
    { q: 'What taxable rate matches Premium Bonds for a non-taxpayer?', a: `For someone whose interest would be covered entirely by the Personal Allowance, the starting rate or the Personal Savings Allowance, tax plays no part. The matching rate is then simply the prize figure divided by the holding: ${h.pc(h.P.premiumBonds.rate)} for the average, and less for the median year. Any taxable account paying more than that leaves them ahead on average, without the luck of the draw.` },
  ],
  body: (h) => {
    const PBp = h.P.premiumBonds;
    const s = h.PB.simulate(30000);
    const incomes = [15000, 40000, 47000, 60000, 110000, 130000];
    const rows = incomes.map((i) => [h.m(i), h.pc(h.S.grossEquivalentRate(h.Y1, i, 30000, s.mean), 2), h.pc(h.S.grossEquivalentRate(h.Y2, i, 30000, s.mean), 2), h.pc(h.S.grossEquivalentRate(h.Y2, i, 30000, s.median), 2)]);
    const hist = [10000, 30000, 50000].map((x) => [h.m(x), h.m(x * PBp.previousRate), h.m(x * PBp.rate), h.m(x * (PBp.rate - PBp.previousRate))]);
    return `<h2>Where the 4.35 % comes from</h2>
<p>The published figures let anyone check the rate. In ${PBp.drawMonth} the draw paid ${h.num(PBp.totalPrizes)} prizes worth ${h.m(PBp.totalValue)} (${h.src('nsi_alloc', 'NS&I, monthly prize allocation')}). There is one prize for every ${h.num(PBp.odds)} Bonds, so the draw held about ${h.num(Math.round(h.PB.ELIGIBLE / 1e9 * 10) / 10)} billion of them. Twelve months of that fund, divided by the Bonds, gives ${h.pc(h.PB.impliedRate, 2)}, which is the published rate once rounding is allowed for. The rate is therefore a size of prize fund, and both it and the odds are variable.</p>
<p>The rise from ${h.pc(PBp.previousRate)} to ${h.pc(PBp.rate)} adds about ${h.m(1000 * (PBp.rate - PBp.previousRate))} a year to the average for each ${h.m(1000)} held. NS&I's own pages are not consistent about the first draw at the new rate, so this site does not state a start month.</p>
${h.table(['Holding', `Average at ${h.pc(PBp.previousRate)}`, `Average at ${h.pc(PBp.rate)}`, 'Difference a year'], hist, 'Average prizes a year at each prize fund rate. The average is not what a typical holder receives.', ['l', 'r', 'r', 'r'])}
<h2>The taxable rate that matches it, band by band</h2>
<p>To compare like with like, the tool asks what rate a taxable account would need so that the interest left after income tax equals the prizes. The answer depends on income, because the Personal Allowance, the ${h.m(h.y(h.Y1).startingRateLimit)} starting rate and the Personal Savings Allowance shelter different amounts of interest at different incomes, and the rate on the rest rises in ${h.Y2} under section 5 of the ${h.src('leg_fa26_s5', 'Finance Act 2026')}. The table works it out for ${h.m(30000)} of Bonds.</p>
${h.table(['Other income', `Matches average, ${h.Y1}`, `Matches average, ${h.Y2}`, `Matches median year, ${h.Y2}`], rows, `${h.m(30000)} of Bonds. Average from the prize fund rate; median from 4,000 simulated years of the ${PBp.drawMonth} table. Engine of this site.`, ['l', 'r', 'r', 'r'])}
<p>Three groups appear. At ${h.m(15000)} the interest on ${h.m(30000)} is largely covered by the starting rate and the allowance, so the matching rate stays close to the prize figure. Basic rate taxpayers need a little more, because ${h.m(30000)} at that rate earns more than the ${h.m(h.y(h.Y1).psa.basic)} allowance (${h.src('leg_ita_12b', 'Income Tax Act 2007, section 12B')}). Higher rate taxpayers need much more. At ${h.m(110000)}, interest also eats into the Personal Allowance, and the ${h.a('savings-income-over-100k', 'page on income between £100,000 and £125,140')} explains why the matching rate there is the highest in the table.</p>
<h2>Reading the result with care</h2>
<p>A matching rate is a way to put two different products on one scale, not a recommendation. It assumes the current prize fund rate lasts a full year, which is not promised, and the median column is a simulated middle result, not a floor. Savings accounts carry their own variable rates. The ${h.a('premium-bonds-calculator', 'Premium Bonds calculator')} shows the full spread from a lean year to a lucky one, and the ${h.a('savings-tax-rates-2027', 'page on the 2027/28 savings rates')} shows how much more tax interest attracts from 6 April 2027.</p>`;
  },
});
