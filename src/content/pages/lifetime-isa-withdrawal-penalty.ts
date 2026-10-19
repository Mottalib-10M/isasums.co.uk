import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'lifetime-isa-withdrawal-penalty',
  group: 'lifetime',
  order: 41,
  tool: { kind: 'mini:lisa-penalty' },
  related: ['lifetime-isa', 'lifetime-isa-house-price-limit', 'lifetime-isa-retirement', 'flexible-isa'],
  sources: ['gov_lisa_withdraw', 'gov_lisa'],
  slug: 'lifetime-isa-withdrawal-penalty',
  nav: 'Lifetime ISA withdrawal charge',
  card: 'Why the 25 % charge costs more than the bonus, and how much to take out to get the cash you need.',
  title: 'Lifetime ISA Withdrawal Penalty: the 25 % Charge Worked Out',
  description: 'Lifetime ISA withdrawal penalty: the 25 % charge takes the bonus and 6.25 % of your own money. See what you get back and what to withdraw for the cash you need.',
  h1: 'Lifetime ISA withdrawal penalty: what the 25 % charge takes',
  intro: 'Enter what you paid in yourself and the cash you need. The tool applies the charge to the whole amount withdrawn, bonus included, and grosses up the withdrawal so the sum left in hand is the one you asked for.',
  resume: (h) => {
    const L = h.P.lisa;
    const c = h.I.lisaCharge(1000);
    return `Money taken out of a Lifetime ISA before age ${L.accessAge}, for anything other than a qualifying first home or terminal illness with less than 12 months to live, bears a withdrawal charge of ${h.pc(L.withdrawalCharge)} of the amount withdrawn. The charge applies to the bonus and to any growth as well as to your own payments, so it removes more than the government added. GOV.UK gives the case of ${h.m(800)} of savings that earns a ${h.m(200)} bonus: the pot of ${h.m(1000)} loses ${h.m(c.charge)} and ${h.m(c.received)} comes back, ${h.m(50)} less than was paid in. That is a loss of ${h.pc(c.ownMoneyLoss, 2)} of your own money before growth. For a partial withdrawal the charge is taken from the amount you ask for, so to receive ${h.m(120)} you withdraw ${h.m(h.I.lisaGrossFor(120))}. Transferring the account to another type of ISA before ${L.accessAge} is charged in the same way.`;
  },
  faqs: (h) => [
    { q: 'Why does the Lifetime ISA charge take back more than the bonus?', a: `The bonus is ${h.pc(h.P.lisa.bonusRate)} of what you pay in, while the charge is ${h.pc(h.P.lisa.withdrawalCharge)} of a larger figure: your payments plus the bonus. On ${h.m(100)} of your money the pot holds ${h.m(125)}, and a quarter of ${h.m(125)} is ${h.m2(31.25)}. You get ${h.m2(93.75)} back, so ${h.m2(6.25)} of every ${h.m(100)} you paid in is lost.` },
    { q: 'Is there a charge if my Lifetime ISA house purchase falls through?', a: 'Not when the money returns in full. Under the GOV.UK rules for conveyancers, if the purchase does not go ahead within 90 days of the conveyancer receiving the funds, the conveyancer sends the whole amount back to the Lifetime ISA manager. A charge applies only to any shortfall between what was withdrawn and what is returned.' },
    { q: 'Can growth in a Lifetime ISA make up for the withdrawal charge?', a: `It can. The charge takes ${h.pc(h.I.lisaCharge(1).ownMoneyLoss, 2)} of your own money only when the pot has not grown. Once growth lifts the pot by about 6.7 % above payments plus bonus, three quarters of it equals what you put in. Losses in a stocks and shares Lifetime ISA work the other way and deepen the cut.` },
    { q: 'Does the Lifetime ISA charge apply after the holder dies?', a: 'No. GOV.UK states there is no charge to withdraw the funds or assets after the account holder dies; the account ends on the date of death and the money passes as part of the estate. The same freedom applies at age 60 and over, and for someone who is terminally ill with less than 12 months to live.' },
  ],
  body: (h) => {
    const L = h.P.lisa;
    const own = [1000, 4000, 8000, 12000, 20000];
    const rows = own.map((o) => { const pot = o * (1 + L.bonusRate); const c = h.I.lisaCharge(pot);
      return [h.m(o), h.m(pot), h.m(c.charge), h.m(c.received), h.m(o - c.received)]; });
    const need = [120, 1000, 2500, 5000, 10000].map((n) => { const g = h.I.lisaGrossFor(n); return [h.m(n), h.m2(g), h.m2(g - n)]; });
    const grow = [0, 0.02, 0.04].map((g) => { const r = h.I.lisaProjection(30, L.annual, 3, g); const c = h.I.lisaCharge(r.value);
      return [h.pc(g), h.m(r.paid), h.m(r.value), h.m(c.received), h.m(c.received - r.paid)]; });
    return `<h2>The charge on a full withdrawal</h2>
<p>When everything is taken out, the ${h.pc(L.withdrawalCharge)} applies to the total in the account, including the government bonus (${h.src('gov_lisa_withdraw', 'GOV.UK, withdrawing money from your Lifetime ISA')}). Without growth, the outcome is always the same share of your own money, whatever the size of the pot.</p>
${h.table(['Your payments', 'Pot with bonus', 'Charge', 'You receive', 'Below your payments'], rows, 'Full withdrawal for an unauthorised reason, no growth. Worked out by the engine of this site.', ['r', 'r', 'r', 'r', 'r'])}
<p>The last column grows in step with the pot: ${h.m(12000)} of savings, three years of full payments, leaves the saver ${h.m(12000 - h.I.lisaCharge(15000).received)} short. That shortfall is the real price of leaving, on top of the bonus that disappears.</p>
<h2>Getting a set amount in hand</h2>
<p>A partial withdrawal is charged on the sum taken out, so the account must release more than the cash you need. Dividing the target by 0.75 gives the gross withdrawal. GOV.UK uses ${h.m(160)} to raise ${h.m(120)}; the same arithmetic gives these figures.</p>
${h.table(['Cash needed', 'Withdraw', 'Charge'], need, 'Gross withdrawal needed for a net amount, 25 % charge.', ['r', 'r', 'r'])}
<p>Take a saver who has paid in ${h.m(12000)} over three years and holds ${h.m(15000)} with the bonus. To have ${h.m(5000)} in hand, the account has to release ${h.m(h.I.lisaGrossFor(5000))}, of which ${h.m(h.I.lisaGrossFor(5000) - 5000)} goes in the charge. The other ${h.m(15000 - h.I.lisaGrossFor(5000))} stays in the Lifetime ISA, still carrying its bonus and still free of the charge if it is later used for a qualifying home or kept until ${L.accessAge}. A partial withdrawal therefore limits the loss to the money actually taken, which the calculator above shows line by line.</p>
<h2>Growth changes the result</h2>
<p>Interest or investment growth is also inside the pot, so it is charged too, but it can offset the loss. The table follows three years of ${h.m(L.annual)} payments from age 30 and a full withdrawal at the end.</p>
${h.table(['Growth a year', 'Own payments', 'Pot', 'You receive', 'Gain or loss'], grow, 'Three years of £4,000, then a full unauthorised withdrawal. Growth rates are assumptions.', ['r', 'r', 'r', 'r', 'r'])}
<p>With no growth or with losses, the saver always ends up behind; with steady growth over several years, the charge can leave them roughly level with what they paid in, but the bonus is gone either way. That contrast is what separates a Lifetime ISA from an ordinary cash ISA, which can be emptied at any time without a charge. In a Lifetime ISA the money is free of the charge only for a first home, from age 60 or in terminal illness.</p>
<h2>When no charge applies</h2>
<p>Three situations release the money freely: buying a first home for ${h.m(L.priceCap)} or less, at least ${L.monthsBeforePurchase} months after the first payment, through a conveyancer and with a mortgage; reaching ${L.accessAge}; and terminal illness with less than 12 months to live. The home conditions are set out on the ${h.a('lifetime-isa-house-price-limit', 'house price limit page')}. Moving the account to a cash or stocks and shares ISA before ${L.accessAge} counts as a withdrawal, and so does a transfer to a Help to Buy ISA. The ${h.a('lifetime-isa', 'main Lifetime ISA page')} shows what the pot reaches if it stays put, and the ${h.src('gov_lisa', 'GOV.UK Lifetime ISA guide')} lists the conditions of the account.</p>`;
  },
});
