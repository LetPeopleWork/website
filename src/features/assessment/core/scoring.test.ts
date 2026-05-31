import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { score, bandOfScore } from "./scoring";

const BAND_RANGES: ReadonlyArray<[number, number, string]> = [
  [0, 25, "Flying blind"],
  [26, 50, "Output-focused"],
  [51, 75, "Flow-aware"],
  [76, 100, "Probabilistic"],
];

const answerVector = () =>
  fc.tuple(
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 0, max: 3 }),
  );

describe("scoring (#8, #9, #10, #11, #12, #13)", () => {
  it("#8 every answer vector yields a deterministic score in 0..100 and exactly one band", () => {
    fc.assert(
      fc.property(answerVector(), (answers) => {
        const result = score(answers);
        const rawSum = answers.reduce((sum, a) => sum + a, 0);
        expect(result.rawSum).toBe(rawSum);
        expect(result.score).toBe(Math.round((rawSum / 18) * 100));
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);

        const containing = BAND_RANGES.filter(
          ([min, max]) => result.score >= min && result.score <= max,
        );
        expect(containing).toHaveLength(1);
        expect(result.band).toBe(containing[0][2]);
      }),
    );
  });

  it("#9 higher answers never produce a lower score", () => {
    fc.assert(
      fc.property(answerVector(), answerVector(), (a, b) => {
        const lower = a.map((value, i) => Math.min(value, b[i])) as typeof a;
        const higher = a.map((value, i) => Math.max(value, b[i])) as typeof a;
        expect(score(higher).score).toBeGreaterThanOrEqual(score(lower).score);
      }),
    );
  });

  it.each([
    [0, "Flying blind"],
    [25, "Flying blind"],
    [26, "Output-focused"],
    [50, "Output-focused"],
    [51, "Flow-aware"],
    [75, "Flow-aware"],
    [76, "Probabilistic"],
    [100, "Probabilistic"],
  ])("#10 score %i lands in band %s", (target, expected) => {
    expect(bandOfScore(target)).toBe(expected);
  });

  it("#11 all-zero answers map to the lowest band", () => {
    const result = score([0, 0, 0, 0, 0, 0]);
    expect(result.score).toBe(0);
    expect(result.band).toBe("Flying blind");
  });

  it("#12 all-three answers map to the highest band", () => {
    const result = score([3, 3, 3, 3, 3, 3]);
    expect(result.score).toBe(100);
    expect(result.band).toBe("Probabilistic");
  });

  it("#13 a raw total of 9 normalizes to 50 in the Output-focused band", () => {
    const result = score([2, 2, 2, 1, 1, 1]);
    expect(result.rawSum).toBe(9);
    expect(result.score).toBe(50);
    expect(result.band).toBe("Output-focused");
  });
});
