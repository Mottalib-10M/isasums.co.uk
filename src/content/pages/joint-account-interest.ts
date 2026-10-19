import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'joint-account-interest',
  group: 'tax',
  order: 16,
  tool: { kind: 'mini:joint' },
  related: ['personal-savings-allowance', 'tax-on-savings-interest', 'savings-tax-pensioners', 'savings-interest-tax-code'],
  sources: ['hmrc_tsem9814', 'gov_form17', 'leg_ita_12b', 'gov_savings_free', 'gov_savings_pay'],
  slug: 'joint-account-interest',
  nav: 'Joint account interest',
  card: 'How interest on a joint account is split between holders, and how each half meets its own allowances.',
  title: 'Joint Account Interest Tax: the 50/50 Split and Form 17',
  description: 'Joint account interest tax for couples: an equal split by default, Form 17 only for real unequal ownership, and each holder’s own £1,000 or £500 allowance.',
  h1: 'Interest on a joint account: who is taxed on what',
  intro: 'Enter each holder’s income before tax and the interest the joint account pays in a year. The tool splits the interest in half and works out each person’s tax at the 2027/28 rates.',
  resume: (h) => {
    const a = h.tax(h.Y1, 62000, 1500), b = h.tax(h.Y1, 18000, 1500);
    return `Interest on a joint account is not taxed as one sum. Each holder is taxed on their own share and sets it against their own Personal Allowance, starting rate and Personal Savings Allowance. For a married couple or civil partners living together, HMRC’s Trusts, Settlements and Estates Manual (TSEM9814) states that income from jointly held property is treated as belonging to them in equal shares, so each is taxed on half, even if they own the money in unequal shares. The 50/50 rule can be set aside only by a Form 17 declaration under section 837 of the Income Tax Act 2007, which must match a real unequal ownership and reach HMRC within 60 days of being signed. Other joint holders, such as siblings, are taxed on what they are actually entitled to. With ${h.m(3000)} of interest split between partners earning ${h.m(62000)} and ${h.m(18000)}, the higher rate partner pays ${h.m2(a.tax)} on their half in ${h.Y1} and the other ${h.m2(b.tax)}.`;
  },
  faqs: (h) => [
    { q: 'Can a married couple choose to have joint account interest taxed on one partner only?', a: `Not freely. HMRC’s manual says married couples and civil partners have no general option to have income taxed in any way they like. A different split is allowed only where they really own the money in unequal shares and declare it on Form 17, with the income share matching the ownership share. A declaration cannot be made where they are beneficial joint tenants of the whole.` },
    { q: 'How is interest split on a joint account held with a parent or sibling?', a: `The 50/50 rule applies only to spouses and civil partners living together. Other joint holders cannot make a Form 17 declaration; each is taxed on the share of the interest they are actually entitled to. Where two siblings each put in half, each is taxed on half. Where the money came from one of them, the facts of ownership decide.` },
    { q: 'When does a Form 17 declaration start to apply to joint interest?', a: `From the date it is signed by the second partner, provided HMRC receives it within 60 days of that date. HMRC’s manual says the 60-day limit is enforced strictly and cannot be extended; a late form has no effect at all. Only income arising after the declaration date is covered, so interest already paid stays split equally.` },
    { q: 'Does each joint holder get their own Personal Savings Allowance on the interest?', a: `Yes. Each holder’s share is added to their own income and meets their own allowances. A basic rate taxpayer can set up to ${h.m(h.y(h.Y1).psa.basic)} of interest against the allowance and a higher rate taxpayer ${h.m(h.y(h.Y1).psa.higher)}, whichever account the interest comes from. Interest from sole accounts uses the same allowance.` },
  ],
  body: (h) => {
    const couples: Array<[number, number]> = [[30000, 30000], [62000, 18000], [55000, 9000], [140000, 40000]];
    const rows = couples.map(([x, y]) => { const a = h.tax(h.Y1, x, 1500), b = h.tax(h.Y1, y, 1500); const a2 = h.tax(h.Y2, x, 1500), b2 = h.tax(h.Y2, y, 1500); return [`${h.m(x)} and ${h.m(y)}`, h.m2(a.tax), h.m2(b.tax), h.m2(a.tax + b.tax), h.m2(a2.tax + b2.tax)]; });
    const Y1 = h.y(h.Y1);
    return `<h2>Why the split matters</h2>
<p>The allowances belong to people, not to accounts. A couple with ${h.m(3000)} of interest from a joint account has two sets of allowances to absorb it, but each set only sees half of the interest. When both partners pay tax in the same band the split changes little. When their incomes differ widely, half the interest can be tax free in one person’s hands and taxed at the higher rate in the other’s. The Personal Savings Allowance depends on each holder’s own band under ${h.src('leg_ita_12b', 'section 12B of the Income Tax Act 2007')}, and the other layers are set out on the ${h.src('gov_savings_free', 'GOV.UK page on tax-free interest')}.</p>
${h.table(['Holders’ other income', `First holder, ${h.Y1}`, `Second holder, ${h.Y1}`, `Couple, ${h.Y1}`, `Couple, ${h.Y2}`], rows, `Tax on ${h.m(3000)} of joint account interest split 50/50, with no other taxable interest. Computed by this site's engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two partners on ${h.m(30000)} each receive ${h.m(1500)}, which is ${h.m(500)} above the ${h.m(Y1.psa.basic)} allowance, so a little tax is due on both sides. Where one partner earns ${h.m(9000)}, their half fits inside unused Personal Allowance. In the last row the first holder is an additional rate taxpayer with no allowance at all, so their half is taxed in full.</p>
<h2>The 50/50 rule for spouses and civil partners</h2>
<p>For a married couple or civil partners who live together, the law presumes equal ownership of income from jointly held property. ${h.src('hmrc_tsem9814', 'HMRC’s manual (TSEM9814)')} says the couple are taxable on that income 50/50 even if they own the property in unequal shares. ${h.src('gov_form17', 'GOV.UK’s Form 17 page')} puts it simply: couples will normally be taxed on an even split of the income between them.</p>
<p>A Form 17 declaration is the only way out of the equal split, and it has conditions. Each partner must actually be entitled to a share other than half, and the income share must match the ownership share (TSEM9850). It cannot be used where the couple own the account as beneficial joint tenants, that is, jointly entitled to the whole rather than holding separate shares; whether a given account is held that way depends on the facts. The form must reach HMRC within 60 days of the date the second partner signs it, a limit HMRC says it has no power to extend, and it applies only to income arising after that date (TSEM9860 and TSEM9862).</p>
<h2>Other joint holders</h2>
<p>The equal-split presumption is specific to couples living together. Couples who have separated, siblings, parents and adult children, and friends sharing an account are each taxed on the interest they are actually entitled to, and cannot make a declaration (TSEM9844).</p>
<h2>Collection</h2>
<p>Each holder’s share of the interest is taxed through that holder’s own tax position: their tax code, a Simple Assessment letter or their tax return, as GOV.UK describes on its ${h.src('gov_savings_pay', 'page on paying tax on savings interest')}. The routes and timing are on the ${h.a('savings-interest-tax-code', 'tax code page')}, and the band test that halves the allowance is on the ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')}. GOV.UK states that you cannot hold an ISA with someone else, so in a couple each partner has a separate ${h.m(h.y(h.Y1).isa.overall)} ISA allowance.</p>`;
  },
});
