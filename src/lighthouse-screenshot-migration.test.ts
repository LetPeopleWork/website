import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const readSource = (relativePath: string) =>
  readFileSync(resolve(srcDir, relativePath), "utf-8");

const lighthousePage = () => readSource("pages/Lighthouse.tsx");
const lighthouseSection = () => readSource("components/LighthouseSection.tsx");

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

  it("Lighthouse.tsx serves the six migrated marketing slots via lighthouseAsset", () => {
    const source = lighthousePage();
    expect(source).toContain(
      'lighthouseAsset("features/metrics/metricsoverview.png")',
    );
    expect(source).toContain(
      'lighthouseAsset("features/metrics/portfoliometricsoverview.png")',
    );
    expect(source).toContain('lighthouseAsset("features/teamdetail.png")');
    expect(source).toContain('lighthouseAsset("features/portfoliodetail.png")');
    expect(source).toContain(
      'lighthouseAsset("concepts/worktrackingsystem_AzureDevOps.png")',
    );
    expect(source).toContain(
      'lighthouseAsset("concepts/azuredevops_team_wizard.png")',
    );
  });

  it("LighthouseSection.tsx serves the team detail slot via lighthouseAsset", () => {
    expect(lighthouseSection()).toContain(
      'lighthouseAsset("features/teamdetail.png")',
    );
  });
});

describe("non-product surfaces stay website-hosted (DDD-9 / DDD-5 exclusions)", () => {
  it("Lighthouse.tsx keeps GitHub.png as a bundled asset", () => {
    expect(lighthousePage()).toContain(
      'import gitHubImage from "@/assets/screenshots/GitHub.png"',
    );
  });

  it("Lighthouse.tsx keeps the OG/SEO image on the same origin, not the CDN", () => {
    const source = lighthousePage();
    expect(source).toContain("https://letpeople.work/forecasts-project.png");
    expect(source).not.toContain(
      'lighthouseAsset("forecasts-project.png")',
    );
  });
});
