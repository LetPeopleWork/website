import { describe, expect, it } from "vitest";
import { prices } from "./pricing";

describe("prices", () => {
  it("quotes the current rates", () => {
    expect(prices).toEqual({
      selfService: "CHF 2,000",
      selfServiceAmount: "2000",
      enterprise: "CHF 10,000",
      enterpriseAmount: "10000",
      pilot: "CHF 3,500",
      assessment: "CHF 4,500",
      aiWorkshopPilot: "CHF 2,500",
      aiWorkshopPilotAmount: "2500",
    });
  });

  // The bare amounts go into the structured data, the display strings onto the
  // page. They have to name the same figure.
  it.each([
    ["selfService", "selfServiceAmount"],
    ["enterprise", "enterpriseAmount"],
    ["aiWorkshopPilot", "aiWorkshopPilotAmount"],
  ] as const)("states %s and its bare amount as the same figure", (display, amount) => {
    expect(prices[display].replace(/[^0-9]/g, "")).toBe(prices[amount]);
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
