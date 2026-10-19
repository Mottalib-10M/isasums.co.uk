/**
 * Premium Bonds, from NS&I's published prize fund rate, odds and the prize allocation of the current
 * draw (params-2026.json, `premiumBonds`). A Bond is £1; each Bond held for a whole calendar month is
 * in the next draw; each Bond can win at most one prize a draw, with probability 1 / odds.
 * Nothing here is guaranteed: the averages are averages, and the spread is simulated with a fixed
 * seed so the page shows the same figures on every load (RECETTE §17.5).
 */
import { P } from './params';

const PB = P.premiumBonds;
export const PRIZES = PB.prizes as Array<{ value: number; count: number; band: string }>;
/** Number of £1 Bonds in the draw, derived from NS&I's own figures: prizes × odds. */
export const ELIGIBLE = PB.totalPrizes * PB.odds;
/** Chance that one £1 Bond wins a prize of this value in one draw. */
export const prizeChance = (value: number) => (PRIZES.find((p) => p.value === value)?.count ?? 0) / ELIGIBLE;
/** Annual prize fund rate implied by the draw table (should equal the published rate). */
export const impliedRate = (PB.totalValue * 12) / ELIGIBLE;
/** Expected value of one £1 Bond in one draw, split by prize band. */
export function expectedPerBond(bands: string[] = ['higher', 'medium', 'lower']) {
  return PRIZES.filter((p) => bands.includes(p.band)).reduce((s, p) => s + (p.value * p.count) / ELIGIBLE, 0);
}

export const bondsHeld = (holding: number) => Math.max(0, Math.min(PB.max, Math.floor(holding)));

export interface Odds { bonds: number; perMonthAny: number; perYearAny: number; expectedPrizesYear: number; months: Array<{ month: number; atLeastOne: number }>; monthsForEvenChance: number | null }
/** Chance of at least one prize per draw and over the following months. */
export function odds(holding: number, monthsShown = 12): Odds {
  const n = bondsHeld(holding);
  const miss = Math.pow(1 - 1 / PB.odds, n);
  const months = Array.from({ length: monthsShown }, (_, k) => ({ month: k + 1, atLeastOne: 1 - Math.pow(miss, k + 1) }));
  const even = n > 0 ? Math.ceil(Math.log(0.5) / Math.log(miss)) : null;
  return { bonds: n, perMonthAny: 1 - miss, perYearAny: 1 - Math.pow(miss, 12), expectedPrizesYear: (12 * n) / PB.odds, months, monthsForEvenChance: even };
}

/** Small deterministic PRNG (mulberry32) so build and browser show the same simulated spread. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function poisson(lambda: number, u: () => number) {
  if (lambda > 60) { // normal approximation for very large holdings
    const z = Math.sqrt(-2 * Math.log(u() || 1e-12)) * Math.cos(2 * Math.PI * u());
    return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * z));
  }
  const L = Math.exp(-lambda); let k = 0, p = 1;
  do { k++; p *= u(); } while (p > L);
  return k - 1;
}

export interface Spread { bonds: number; mean: number; median: number; p10: number; p90: number; chanceNothing: number; chanceBeatMean: number; years: number }
/** Prizes over `months` (12 = one year) for a holding: average, median and the 10th/90th percentiles. */
export function simulate(holding: number, months = 12, runs = 4000): Spread {
  const n = bondsHeld(holding);
  const lambda = (n * months) / PB.odds;
  const cum: number[] = []; let acc = 0;
  for (const p of PRIZES) { acc += p.count / PB.totalPrizes; cum.push(acc); }
  const u = rng(n * 7919 + months);
  const out: number[] = [];
  for (let r = 0; r < runs; r++) {
    const k = poisson(lambda, u); let s = 0;
    for (let j = 0; j < k; j++) { const x = u(); let i = 0; while (i < cum.length - 1 && x > cum[i]) i++; s += PRIZES[i].value; }
    out.push(s);
  }
  out.sort((a, b) => a - b);
  const q = (f: number) => out[Math.min(out.length - 1, Math.floor(f * out.length))];
  const mean = n * expectedPerBond() * months;
  return { bonds: n, mean, median: q(0.5), p10: q(0.1), p90: q(0.9), chanceNothing: Math.pow(1 - 1 / PB.odds, n * months), chanceBeatMean: out.filter((x) => x >= mean).length / out.length, years: months / 12 };
}
