import { describe, expect, it } from "vitest";
import {
  DEFAULT_SLE_DAYS,
  MAX_ITEMS,
  currentItem,
  initialState,
  normaliseSle,
  parseItems,
  progressRatio,
  reduce,
  type RoundState,
} from "./roundMachine";

const startedRound = (items: readonly string[], at = 1_000): RoundState =>
  reduce(initialState(), { type: "start", items, sleDays: 8, at });

describe("parseItems", () => {
  it("takes one item per line, trimming whitespace", () => {
    expect(parseItems("  Add SSO \n\nFix export  \n")).toEqual(["Add SSO", "Fix export"]);
  });

  it("keeps duplicates, because a real backlog contains them", () => {
    expect(parseItems("Same\nSame")).toEqual(["Same", "Same"]);
  });

  it("caps a paste at MAX_ITEMS rather than starting an endless round", () => {
    const raw = Array.from({ length: MAX_ITEMS + 20 }, (_, i) => `item ${i}`).join("\n");
    expect(parseItems(raw)).toHaveLength(MAX_ITEMS);
  });

  it("returns nothing for whitespace only", () => {
    expect(parseItems("   \n\n  ")).toEqual([]);
  });
});

describe("normaliseSle", () => {
  it("accepts a plain positive number of days", () => {
    expect(normaliseSle(14)).toBe(14);
    expect(normaliseSle("21")).toBe(21);
  });

  it("falls back to the default for junk, zero, and negatives", () => {
    expect(normaliseSle("")).toBe(DEFAULT_SLE_DAYS);
    expect(normaliseSle("abc")).toBe(DEFAULT_SLE_DAYS);
    expect(normaliseSle(0)).toBe(DEFAULT_SLE_DAYS);
    expect(normaliseSle(-3)).toBe(DEFAULT_SLE_DAYS);
    expect(normaliseSle(Number.NaN)).toBe(DEFAULT_SLE_DAYS);
  });

  it("clamps absurd values instead of trusting them", () => {
    expect(normaliseSle(99_999)).toBe(365);
  });
});

describe("start", () => {
  it("moves to running and shows the first item", () => {
    const state = startedRound(["one", "two"]);
    expect(state.phase).toBe("running");
    expect(currentItem(state)).toBe("one");
    expect(state.startedAt).toBe(1_000);
  });

  it("refuses to start an empty round", () => {
    const state = reduce(initialState(), { type: "start", items: [], sleDays: 8, at: 1 });
    expect(state.phase).toBe("setup");
  });
});

describe("vote", () => {
  it("#AC-1.4 records a verdict and advances to the next item", () => {
    const state = reduce(startedRound(["one", "two"]), {
      type: "vote",
      verdict: "fits",
      at: 2_000,
    });
    expect(state.votes).toEqual([{ item: "one", verdict: "fits" }]);
    expect(currentItem(state)).toBe("two");
    expect(state.phase).toBe("running");
  });

  it("#AC-1.1 finishes on the last item and stamps the end time", () => {
    let state = startedRound(["one", "two"], 1_000);
    state = reduce(state, { type: "vote", verdict: "fits", at: 3_000 });
    state = reduce(state, { type: "vote", verdict: "too-big", at: 5_000 });

    expect(state.phase).toBe("done");
    expect(state.finishedAt).toBe(5_000);
    expect(state.votes).toHaveLength(2);
  });

  it("records the middle verdict without capturing a condition (slice 01 scope)", () => {
    const state = reduce(startedRound(["one"]), {
      type: "vote",
      verdict: "conditional",
      at: 2_000,
    });
    expect(state.votes).toEqual([{ item: "one", verdict: "conditional" }]);
  });

  it("ignores votes once the round is done", () => {
    const done = reduce(startedRound(["only"]), { type: "vote", verdict: "fits", at: 2_000 });
    const after = reduce(done, { type: "vote", verdict: "too-big", at: 9_000 });
    expect(after).toEqual(done);
  });

  it("ignores votes before the round has started", () => {
    const state = reduce(initialState(), { type: "vote", verdict: "fits", at: 1 });
    expect(state.phase).toBe("setup");
    expect(state.votes).toHaveLength(0);
  });
});

describe("restart", () => {
  it("clears the round but keeps the SLE, which belongs to the team", () => {
    const done = reduce(
      reduce(initialState(), { type: "start", items: ["only"], sleDays: 21, at: 1_000 }),
      { type: "vote", verdict: "fits", at: 2_000 },
    );
    const state = reduce(done, { type: "restart" });

    expect(state.phase).toBe("setup");
    expect(state.votes).toEqual([]);
    expect(state.startedAt).toBeNull();
    expect(state.sleDays).toBe(21);
  });
});

describe("progressRatio", () => {
  it("runs from 0 to just under 1 across the round", () => {
    let state = startedRound(["a", "b", "c", "d"]);
    expect(progressRatio(state)).toBe(0);
    state = reduce(state, { type: "vote", verdict: "fits", at: 2 });
    expect(progressRatio(state)).toBe(0.25);
  });

  it("is 0 for an unstarted round rather than dividing by zero", () => {
    expect(progressRatio(initialState())).toBe(0);
  });
});
