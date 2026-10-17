import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import faqs from "@/content/lighthouse-faq.json";
import prices from "@/lib/pricing.json";
// @ts-expect-error - plain .mjs build scripts without type declarations
import { guideMarkdown, htmlToMarkdown, renderGuidePage } from "../scripts/guide-page.mjs";
// @ts-expect-error - plain .mjs build script without type declarations
import { loadGuides } from "../scripts/guides/index.mjs";
// @ts-expect-error - plain .mjs build script without type declarations
import { guideSchema, jsonLdTag } from "../scripts/seo-schema.mjs";
// @ts-expect-error - plain .mjs build script without type declarations
import { buildLlmsFull } from "../scripts/llms-full.mjs";
// @ts-expect-error - plain .mjs build script without type declarations
import { lighthouseBody } from "../scripts/seo-content.mjs";

// The static guide pages (/compare/, /azure-devops-forecasting/,
// /jira-forecasting-without-story-points/) and llms-full.txt, which the build
// writes from scripts/guides. They are what Google and AI assistants quote, so
// they have to be complete, linked and honest.
type Faq = { question: string; answer: string };
type Guide = {
  path: string;
  title: string;
  description: string;
  navLabel: string;
  eyebrow: string;
  h1: string;
  lede: string;
  body: string;
  faqs: Faq[];
  published: string;
  updated: string;
};

const guides: Guide[] = loadGuides(prices);
const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
const page = (g: Guide) => renderGuidePage(g, guides, jsonLdTag(guideSchema(g)));
const text = (g: Guide) => guideMarkdown(g);

describe.each(guides.map((g) => [g.path, g] as const))("guide /%s/", (path, guide) => {
  const html: string = page(guide);

  it("has one title, a description that fits a search result, and a trailing-slash canonical", () => {
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(guide.title.length).toBeLessThanOrEqual(70);
    expect(guide.description.length).toBeGreaterThanOrEqual(110);
    expect(guide.description.length).toBeLessThanOrEqual(165);
    expect(html).toContain(`<link rel="canonical" href="https://letpeople.work/${path}/" />`);
    expect(guide.updated >= guide.published).toBe(true);
  });

  it("carries one structured data block with the article, the breadcrumbs and every question", () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    expect(blocks).toHaveLength(1);
    const graph: Array<Record<string, unknown>> = JSON.parse(blocks[0][1])["@graph"];
    const types = graph.map((n) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["TechArticle", "BreadcrumbList", "FAQPage"]));
    const faq = graph.find((n) => n["@type"] === "FAQPage") as { mainEntity: Array<{ name: string }> };
    expect(faq.mainEntity.map((q) => q.name)).toEqual(guide.faqs.map((f) => f.question));
  });

  it("is counted by Plausible and leads to the Lighthouse page", () => {
    expect(html).toContain('data-domain="letpeople.work"');
    expect(html).toContain('href="https://letpeople.work/lighthouse/');
  });

  it("only states prices that pricing.json holds", () => {
    const quoted = [...text(guide).matchAll(/CHF [\d,']+/g)].map(([m]) => m);
    const known = Object.values(prices).filter((v) => v.startsWith("CHF"));
    for (const price of quoted) expect(known).toContain(price);
  });

  it("never calls Lighthouse open source", () => {
    expect(text(guide)).not.toMatch(/open[- ]source/i);
  });

  // Peter's voice rules: no em dashes, none of the words that make copy read
  // as generated (Wikipedia, "Signs of AI writing").
  it("avoids the usual signs of AI writing", () => {
    const words = text(guide);
    expect(words).not.toContain("—");
    for (const tell of [
      "leverage", "seamless", "unlock", "empower", "delve", "game changer", "game-changer",
      "robust", "cutting-edge", "foster", "pivotal", "crucial", "quietly", "not just",
      "in today's", "landscape", "testament", "insights",
    ]) {
      expect(words.toLowerCase()).not.toContain(tell);
    }
  });

  it("is linked from the sitemap, llms.txt and the site footer", () => {
    const url = `https://letpeople.work/${path}/`;
    expect(read("public/sitemap.xml")).toContain(`<loc>${url}</loc>`);
    expect(read("public/llms.txt")).toContain(`(${url})`);
    expect(read("src/components/SimpleFooter.tsx")).toContain(`"/${path}/"`);
  });

  it("is not also a hand-written file in public/, which the build would overwrite", () => {
    expect(existsSync(join(root, "public", path, "index.html"))).toBe(false);
  });
});

describe("llms-full.txt", () => {
  const full: string = buildLlmsFull({
    llms: read("public/llms.txt"),
    lighthouseHtml: lighthouseBody(faqs, prices),
    guides,
    date: "2026-10-17",
  });

  it("holds the summary, the product page with its FAQ, and every guide", () => {
    expect(full).toContain("# Part 1: Summary (llms.txt)");
    for (const faq of faqs) expect(full).toContain(faq.question);
    for (const guide of guides) {
      expect(full).toContain(`## ${guide.h1}`);
      for (const faq of guide.faqs) expect(full).toContain(faq.question);
    }
    expect(full).not.toMatch(/<\/?(p|h\d|li|table|a)\b/);
  });

  it("states the edition prices from pricing.json", () => {
    expect(full).toContain(prices.selfService);
    expect(full).toContain(prices.enterprise);
  });
});

describe("the Markdown converter", () => {
  it("turns headings, links, lists and tables into Markdown", () => {
    const md: string = htmlToMarkdown(
      '<h2>Side by side</h2><p>See <a href="https://x.test/">the docs</a> &amp; more.</p><ul><li>One</li><li>Two</li></ul>' +
        "<table><thead><tr><th></th><th>A</th></tr></thead><tbody><tr><th>Price</th><td>Free</td></tr></tbody></table>",
    );
    expect(md).toBe(
      "### Side by side\n\nSee [the docs](https://x.test/) & more.\n\n- One\n- Two\n\n|  | A |\n| --- | --- |\n| Price | Free |",
    );
  });
});
