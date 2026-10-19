import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'premium-bonds-odds',
  group: 'premium',
  order: 61,
  tool: { kind: 'mini:pb-odds', props: { holding: 10000 } },
  related: ['premium-bonds-calculator', 'premium-bonds-prize-rate', 'home'],
  sources: ['nsi_pb', 'nsi_alloc'],
  slug: 'premium-bonds-odds',
  nav: 'Premium Bonds odds',
  card: 'Your chance of at least one prize this month and this year, and the odds behind each prize value.',
  title: 'Premium Bonds Odds: 21,000 to 1 and Your Chance a Month',
  description: 'Premium Bonds odds of 21,000 to 1 per £1 Bond turned into your chance of a prize each month and each year, with the full October 2026 prize table and its odds.',
  h1: 'Premium Bonds odds: your chance of a prize, from one draw to a year',
  intro: 'Type the value of your Bonds. The tool turns the published odds into the chance of at least one prize in a month, in three months and in a year, and the number of prizes to expect.',
  resume: (h) => {
    const PBp = h.P.premiumBonds;
    const o1 = h.PB.odds(1000), o10 = h.PB.odds(10000), o50 = h.PB.odds(50000);
    return `NS&I states the odds of Premium Bonds as ${h.num(PBp.odds)} to 1 for each £1 Bond in each monthly draw, down from ${h.num(PBp.previousOdds)} to 1 before the latest change (${h.src('nsi_pb', 'NS&I, Premium Bonds')}). Those odds describe one Bond, so the chance for a holding depends on how many Bonds it contains. With ${h.m(1000)} the chance of at least one prize in a given month is about ${h.pc(o1.perMonthAny, 1)}, and over twelve draws it reaches ${h.pc(o1.perYearAny, 0)}. With ${h.m(10000)} it is ${h.pc(o10.perMonthAny, 0)} a month and close to certain over a year, with around ${h.num(o10.expectedPrizesYear)} prizes expected. The maximum holding of ${h.m(PBp.max)} wins something in about ${h.pc(o50.perMonthAny, 0)} of months. Odds say nothing about size: in the ${PBp.drawMonth} draw, ${h.pc((PBp.prizes.filter((p) => p.band === 'lower').reduce((s, p) => s + p.count, 0)) / PBp.totalPrizes, 0)} of the ${h.num(PBp.totalPrizes)} prizes were worth ${h.m(100)} or less. Nothing here is a promise of any prize.`;
  },
  faqs: (h) => [
    { q: 'What do the Premium Bonds odds of 21,000 to 1 actually mean?', a: `For every ${h.num(h.P.premiumBonds.odds)} Bonds in a draw there is, on average, one prize. Each £1 Bond therefore has about a 1 in ${h.num(h.P.premiumBonds.odds)} chance of winning something in a given month. The figure is set from the number of prizes NS&I creates, not from any single prize: the chance of the top ${h.m(1000000)} prize is millions of times smaller.` },
    { q: 'Does buying more Bonds improve my odds per Bond?', a: 'No. Each Bond has the same chance as every other Bond in the draw, whoever holds it and however long it has been held. A bigger holding only gives you more tickets, so your chance of at least one prize goes up and the number of prizes you can expect rises in proportion. It does not change the value of the prizes you are likely to win.' },
    { q: 'How often does a £5,000 holding of Premium Bonds win?', a: `With ${h.m(5000)} the chance of at least one prize in a month is about ${h.pc(h.PB.odds(5000).perMonthAny, 0)}, so wins come roughly once every four or five draws on average and about ${h.num(h.PB.odds(5000).expectedPrizesYear)} prizes a year can be expected. Real months cluster: two prizes in one month and nothing for half a year can both happen. Most of the prizes won will be ${h.m(25)}, ${h.m(50)} or ${h.m(100)}.` },
    { q: 'Why did the odds of Premium Bonds move from 23,000 to 21,000 to 1?', a: `NS&I sets the odds together with the prize fund rate. When the rate went from ${h.pc(h.P.premiumBonds.previousRate)} to ${h.pc(h.P.premiumBonds.rate)}, more prizes were created per pound invested, which shortens the odds. Both figures are variable and NS&I can revise them; the page uses the published figures in force for the ${h.P.premiumBonds.drawMonth} draw.` },
  ],
  body: (h) => {
    const PBp = h.P.premiumBonds;
    const prizeRows = h.PB.PRIZES.map((p) => [h.m(p.value), h.num(p.count), `1 in ${h.num(Math.round(h.PB.ELIGIBLE / p.count))}`, h.pc((p.value * p.count) / PBp.totalValue, 1)]);
    const holds = [100, 1000, 5000, 20000, 50000];
    const holdRows = holds.map((x) => { const o = h.PB.odds(x); return [h.m(x), h.pc(o.perMonthAny, 1), h.pc(o.months[5].atLeastOne, 1), h.pc(o.perYearAny, 1), h.num(Math.round(o.expectedPrizesYear * 10) / 10), o.monthsForEvenChance === null ? 'n/a' : String(o.monthsForEvenChance)]; });
    const higherCount = PBp.prizes.filter((p) => p.band === 'higher').reduce((s, p) => s + p.count, 0);
    return `<h2>The prize table behind the odds</h2>
<p>Every month NS&I counts the Bonds eligible for the draw and creates one prize for every ${h.num(PBp.odds)} of them. For ${PBp.drawMonth} that gave ${h.num(PBp.totalPrizes)} prizes with a total value of ${h.m(PBp.totalValue)} (${h.src('nsi_alloc', 'NS&I, monthly prize allocation')}). Multiplying the number of prizes by the odds gives about ${h.num(Math.round(h.PB.ELIGIBLE / 1e9 * 10) / 10)} billion Bonds in the draw, which lets each prize value be turned into a chance per Bond.</p>
${h.table(['Prize', 'Number in the draw', 'Chance per £1 Bond', 'Share of the prize fund'], prizeRows, `${PBp.drawMonth} draw. Chance per Bond = prizes of that value divided by the Bonds in the draw (prizes × odds). Worked out by the engine of this site from the NS&I figures.`, ['l', 'r', 'r', 'r'])}
<p>The bottom three rows hold almost all the prizes. The top six values together count only ${h.num(higherCount)} prizes, so a single Bond's chance of winning ${h.m(5000)} or more in a month is about 1 in ${h.num(Math.round(h.PB.ELIGIBLE / higherCount))}. The ${h.m(1000000)} prize comes up twice a month across the whole draw, which puts it at odds that no holding of ${h.m(PBp.max)} can bring close.</p>
<h2>From one Bond to a holding</h2>
<p>Because each Bond is drawn independently, the chance of no prize at all is the chance of one Bond missing, raised to the number of Bonds. The tool uses that formula and then repeats it over the months. The table shows what it gives for five holdings, including the number of draws after which a first prize becomes more likely than not.</p>
${h.table(['Holding', 'In one month', 'Within 6 months', 'Within 12 months', 'Prizes expected a year', 'Months for an even chance'], holdRows, `Chance of at least one prize at ${h.num(PBp.odds)} to 1 per £1 Bond. Engine of this site.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The minimum purchase of ${h.m(PBp.min)} gives a very small chance in any month. At ${h.m(100)} the even-chance point is years away, which is why small holders often see long gaps. Once a holding reaches several thousand pounds, prizes arrive most months, but most of them are ${h.m(25)}. Holding more than ${h.m(PBp.max)} is not allowed.</p>
<h2>Why a lucky streak does not change the next draw</h2>
<p>Each draw is separate. A holding that won three months running has exactly the same chance next month as one that has won nothing for a year, because the odds per Bond are set afresh for every draw from the number of Bonds and prizes. Long gaps are expected rather than a sign that something is wrong: for ${h.m(1000)}, about ${h.pc(1 - h.PB.odds(1000).perYearAny, 0)} of years pass with no prize at all, even though nothing about the Bonds has changed. The chance only moves when the holding grows or shrinks, or when NS&I changes the odds.</p>
<h2>Odds are not a return</h2>
<p>Knowing how often a holding wins says little about how much it earns. A holder of ${h.m(20000)} expects about ${h.num(Math.round(h.PB.odds(20000).expectedPrizesYear * 10) / 10)} prizes a year, yet the total can vary widely from one year to the next. The ${h.a('premium-bonds-calculator', 'Premium Bonds calculator')} shows that spread in pounds, and the ${h.a('premium-bonds-prize-rate', 'prize fund rate page')} explains how the ${h.pc(PBp.rate)} figure relates to these odds. Both odds and rate are variable; the current figures are those on NS&I's ${h.src('nsi_pb', 'Premium Bonds page')}.</p>`;
  },
});
