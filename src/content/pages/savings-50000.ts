import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-50000',
  group: 'amounts',
  order: 72,
  tool: { kind: 'isa', props: { balance: 50000, income: 55000, rate: 4 } },
  related: ['savings-tax-rates-2027', 'cash-isa-changes', 'isa-transfer', 'savings-100000'],
  sources: ['leg_ita_12b', 'leg_fa26_s5', 'leg_si_1018', 'gov_isa_transfer'],
  slug: 'savings-50000',
  nav: '£50,000 of savings',
  card: 'A higher rate taxpayer with £50,000: the yearly tax on the interest and how many tax years it takes to shelter it.',
  title: '£50,000 Savings: Higher Rate Tax and the Years to Shelter',
  description: '£50,000 savings at 4 % for a higher rate taxpayer: £600 of tax now, £630 in 2027/28, and how many tax years of cash ISA limit it takes to move it all, by age.',
  h1: '£50,000 in savings at the higher rate: the tax, and how long sheltering takes',
  intro: 'The calculator opens on £50,000 at 4 % with £55,000 of other income, a higher rate taxpayer. It shows the tax in a taxable account against a cash ISA in 2026/27 and in 2027/28.',
  resume: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const i = 2000, t1 = h.tax(h.Y1, 55000, i), t2 = h.tax(h.Y2, 55000, i);
    return `At 4 %, ${h.m(50000)} earns ${h.m(i)} of interest a year. Someone with ${h.m(55000)} of wages or pension is a higher rate taxpayer, so only ${h.m(Y1.psa.higher)} of that interest is covered by the Personal Savings Allowance (${h.src('leg_ita_12b', 'Income Tax Act 2007, section 12B')}) and the other ${h.m(i - Y1.psa.higher)} is taxed at ${h.pc(Y1.savingsRates.higher)} in ${h.Y1}: ${h.m(t1.tax)} a year. From 6 April 2027 the higher savings rate becomes ${h.pc(Y2.savingsRates.higher)} under the Finance Act 2026, and the same interest costs ${h.m(t2.tax)}. A cash ISA removes that tax, but only up to the yearly limit: ${h.m(Y1.isa.cashUnder65)} can go into cash in ${h.Y1}, then ${h.m(Y2.isa.cashUnder65)} a year from ${h.Y2} for anyone 64 or under on 5 April, or ${h.m(Y2.isa.cashFrom65)} for those aged 65 or more. Moving a ${h.m(50000)} balance into cash ISAs therefore takes three or four tax years, and the tax shrinks each year as the taxable part gets smaller.`;
  },
  faqs: (h) => [
    { q: 'How much tax does a higher rate taxpayer pay on £50,000 of savings?', a: `At 4 %, ${h.m(h.tax(h.Y1, 55000, 2000).tax)} in ${h.Y1} on ${h.m(55000)} of other income: ${h.m(2000)} of interest, less the ${h.m(h.y(h.Y1).psa.higher)} allowance, taxed at ${h.pc(h.y(h.Y1).savingsRates.higher)}. In ${h.Y2} the rate rises to ${h.pc(h.y(h.Y2).savingsRates.higher)} and the tax to ${h.m(h.tax(h.Y2, 55000, 2000).tax)}. A different interest rate changes the result in proportion once the allowance is used.` },
    { q: 'Can I transfer £50,000 from an old cash ISA without using my allowance?', a: 'Yes. Money saved in ISAs in previous tax years can be transferred to another ISA without counting towards the current year\'s allowance, as long as it moves by transfer between providers rather than being withdrawn and paid in again. A transfer between cash ISAs should take no longer than 15 working days. The yearly limits on this page apply only to new money.' },
    { q: 'Does interest on £50,000 push a £48,000 earner into the higher rate?', a: `It does at 4 %. ${h.m(48000)} plus ${h.m(2000)} of interest is ${h.m(50000)}, just under the ${h.m(50270)} threshold, so the allowance stays at ${h.m(h.y(h.Y1).psa.basic)}. A rate a little higher, or another account, would cross it, halve the allowance and tax the interest above the threshold at the higher rate.` },
    { q: 'Can £50,000 be spread across several cash ISAs in the same tax year?', a: `Yes. Since 6 April 2024 more than one ISA of the same type can be opened and paid into in one tax year, so new money can go to two or more cash ISAs. The yearly cap still applies to the total: ${h.m(h.y(h.Y1).isa.cashUnder65)} across all cash ISAs in ${h.Y1}, and ${h.m(h.y(h.Y2).isa.cashUnder65)} from ${h.Y2} for anyone 64 or under on 5 April. Splitting the money does not speed up the timeline.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1), Y2 = h.y(h.Y2);
    const r = 0.04, inc = 55000;
    const labels = [h.Y1, h.Y2, '2028/29', '2029/30'];
    const path = (later: number) => {
      let left = 50000;
      return labels.map((lab, k) => {
        const cap = k === 0 ? Y1.isa.cashUnder65 : later;
        const moved = Math.min(cap, left); left -= moved;
        const t = h.tax(k === 0 ? h.Y1 : h.Y2, inc, left * r).tax;
        return { lab, moved, left, t };
      });
    };
    const u = path(Y2.isa.cashUnder65), o = path(Y2.isa.cashFrom65);
    const rows = labels.map((lab, k) => [lab, h.m(u[k].moved), h.m(u[k].left), h.m2(u[k].t), h.m(o[k].moved), h.m(o[k].left), h.m2(o[k].t)]);
    const sumU = u.reduce((s, x) => s + x.t, 0), sumO = o.reduce((s, x) => s + x.t, 0), none = h.tax(h.Y1, inc, 2000).tax + 3 * h.tax(h.Y2, inc, 2000).tax;
    const yearsU = u.findIndex((x) => x.left === 0) + 1, yearsO = o.findIndex((x) => x.left === 0) + 1;
    return `<h2>A timeline, year by year</h2>
<p>A sum of this size cannot enter a cash ISA in one go. The table assumes the full yearly cash limit is used at the start of each tax year, with the rest earning 4 % in a taxable account and the interest taken out, not added. It compares a saver who stays 64 or under on each 5 April with one who is already 65 or older. For 2028/29 and 2029/30 it applies the ${h.Y2} rates and limits, the latest set by law; later rates have not been fixed and may differ.</p>
${h.table(['Tax year', 'Under 65: moved', 'Left taxable', 'Tax that year', '65+: moved', 'Left taxable', 'Tax that year'], rows, `${h.m(50000)} at 4 %, other income ${h.m(inc)}. Limits from SI 2026/1018; tax from the engine of this site. Years after ${h.Y2} assume the ${h.Y2} rules continue.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The under-65 saver needs ${yearsU} tax years and pays ${h.m(sumU)} in total along the way. The saver aged 65 or more needs ${yearsO} and pays ${h.m(sumO)}. Leaving everything in a taxable account for the same four years would cost about ${h.m(none)} on these assumptions. The gap comes almost entirely from the higher savings rate: at ${h.m(inc)}, each taxable pound beyond the ${h.m(Y1.psa.higher)} allowance loses ${h.pc(Y1.savingsRates.higher)} now and ${h.pc(Y2.savingsRates.higher)} from ${h.date(h.P.reform.inForce)} (${h.src('leg_fa26_s5', 'Finance Act 2026, section 5')}).</p>
<h2>Why the allowance does so little here</h2>
<p>For a higher rate taxpayer, ${h.m(Y1.psa.higher)} of tax-free interest is used up by about ${h.m(Y1.psa.higher / r)} of savings at 4 %. Everything beyond that is taxed at the full higher savings rate, so the tax on ${h.m(50000)} grows almost in line with the balance. The starting rate for savings plays no part either, because wages of ${h.m(inc)} fill the bands below it. That is the main difference from the ${h.a('savings-100000', '£100,000 page')}, where a basic rate pensioner is the example.</p>
<h2>Rules that shape the timeline</h2>
<p>The yearly cash cap comes from ${h.src('leg_si_1018', 'SI 2026/1018')}. It applies to new subscriptions only; money already in cash ISAs is untouched and can be moved between providers by transfer without using the allowance (${h.src('gov_isa_transfer', 'GOV.UK, transferring your ISA')}). The other ${h.m(Y2.isa.overall - Y2.isa.cashUnder65)} of allowance that an under-65 cannot put into cash from ${h.Y2} can still go into a stocks and shares ISA, but cash held there will carry a flat ${h.pc(Y2.cashInvestmentIsaCharge)} charge on its interest, and transfers from such an ISA to a cash ISA are not allowed for under-65s.</p>
<p>The overall ${h.m(Y2.isa.overall)} allowance is frozen until April 2031. The ${h.a('cash-isa-changes', 'page on the 2027 cash ISA changes')} sets out the whole reform, and the ${h.a('savings-tax-rates-2027', '2027/28 rates page')} shows how the new rates fall on other incomes. The calculator above lets you test another rate, balance or income.</p>`;
  },
});
