// Derived numbers for the wrap-up screen. Pure; recomputed on render, never stored.
//
// secondsPerItem is the headline figure and the feature's own falsification
// instrument (see docs/feature/sizing-poker/feature-delta.md, D5). If it climbs,
// the three-way question is not beating estimation on speed and the page should
// say so rather than hide it. No competing planning-poker tool reports round
// duration at all, because in their model deliberation is the point. Here it is
// the thing being disproven, so it leads.

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
  /** The three take-away lists, so a PO can copy them straight into their tracker. */
  readonly readyItems: readonly string[];
  readonly maybeItems: readonly string[];
  readonly tooBigItems: readonly string[];
  readonly wasFast: boolean;
}

const itemsWith = (votes: readonly Vote[], verdict: Vote["verdict"]): readonly string[] =>
  votes.filter((v) => v.verdict === verdict).map((v) => v.item);

export const statsFor = (state: RoundState): RoundStats => {
  const total = state.votes.length;
  const elapsedMs =
    state.startedAt !== null && state.finishedAt !== null
      ? Math.max(0, state.finishedAt - state.startedAt)
      : 0;
  const secondsPerItem = total === 0 ? 0 : elapsedMs / 1000 / total;

  const readyItems = itemsWith(state.votes, "fits");
  const maybeItems = itemsWith(state.votes, "conditional");
  const tooBigItems = itemsWith(state.votes, "too-big");

  return {
    total,
    fits: readyItems.length,
    conditional: maybeItems.length,
    tooBig: tooBigItems.length,
    elapsedMs,
    secondsPerItem,
    readyItems,
    maybeItems,
    tooBigItems,
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

/** Plain-text summary a PO can paste into their tracker or into Slack. */
export const summaryText = (stats: RoundStats, targetDays: number): string => {
  const block = (heading: string, items: readonly string[]) =>
    items.length ? `\n${heading}\n${items.map((i) => `- ${i}`).join("\n")}\n` : "";

  return [
    `Sizing round: could we finish each of these within ${targetDays} days?`,
    `${stats.total} items in ${formatDuration(stats.elapsedMs)} (${stats.secondsPerItem.toFixed(1)}s each)`,
    block("Ready to go", stats.readyItems),
    block("Maybe - something needs arranging first", stats.maybeItems),
    block("Needs work - too big, slice before starting", stats.tooBigItems),
  ]
    .join("\n")
    .trim();
};

/**
 * Analytics payload. Counts and buckets only, never item titles.
 * See src/lib/plausible.ts: properties must stay non-personal.
 */
export const trackingProps = (
  stats: RoundStats,
): Record<string, string | number> => ({
  items: stats.total,
  ready: stats.fits,
  maybe: stats.conditional,
  needs_work: stats.tooBig,
  seconds_per_item: Math.round(stats.secondsPerItem),
  pace: stats.wasFast ? "fast" : "slow",
});
