// Post-build step for the GitHub Pages SPA.
//
// Vite ships a single index.html whose <head> meta is set for the homepage.
// react-helmet-async rewrites per-page meta in the browser, but social-link
// scrapers (LinkedIn, Slack, X, Facebook) and non-JS crawlers never run JS, so
// every shared subpage link would otherwise show the homepage card.
//
// This writes a static index.html per route with that route's own title,
// description, Open Graph / Twitter tags and structured data (JSON-LD, built
// by seo-schema.mjs) baked into the <head>. No headless
// browser required: scrapers only read <head>, and Google renders the JS for
// full body content. Replaces the manual "cp index.html" fallback step.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homeBody, lighthouseBody, loadFaq, loadPrices, simpleBody } from "./seo-content.mjs";
import { guideSchema, jsonLdTag, loadSchemaData, schemaFor } from "./seo-schema.mjs";
import { renderGuidePage } from "./guide-page.mjs";
import { loadGuides } from "./guides/index.mjs";
import { buildLlmsFull } from "./llms-full.mjs";

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
      "Self-hosted, source-available flow metrics and Monte Carlo forecasting. Connects to Jira Cloud and Data Center, Azure DevOps, Linear and ServiceNow. Forecast when work will be done from your teams' own history, from one team to a portfolio.",
    noscript: `
      <h1>Lighthouse by LetPeopleWork</h1>
      <p>Lighthouse is a self-hosted, source-available flow metrics and Monte Carlo forecasting tool for software delivery teams. It is a self-hosted alternative to ActionableAgile and Nave, free for up to 3 teams.</p>
      <p>It connects to Jira Cloud and Data Center, Azure DevOps, Linear and ServiceNow, turns a team's real delivery history into probabilistic delivery forecasts, and shows where the delivery system is losing speed, including blocked work and predictability trends over time. AI assistants can query the flow data directly over MCP (Model Context Protocol). It runs as a native desktop app (Windows, macOS, Linux), as a Docker container, or on Kubernetes via an official Helm chart.</p>
      <p>Editions, all self-hosted with the source public: Community is free forever (up to 3 teams and 1 portfolio). Self-Service is CHF 2,000 per year, with unlimited teams and portfolios. Enterprise is CHF 10,000 per year with prioritised support. Your data always stays on your own infrastructure.</p>
      <p>A comparison with ActionableAgile and Nave is at <a href="https://letpeople.work/compare/">https://letpeople.work/compare/</a>, and a machine-readable summary at https://letpeople.work/llms.txt</p>
    `,
  },
  {
    path: "ai",
    title: "Run your company with AI, in your own environment | LetPeopleWork",
    description:
      "obAIa is how LetPeopleWork runs itself: decisions and work as files in git, AI agents that argue the hard calls, people who decide. We help companies set it up in their own environment.",
    image: `${SITE}/og/ai.png`,
    imageAlt: "Less hype. More working AI. AI at LetPeopleWork.",
    noscript: `
      <h1>We run our company with AI. We can help you set it up in yours.</h1>
      <p>obAIa is the big room of LetPeopleWork, kept as plain Markdown files in a private git repository: decisions, cards, contacts, notes and dates. A Claude Code session on top of it is how the founders work with it, by typing. Three agents with a marketing, a social and a commercial lens argue hard decisions; each decision is kept with its reasoning and a date to revisit it. Views such as the board are computed from the records, and the weekly review agenda is drafted from them. People make every decision.</p>
      <p>LetPeopleWork helps companies set up the same way of working inside their own environment: start with one kind of record, a design day, a build day with Claude Code, one or two connected tools and one scheduled agent, then the weekly habit and a follow-up. So far obAIa runs at LetPeopleWork only; the first setups elsewhere run as pilots.</p>
      <p>Open-source Claude Code plugins (MIT): LetPeopleWorkShop for workshops, LetPeopleGrow for 1:1s, LetPeopleAlign for meeting transcripts. Lighthouse, the flow metrics and forecasting tool, connects to the same agents through its MCP server. AI workshops: four steps at a pilot price of CHF 2,500 per team. Details at https://letpeople.work/ai/ and https://letpeople.work/llms.txt</p>
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
      <p>The assessment is grounded in flow metrics and probabilistic forecasting, the same foundations behind Lighthouse, LetPeopleWork's source-available flow metrics and forecasting tool: https://letpeople.work/lighthouse</p>
    `,
  },
  {
    path: "sizing-poker",
    title: "Sizing Poker - Size Your Backlog Against Your SLE | LetPeopleWork",
    description:
      "Size a backlog by asking one question per item: could we finish this within the time we set? Three answers, no story points. Free, no signup, runs entirely in your browser.",
    image: `${SITE}/og/sizing-poker.jpg`,
    imageAlt: "Does it fit? One question per work item. Three answers. No story points.",
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

// Puts the route's readable content inside #root, where crawlers that do not
// run JavaScript find it as normal page text. The head snippet in index.html
// hides .prerender as soon as JavaScript runs, and React's createRoot replaces
// it on mount, so visitors with JavaScript never see it. The <noscript> block
// is no longer needed for content then; it keeps one line.
const PRERENDER_NOSCRIPT = `
      <p>The interactive parts of this page need JavaScript. The text below covers the content.</p>
    `;
const withBody = (html, body) => {
  if (!html.includes('<div id="root"></div>')) {
    throw new Error("[prerender-meta] template has no empty #root to fill");
  }
  return swapNoscript(html, PRERENDER_NOSCRIPT).replace(
    '<div id="root"></div>',
    () => `<div id="root"><div class="prerender">\n${body}\n</div></div>`,
  );
};

// Puts the route's structured data into its <head>, so crawlers that do not
// run JavaScript see it as well. The React pages render none, so there is
// exactly one copy per page.
const schemaData = loadSchemaData();
const withSchema = (html, route) => {
  const schema = schemaFor(route, schemaData);
  if (!schema) return html;
  if (!html.includes("</head>")) throw new Error("[prerender-meta] template has no </head>");
  return html.replace("</head>", () => `  ${jsonLdTag(schema)}\n  </head>`);
};

const faqs = loadFaq();
const prices = loadPrices();
const bodies = {
  lighthouse: lighthouseBody(faqs, prices),
};

function writeRoute(routePath, html) {
  mkdirSync(join(DIST, routePath), { recursive: true });
  writeFileSync(join(DIST, routePath, "index.html"), html);
}

for (const r of seoRoutes) {
  // GitHub Pages 301s /route to /route/, so canonical/og URLs use the
  // trailing-slash form to match what is actually served.
  const html = applyMeta(template, { ...r, url: `${SITE}/${r.path}/` });
  const body = bodies[r.path] ?? simpleBody(r.noscript);
  writeRoute(r.path, withSchema(withBody(html, body), r.path));
  console.log(`[prerender-meta] wrote /${r.path} with page meta, readable body and structured data`);
}

// The homepage is the template itself; it gets its readable body last, after
// every route above was derived from the untouched template.
writeFileSync(join(DIST, "index.html"), withSchema(withBody(template, homeBody(prices)), ""));
console.log("[prerender-meta] wrote / readable body and structured data");
for (const { path, title } of fallbackRoutes) {
  let html = template
    .replace(/(<meta name="robots" content=")[\s\S]*?(")/, "$1noindex, nofollow$2")
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = swapNoscript(html, FALLBACK_NOSCRIPT);
  writeRoute(path, html);
  console.log(`[prerender-meta] wrote /${path} (SPA fallback, noindex)`);
}
// Guide pages: complete static HTML, no app behind them (guide-page.mjs).
const guides = loadGuides(prices);
for (const guide of guides) {
  writeRoute(guide.path, renderGuidePage(guide, guides, jsonLdTag(guideSchema(guide))));
  console.log(`[prerender-meta] wrote /${guide.path} (guide page)`);
}

// llms-full.txt, from the same sources as the pages.
writeFileSync(
  join(DIST, "llms-full.txt"),
  buildLlmsFull({
    llms: readFileSync(join(DIST, "llms.txt"), "utf8"),
    lighthouseHtml: bodies.lighthouse,
    guides,
    date: new Date().toISOString().slice(0, 10),
  }),
);
console.log("[prerender-meta] wrote /llms-full.txt");
console.log("[prerender-meta] done");
