/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# ISA Sums',
    '',
    `> Tax on UK savings interest worked out in the browser for 2026/27 and 2027/28: Personal Allowance, the £5,000 starting rate for savings, the £1,000/£500/nil Personal Savings Allowance, savings rates of 20/40/45 % now and 22/42/47 % from 6 April 2027 (Finance Act 2026, s.5), and what a cash ISA saves against a taxable account. ISA rules including the £12,000 cash ISA limit for under-65s from 6 April 2027 (SI 2026/1018), Lifetime ISA, Junior ISA, flexible ISAs and transfers; Premium Bonds odds and prize spread from NS&I's monthly prize allocation. Rules from legislation.gov.uk and GOV.UK, last read ${LAST_UPDATED}. Published by Radif Partners, an independent publisher; not HMRC, not NS&I, sells no product.`,
    '',
    '## Calculators and guides',
    `- [ISA or taxable account calculator](${SITE_URL}${route('home', 'en')}): tax on the interest of a balance at your income, both years, and what an ISA saves.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the sums are done](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
