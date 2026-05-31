export type DateRange = "7d" | "30d" | "90d" | "all";

const DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const WINDOW_DAYS: Readonly<Record<Exclude<DateRange, "all">, number>> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const filterByDateRange = <T extends { readonly createdAt: string }>(
  items: readonly T[],
  range: DateRange,
  now: string | Date,
): readonly T[] => {
  if (range === "all") {
    return items.slice();
  }
  const nowMs = (now instanceof Date ? now : new Date(now)).getTime();
  const cutoffMs = nowMs - WINDOW_DAYS[range] * DAYS_IN_MILLISECONDS;
  return items.filter(
    (item) => new Date(item.createdAt).getTime() >= cutoffMs,
  );
};
