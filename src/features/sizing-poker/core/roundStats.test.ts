import { describe, expect, it } from "vitest";
import { initialState, reduce, type RoundState, type Verdict } from "./roundMachine";
import {
  DELIBERATION_THRESHOLD_SECONDS,
  formatDuration,
  splitWidths,
  statsFor,
  trackingProps,
} from "./roundStats";

/** Runs a whole round, spending `msPerItem` on each answer. */
const roundOf = (verdicts: readonly Verdict[], msPerItem = 5_000): RoundState => {
  const items = verdicts.map((_, i) => `item ${i + 1}`);
  let state = reduce(initialState(), { type: "start", items, targetDays: 8, at: 0 });
  verdicts.forEach((verdict, i) => {
    state = reduce(state, { type: "vote", verdict, at: (i + 1) * msPerItem });
  });
  return state;
};

describe("statsFor", () => {
  it("#AC-1.1 reports elapsed time and mean seconds per item", () => {
    const stats = statsFor(roundOf(["fits", "fits", "too-big", "fits"], 5_000));
    expect(stats.total).toBe(4);
    expect(stats.elapsedMs).toBe(20_000);
    expect(stats.secondsPerItem).toBe(5);
  });

  it("counts each verdict, and the three always sum to the total", () => {
    const stats = statsFor(roundOf(["fits", "conditional", "too-big", "conditional"]));
    expect(stats).toMatchObject({ fits: 1, conditional: 2, tooBig: 1, total: 4 });
    expect(stats.fits + stats.conditional + stats.tooBig).toBe(stats.total);
  });

  it("#AC-1.5 lists the too-big items verbatim and in order", () => {
    const stats = statsFor(roundOf(["fits", "too-big", "fits", "too-big"]));
    expect(stats.tooBigItems).toEqual(["item 2", "item 4"]);
  });

  it("flags a fast round below the deliberation threshold", () => {
    expect(statsFor(roundOf(["fits", "fits"], 4_000)).wasFast).toBe(true);
  });

  it("flags a slow round at or above the deliberation threshold", () => {
    const slow = statsFor(roundOf(["fits", "fits"], DELIBERATION_THRESHOLD_SECONDS * 1_000));
    expect(slow.wasFast).toBe(false);
  });

  it("does not divide by zero on an unfinished round", () => {
    const stats = statsFor(initialState());
    expect(stats.secondsPerItem).toBe(0);
    expect(stats.wasFast).toBe(false);
  });
});

describe("formatDuration", () => {
  it("formats as m:ss with a padded seconds field", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(9_000)).toBe("0:09");
    expect(formatDuration(42_000)).toBe("0:42");
    expect(formatDuration(125_000)).toBe("2:05");
  });

  it("never reports more time than elapsed, and never reports negative time", () => {
    expect(formatDuration(1_999)).toBe("0:01");
    expect(formatDuration(-5_000)).toBe("0:00");
  });
});

describe("splitWidths", () => {
  it("sums to exactly 100 even when the split does not divide evenly", () => {
    const w = splitWidths(statsFor(roundOf(["fits", "conditional", "too-big"])));
    expect(w.fits + w.conditional + w.tooBig).toBeCloseTo(100, 10);
  });

  it("is all zero for an empty round", () => {
    expect(splitWidths(statsFor(initialState()))).toEqual({
      fits: 0,
      conditional: 0,
      tooBig: 0,
    });
  });
});

describe("trackingProps", () => {
  it("#AC-1.6 emits counts and buckets only, never item titles", () => {
    const state = roundOf(["fits", "too-big"], 3_000);
    const props = trackingProps(statsFor(state));

    expect(props).toEqual({
      items: 2,
      ready: 1,
      maybe: 0,
      needs_work: 1,
      seconds_per_item: 3,
      pace: "fast",
    });

    const serialised = JSON.stringify(props);
    state.items.forEach((item) => expect(serialised).not.toContain(item));
  });
});
