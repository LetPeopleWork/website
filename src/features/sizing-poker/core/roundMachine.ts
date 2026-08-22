// Pure state machine for a sizing round. No React, no I/O, no clock.
//
// Timestamps are passed in on the actions that need them rather than read from
// Date.now() in here, so the machine stays deterministic and the timing maths in
// roundStats.ts can be unit-tested without faking timers.
//
// The field is targetDays, not sleDays, on purpose. It IS the team's Service
// Level Expectation, but the audience for this page has never heard the term
// (see docs/feature/sizing-poker/feature-delta.md, D10). The UI asks how fast
// items should be done and only names the concept in the wrap-up.

export type Verdict = "fits" | "conditional" | "too-big";

export type Phase = "intro" | "config" | "running" | "done";

/**
 * "guided" is the walkthrough (G8-G17): example items, coach notes, and the
 * one-time lesson on the first "No". It is a flag through the same phases, not
 * a separate flow (G5).
 */
export type Mode = "normal" | "guided";

export interface Vote {
  readonly item: string;
  readonly verdict: Verdict;
}

export interface RoundState {
  readonly phase: Phase;
  readonly mode: Mode;
  /**
   * True for any round that BEGAN guided, even after the coaching is exited.
   * The wrap-up and analytics key off this, not off `mode`: a round whose early
   * answers were made while reading coach notes has a fabricated pace, and it
   * must never feed the seconds-per-item evidence (G2, G10).
   */
  readonly startedGuided: boolean;
  readonly targetDays: number;
  readonly items: readonly string[];
  readonly currentIndex: number;
  readonly votes: readonly Vote[];
  /** Milliseconds since epoch, supplied by the caller. Null until the round starts. */
  readonly startedAt: number | null;
  readonly finishedAt: number | null;
}

export type RoundAction =
  | { type: "begin" }
  | { type: "beginGuided" }
  | { type: "start"; items: readonly string[]; targetDays: number; at: number }
  | { type: "vote"; verdict: Verdict; at: number }
  | { type: "exitGuided"; at: number }
  | { type: "finish"; at: number }
  | { type: "restart" };

/** Upper bound on a single round. Past this, sizing is not the problem. */
export const MAX_ITEMS = 50;

export const DEFAULT_TARGET_DAYS = 10;

export const initialState = (): RoundState => ({
  phase: "intro",
  mode: "normal",
  startedGuided: false,
  targetDays: DEFAULT_TARGET_DAYS,
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

/** A whole number of days, at least 1. Anything else falls back to the default. */
export const normaliseTarget = (raw: number | string): number => {
  const parsed = typeof raw === "number" ? raw : Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_TARGET_DAYS;
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
  targetDays: number,
  at: number,
): RoundState => {
  if (items.length === 0) {
    return state;
  }
  return {
    phase: "running",
    mode: state.mode,
    startedGuided: state.mode === "guided",
    targetDays,
    items,
    currentIndex: 0,
    votes: [],
    startedAt: at,
    finishedAt: null,
  };
};

/** Move past the current item: next one, or the end of the round. */
const advance = (state: RoundState, at: number): RoundState => {
  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.items.length) {
    return { ...state, phase: "done", finishedAt: at };
  }
  return { ...state, currentIndex: nextIndex };
};

// A guided vote records exactly like a normal one. The teaching (G20) lives
// in the page's popups, which pause BEFORE dispatching - the machine never
// holds a round for it.
const vote = (state: RoundState, verdict: Verdict, at: number): RoundState => {
  if (state.phase !== "running") {
    return state;
  }
  const item = state.items[state.currentIndex];
  if (item === undefined) {
    return state;
  }
  return advance({ ...state, votes: [...state.votes, { item, verdict }] }, at);
};

/**
 * Stop a round before the last item and keep what was answered.
 *
 * Running out of time is the ordinary way a session ends: you bring ten items,
 * you get through five. Those five are a real result and the round must not
 * discard them. Only a round with nothing answered yet has nothing to report,
 * and that one goes back to config so the target can be corrected.
 */
const finish = (state: RoundState, at: number): RoundState => {
  if (state.phase !== "running") {
    return state;
  }
  if (state.votes.length === 0) {
    return { ...initialState(), phase: "config", targetDays: state.targetDays };
  }
  return { ...state, phase: "done", finishedAt: at };
};

export const reduce = (state: RoundState, action: RoundAction): RoundState => {
  switch (action.type) {
    case "begin":
      return state.phase === "intro" ? { ...state, phase: "config" } : state;
    case "beginGuided":
      return state.phase === "intro"
        ? { ...state, phase: "config", mode: "guided" }
        : state;
    case "start":
      return start(state, action.items, action.targetDays, action.at);
    case "vote":
      return vote(state, action.verdict, action.at);
    // Leaving the walkthrough keeps the visitor exactly where they are, minus
    // the coaching (G11) - training wheels, not a locked track. startedGuided
    // survives on purpose: the answers so far were made while popups paused
    // the clock, so the round must still end on the guided wrap-up, without a
    // pace (G10).
    case "exitGuided": {
      if (state.mode !== "guided") {
        return state;
      }
      return state.phase === "config"
        ? { ...initialState(), phase: "config", targetDays: state.targetDays }
        : { ...state, mode: "normal" };
    }
    case "finish":
      return finish(state, action.at);
    case "restart":
      // Back to config, not intro: a second round is a repeat, not a first look.
      // Keep the target, which is a property of the team, not of the round.
      return { ...initialState(), phase: "config", targetDays: state.targetDays };
    default:
      return state;
  }
};
