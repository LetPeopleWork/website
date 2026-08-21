import { describe, expect, it } from "vitest";
import {
  DEFAULT_TARGET_DAYS,
  MAX_ITEMS,
  currentItem,
  initialState,
  normaliseTarget,
  parseItems,
  progressRatio,
  reduce,
  type RoundState,
} from "./roundMachine";

const startedRound = (items: readonly string[], at = 1_000): RoundState =>
  reduce(initialState(), { type: "start", items, targetDays: 8, at });

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

describe("normaliseTarget", () => {
  it("accepts a plain positive number of days", () => {
    expect(normaliseTarget(14)).toBe(14);
    expect(normaliseTarget("21")).toBe(21);
  });

  it("falls back to the default for junk, zero, and negatives", () => {
    expect(normaliseTarget("")).toBe(DEFAULT_TARGET_DAYS);
    expect(normaliseTarget("abc")).toBe(DEFAULT_TARGET_DAYS);
    expect(normaliseTarget(0)).toBe(DEFAULT_TARGET_DAYS);
    expect(normaliseTarget(-3)).toBe(DEFAULT_TARGET_DAYS);
    expect(normaliseTarget(Number.NaN)).toBe(DEFAULT_TARGET_DAYS);
  });

  it("clamps absurd values instead of trusting them", () => {
    expect(normaliseTarget(99_999)).toBe(365);
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
    const state = reduce(initialState(), { type: "start", items: [], targetDays: 8, at: 1 });
    expect(state.phase).toBe("intro");
  });
});

describe("begin", () => {
  it("moves from the intro to the config step", () => {
    expect(initialState().phase).toBe("intro");
    expect(reduce(initialState(), { type: "begin" }).phase).toBe("config");
  });

  it("does nothing once past the intro", () => {
    const running = startedRound(["one"]);
    expect(reduce(running, { type: "begin" })).toEqual(running);
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
    expect(state.phase).toBe("intro");
    expect(state.votes).toHaveLength(0);
  });
});

describe("restart", () => {
  it("returns to config, keeping the target, which belongs to the team", () => {
    const done = reduce(
      reduce(initialState(), { type: "start", items: ["only"], targetDays: 21, at: 1_000 }),
      { type: "vote", verdict: "fits", at: 2_000 },
    );
    const state = reduce(done, { type: "restart" });

    expect(state.phase).toBe("config");
    expect(state.votes).toEqual([]);
    expect(state.startedAt).toBeNull();
    expect(state.targetDays).toBe(21);
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

describe("the guided walkthrough (G17)", () => {
  const guidedRound = (): RoundState => {
    const configured = reduce(initialState(), { type: "beginGuided" });
    return reduce(configured, {
      type: "start",
      items: ["easy", "coupled", "huge"],
      targetDays: 10,
      at: 1_000,
    });
  };

  it("beginGuided lands on config in guided mode", () => {
    const state = reduce(initialState(), { type: "beginGuided" });
    expect(state.phase).toBe("config");
    expect(state.mode).toBe("guided");
  });

  it("a round started guided stays marked as such for its whole life", () => {
    let state = guidedRound();
    expect(state.startedGuided).toBe(true);
    state = reduce(state, { type: "exitGuided", at: 2_000 });
    expect(state.mode).toBe("normal");
    expect(state.startedGuided).toBe(true);
  });

  it("the first No pauses on the item with the lesson pending", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "fits", at: 2_000 });
    state = reduce(state, { type: "vote", verdict: "too-big", at: 3_000 });

    expect(state.lessonPending).toBe(true);
    expect(state.currentIndex).toBe(1); // still on the item that got the No
    expect(state.votes).toHaveLength(2); // but the vote is recorded
  });

  it("votes are ignored while the lesson is up, so keyboard mashing cannot skip it", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "too-big", at: 2_000 });
    const during = reduce(state, { type: "vote", verdict: "fits", at: 3_000 });
    expect(during).toEqual(state);
  });

  it("dismissing the lesson advances, and a second No teaches nothing (G3: once)", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "too-big", at: 2_000 });
    state = reduce(state, { type: "dismissLesson", at: 3_000 });
    expect(state.currentIndex).toBe(1);
    expect(state.lessonPending).toBe(false);

    state = reduce(state, { type: "vote", verdict: "too-big", at: 4_000 });
    expect(state.lessonPending).toBe(false);
    expect(state.currentIndex).toBe(2);
  });

  it("a No on the last item finishes the round after the lesson is dismissed", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "fits", at: 2_000 });
    state = reduce(state, { type: "vote", verdict: "conditional", at: 3_000 });
    state = reduce(state, { type: "vote", verdict: "too-big", at: 4_000 });
    expect(state.phase).toBe("running"); // held by the lesson
    state = reduce(state, { type: "dismissLesson", at: 5_000 });
    expect(state.phase).toBe("done");
    expect(state.finishedAt).toBe(5_000);
  });

  it("the lesson never fires in a normal round", () => {
    let state = reduce(initialState(), { type: "begin" });
    state = reduce(state, { type: "start", items: ["a", "b"], targetDays: 10, at: 1_000 });
    state = reduce(state, { type: "vote", verdict: "too-big", at: 2_000 });
    expect(state.lessonPending).toBe(false);
    expect(state.currentIndex).toBe(1);
  });

  it("exiting from guided config resets to a clean normal config (nothing to keep)", () => {
    const configured = reduce(initialState(), { type: "beginGuided" });
    const state = reduce(configured, { type: "exitGuided", at: 1 });
    expect(state.phase).toBe("config");
    expect(state.mode).toBe("normal");
    expect(state.startedGuided).toBe(false);
  });

  it("exiting mid-round keeps the round intact, coaching removed (G11)", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "fits", at: 2_000 });
    state = reduce(state, { type: "exitGuided", at: 3_000 });
    expect(state.phase).toBe("running");
    expect(state.mode).toBe("normal");
    expect(state.currentIndex).toBe(1);
    expect(state.votes).toHaveLength(1);
  });

  it("exiting while the lesson is up dismisses it and advances", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "too-big", at: 2_000 });
    state = reduce(state, { type: "exitGuided", at: 3_000 });
    expect(state.lessonPending).toBe(false);
    expect(state.currentIndex).toBe(1);
    expect(state.mode).toBe("normal");
  });

  it("restart clears guided state entirely - the second round is the real thing", () => {
    let state = guidedRound();
    state = reduce(state, { type: "vote", verdict: "fits", at: 2_000 });
    state = reduce(state, { type: "restart" });
    expect(state.mode).toBe("normal");
    expect(state.startedGuided).toBe(false);
    expect(state.phase).toBe("config");
  });
});
