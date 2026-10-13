import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const readSource = (relativePath: string) =>
  readFileSync(resolve(srcDir, relativePath), "utf-8");

const lighthousePage = () => readSource("pages/Lighthouse.tsx");
const lighthouseSection = () => readSource("components/LighthouseSection.tsx");
const lighthouseQuestions = () => readSource("features/lighthouse-page/LighthouseQuestions.tsx");

const MIGRATED_BUNDLED_IMPORTS = [
  "Metrics_Team_1.png",
  "Metrics_Project_1.png",
  "Forecasts_Team_Manual.png",
  "Forecasts_Project.png",
  "ALM_Connection.png",
  "Query_Configuration.png",
];

describe("Lighthouse marketing screenshots are served from the jsDelivr CDN", () => {
  it.each(MIGRATED_BUNDLED_IMPORTS)(
    "Lighthouse.tsx no longer bundles %s",
    (fileName) => {
      expect(lighthousePage()).not.toContain(
        `@/assets/screenshots/${fileName}`,
      );
    },
  );

  it("LighthouseSection.tsx no longer bundles Forecasts_Team_Manual.png", () => {
    expect(lighthouseSection()).not.toContain(
      "@/assets/screenshots/Forecasts_Team_Manual.png",
    );
  });

  // Since October 2026 the /lighthouse product screenshots live in the
  // "What it answers" tabs, which replaced the carousel and the deep dive.
  it("the /lighthouse question tabs serve their screenshots via lighthouseAsset", () => {
    const source = lighthouseQuestions();
    for (const asset of [
      "features/teamdetail.png",
      "features/metrics/metricsoverview.png",
      "features/deliveryTimeline.png",
      "features/portfoliodetail.png",
      "features/refinement.png",
    ]) {
      expect(source).toContain(`lighthouseAsset("${asset}")`);
    }
  });

  it("no /lighthouse source bundles a product screenshot", () => {
    expect(lighthousePage()).not.toContain("@/assets/screenshots/");
    expect(lighthouseQuestions()).not.toContain("@/assets/screenshots/");
  });

  it("LighthouseSection.tsx serves the team detail slot via lighthouseAsset", () => {
    expect(lighthouseSection()).toContain(
      'lighthouseAsset("features/teamdetail.png")',
    );
  });
});

describe("non-product surfaces stay website-hosted (DDD-9 / DDD-5 exclusions)", () => {
  it("Lighthouse.tsx keeps the OG/SEO image on the same origin, not the CDN", () => {
    const source = lighthousePage();
    expect(source).toContain("https://letpeople.work/lighthouse-forecast.png");
    expect(source).not.toContain(
      'lighthouseAsset("lighthouse-forecast.png")',
    );
  });
});
