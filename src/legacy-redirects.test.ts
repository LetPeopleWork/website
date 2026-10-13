import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Static redirect pages for URLs of the pre-2026 site (public/<old path>/index.html).
// GitHub Pages cannot send a 301, so each page carries a canonical link and an
// immediate meta refresh to the same target, plus noindex.
const findStubs = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return findStubs(full);
    return name === "index.html" && readFileSync(full, "utf8").includes('http-equiv="refresh"') ? [full] : [];
  });

const stubs = findStubs("public");

describe("legacy URL redirects", () => {
  it("covers every old URL that returned 404 in October 2026", () => {
    const paths = stubs.map((f) => f.replace(/^public\//, "/").replace(/\/index\.html$/, ""));
    for (const old of ["/blog", "/about-us", "/privacy-policy", "/flowpulse", "/montecarlocsv", "/flowmetricscsv", "/post/kanban-mythbusters", "/post/forecasting-using-monte-carlo-simulations"]) {
      expect(paths).toContain(old);
    }
  });

  it.each(stubs)("%s points canonical and refresh at the same target and is noindex", (file) => {
    const html = readFileSync(file, "utf8");
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    const refresh = html.match(/content="0; url=([^"]+)"/)?.[1];
    expect(canonical).toBeTruthy();
    expect(refresh).toBe(canonical);
    expect(html).toContain('name="robots" content="noindex"');
    expect(canonical).toMatch(/^https:\/\//);
  });
});
