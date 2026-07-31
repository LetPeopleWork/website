import { describe, expect, it } from "vitest";
import {
  PRICE_CUTOVER_INSTANT as EDGE_CUTOVER_INSTANT,
  PRICE_ID_AFTER_CUTOVER,
  PRICE_ID_BEFORE_CUTOVER,
  resolvePriceId,
} from "../../supabase/functions/create-payment/priceCutover";
import { isAfterPriceCutover, PRICE_CUTOVER_INSTANT, prices } from "./pricing";

const CUTOVER = new Date(PRICE_CUTOVER_INSTANT);
const oneMinuteBefore = new Date(CUTOVER.getTime() - 60_000);
const oneMinuteAfter = new Date(CUTOVER.getTime() + 60_000);

describe("price cutover instant", () => {
  it("is Swiss midnight on 1 August 2026", () => {
    expect(PRICE_CUTOVER_INSTANT).toBe("2026-07-31T22:00:00Z");
    expect(
      CUTOVER.toLocaleString("en-GB", {
        timeZone: "Europe/Zurich",
        dateStyle: "short",
        timeStyle: "short",
      }),
    ).toBe("01/08/2026, 00:00");
  });

  // The edge function is deployed standalone and cannot import from src/, so the constant is
  // duplicated there on purpose. A drift means the page and the Stripe checkout quote different
  // prices, which is the exact failure this whole feature exists to prevent.
  it("is byte-identical to the copy in create-payment", () => {
    expect(EDGE_CUTOVER_INSTANT).toBe(PRICE_CUTOVER_INSTANT);
  });
});

describe("isAfterPriceCutover", () => {
  it("is false one minute before", () => {
    expect(isAfterPriceCutover(oneMinuteBefore)).toBe(false);
  });

  it("is true at the instant itself, not just after it", () => {
    expect(isAfterPriceCutover(CUTOVER)).toBe(true);
  });

  it("is true one minute after", () => {
    expect(isAfterPriceCutover(oneMinuteAfter)).toBe(true);
  });
});

// AC-2.1/2.2 — the edge function is the authority on what Stripe actually bills.
describe("resolvePriceId", () => {
  it("bills the CHF 999 price one minute before the cutover", () => {
    expect(resolvePriceId(oneMinuteBefore)).toBe(PRICE_ID_BEFORE_CUTOVER);
  });

  it("bills the CHF 2,000 price at the instant itself", () => {
    expect(resolvePriceId(CUTOVER)).toBe(PRICE_ID_AFTER_CUTOVER);
  });

  it("bills the CHF 2,000 price one minute after", () => {
    expect(resolvePriceId(oneMinuteAfter)).toBe(PRICE_ID_AFTER_CUTOVER);
  });

  it("switches on the same boundary the page renders on", () => {
    for (const now of [oneMinuteBefore, CUTOVER, oneMinuteAfter]) {
      const billsNewPrice = resolvePriceId(now) === PRICE_ID_AFTER_CUTOVER;
      expect(billsNewPrice).toBe(isAfterPriceCutover(now));
    }
  });
});

describe("prices", () => {
  it("quotes the old rates before the cutover", () => {
    expect(prices(oneMinuteBefore)).toEqual({
      selfService: "CHF 999",
      selfServiceAmount: "999",
      pilot: "CHF 2,000",
      assessment: "CHF 3,500",
    });
  });

  it("quotes the new rates from the cutover instant onwards", () => {
    expect(prices(CUTOVER)).toEqual({
      selfService: "CHF 2,000",
      selfServiceAmount: "2000",
      pilot: "CHF 3,000",
      assessment: "CHF 4,500",
    });
  });

  // The licence and the pilot both read "CHF 2,000" if the pilot is left alone, on the same site.
  it("never quotes the same figure for the licence and the pilot", () => {
    for (const now of [oneMinuteBefore, CUTOVER, oneMinuteAfter]) {
      const { selfService, pilot } = prices(now);
      expect(selfService).not.toBe(pilot);
    }
  });

  it("keeps the assessment above the licence it bundles", () => {
    const amount = (chf: string) => Number(chf.replace(/[^0-9]/g, ""));

    for (const now of [oneMinuteBefore, CUTOVER]) {
      const { assessment, selfService } = prices(now);
      expect(amount(assessment) - amount(selfService)).toBeGreaterThanOrEqual(2500);
    }
  });
});
