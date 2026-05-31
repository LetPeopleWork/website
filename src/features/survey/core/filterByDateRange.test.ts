import { describe, it, expect } from "vitest";
import { filterByDateRange, type DateRange } from "./filterByDateRange";

interface Dated {
  readonly createdAt: string;
  readonly label: string;
}

const item = (createdAt: string, label: string): Dated => ({
  createdAt,
  label,
});

const NOW = "2026-05-31T12:00:00.000Z";

describe("filterByDateRange", () => {
  it("returns every item when the range is 'all'", () => {
    const items = [
      item("2020-01-01T00:00:00.000Z", "ancient"),
      item("2026-05-31T11:59:59.000Z", "recent"),
    ];

    expect(filterByDateRange(items, "all", NOW)).toEqual(items);
  });

  it("returns an empty array for empty input regardless of range", () => {
    const ranges: readonly DateRange[] = ["7d", "30d", "90d", "all"];
    for (const range of ranges) {
      expect(filterByDateRange<Dated>([], range, NOW)).toEqual([]);
    }
  });

  it("keeps an item exactly at the cutoff boundary and drops one just outside", () => {
    const justInside = item("2026-05-24T12:00:00.000Z", "boundary");
    const justOutside = item("2026-05-24T11:59:59.000Z", "stale");
    const wellInside = item("2026-05-30T12:00:00.000Z", "fresh");

    const result = filterByDateRange(
      [justOutside, justInside, wellInside],
      "7d",
      NOW,
    );

    expect(result.map((entry) => entry.label)).toEqual(["boundary", "fresh"]);
  });

  it("scopes by 30 and 90 day windows independently", () => {
    const items = [
      item("2026-03-15T12:00:00.000Z", "77-days-ago"),
      item("2026-05-10T12:00:00.000Z", "21-days-ago"),
      item("2026-05-30T12:00:00.000Z", "1-day-ago"),
    ];

    expect(filterByDateRange(items, "30d", NOW).map((e) => e.label)).toEqual([
      "21-days-ago",
      "1-day-ago",
    ]);
    expect(filterByDateRange(items, "90d", NOW).map((e) => e.label)).toEqual([
      "77-days-ago",
      "21-days-ago",
      "1-day-ago",
    ]);
  });

  it("compares in UTC regardless of the local offset embedded in createdAt", () => {
    const utcEquivalent = item("2026-05-25T00:00:00.000Z", "utc");
    const offsetEquivalent = item("2026-05-25T02:00:00.000+02:00", "offset");

    const result = filterByDateRange(
      [utcEquivalent, offsetEquivalent],
      "7d",
      NOW,
    );

    expect(result.map((e) => e.label)).toEqual(["utc", "offset"]);
  });

  it("does not mutate the input array", () => {
    const items = [item("2026-05-30T12:00:00.000Z", "a")];
    const snapshot = [...items];

    filterByDateRange(items, "7d", NOW);

    expect(items).toEqual(snapshot);
  });
});
