// Single source of truth for every price stated on the site.
//
// ADO #5563: the Self-Service licence goes CHF 999 -> CHF 2,000 at Swiss midnight on 2026-08-01, and
// the services ladder moves with it. The change is deployed BEFORE the cutover and gates itself on the
// clock, so no deploy is needed at the instant. Delete the gate (and this comment) once it has passed.
//
// The same instant is duplicated in supabase/functions/create-payment/index.ts — edge functions are
// deployed standalone and cannot import from src/. pricing.test.ts asserts the two never drift.
export const PRICE_CUTOVER_INSTANT = "2026-07-31T22:00:00Z";

const CUTOVER_MS = Date.parse(PRICE_CUTOVER_INSTANT);

export interface Prices {
  /** Display string for the Self-Service licence, e.g. "CHF 2,000". */
  selfService: string;
  /** Bare amount for schema.org Offer.price, which takes no currency symbol or separators. */
  selfServiceAmount: string;
  /** Implement / BYOD pilot engagement. */
  pilot: string;
  /** Flow Clarity Assessment (bundles a Lighthouse licence). */
  assessment: string;
}

const BEFORE_CUTOVER: Prices = {
  selfService: "CHF 999",
  selfServiceAmount: "999",
  pilot: "CHF 2,000",
  assessment: "CHF 3,500",
};

const AFTER_CUTOVER: Prices = {
  selfService: "CHF 2,000",
  selfServiceAmount: "2000",
  pilot: "CHF 3,000",
  assessment: "CHF 4,500",
};

export function isAfterPriceCutover(now: Date = new Date()): boolean {
  return now.getTime() >= CUTOVER_MS;
}

export function prices(now: Date = new Date()): Prices {
  return isAfterPriceCutover(now) ? AFTER_CUTOVER : BEFORE_CUTOVER;
}
