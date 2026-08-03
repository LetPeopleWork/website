// Pure state machine for a sizing round. No React, no I/O, no clock.
//
// Timestamps are passed in on the actions that need them rather than read from
// Date.now() in here, so the machine stays deterministic and the timing maths in
// roundStats.ts can be unit-tested without faking timers.

export type Verdict = "fits" | "conditional" | "too-big";

export type Phase = "setup" | "running" | "done";

export interface Vote {
  readonly item: string;
  readonly verdict: Verdict;
}

export interface RoundState {
  readonly phase: Phase;
  readonly sleDays: number;
  readonly items: readonly string[];
  readonly currentIndex: number;
  readonly votes: readonly Vote[];
  /** Milliseconds since epoch, supplied by the caller. Null until the round starts. */
  readonly startedAt: number | null;
  readonly finishedAt: number | null;
}

export type RoundAction =
  | { type: "start"; items: readonly string[]; sleDays: number; at: number }
  | { type: "vote"; verdict: Verdict; at: number }
  | { type: "restart" };

/** Upper bound on a single round. Past this, sizing is not the problem. */
export const MAX_ITEMS = 50;

export const DEFAULT_SLE_DAYS = 8;

export const initialState = (): RoundState => ({
  phase: "setup",
  sleDays: DEFAULT_SLE_DAYS,
  items: [],
  currentIndex: 0,
  votes: [],
  startedAt: null,
  finishedAt: null,
});

/**
 * One item per line, trimmed, blanks dropped, capped at MAX_ITEMS.
 * Duplicates are kept: a backlog with the same title twice is a real backlog.
 */
export const parseItems = (raw: string): readonly string[] =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, MAX_ITEMS);

/** SLE is a whole number of days, at least 1. Anything else falls back to the default. */
export const normaliseSle = (raw: number | string): number => {
  const parsed = typeof raw === "number" ? raw : Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_SLE_DAYS;
  }
  return Math.min(Math.floor(parsed), 365);
};

export const currentItem = (state: RoundState): string | null =>
  state.phase === "running" ? (state.items[state.currentIndex] ?? null) : null;

export const progressRatio = (state: RoundState): number =>
  state.items.length === 0 ? 0 : state.currentIndex / state.items.length;

const start = (
  state: RoundState,
  items: readonly string[],
  sleDays: number,
  at: number,
): RoundState => {
  if (items.length === 0) {
    return state;
  }
  return {
    phase: "running",
    sleDays,
    items,
    currentIndex: 0,
    votes: [],
    startedAt: at,
    finishedAt: null,
  };
};

const vote = (state: RoundState, verdict: Verdict, at: number): RoundState => {
  if (state.phase !== "running") {
    return state;
  }
  const item = state.items[state.currentIndex];
  if (item === undefined) {
    return state;
  }

  const votes = [...state.votes, { item, verdict }];
  const nextIndex = state.currentIndex + 1;

  if (nextIndex >= state.items.length) {
    return { ...state, votes, currentIndex: state.currentIndex, phase: "done", finishedAt: at };
  }
  return { ...state, votes, currentIndex: nextIndex };
};

export const reduce = (state: RoundState, action: RoundAction): RoundState => {
  switch (action.type) {
    case "start":
      return start(state, action.items, action.sleDays, action.at);
    case "vote":
      return vote(state, action.verdict, action.at);
    case "restart":
      // Keep the SLE: it is a property of the team, not of the round.
      return { ...initialState(), sleDays: state.sleDays };
    default:
      return state;
  }
};
