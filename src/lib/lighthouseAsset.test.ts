import { describe, it, expect } from "vitest";
import { lighthouseAsset } from "@/lib/lighthouseAsset";

const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/LetPeopleWork/Lighthouse@main/docs/assets/";

describe("lighthouseAsset", () => {
  it.each([
    [
      "features/metrics/metricsoverview.png",
      `${CDN_BASE}features/metrics/metricsoverview.png`,
    ],
    [
      "concepts/worktrackingsystem_AzureDevOps.png",
      `${CDN_BASE}concepts/worktrackingsystem_AzureDevOps.png`,
    ],
    ["features/teamdetail.png", `${CDN_BASE}features/teamdetail.png`],
  ])("resolves %s against the jsDelivr CDN base", (path, expected) => {
    expect(lighthouseAsset(path)).toBe(expected);
  });

  it("normalizes a single leading slash without doubling or dropping segments", () => {
    expect(lighthouseAsset("/features/teamdetail.png")).toBe(
      `${CDN_BASE}features/teamdetail.png`,
    );
  });
});
