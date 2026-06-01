import { describe, it, expect } from "vitest";
import { bandMatchesScore } from "@shared/bands";

describe("anti-forgery band re-validation (#27 forged, #28 out-of-range, #29 honest)", () => {
  it("#29 accepts an honest result whose band matches its score", () => {
    expect(bandMatchesScore(58, "Flow-aware")).toBe(true);
  });

  it("#27 rejects a forged band the score does not earn", () => {
    expect(bandMatchesScore(4, "Predictable")).toBe(false);
  });

  it.each([
    [-1, "Flying blind"],
    [101, "Predictable"],
    [50.5, "Drifting"],
  ])("#28 rejects an out-of-range score %d", (score, band) => {
    expect(bandMatchesScore(score, band)).toBe(false);
  });

  it.each([
    [0, "Flying blind"],
    [25, "Flying blind"],
    [26, "Drifting"],
    [50, "Drifting"],
    [51, "Flow-aware"],
    [75, "Flow-aware"],
    [76, "Predictable"],
    [100, "Predictable"],
  ])("accepts boundary score %d in its earned band", (score, band) => {
    expect(bandMatchesScore(score, band)).toBe(true);
  });
});
