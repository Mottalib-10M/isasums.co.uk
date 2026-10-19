import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'lifetime-isa-house-price-limit',
  group: 'lifetime',
  order: 42,
  mini: { kind: 'mini:lisa-cap' },
  related: ['lifetime-isa', 'lifetime-isa-withdrawal-penalty', 'lifetime-isa-retirement', 'home'],
  sources: ['gov_lisa_ftb_withdrawal', 'gov_lisa_conveyancer', 'gov_lisa_withdraw', 'gov_ftb_isa', 'gov_stats', 'gov_lisa'],
  slug: 'lifetime-isa-house-price-limit',
  nav: 'Lifetime ISA house price limit',
  card: 'The £450,000 cap, the 12 month wait, the conveyancer and the 90 day window, and what happens over the limit.',
  title: 'Lifetime ISA House Price Limit: £450,000 and the 12 Months',
  description: 'Lifetime ISA house price limit of £450,000 on the full price, the 12 month wait, the conveyancer and 90 day rules, and the 25 % charge if the home costs more.',
  h1: 'Lifetime ISA house price limit: the £450,000 cap and the other conditions',
  intro: 'A Lifetime ISA pays out for a first home only when every condition is met on the day of the withdrawal. This guide goes through them one by one, then shows what a buyer above the cap gives up.',
  resume: (h) => {
    const L = h.P.lisa;
    const c = h.I.lisaCharge(20000);
    return `A Lifetime ISA can be used without a charge to buy a first home only if the purchase price is ${h.m(L.priceCap)} or less. The cap is the same in every part of the UK and has stayed at ${h.m(L.priceCap)} since the account began in April 2017. It applies to the full price of the property, even when a buyer takes only a share under shared ownership. Four other conditions apply: at least ${L.monthsBeforePurchase} months must have passed since the first payment into the account, the buyer must be a first-time buyer, the purchase must use a mortgage, and the money must be paid by the ISA manager to a conveyancer or solicitor who is not the buyer. The home must be in the UK and become the buyer's main residence. Above the cap the withdrawal counts as unauthorised and bears the ${h.pc(L.withdrawalCharge)} charge: on a pot of ${h.m(20000)} that is ${h.m(c.charge)}, leaving ${h.m(c.received)}.`;
  },
  faqs: (h) => [
    { q: 'Does the £450,000 Lifetime ISA cap apply to my share or to the whole property?', a: `To the whole property. HMRC's technical guidance for conveyancers says the limit of ${h.m(h.P.lisa.priceCap)} applies to the full sale price rather than the initial share purchased. A buyer taking a 40 % share of a ${h.m(500000)} flat under shared ownership is therefore over the cap, even though the share itself costs ${h.m(200000)}.` },
    { q: 'When does the 12 month clock start for a Lifetime ISA home purchase?', a: `From the date of the first payment into the Lifetime ISA, not from when the account was opened or the bonus arrived. When the money is withdrawn for the purchase, at least ${h.P.lisa.monthsBeforePurchase} months must have passed since that first payment. Someone who opens an account and pays in this month cannot use it for a completion that falls before the same month next year.` },
    { q: 'Can I use a Lifetime ISA to buy a home with a family loan instead of a mortgage?', a: 'No. GOV.UK requires a purchase with a mortgage, a loan secured as a charge over the property, and excludes private loans from close family: parents, grandparents, children, grandchildren, siblings, a spouse or civil partner, and relatives of a spouse or civil partner. A cash purchase does not meet the conditions either.' },
    { q: 'What happens to a Lifetime ISA withdrawal if completion takes longer than 90 days?', a: 'The conveyancer can ask the Lifetime ISA manager for a 60 day extension, then a further 30 day extension, when the purchase is still expected to go ahead. If it does not proceed, the conveyancer returns the full amount directly to the manager and no charge arises. A charge is due only on any part that does not come back.' },
    { q: 'Is the First Time Buyer ISA price cap higher than £450,000?', a: `It has not been set. The government consultation ran from ${h.date(h.P.ftbIsa.consultationOpened)} to ${h.date(h.P.ftbIsa.consultationClosed)} and left the price cap, like the launch date, to a later decision. Any figure for the new account seen today is a guess, not a rule. Until something is legislated, the ${h.m(h.P.lisa.priceCap)} Lifetime ISA cap is the only one in force.` },
  ],
  body: (h) => {
    const L = h.P.lisa;
    const prices = [300000, 425000, 450000, 450001, 475000, 550000].map((p) => { const ok = h.I.lisaPriceOk(p); const c = h.I.lisaCharge(24000);
      return [h.m(p), ok ? 'Yes' : 'No', ok ? h.m(L.priceCap - p) : `${h.m(p - L.priceCap)} over`, ok ? h.m(24000) : h.m(c.received)]; });
    const shares = [0.25, 0.4, 0.5].map((s) => { const full = 480000; return [h.pc(s), h.m(full), h.m(full * s), h.I.lisaPriceOk(full) ? 'Within' : 'Over']; });
    const pots = [8000, 15407, 25000, 40000].map((p) => { const c = h.I.lisaCharge(p); return [h.m(p), h.m(c.charge), h.m(c.received), h.m(p / (1 + L.bonusRate) - c.received)]; });
    return `<h2>The conditions, in the order they are checked</h2>
<p>The Lifetime ISA manager does not release money for a home simply because the saver asks. The conveyancer acting on the purchase makes the request, and both the saver and the conveyancer sign declarations. GOV.UK sets out what those declarations confirm (${h.src('gov_lisa_withdraw', 'GOV.UK, withdrawing money from your Lifetime ISA')}):</p>
<ul>
<li><strong>Price.</strong> The purchase price is ${h.m(L.priceCap)} or less. One pound over is enough to fail.</li>
<li><strong>Timing.</strong> At least ${L.monthsBeforePurchase} months have passed since the first payment into the account.</li>
<li><strong>First home.</strong> The buyer confirms they are a first-time buyer, and the property becomes their main residence once the purchase completes.</li>
<li><strong>Location.</strong> The property is a residential property in the UK.</li>
<li><strong>Mortgage.</strong> The buyer takes a loan secured on the property; private loans from close relatives do not count.</li>
<li><strong>Conveyancer.</strong> The money goes straight to a conveyancer or solicitor, and the buyer cannot act as their own conveyancer.</li>
</ul>
<p>If any one of these is not met, the money can still come out, but it is treated like any other early withdrawal and loses a quarter of its value.</p>
<h2>Where a price sits against the cap</h2>
<p>The table takes a pot of ${h.m(24000)}, roughly five years of full payments with the bonus, and shows what reaches the buyer at different prices. The test is a strict comparison: ${h.m(L.priceCap)} exactly is within the limit.</p>
${h.table(['Purchase price', 'Within cap', 'Margin', 'Pot of £24,000 gives'], prices, 'Lifetime ISA pot of £24,000 used towards a first home, by purchase price. Worked out by the engine of this site.', ['r', 'l', 'r', 'r'])}
<p>The cut is abrupt. There is no taper: a buyer at ${h.m(450001)} loses ${h.m(h.I.lisaCharge(24000).charge)} on this pot, the same as a buyer at ${h.m(550000)}. Negotiating the price down to the cap or below is therefore worth exactly that sum to the buyer, on top of the saving on the price itself.</p>
<h2>Shared ownership and joint buyers</h2>
<p>HMRC's technical guidance for conveyancers states that the limit applies to the full sale price of the property, not to the share bought at the start. For shared ownership, the full price is worked out from the share and what it costs. The example below uses a home with a full market price of ${h.m(480000)}.</p>
${h.table(['Share bought', 'Full price', 'Price of the share', 'Against the cap'], shares, 'Shared ownership: the cap is tested on the full price, not the share.', ['r', 'r', 'r', 'l'])}
<p>A Lifetime ISA holder can also buy jointly with others. Each person using a Lifetime ISA must meet every condition on their own, including being a first-time buyer. GOV.UK puts it this way for couples: if the person you buy with also has a Lifetime ISA, you can both use your savings and bonuses, provided both of you are first-time buyers and meet all the conditions. The cap does not double for two buyers: it is still the price of the one property that is compared with ${h.m(L.priceCap)}.</p>
<h2>The 90 day window</h2>
<p>Once the conveyancer receives the money, the purchase is expected to complete within 90 days. If it slips, the conveyancer can ask for an extension of 60 days, then one more of 30 days, giving 180 days in all. When the purchase falls through, the conveyancer sends the full amount back to the Lifetime ISA manager and the account carries on as before, with no charge. A charge applies only if less comes back than went out, on the missing part. These rules are in the GOV.UK guidance for Lifetime ISA withdrawals for a first time residential purchase, written for conveyancers and managers.</p>
<h2>A worked timeline</h2>
<p>Take a saver who makes the first payment into a Lifetime ISA on 1 March 2026. The account cannot fund a home until 1 March 2027, twelve months later, however much is in it by then. Suppose the buyer finds a flat at ${h.m(410000)} in the spring of 2027. Their conveyancer checks the price against the cap, confirms that a mortgage is being taken, and asks the Lifetime ISA manager for the money, with the declarations signed by both. The manager pays the conveyancer directly, never the buyer.</p>
<p>From the day the conveyancer receives the funds, the purchase has 90 days to complete. If the seller delays, the conveyancer can ask for 60 more days, then 30 more. If the chain collapses, the conveyancer sends the money back to the manager in full, and the account is as it was, bonus included. If the buyer later finds another home that meets the conditions, the process starts again with a new request.</p>
<p>Two conditions are tested on precise figures. The first is the date: the twelve months are counted to the day the money is withdrawn, so a withdrawal requested in the eleventh month after the first payment fails, whatever stage the purchase has reached. The second is the price: it is the purchase price declared by the conveyancer that is compared with ${h.m(L.priceCap)}, so an agreed price that moves above the cap before completion takes the whole withdrawal outside the rules.</p>
<h2>What the declarations cover</h2>
<p>The saver's declaration confirms they are a first-time buyer and will live in the property as their main residence. The conveyancer's declaration confirms the purchase price, that the property is residential and in the UK, and that a loan secured on the property is part of the purchase. These are the facts the manager relies on to release the money without the charge.</p>
<h2>What the charge costs above the cap</h2>
<p>A buyer who goes ahead at a price over ${h.m(L.priceCap)} can still withdraw, but the ${h.pc(L.withdrawalCharge)} charge takes the bonus and part of their own savings. The last column shows how far the cash received falls below the money the buyer paid in, assuming no growth.</p>
${h.table(['Pot', 'Charge', 'Cash received', 'Below own payments'], pots, 'Unauthorised withdrawal of a Lifetime ISA pot, no growth. £15,407 is the average home withdrawal of 2025/26.', ['r', 'r', 'r', 'r'])}
<p>The alternative of keeping the account until age ${L.accessAge}, when it can be emptied without a charge, is described on the ${h.a('lifetime-isa-retirement', 'Lifetime ISA retirement page')}. The full arithmetic of the charge, including partial withdrawals, is on the ${h.a('lifetime-isa-withdrawal-penalty', 'withdrawal penalty page')}.</p>
<h2>A cap fixed in cash since 2017</h2>
<p>The ${h.m(L.priceCap)} limit was set when the account opened on 6 April 2017 and has not been raised since. It is a single figure for the whole country, so the room it leaves differs from one area to another as local prices differ. Because the cap is a cash amount, every rise in house prices brings more homes over it without any change in the law.</p>
<p>The use of the account remains large. HMRC counted ${h.num(L.houseWithdrawals2526)} withdrawals to buy a home in 2025/26, with an average of ${h.m(L.avgHouseWithdrawal2526)} each (${h.src('gov_stats', 'HMRC annual savings statistics, September 2026')}). An average of that size is about what four years of full payments and their bonus produce; it describes the size of the withdrawals, not the prices of the homes bought.</p>
<h2>The First Time Buyer ISA consultation</h2>
<p>From ${h.date(h.P.ftbIsa.consultationOpened)} to ${h.date(h.P.ftbIsa.consultationClosed)}, the government consulted on a First Time Buyer ISA that would replace the Lifetime ISA for new savers (${h.src('gov_ftb_isa', 'GOV.UK, First Time Buyer ISA consultation')}). The consultation did not fix a price cap for the new account and did not give a launch date. Nothing in it changes the rules of existing Lifetime ISAs today: accounts can still be opened, paid into and used for a home under the ${h.m(L.priceCap)} limit. This site will add the new figures only once they are set in law.</p>
<p>For the bonus, the ages and the size of the pot over time, see the ${h.a('lifetime-isa', 'Lifetime ISA page')} and the ${h.src('gov_lisa', 'GOV.UK Lifetime ISA guide')}.</p>`;
  },
});
