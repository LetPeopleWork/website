// ADO #5563 — which Stripe price the checkout bills, decided by the clock.
//
// Kept free of Deno/URL imports on purpose so the browser-side test suite can import it directly;
// index.ts is not importable from vitest because of its https:// specifiers.
//
// PRICE_CUTOVER_INSTANT must stay byte-identical to the one in src/lib/pricing.ts — edge functions are
// deployed standalone and cannot import from src/, so it is duplicated and pricing.test.ts guards the
// pair. If they drift, the page and the checkout quote different prices.
export const PRICE_CUTOVER_INSTANT = "2026-07-31T22:00:00Z";

export const PRICE_ID_BEFORE_CUTOVER = "price_1RrMcgKzDcGH6xxwg9ABCbwz"; // CHF 999
export const PRICE_ID_AFTER_CUTOVER = "price_1Tz9rbKzDcGH6xxwjjLiT0VV"; // CHF 2,000

export function resolvePriceId(now: Date): string {
  return now.getTime() >= Date.parse(PRICE_CUTOVER_INSTANT)
    ? PRICE_ID_AFTER_CUTOVER
    : PRICE_ID_BEFORE_CUTOVER;
}
