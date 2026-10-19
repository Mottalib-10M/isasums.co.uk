/**
 * ISA rules: the yearly allowance and its split, the cash ISA limit from 6 April 2027 (SI 2026/1018,
 * "64 or under at the end of that year"), flexible withdrawals, the Lifetime ISA bonus and withdrawal
 * charge, Junior ISA growth and the £100 rule on money a parent gives a child. Pure functions fed by
 * params-2026.json.
 */
import { P } from './params';
import type { YearKey } from './savings';
import { yr } from './savings';

const clamp0 = (x: number) => (x > 0 ? x : 0);

/** Age at the end of a tax year (5 April), from a date of birth given as year, month (1-12) and day. */
export function ageAtEndOfYear(year: YearKey, birthYear: number, birthMonth: number, birthDay = 1): number {
  const endY = Number(yr(year).end.slice(0, 4)); // 5 April of that year
  let age = endY - birthYear;
  if (birthMonth > 4 || (birthMonth === 4 && birthDay > 5)) age -= 1;
  return age;
}
/** Cash ISA limit for a person who is `ageAtEnd` at the end of the tax year. */
export function cashLimit(year: YearKey, ageAtEnd: number): number {
  const I = yr(year).isa;
  return ageAtEnd <= 64 ? I.cashUnder65 : I.cashFrom65;
}
/** First tax year from 2027/28 in which someone born on that date keeps the £20,000 cash limit. */
export function firstYearFullCash(birthYear: number, birthMonth: number, birthDay = 1): { label: string; age: number } {
  for (let start = 2027; start < 2100; start++) {
    const endY = start + 1;
    let age = endY - birthYear; if (birthMonth > 4 || (birthMonth === 4 && birthDay > 5)) age -= 1;
    if (age >= 65) return { label: `${start}/${String(endY).slice(2)}`, age };
  }
  return { label: 'n/a', age: 0 };
}

export interface AllowanceInput { year: YearKey; cash: number; investments: number; innovative?: number; lifetime: number; ageAtEnd: number; flexibleWithdrawn?: number }
export interface AllowanceResult { used: number; left: number; cashLimit: number; cashLeft: number; lifetimeLeft: number; overBy: number; cashOverBy: number; lifetimeOverBy: number; flexibleBack: number }
/** What is left of the year's ISA allowance after what has been paid in. */
export function allowance(i: AllowanceInput): AllowanceResult {
  const I = yr(i.year).isa;
  const back = clamp0(i.flexibleWithdrawn ?? 0);
  const lifetime = clamp0(i.lifetime), cash = clamp0(i.cash);
  const used = cash + clamp0(i.investments) + clamp0(i.innovative ?? 0) + lifetime - back;
  const cl = cashLimit(i.year, i.ageAtEnd);
  const left = clamp0(I.overall - used);
  return {
    used, left, cashLimit: cl,
    cashLeft: Math.min(left, clamp0(cl - (cash - Math.min(back, cash)))),
    lifetimeLeft: Math.min(left, clamp0(I.lisa - lifetime)),
    overBy: clamp0(used - I.overall), cashOverBy: clamp0(cash - Math.min(back, cash) - cl), lifetimeOverBy: clamp0(lifetime - I.lisa), flexibleBack: back,
  };
}

/** Room left this year in a flexible or non-flexible ISA after paying in and taking out (GOV.UK example). */
export function flexibleRoom(year: YearKey, paidIn: number, withdrawn: number, flexible: boolean) {
  const I = yr(year).isa;
  const base = clamp0(I.overall - clamp0(paidIn));
  const w = Math.min(clamp0(withdrawn), clamp0(paidIn));
  return { room: base + (flexible ? w : 0), base, regained: flexible ? w : 0 };
}

const L = P.lisa;
export interface LisaYear { age: number; paid: number; bonus: number; value: number }
export interface LisaResult { years: LisaYear[]; paid: number; bonus: number; value: number; growth: number; stoppedAt50: boolean; tooOldToOpen: boolean }
/** Lifetime ISA year by year: payments until the day before 50, a 25 % bonus capped at £1,000 a year, growth on the pot. */
export function lisaProjection(ageNow: number, annual: number, years: number, growth: number, startValue = 0): LisaResult {
  const pay = Math.min(clamp0(annual), L.annual);
  const tooOldToOpen = ageNow >= L.openBeforeAge && startValue === 0;
  let value = clamp0(startValue), paid = 0, bonus = 0; let stopped = false;
  const out: LisaYear[] = [];
  for (let k = 0; k < Math.round(clamp0(years)); k++) {
    const age = ageNow + k;
    const can = !tooOldToOpen && age < L.payUntilAge && age >= L.openMinAge;
    if (!can && age >= L.payUntilAge) stopped = true;
    const p = can ? pay : 0, b = Math.min(p * L.bonusRate, L.maxBonus);
    value = (value + p + b) * (1 + growth);
    paid += p; bonus += b;
    out.push({ age, paid: p, bonus: b, value });
  }
  return { years: out, paid, bonus, value, growth: value - paid - bonus - clamp0(startValue), stoppedAt50: stopped, tooOldToOpen };
}
/** What the 25 % withdrawal charge takes when money leaves a Lifetime ISA for another reason. */
export function lisaCharge(withdrawal: number) {
  const w = clamp0(withdrawal), charge = w * L.withdrawalCharge, received = w - charge;
  // Of £1 of own money, £1.25 goes in; 75 % of £1.25 comes out: 6.25 % of own money is lost.
  const ownMoneyLoss = 1 - (1 + L.bonusRate) * (1 - L.withdrawalCharge);
  return { withdrawal: w, charge, received, ownMoneyLoss };
}
/** Gross amount to take out so that `needed` is left after the charge. */
export const lisaGrossFor = (needed: number) => clamp0(needed) / (1 - L.withdrawalCharge);
export const lisaPriceOk = (price: number) => price <= L.priceCap;

/** Value of regular monthly payments with yearly growth, contributions capped by an annual limit. */
export function project(startValue: number, monthly: number, years: number, growth: number, annualCap = Infinity) {
  let v = clamp0(startValue), paid = 0;
  const perYear = Math.min(clamp0(monthly) * 12, annualCap);
  for (let k = 0; k < Math.round(clamp0(years)); k++) { v = v * (1 + growth) + perYear * (1 + growth / 2); paid += perYear; }
  return { value: v, paid, growth: v - paid - clamp0(startValue), perYear, capped: clamp0(monthly) * 12 > annualCap };
}
export const juniorProjection = (startValue: number, monthly: number, childAge: number, growth: number) =>
  project(startValue, monthly, clamp0(P.junior.accessAge - childAge), growth, P.junior.annual);
