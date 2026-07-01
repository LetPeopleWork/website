// Post-build step for the GitHub Pages SPA.
//
// Vite ships a single index.html whose <head> meta is set for the homepage.
// react-helmet-async rewrites per-page meta in the browser, but social-link
// scrapers (LinkedIn, Slack, X, Facebook) and non-JS crawlers never run JS, so
// every shared subpage link would otherwise show the homepage card.
//
// This writes a static index.html per route with that route's own title,
// description, and Open Graph / Twitter tags baked into the <head>. No headless
// browser required: scrapers only read <head>, and Google renders the JS for
// full body content. Replaces the manual "cp index.html" fallback step.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://letpeople.work";
const template = readFileSync(join(DIST, "index.html"), "utf8");

// Routes that get their own <head> meta.
const seoRoutes = [
  {
    path: "lighthouse",
    title: "Lighthouse - Flow Metrics & Forecasting Tool | LetPeopleWork",
    description:
      "Self-hosted, open-source flow metrics and probabilistic forecasting. Connects to Jira, Azure DevOps, and Linear. Turn your real delivery history into forecasts you can defend, from team to portfolio.",
  },
  {
    path: "ai",
    title: "Less Hype. More Working AI. | LetPeopleWork",
    description:
      "Practical AI from LetPeopleWork: obAIa, our open-source Claude Code plugins, and a hands-on AI workshop journey that turns AI from an open browser tab into real work.",
  },
  {
    path: "assessment",
    title: "Delivery Predictability Assessment | LetPeopleWork",
    description:
      "A free, honest, five-minute read on how predictable your delivery really is, across what you measure and how you forecast. Six questions, one clear score, no email required.",
  },
];

// Utility routes: plain SPA fallback so direct URLs resolve. No meta override.
const fallbackRoutes = ["admin/dashboard", "admin/assessment", "survey"];

const escapeAttr = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function applyMeta(html, { title, description, url }) {
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`],
    [/(<meta name="description" content=")[\s\S]*?(")/, `$1${d}$2`],
    [/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${t}$2`],
    [/(<meta property="og:description" content=")[\s\S]*?(")/, `$1${d}$2`],
    [/(<meta property="og:url" content=")[\s\S]*?(")/, `$1${url}$2`],
    [/(<meta name="twitter:title" content=")[\s\S]*?(")/, `$1${t}$2`],
    [/(<meta name="twitter:description" content=")[\s\S]*?(")/, `$1${d}$2`],
    [/(<meta name="twitter:url" content=")[\s\S]*?(")/, `$1${url}$2`],
    [/(<link rel="canonical" href=")[\s\S]*?(")/, `$1${url}$2`],
  ];
  let out = html;
  for (const [re, rep] of swaps) {
    if (!re.test(out)) console.warn(`[prerender-meta] pattern not found: ${re}`);
    out = out.replace(re, rep);
  }
  return out;
}

function writeRoute(routePath, html) {
  mkdirSync(join(DIST, routePath), { recursive: true });
  writeFileSync(join(DIST, routePath, "index.html"), html);
}

for (const r of seoRoutes) {
  writeRoute(r.path, applyMeta(template, { ...r, url: `${SITE}/${r.path}` }));
  console.log(`[prerender-meta] wrote /${r.path} with page meta`);
}
for (const p of fallbackRoutes) {
  writeRoute(p, template);
  console.log(`[prerender-meta] wrote /${p} (SPA fallback)`);
}
console.log("[prerender-meta] done");
