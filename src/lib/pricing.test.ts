import { describe, expect, it } from "vitest";
import { prices } from "./pricing";

describe("prices", () => {
  it("quotes the current rates", () => {
    expect(prices).toEqual({
      selfService: "CHF 2,000",
      selfServiceAmount: "2000",
      pilot: "CHF 3,000",
      assessment: "CHF 4,500",
    });
  });

  // The licence and the pilot both read "CHF 2,000" if the pilot is left alone, on the same site.
  it("never quotes the same figure for the licence and the pilot", () => {
    expect(prices.selfService).not.toBe(prices.pilot);
  });

  it("keeps the assessment above the licence it bundles", () => {
    const amount = (chf: string) => Number(chf.replace(/[^0-9]/g, ""));

    expect(amount(prices.assessment) - amount(prices.selfService)).toBeGreaterThanOrEqual(2500);
  });
});
