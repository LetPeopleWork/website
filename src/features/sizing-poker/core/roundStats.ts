// Derived numbers for the result screen. Pure; recomputed on render, never stored.
//
// secondsPerItem is the headline figure and the feature's own falsification
// instrument (see docs/feature/sizing-poker/feature-delta.md, D5). If it climbs,
// the three-way question is not beating estimation on speed and the page should
// say so rather than hide it.

import type { RoundState, Vote } from "./roundMachine";

/** Above this, the round has become a discussion. Sourced from D4 / the KPI table. */
export const DELIBERATION_THRESHOLD_SECONDS = 15;

export interface RoundStats {
  readonly total: number;
  readonly fits: number;
  readonly conditional: number;
  readonly tooBig: number;
  readonly elapsedMs: number;
  readonly secondsPerItem: number;
  readonly tooBigItems: readonly string[];
  readonly wasFast: boolean;
}

const countOf = (votes: readonly Vote[], verdict: Vote["verdict"]): number =>
  votes.filter((v) => v.verdict === verdict).length;

export const statsFor = (state: RoundState): RoundStats => {
  const total = state.votes.length;
  const elapsedMs =
    state.startedAt !== null && state.finishedAt !== null
      ? Math.max(0, state.finishedAt - state.startedAt)
      : 0;
  const secondsPerItem = total === 0 ? 0 : elapsedMs / 1000 / total;

  return {
    total,
    fits: countOf(state.votes, "fits"),
    conditional: countOf(state.votes, "conditional"),
    tooBig: countOf(state.votes, "too-big"),
    elapsedMs,
    secondsPerItem,
    tooBigItems: state.votes.filter((v) => v.verdict === "too-big").map((v) => v.item),
    wasFast: total > 0 && secondsPerItem < DELIBERATION_THRESHOLD_SECONDS,
  };
};

/** m:ss. Rounds down, so a round never reports more time than it took. */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Percentage widths that always sum to exactly 100 for a non-empty round, so the
 * split bar never leaves a sliver of background showing from rounding drift.
 */
export const splitWidths = (
  stats: RoundStats,
): { fits: number; conditional: number; tooBig: number } => {
  if (stats.total === 0) {
    return { fits: 0, conditional: 0, tooBig: 0 };
  }
  const pct = (n: number) => (n / stats.total) * 100;
  const fits = pct(stats.fits);
  const conditional = pct(stats.conditional);
  return { fits, conditional, tooBig: 100 - fits - conditional };
};

/**
 * Analytics payload. Counts and buckets only, never item titles.
 * See src/lib/plausible.ts: properties must stay non-personal.
 */
export const trackingProps = (
  stats: RoundStats,
): Record<string, string | number> => ({
  items: stats.total,
  fits: stats.fits,
  conditional: stats.conditional,
  too_big: stats.tooBig,
  seconds_per_item: Math.round(stats.secondsPerItem),
  pace: stats.wasFast ? "fast" : "slow",
});
