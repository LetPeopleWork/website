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
      planned: 2,
      ended: "all",
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

describe("a round that stopped early", () => {
  /** Answers `answered` of `planned` items, then stops. */
  const partial = (planned: number, answered: number): RoundState => {
    const items = Array.from({ length: planned }, (_, i) => `item ${i + 1}`);
    let state = reduce(initialState(), { type: "start", items, targetDays: 8, at: 0 });
    for (let i = 0; i < answered; i++) {
      state = reduce(state, { type: "vote", verdict: "fits", at: (i + 1) * 2_000 });
    }
    return reduce(state, { type: "finish", at: answered * 2_000 });
  };

  it("keeps the answers and reports both the planned and the sized count", () => {
    const stats = statsFor(partial(10, 5));
    expect(stats.total).toBe(5);
    expect(stats.planned).toBe(10);
    expect(stats.endedEarly).toBe(true);
  });

  it("computes seconds per item over what was actually sized, not what was planned", () => {
    // 5 answers, last at t=10s -> 2.0s each, not 1.0s over the planned ten.
    expect(statsFor(partial(10, 5)).secondsPerItem).toBe(2);
  });

  it("reports the items it never reached, in order", () => {
    expect(statsFor(partial(4, 2)).unsizedItems).toEqual(["item 3", "item 4"]);
  });

  it("is not flagged as early when every item was answered", () => {
    const stats = statsFor(partial(3, 3));
    expect(stats.endedEarly).toBe(false);
    expect(stats.unsizedItems).toEqual([]);
  });

  it("tells analytics the round ended early, so completion rate is measurable", () => {
    expect(trackingProps(statsFor(partial(10, 5)))).toMatchObject({
      items: 5,
      planned: 10,
      ended: "early",
    });
  });
});
