import { describe, expect, it } from "vitest";
import faqs from "@/content/lighthouse-faq.json";
import prices from "@/lib/pricing.json";
// @ts-expect-error - plain .mjs build script without type declarations
import { homeBody, lighthouseBody, renderFaq } from "../scripts/seo-content.mjs";

// The static text that crawlers without JavaScript read (GPTBot, ClaudeBot,
// PerplexityBot). It has to stay in step with the real pages.
describe("crawler-readable page content", () => {
  const lighthouse: string = lighthouseBody(faqs, prices);
  const home: string = homeBody(prices);

  it("renders every FAQ the page shows, from the same file", () => {
    for (const faq of faqs) {
      expect(lighthouse).toContain(renderFaq([faq]).split("\n")[0]);
    }
  });

  it("says what Lighthouse is, where it runs and what it connects to", () => {
    expect(lighthouse).toMatch(/<h1>[^<]*Monte Carlo/);
    for (const fact of ["Jira Server or Data Center", "Azure DevOps", "Linear", "ServiceNow", "Helm chart", "MCP server", "Forecast Reality Check", "Reports tab"]) {
      expect(lighthouse).toContain(fact);
    }
  });

  it("states the prices that the pricing cards show", () => {
    expect(lighthouse).toContain("CHF 2,000 a year");
    expect(lighthouse).toContain("CHF 10,000 a year");
    expect(home).toContain("free for up to 3 teams");
  });

  it("never calls Lighthouse open source", () => {
    expect(lighthouse).not.toMatch(/open[- ]source/i);
    expect(home).not.toMatch(/open[- ]source/i);
    expect(lighthouse).toContain("Source Available License");
  });
});
