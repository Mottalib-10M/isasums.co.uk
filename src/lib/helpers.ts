/** Writing helpers handed to every page: links, numbers from the engine, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as S from './engine/savings';
import * as I from './engine/isa';
import * as PB from './engine/premium';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(strict = false) {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const m2 = (n: number) => formatMoney(n, 2);
  const pc = (x: number, d?: number) => { const v = Math.round(x * 10000) / 100; return formatPercent(x, d ?? (Number.isInteger(v) ? 0 : Number.isInteger(+(v * 10).toFixed(6)) ? 1 : 2)); };
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, 'en')}">${text}</a>`;
  };
  const Y1: S.YearKey = '2026/27', Y2: S.YearKey = '2027/28';
  const tax = (year: S.YearKey, nonSavings: number, interest: number, o: Parameters<typeof S.interestTax>[3] = {}) => S.interestTax(year, nonSavings, interest, o);
  return {
    P, S, I, PB, Y1, Y2,
    /** The parameters of a tax year. */
    y: S.yr,
    /** Tax caused by an amount of interest (engine). */
    tax,
    /** Link to another page of the site by id. */
    a,
    /** £2,363 (rounded to the pound). */
    m,
    /** £2,362.90 (pence kept). */
    m2,
    num: (n: number) => formatNumber(n, 0),
    /** 25 %, 4.35 % (decimals only when needed). */
    pc,
    /** “6 April 2027” from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Table of the tax on one amount of interest for several incomes, 2026/27 against 2027/28. */
    taxByIncome: (incomes: number[], interest: number, caption?: string, o: Parameters<typeof S.interestTax>[3] = {}) => {
      const rows = incomes.map((ns) => { const a1 = tax(Y1, ns, interest, o), a2 = tax(Y2, ns, interest, o);
        return [m(ns), m(a1.free), m2(a1.tax), m2(a2.tax), m2(a2.tax - a1.tax)]; });
      return table(['Other income', 'Interest tax free', `Tax ${Y1}`, `Tax ${Y2}`, 'Change'], rows, caption ?? `Tax caused by ${m(interest)} of interest in a taxable account, by other income before tax. Worked out by the engine of this site from the Finance Act 2026 rates.`, ['l', 'r', 'r', 'r', 'r']);
    },
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
