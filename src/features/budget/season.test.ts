import { describe, expect, it } from "vitest";
import { budgetPhase, budgetSeasonOpen } from "./season";

// The year-end budget campaign runs to 31 December 2026 and then removes
// itself. Until 5 December the trial comes first, after that the purchase.
describe("the budget season", () => {
  it("puts the trial first while there is time to try it", () => {
    expect(budgetPhase(new Date(2026, 10, 12, 9, 0))).toBe("trial");
    expect(budgetPhase(new Date(2026, 11, 5, 23, 59))).toBe("trial");
  });

  it("puts the purchase first from 6 December", () => {
    expect(budgetPhase(new Date(2026, 11, 6, 0, 0))).toBe("buy");
    expect(budgetPhase(new Date(2026, 11, 31, 23, 59))).toBe("buy");
  });

  it("is over when the new year starts", () => {
    expect(budgetPhase(new Date(2027, 0, 1, 0, 0))).toBe("over");
    expect(budgetSeasonOpen(new Date(2027, 0, 1, 0, 0))).toBe(false);
    expect(budgetSeasonOpen(new Date(2026, 11, 31, 23, 59))).toBe(true);
  });
});
