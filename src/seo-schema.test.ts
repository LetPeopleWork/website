import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import faqs from "@/content/lighthouse-faq.json";
import film from "@/content/lighthouse-film.json";
import journey from "@/content/ai-journey.json";
import videos from "@/content/videos.json";
import prices from "@/lib/pricing.json";
// @ts-expect-error - plain .mjs build script without type declarations
import { jsonLdTag, schemaFor } from "../scripts/seo-schema.mjs";

// The structured data that prerender-meta.mjs writes into each route's static
// <head>. It has to agree with what the pages show, and appear once per page.
type Node = Record<string, unknown> & { "@type": string };

const data = { prices, film, faqs, journey, videos };
const graph = (route: string): Node[] => schemaFor(route, data)["@graph"];
const ofType = (route: string, type: string) => graph(route).filter((n) => n["@type"] === type);
const offerPrice = (offers: Array<{ name: string; price: string }>, name: string) =>
  offers.find((o) => o.name === name)?.price;

describe("static structured data", () => {
  const routes = ["", "lighthouse", "sizing-poker", "ai", "assessment"];

  it.each(routes)("gives route '%s' one schema.org graph with the site and the organisation", (route) => {
    const schema = schemaFor(route, data);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(ofType(route, "WebSite")).toHaveLength(1);
    expect(ofType(route, "Organization")).toHaveLength(1);
  });

  it("gives routes it does not know about nothing", () => {
    expect(schemaFor("admin/dashboard", data)).toBeNull();
  });

  it("takes the Lighthouse prices from pricing.json, on the homepage and on /lighthouse", () => {
    for (const route of ["", "lighthouse"]) {
      const [app] = ofType(route, "SoftwareApplication");
      const offers = app.offers as Array<{ name: string; price: string }>;
      expect(offerPrice(offers, "Lighthouse Community")).toBe("0");
      expect(offerPrice(offers, "Lighthouse Self-Service")).toBe(prices.selfServiceAmount);
      expect(offerPrice(offers, "Lighthouse Enterprise")).toBe(prices.enterpriseAmount);
      // Google's Rich Results Test rejects a UnitPriceSpecification on these offers.
      expect(JSON.stringify(offers)).not.toContain("priceSpecification");
    }
  });

  it("types no price into the build script", () => {
    const source = readFileSync(join(__dirname, "../scripts/seo-schema.mjs"), "utf8");
    for (const amount of [prices.selfServiceAmount, prices.enterpriseAmount, prices.aiWorkshopPilotAmount, "999"]) {
      expect(source).not.toContain(`"${amount}"`);
    }
  });

  it("carries no star ratings, because nobody gave any", () => {
    for (const route of routes) {
      const json = JSON.stringify(schemaFor(route, data));
      expect(json).not.toContain("aggregateRating");
      expect(json).not.toContain('"Review"');
    }
  });

  it("puts every FAQ the page shows into the FAQPage", () => {
    const [page] = ofType("lighthouse", "FAQPage");
    const questions = (page.mainEntity as Array<{ name: string }>).map((q) => q.name);
    expect(questions).toEqual(faqs.map((f) => f.question));
  });

  it("describes the film with an ISO duration and a same-origin poster first", () => {
    const [app] = ofType("lighthouse", "SoftwareApplication");
    const videos = app.video as Array<Record<string, unknown>>;
    const filmVideo = videos.find((v) => v.name === film.title);
    expect(filmVideo).toBeDefined();
    expect(filmVideo?.duration).toBe("PT1M15S");
    // Google's Rich Results Test flags an upload date without a time zone.
    expect(filmVideo?.uploadDate).toBe(`${film.uploadDate}T00:00:00Z`);
    expect((filmVideo?.thumbnailUrl as string[])[0]).toBe(film.posterUrl);
    // The Refinement video plays on the Refinement tab of the same page.
    expect(videos.map((v) => v.name)).toContain(data.videos.refinement.title);
  });

  it("lists every AI workshop at the pilot price the page shows", () => {
    const courses = ofType("ai", "Course");
    expect(courses.map((c) => c.name)).toEqual(journey.map((s) => s.title));
    for (const course of courses) {
      expect((course.offers as { price: string }).price).toBe(prices.aiWorkshopPilotAmount);
    }
  });

  it("uses the trailing-slash URLs that GitHub Pages serves in breadcrumbs", () => {
    const [crumbs] = ofType("lighthouse", "BreadcrumbList");
    const items = (crumbs.itemListElement as Array<{ item: string }>).map((i) => i.item);
    expect(items).toEqual(["https://letpeople.work/", "https://letpeople.work/lighthouse/"]);
  });

  it("cannot close its own script tag early", () => {
    const tag: string = jsonLdTag({ name: "</script><script>alert(1)</script>" });
    expect(tag.match(/<\/script>/g)).toHaveLength(1);
    expect(JSON.parse(tag.replace(/^<script[^>]*>|<\/script>$/g, "")).name).toContain("</script>");
  });
});

// The React pages used to render their own JSON-LD at runtime. With the static
// copy in the HTML, a second one would give Google every block twice.
describe("runtime structured data", () => {
  const sourceFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
    });

  it("is rendered by no component", () => {
    const offenders = sourceFiles(join(__dirname)).filter((f) =>
      readFileSync(f, "utf8").includes("application/ld+json"),
    );
    expect(offenders).toEqual([]);
  });
});
