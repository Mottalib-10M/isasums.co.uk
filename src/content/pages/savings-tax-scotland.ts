import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'savings-tax-scotland',
  group: 'tax',
  order: 17,
  tool: { kind: 'mini:scotland' },
  related: ['personal-savings-allowance', 'savings-tax-rates-2027', 'savings-income-over-100k', 'tax-on-savings-interest'],
  sources: ['gov_scotland', 'leg_ita_11d', 'leg_ita_12b'],
  slug: 'savings-tax-scotland',
  nav: 'Savings tax in Scotland',
  card: 'Why a Scottish taxpayer’s interest is taxed at UK rates and bands, even when their pay is not.',
  title: 'Savings Tax in Scotland 2026/27: UK Rates on Your Interest',
  description: 'Savings tax in Scotland: interest is taxed at UK rates and bands, and the £1,000 or £500 allowance uses the UK £50,270 line even if your pay is taxed at 42 %.',
  h1: 'Savings tax for Scottish taxpayers: UK rules on interest',
  intro: 'Enter your income other than savings and your taxable interest. The tool applies the Scottish rates to pay or pension and the UK savings rates and bands to the interest, as the law requires.',
  resume: (h) => {
    const Y1 = h.y(h.Y1);
    const x = h.tax(h.Y1, 45000, 1500, { nation: 'scotland' });
    return `Scottish rates of income tax apply only to wages, pensions, profits and rent. Savings interest of a Scottish taxpayer is taxed at the UK savings rates and on the UK bands: section 11D of the Income Tax Act 2007 says so in terms, and the Personal Savings Allowance test in section 12B also uses the UK bands. In ${h.Y1} that means ${h.pc(Y1.savingsRates.basic)}, ${h.pc(Y1.savingsRates.higher)} and ${h.pc(Y1.savingsRates.additional)} on interest above the allowances, the same ${h.m(Y1.startingRateLimit)} starting rate and an allowance of ${h.m(Y1.psa.basic)} until total income passes ${h.m(Y1.personalAllowance + Y1.basicRateLimit)}. A Scot on ${h.m(45000)} pays the Scottish higher rate of 42 % on the top slice of their salary, yet for savings they are still a basic rate taxpayer: on ${h.m(1500)} of interest they keep the ${h.m(x.psa)} allowance and pay ${h.m2(x.tax)}. From 6 April 2027 the UK savings rates rise to ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)} in Scotland too; Scottish rates for ${h.Y2} are not yet set.`;
  },
  faqs: (h) => [
    { q: 'Do Scottish taxpayers with pay in the 42 % band lose half their savings allowance?', a: `Not because of the Scottish band. The allowance is decided on UK bands, so a Scot loses half of it only when total income, interest included, goes above ${h.m(h.y(h.Y1).personalAllowance + h.y(h.Y1).basicRateLimit)}. Someone whose salary is taxed at 42 % from ${h.m(h.y(h.Y1).personalAllowance + h.y(h.Y1).scotland![2].upTo! + 1)} still has the full ${h.m(h.y(h.Y1).psa.basic)} allowance below that point.` },
    { q: 'Is interest on a Scottish savings account taxed at 19 % or 21 %?', a: `No. The starter rate of 19 % and the intermediate rate of 21 % are Scottish rates for non-savings income only. Interest above the allowances is taxed at the UK savings basic rate of ${h.pc(h.y(h.Y1).savingsRates.basic)} in ${h.Y1} and ${h.pc(h.y(h.Y2).savingsRates.basic)} from 6 April 2027, wherever in the UK the saver lives.` },
    { q: 'Will Scottish rates for 2027/28 change the tax on my interest?', a: `They will not change the savings slice, which follows UK rates already fixed by the Finance Act 2026. They can matter in one case: above ${h.m(h.y(h.Y1).taperThreshold)}, interest reduces the Personal Allowance and so raises the tax on salary, which is priced at Scottish rates. Until those rates are set, this site shows that part as not yet known for ${h.Y2}.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const sc = Y1.scotland!;
    const bandOf = (gross: number) => { const t = Math.max(0, gross - Y1.personalAllowance); return sc.find((b) => b.upTo === null || t <= b.upTo)!; };
    const incomes = [25000, 40000, 45000, 50000, 60000, 80000];
    const rows = incomes.map((ns) => { const a = h.tax(h.Y1, ns, 1500, { nation: 'scotland' }), b = h.tax(h.Y2, ns, 1500, { nation: 'scotland' }); const bd = bandOf(ns); return [h.m(ns), `${bd.name}, ${h.pc(bd.rate)}`, h.m(a.psa), h.m2(a.tax), h.m2(b.tax)]; });
    const gross = (t: number) => (t >= Y1.higherRateLimit ? t : Y1.personalAllowance + t);
    const bands = sc.map((b, i) => [b.name, i === 0 ? `${h.m(Y1.personalAllowance + 1)} to ${h.m(gross(b.upTo!))}` : b.upTo === null ? `over ${h.m(gross(sc[i - 1].upTo!))}` : `to ${h.m(gross(b.upTo))}`, h.pc(b.rate)]);
    const hi42 = Y1.personalAllowance + sc[2].upTo! + 1;
    return `<h2>Two sets of rates on one income</h2>
<p>Scotland sets its own rates and bands for non-savings income. For ${h.Y1} they are listed on the ${h.src('gov_scotland', 'GOV.UK page on Income Tax in Scotland')}, and they apply on top of the UK Personal Allowance of ${h.m(Y1.personalAllowance)}.</p>
${h.table(['Scottish band', 'Income before tax', 'Rate'], bands, `Scottish rates on wages, pensions and other non-savings income, ${h.Y1}, with the standard Personal Allowance, which is withdrawn above £100,000 and gone at £125,140. From the parameter file of this site.`, ['l', 'l', 'r'])}
<p>None of these rates touches interest. ${h.src('leg_ita_11d', 'Section 11D of the Income Tax Act 2007')} provides that the savings income of a Scottish taxpayer is charged at the savings basic, higher and additional rates of the UK, with the UK basic and higher rate limits deciding which slice falls where. The interest still sits on top of the salary, so the salary uses up UK band space first, but the Scottish thresholds play no part.</p>
<h2>What it means at different incomes</h2>
${h.table(['Scottish income', 'Scottish band of the last £ of pay', 'Savings allowance', `Tax on ${h.m(1500)}, ${h.Y1}`, `Same, ${h.Y2}`], rows, `Tax on ${h.m(1500)} of interest for a Scottish taxpayer. Computed by this site's engine using UK savings rules.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The rows between ${h.m(hi42)} and ${h.m(Y1.personalAllowance + Y1.basicRateLimit)} are the ones that surprise people. Their pay is already taxed at 42 %, the Scottish higher rate, but their interest is taxed as if they were basic rate taxpayers: the full ${h.m(Y1.psa.basic)} allowance, then ${h.pc(Y1.savingsRates.basic)}. Once salary and interest together cross the UK line, the allowance halves and the interest above it meets the UK higher savings rate of ${h.pc(Y1.savingsRates.higher)}, which is lower than the 42 % Scottish rate on pay.</p>
<h2>The allowance test is British, too</h2>
<p>Section 12B, which fixes the Personal Savings Allowance at ${h.m(Y1.psa.basic)}, ${h.m(Y1.psa.higher)} or nil, uses the UK bands for Scottish taxpayers as well (${h.src('leg_ita_12b', 'Income Tax Act 2007, section 12B')}). A Scot is a higher rate taxpayer for this purpose only when income goes past the UK higher rate threshold, and an additional rate taxpayer only above ${h.m(Y1.higherRateLimit)} of taxable income. The ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')} shows how interest can tip someone over the line.</p>
<h2>2027/28 in Scotland</h2>
<p>The UK savings rates for ${h.Y2} are already law, so the tax on interest for that year can be worked out now for a Scottish saver in exactly the same way as for anyone else; the ${h.a('savings-tax-rates-2027', 'page on the 2027/28 rates')} sets out the increase. The Scottish rates on pay for ${h.Y2} will be set by the Scottish Parliament later and are not known. They only enter the tax caused by interest when income is above ${h.m(Y1.taperThreshold)}, where interest shrinks the Personal Allowance and the extra tax on pay is priced at Scottish rates; the ${h.a('savings-income-over-100k', 'page on income over £100,000')} covers that zone. For that case the tool shows the savings part and marks the rest as not yet known.</p>`;
  },
});
