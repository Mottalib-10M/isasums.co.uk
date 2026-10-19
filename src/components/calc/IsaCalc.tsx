/**
 * The main tool: the same balance at the same rate in a taxable account and in an ISA, for 2026/27 and
 * 2027/28, for your own income. Every figure comes from lib/engine/savings.ts (tested).
 * Hydration (RECETTE §17.5): first render = props defaults; link parameters applied in an effect, and
 * the address only changes after a real input (url-state.ts).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { compare, ACCOUNT_LABEL, type Account, type Nation, type CompareYear } from '../../lib/engine/savings';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { income?: number; balance?: number; rate?: number; account?: Account; otherInterest?: number; nation?: Nation; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const m2 = (n: number) => formatMoney(n, 2);
const ACC = (['cash-isa', 'investment-isa-cash'] as Account[]).map((a) => ({ value: a, label: ACCOUNT_LABEL[a] }));
const NAT = [{ value: 'ruk', label: 'England, Wales or N. Ireland' }, { value: 'scotland', label: 'Scotland' }];

function Col({ y, account }: { y: CompareYear; account: Account }) {
  const t = y.taxable; const R = P.years[y.year].savingsRates;
  return (
    <>
      <tr><td className="pr-2 text-navy-700">Interest at 0 % (allowances)</td><td className="tabular-nums text-right">{m(t.free)}</td></tr>
      {t.atBasic > 0 && <tr><td className="pr-2 text-navy-700">Taxed at {formatPercent(R.basic, 0)}</td><td className="tabular-nums text-right">{m(t.atBasic)}</td></tr>}
      {t.atHigher > 0 && <tr><td className="pr-2 text-navy-700">Taxed at {formatPercent(R.higher, 0)}</td><td className="tabular-nums text-right">{m(t.atHigher)}</td></tr>}
      {t.atAdditional > 0 && <tr><td className="pr-2 text-navy-700">Taxed at {formatPercent(R.additional, 0)}</td><td className="tabular-nums text-right">{m(t.atAdditional)}</td></tr>}
      {(t.knockOn ?? 0) > 0 && <tr><td className="pr-2 text-navy-700">Tax on other income (allowance lost)</td><td className="tabular-nums text-right">{m2(t.knockOn!)}</td></tr>}
      <tr><td className="pr-2 text-navy-700">Tax in a taxable account</td><td className="tabular-nums text-right">{m2(t.tax)}</td></tr>
      <tr><td className="pr-2 text-navy-700">Tax in the {account === 'cash-isa' ? 'cash ISA' : 'investment ISA'}</td><td className="tabular-nums text-right">{m2(y.accountTax)}</td></tr>
    </>
  );
}

export default function IsaCalc({ income: i0 = 45000, balance: b0 = 30000, rate: r0 = 4, account: a0 = 'cash-isa', otherInterest: o0 = 0, nation: n0 = 'ruk', methodHref, idPrefix = 'isa' }: Props) {
  const [income, setIncome] = useState(i0);
  const [balance, setBalance] = useState(b0);
  const [rate, setRate] = useState(r0);
  const [account, setAccount] = useState<Account>(a0);
  const [other, setOther] = useState(o0);
  const [nation, setNation] = useState<Nation>(n0);
  const [ext, setExt] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setIncome(num(u, 'inc', i0)); setBalance(num(u, 'bal', b0)); setRate(num(u, 'r', r0)); setOther(num(u, 'oth', o0)); setExt(num(u, 'ext', 0));
    const a = str(u, 'acc', a0); if (a === 'cash-isa' || a === 'investment-isa-cash') setAccount(a);
    setNation(str(u, 'n', n0) === 'scotland' ? 'scotland' : 'ruk');
  }, []);
  useEffect(() => { updateURL({ inc: income, bal: balance, r: rate, acc: account === 'cash-isa' ? undefined : account, oth: other || undefined, n: nation === 'ruk' ? undefined : nation, ext: ext || undefined }); }, [income, balance, rate, account, other, nation, ext]);

  const res = useMemo(() => compare({ nonSavings: income, balance, rate: rate / 100, otherInterest: other, extension: ext, nation, account }), [income, balance, rate, other, ext, nation, account]);
  const [a, b] = res;
  const share = () => { try { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard refused */ } };
  const id = (x: string) => `${idPrefix}-${x}`;
  const cap = P.years['2027/28'].isa.cashUnder65;
  const notes: string[] = [];
  if (account === 'cash-isa' && balance > cap) notes.push(`From 6 April 2027 you can pay at most ${m(cap)} a year into cash ISAs if you are 64 or under on 5 April 2028; money already inside stays tax free.`);
  if (account === 'investment-isa-cash') notes.push(`From 6 April 2027 interest on cash held in a stocks and shares ISA bears a flat ${formatPercent(P.years['2027/28'].cashInvestmentIsaCharge, 0)} charge, paid by the ISA manager.`);
  if (b.taxable.knockOn === null) notes.push('Your interest also reduces your Personal Allowance. The cost of that on your wages depends on the Scottish rates for 2027/28, not yet set: the 2027/28 figure shows the tax on the interest only.');
  else if (b.taxable.ratesAssumed) notes.push('The extra tax on your other income from the tapered allowance uses this year’s 20/40/45 % main rates: the 2027/28 main rates are set by the next Finance Act.');

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('inc')} label="Your income before tax" value={income} onChange={setIncome} unit="£" max={10_000_000} help="Wages, pension, profits, rent: not interest" />
            <NumberField id={id('bal')} label="Savings balance" value={balance} onChange={setBalance} unit="£" max={50_000_000} help="The money you could keep in an ISA" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('rate')} label="Interest rate (AER)" value={rate} onChange={setRate} unit="%" max={25} decimals={2} help="Same rate in both accounts" />
            <SelectField id={id('acc')} label="ISA to compare with" value={account} onChange={(v) => setAccount(v as Account)} options={ACC} />
          </div>
          <details className="group border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-accent-700">More: other interest, Scotland, Gift Aid and pension</summary>
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('oth')} label="Other taxable interest a year" value={other} onChange={setOther} unit="£" max={10_000_000} help="From accounts you keep outside ISAs" />
                <SelectField id={id('nat')} label="Where you pay income tax" value={nation} onChange={(v) => setNation(v as Nation)} options={NAT} />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('ext')} label="Gift Aid and pension, gross" value={ext} onChange={setExt} unit="£" max={1_000_000} help="Relief-at-source contributions only" />
              </div>
            </div>
          </details>
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">{account === 'cash-isa' ? 'A cash ISA saves you, from April 2027' : 'Keeping it in the ISA saves you, from April 2027'}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(b.isaGain)}<span className="ml-1 text-base font-medium text-navy-700">a year</span></p>
          <p className="mt-1 text-sm text-navy-800">{m(a.isaGain)} in 2026/27 · interest {m(a.interest)} a year</p>
          <table className="ledger mt-3 w-full text-sm">
            <thead><tr><th className="text-left"> </th><th className="text-right">{a.year} / {b.year}</th></tr></thead>
            <tbody>
              <tr><td className="pr-2 text-navy-700">Your allowance on savings</td><td className="tabular-nums text-right">{m(a.taxable.psa)} / {m(b.taxable.psa)}</td></tr>
              <tr><td className="pr-2 text-navy-700">Interest at 0 % (allowances)</td><td className="tabular-nums text-right">{m(a.taxable.free)} / {m(b.taxable.free)}</td></tr>
              <tr><td className="pr-2 text-navy-700">Tax in a taxable account</td><td className="tabular-nums text-right">{m2(a.taxable.tax)} / {m2(b.taxable.tax)}</td></tr>
              <tr><td className="pr-2 text-navy-700">Tax in the {account === 'cash-isa' ? 'cash ISA' : 'investment ISA'}</td><td className="tabular-nums text-right">{m2(a.accountTax)} / {m2(b.accountTax)}</td></tr>
              <tr className="total"><td>Interest you keep, taxable account</td><td className="tabular-nums text-right">{m(a.taxable.net)} / {m(b.taxable.net)}</td></tr>
            </tbody>
          </table>
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer text-xs font-medium text-accent-700">Line by line, 2027/28</summary>
            <table className="ledger mt-2 w-full text-sm"><tbody><Col y={b} account={account} /></tbody></table>
          </details>
          {notes.map((n) => <p key={n} className="mt-2 text-xs text-navy-700">{n}</p>)}
        </div>
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">Tax on {m(a.interest)} of interest: <strong className="tabular-nums">{m(a.taxable.tax)}</strong> now, <strong className="tabular-nums">{m(b.taxable.tax)}</strong> from April 2027 · in a cash ISA: £0</div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button type="button" onClick={share} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy a link to this result'}</button>
        <button type="button" onClick={() => window.print()} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        <a href={methodHref} className="text-accent-700 underline underline-offset-2">How this is calculated</a>
        <span className="text-xs text-navy-600">Rates from the Finance Act 2026. Dividends and foreign interest are not included.</span>
      </div>
    </div>
  );
}
