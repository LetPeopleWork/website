import season from "@/content/budget-season.json";

// The year-end budget campaign (November and December 2026): a bar on every
// page and the /budget page. Both switch themselves off after the last day,
// so nothing stale is left on the site in January. No discount and no
// deadline of ours: the price stays the same, only the visitor's budget ends.
//
// The dates live in src/content/budget-season.json, which the build reads as
// well (scripts/prerender-meta.mjs). Dates are the visitor's local dates.
const localDate = (iso: string): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const lastDay = localDate(season.lastDay);
const over = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1);
const buyFirst = localDate(season.buyFirstFrom);

/**
 * "trial": the free trial is the first button, there is time to try it.
 * "buy": the purchase is the first button, the budget closes soon.
 * "over": the campaign is gone.
 */
export type BudgetPhase = "trial" | "buy" | "over";

export const budgetPhase = (now: Date = new Date()): BudgetPhase => {
  if (now >= over) return "over";
  return now >= buyFirst ? "buy" : "trial";
};

export const budgetSeasonOpen = (now: Date = new Date()): boolean => budgetPhase(now) !== "over";

export const BUDGET_PATH = "/budget";
export const BUDGET_URL = "https://letpeople.work/budget/";
