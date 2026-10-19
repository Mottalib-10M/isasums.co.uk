import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'reclaim-tax-on-savings',
  group: 'tax',
  order: 20,
  mini: { kind: 'mini:refund' },
  related: ['savings-interest-tax-code', 'starting-rate-for-savings', 'personal-savings-allowance', 'savings-tax-pensioners'],
  sources: ['gov_savings_refund', 'gov_savings_pay', 'gov_savings_free', 'gov_check_tool'],
  slug: 'reclaim-tax-on-savings',
  nav: 'Reclaim tax on savings',
  card: 'Tax on interest collected twice or on a wrong estimate: how it is put right this year and for past years.',
  title: 'Reclaim Tax on Savings Interest: Refunds and 4-Year Limit',
  description: 'Reclaim tax on savings interest: correct a tax code estimate this year, or claim past years within 4 years via Self Assessment, HMRC or form R40, with sums.',
  h1: 'Reclaiming tax on savings interest',
  intro: 'Overpaid tax on interest usually comes from an estimate, not from the bank. This guide sets out how the overpayment arises, how the current year is corrected and how earlier years are claimed back.',
  resume: (h) => {
    const t = h.tax(h.Y1, 11000, 2500);
    return `Since April 2016 banks pay interest without deducting tax, so an overpayment of tax on savings now comes mostly from HMRC’s own estimate: the tax code can include a figure for this year’s interest, based on what your accounts paid before, and it can be too high if balances have moved into ISAs, rates have fallen or income has dropped. For the current year GOV.UK points to the Personal Tax Account to compare the estimate with your bank statements, and to HMRC to correct it; once the code is put right, any excess can be repaid through your pay or pension. For earlier years the claim must be made within 4 years of the end of the tax year concerned, through a Self Assessment return if you send one, by contacting HMRC, or on form R40. A worked case: with ${h.m(11000)} of other income and ${h.m(2500)} of interest, the correct tax on the interest for ${h.Y1} is ${h.m2(t.tax)}, because unused Personal Allowance and the starting rate cover all of it, so anything collected on it is refundable.`;
  },
  faqs: (h) => [
    { q: 'How far back can I reclaim tax overpaid on savings interest?', a: `GOV.UK says the claim must be made within 4 years of the end of the tax year you want a refund for. The tax year ends on 5 April, so the window for ${h.Y1}, which ends on 5 April 2027, closes on 5 April 2031. Years older than four tax years can no longer be claimed by this route.` },
    { q: 'Who uses form R40 to reclaim tax on savings interest?', a: `GOV.UK lists form R40 as one way to claim back tax paid on savings interest for an earlier year. People who send a Self Assessment return make the claim through the return instead, within the same four-year limit. A claim can also be made by contacting HMRC, which may ask for evidence where a bank has already reported the interest.` },
    { q: 'Can a too-high savings estimate in my tax code be fixed during the year?', a: `Yes. The estimate is shown in your Personal Tax Account. If your statements show less interest than HMRC expects, you can ask HMRC to correct it, and a new code goes to your employer or pension provider. GOV.UK says that tax already overpaid in the year can then be refunded through your pay or pension.` },
    { q: 'Does unused starting rate for savings lead to a refund?', a: `Only where tax was actually collected on interest that the starting rate should have covered. That can happen when income falls during a year, for example on retirement, while the tax code still assumes a full salary. The year can then be worked out again with the starting rate, and the tax taken on interest inside it can be put right in the year or claimed back within the four-year limit.` },
  ],
  body: (h) => {
    const Y1 = h.y(h.Y1);
    const incomes = [9000, 11000, 14000, 16000, 20000, 40000];
    const rows = incomes.map((ns) => { const right = h.tax(h.Y1, ns, 2500).tax, est = h.tax(h.Y1, ns, 4000).tax; return [h.m(ns), h.m2(right), h.m2(est), h.m2(Math.max(0, est - right))]; });
    const years = ['2022/23', '2023/24', '2024/25', '2025/26', '2026/27'];
    const deadlines = years.map((y) => { const end = Number(y.slice(0, 4)) + 1; return [y, `5 April ${end}`, `5 April ${end + 4}`]; });
    return `<h2>Where overpayments come from today</h2>
<p>Under the system in place since April 2016, no tax is taken off interest at the bank. Every pound collected on savings is collected by HMRC, so an overpayment means that HMRC’s figures and the saver’s real figures differ. The most common sources are:</p>
<ul>
<li><strong>An estimate that runs ahead of reality.</strong> The tax code can include an estimate of this year’s interest, often built from last year’s. If money has since moved into a cash ISA, been spent, or earns a lower rate, the code collects tax on interest that is never paid.</li>
<li><strong>A fall in other income.</strong> When pay stops or drops part way through a year, unused Personal Allowance and the ${h.a('starting-rate-for-savings', 'starting rate for savings')} can cover interest that the code treated as taxable.</li>
<li><strong>A wrong split or a wrong record.</strong> Interest on a joint account belongs half to each spouse or civil partner by default, and interest earned inside an ISA is not taxable at all. A record that puts all the joint interest on one person, or counts ISA interest, overstates the bill.</li>
<li><strong>A change of band.</strong> An estimate that assumes a higher rate taxpayer’s ${h.m(Y1.psa.higher)} allowance when the year ends at the basic rate, with a ${h.m(Y1.psa.basic)} allowance, takes too much.</li>
</ul>
<h2>Sizing the overpayment</h2>
<p>The table compares the correct tax on ${h.m(2500)} of interest with the tax collected if the code had assumed ${h.m(4000)}. It shows how much the size of an overpayment depends on the rest of the saver’s income: at low incomes both figures are nil because the allowances cover even the larger sum, while for a full-time employee every pound of over-estimate is taxed.</p>
${h.table(['Other income', `Correct tax on ${h.m(2500)}`, `Tax if ${h.m(4000)} assumed`, 'Overpaid'], rows, `Tax on interest in ${h.Y1} on actual and on over-estimated interest, by other income before tax. Computed by this site's engine.`, ['l', 'r', 'r', 'r'])}
<p>The calculator above does the same sum for your own figures: enter your other income, the interest you actually earned and the tax already paid or collected on it, and it shows the difference.</p>
<h2>A worked example</h2>
<p>Take an employee on ${h.m(30000)} whose accounts paid ${h.m(3000)} of interest last year. HMRC builds the same figure into this year’s code, so the code is set to collect ${h.m2(h.tax(h.Y1, 30000, 3000).tax)} on savings: the ${h.m(Y1.psa.basic)} allowance covers the first slice and the rest is taxed at ${h.pc(Y1.savingsRates.basic)}. In May, though, most of the money moved into a cash ISA, and the taxable accounts end up paying only ${h.m(1200)} over the year. The correct tax is then ${h.m2(h.tax(h.Y1, 30000, 1200).tax)}, so ${h.m2(h.tax(h.Y1, 30000, 3000).tax - h.tax(h.Y1, 30000, 1200).tax)} is collected that was never owed. Nothing went wrong at the bank and the saver made no mistake; the estimate simply described a year that did not happen. The fix is the correction described below, made as soon as the change in balances is known.</p>
<h2>Putting the current year right</h2>
<p>For the tax year in progress, the GOV.UK page on ${h.src('gov_savings_refund', 'paying too much tax on savings')} sets out a short sequence. Check the savings interest estimate in your tax code through your Personal Tax Account. Compare it with your bank and building society statements. If it is wrong, contact HMRC to correct it. HMRC then issues a new code, and where too much tax has already been taken in the year, the employer or pension provider can refund the difference through your pay or pension.</p>
<p>The same correction also stops further over-collection for the rest of the year. Because codes run month by month, a correction made early in the tax year has more effect than one made in March, when most of the tax has already been taken. The way codes are used to collect tax on interest is described on the ${h.a('savings-interest-tax-code', 'tax code page')} and on GOV.UK’s ${h.src('gov_savings_pay', 'page on how you pay tax on savings interest')}.</p>
<h2>Claiming for earlier years</h2>
<p>For a tax year that has ended, the claim has to be made within 4 years of the end of that year. GOV.UK lists three ways to do it:</p>
<ul>
<li>through your Self Assessment tax return, if you send one;</li>
<li>by contacting HMRC, which may ask for evidence where your bank or building society has already reported your interest for that year;</li>
<li>on form R40, the claim form linked from the GOV.UK page.</li>
</ul>
<p>GOV.UK frames the previous-year claim around savers whose total income was below their Personal Allowance, which is the situation where no tax at all was due on interest. Where an estimate in a code took more than the year’s real interest justified, the comparison with your statements is the same, and the time limit runs from 5 April at the end of each year:</p>
${h.table(['Tax year', 'Year ends', 'Last day to claim'], deadlines, 'Four-year time limit for claiming back tax on savings interest, by tax year.', ['l', 'l', 'l'])}
<h2>What to have to hand</h2>
<p>A claim is easier to check when the interest figures are clear. Statements from each bank and building society show the interest paid, and the dates show which tax year each payment belongs to. With those figures, the correct tax can be worked out layer by layer: Personal Allowance left over, then the starting rate of up to ${h.m(Y1.startingRateLimit)}, then the ${h.m(Y1.psa.basic)} or ${h.m(Y1.psa.higher)} allowance, as set out on the ${h.src('gov_savings_free', 'GOV.UK page on tax-free interest')}. The ${h.a('personal-savings-allowance', 'Personal Savings Allowance page')} explains which allowance applies.</p>
<p>HMRC’s own estimator, ${h.src('gov_check_tool', 'check how much tax you pay on dividends and interest from savings')}, covers ${h.Y1} and gives an official view of the tax for that year. It is not designed for people who file Self Assessment, and it does not cover earlier years or ${h.Y2}.</p>
<h2>Retired savers and people with low income</h2>
<p>Retired savers and people on low incomes are the group most likely to have had tax collected on interest that was in fact covered by their allowances. A pensioner with only the State Pension has the whole starting rate and the whole Personal Savings Allowance to use, and the ${h.a('savings-tax-pensioners', 'page for pensioners')} shows how much interest that covers. A worker whose hours were cut, or who stopped work in the middle of a year, may have had a code that still assumed a full salary. In both cases the starting point is the same: compare the interest actually received with what HMRC used, then follow the route above that fits the year.</p>
<h2>After 6 April 2027</h2>
<p>From ${h.Y2} the savings rates rise to ${h.pc(h.y(h.Y2).savingsRates.basic)}, ${h.pc(h.y(h.Y2).savingsRates.higher)} and ${h.pc(h.y(h.Y2).savingsRates.additional)}. The rules on refunds do not change, but each pound of over-estimated interest that is taxed costs two pence more, so the same error in a code produces a slightly larger overpayment. The allowances, and therefore the amount of interest that should never have been taxed at all, stay where they are.</p>`;
  },
});
