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
//
// `noscript` is the crawlable body fallback for the route, swapped into the
// template's <noscript> block. Without it every route ships the homepage's
// block, so all pages look byte-identical to anything that reads raw HTML —
// which is how the whole site ended up in Search Console's "Crawled, currently
// not indexed" bucket. Keep each one short, factual, and unique to its page.
const seoRoutes = [
  {
    path: "lighthouse",
    title: "Lighthouse - Flow Metrics & Forecasting Tool | LetPeopleWork",
    description:
      "Self-hosted, open-source flow metrics and probabilistic forecasting. Connects to Jira, Azure DevOps, Linear, and ServiceNow. Turn your real delivery history into forecasts you can defend, from team to portfolio.",
    noscript: `
      <h1>Lighthouse by LetPeopleWork</h1>
      <p>Lighthouse is an open-source, self-hosted flow metrics and Monte Carlo forecasting tool for software delivery teams. It is a free, self-hosted alternative to ActionableAgile and Nave.</p>
      <p>It connects to Jira, Azure DevOps, and Linear, turns a team's real delivery history into probabilistic delivery forecasts, and shows where the delivery system is losing speed, including blocked work and predictability trends over time. AI assistants can query the flow data directly over MCP (Model Context Protocol). It runs as a native desktop app (Windows, macOS, Linux), as a Docker container, or on Kubernetes via an official Helm chart.</p>
      <p>Editions, all self-hosted and open source: Community is free forever (up to 3 teams and 1 portfolio). Self-Service is CHF 2,000 per year, with unlimited teams and portfolios. Enterprise is CHF 10,000 per year with prioritised support. Your data always stays on your own infrastructure.</p>
      <p>A comparison with ActionableAgile and Nave is at <a href="https://letpeople.work/compare/">https://letpeople.work/compare/</a>, and a machine-readable summary at https://letpeople.work/llms.txt</p>
    `,
  },
  {
    path: "ai",
    title: "Less Hype. More Working AI. | LetPeopleWork",
    description:
      "Practical AI from LetPeopleWork: obAIa, our open-source Claude Code plugins, and a hands-on AI workshop journey that turns AI from an open browser tab into real work.",
    image: `${SITE}/og/ai.png`,
    imageAlt: "Less hype. More working AI. AI at LetPeopleWork.",
    noscript: `
      <h1>Less Hype. More Working AI. - AI at LetPeopleWork</h1>
      <p>Practical AI from LetPeopleWork: obAIa, our open-source Claude Code plugins, and a hands-on AI workshop journey that turns AI from an open browser tab into real work.</p>
      <p>LetPeopleWork GmbH is a Swiss consultancy in flow, forecasting, and delivery. Details on the tooling and workshops are at https://letpeople.work/ai, with a machine-readable summary at https://letpeople.work/llms.txt</p>
    `,
  },
  {
    path: "assessment",
    title: "Delivery Predictability Assessment | LetPeopleWork",
    description:
      "A free, honest, five-minute read on how predictable your delivery really is, across what you measure and how you forecast. Six questions, one clear score, no email required.",
    image: `${SITE}/og/assessment.png`,
    imageAlt: "How predictable is your delivery? Free five-minute assessment.",
    noscript: `
      <h1>Delivery Predictability Assessment</h1>
      <p>A free, honest, five-minute read on how predictable your delivery really is, across what you measure and how you forecast. Six questions, one clear score, and a concrete next step. No email required.</p>
      <p>The assessment is grounded in flow metrics and probabilistic forecasting, the same foundations behind Lighthouse, LetPeopleWork's open-source flow metrics and forecasting tool: https://letpeople.work/lighthouse</p>
    `,
  },
  {
    // Unlisted on purpose: shipped for link-only access while the mechanism is
    // being dogfooded. Deliberately absent from sitemap.xml and llms.txt too.
    // To launch it: drop `noindex`, add the sitemap + llms.txt entries, and add
    // a nav link.
    path: "sizing-poker",
    title: "Sizing Poker - Size Your Backlog Against Your SLE | LetPeopleWork",
    description:
      "Size a backlog by asking one question per item: could we finish this within the time we set? Three answers, no story points. Free, no signup, runs entirely in your browser.",
    image: `${SITE}/og/sizing-poker.jpg`,
    imageAlt: "Does it fit? One question per work item. Three answers. No story points.",
    noindex: true,
    noscript: `
      <h1>Sizing Poker - Does it fit?</h1>
      <p>Size a backlog by asking one question per work item instead of estimating it: could we finish this within the time we set? Three answers, no story points. A Product Owner or Scrum Master runs it, alone or with the team round a shared screen. Free, no signup, and nothing leaves the browser.</p>
    `,
  },
];

// Utility routes: SPA fallback so direct URLs resolve, kept out of search.
// They are empty shells without JavaScript, and the admin pages are internal,
// so indexing them only feeds the "crawled, currently not indexed" pile.
const fallbackRoutes = [
  { path: "admin/dashboard", title: "Admin dashboard | LetPeopleWork" },
  { path: "admin/assessment", title: "Admin dashboard | LetPeopleWork" },
  { path: "survey", title: "Survey | LetPeopleWork" },
  // Walkthrough style prototypes, link-only for comparison. Remove once a
  // style is chosen.
  { path: "sizing-poker-2", title: "Sizing Poker prototype | LetPeopleWork" },
  { path: "sizing-poker-3", title: "Sizing Poker prototype | LetPeopleWork" },
];

const FALLBACK_NOSCRIPT = `
      <p>This page is an interactive tool and needs JavaScript to run. The main site is at <a href="https://letpeople.work/">https://letpeople.work/</a></p>
    `;

const escapeAttr = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Swaps the template's <noscript> body fallback (the homepage's) for the
// route's own. A replacer function, not a replacement string, so "$" in the
// content can never be misread as a capture-group reference.
const swapNoscript = (html, content) =>
  html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => `<noscript>${content}</noscript>`);

function applyMeta(html, { title, description, url, image, imageAlt, noindex, noscript }) {
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const swaps = [
    // Unlisted routes: live, reachable by link, but kept out of search results
    // and AI crawlers. Must match the noIndex prop on the page's <SEO>.
    [
      /(<meta name="robots" content=")[\s\S]*?(")/,
      noindex ? `$1noindex, nofollow$2` : "$&",
    ],
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
  if (image) {
    swaps.push(
      [/(<meta property="og:image" content=")[\s\S]*?(")/, `$1${image}$2`],
      [/(<meta name="twitter:image" content=")[\s\S]*?(")/, `$1${image}$2`],
    );
  }
  if (imageAlt) {
    const a = escapeAttr(imageAlt);
    // The static template has no image:alt tags, so inject them next to the
    // image tags rather than swapping.
    swaps.push(
      [
        /(<meta property="og:image" content="[^"]*" \/>)/,
        `$1\n    <meta property="og:image:alt" content="${a}" />`,
      ],
      [
        /(<meta name="twitter:image" content="[^"]*" \/>)/,
        `$1\n    <meta name="twitter:image:alt" content="${a}" />`,
      ],
    );
  }
  let out = html;
  for (const [re, rep] of swaps) {
    if (!re.test(out)) console.warn(`[prerender-meta] pattern not found: ${re}`);
    out = out.replace(re, rep);
  }
  if (noscript) {
    out = swapNoscript(out, noscript);
  }
  return out;
}

function writeRoute(routePath, html) {
  mkdirSync(join(DIST, routePath), { recursive: true });
  writeFileSync(join(DIST, routePath, "index.html"), html);
}

for (const r of seoRoutes) {
  // GitHub Pages 301s /route to /route/, so canonical/og URLs use the
  // trailing-slash form to match what is actually served.
  writeRoute(r.path, applyMeta(template, { ...r, url: `${SITE}/${r.path}/` }));
  console.log(`[prerender-meta] wrote /${r.path} with page meta`);
}
for (const { path, title } of fallbackRoutes) {
  let html = template
    .replace(/(<meta name="robots" content=")[\s\S]*?(")/, "$1noindex, nofollow$2")
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = swapNoscript(html, FALLBACK_NOSCRIPT);
  writeRoute(path, html);
  console.log(`[prerender-meta] wrote /${path} (SPA fallback, noindex)`);
}
console.log("[prerender-meta] done");
