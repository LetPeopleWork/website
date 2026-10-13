// Static page content for crawlers that do not run JavaScript.
//
// The site is a React SPA. Google renders JavaScript, but most AI crawlers
// (GPTBot, ClaudeBot, PerplexityBot and others) read only the raw HTML, which
// used to hold about 150 words per page. prerender-meta.mjs puts the body of
// each route below into that route's index.html, inside #root. Visitors with
// JavaScript never see it: a class on <html> hides it at once, and React
// replaces it when the app mounts. Visitors without JavaScript get it as a
// readable page.
//
// Keep it factual and in step with the real pages. Every claim here is on the
// site, in the Lighthouse docs or in the privacy policy. Prices come from
// src/lib/pricing.json and the FAQ from src/content/lighthouse-faq.json, the
// same files the pages render.

import { readFileSync } from "node:fs";

const SITE = "https://letpeople.work";
const DOCS = "https://docs.lighthouse.letpeople.work";
const GITHUB = "https://github.com/LetPeopleWork/Lighthouse";

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const loadFaq = (path = "src/content/lighthouse-faq.json") =>
  JSON.parse(readFileSync(path, "utf8"));

export const loadPrices = (path = "src/lib/pricing.json") =>
  JSON.parse(readFileSync(path, "utf8"));

export const renderFaq = (faqs) =>
  faqs.map((f) => `<h3>${esc(f.question)}</h3>\n<p>${esc(f.answer)}</p>`).join("\n");

const nav = `<nav aria-label="Site">
<a href="${SITE}/">LetPeopleWork</a> ·
<a href="${SITE}/lighthouse/">Lighthouse</a> ·
<a href="${SITE}/sizing-poker/">Sizing Poker</a> ·
<a href="${SITE}/compare/">Lighthouse vs ActionableAgile vs Nave</a> ·
<a href="${DOCS}">Documentation</a> ·
<a href="${GITHUB}">Source on GitHub</a>
</nav>`;

const footer = `<p>LetPeopleWork GmbH, Switzerland. Built by Peter Zylka-Greger and Benjamin Huser-Berta. Contact: contact@letpeople.work. Machine-readable summary: <a href="${SITE}/llms.txt">${SITE}/llms.txt</a></p>`;

export const homeBody = (prices) => `${nav}
<main>
<h1>When will it be done? Lighthouse answers with the odds.</h1>
<p>Every guess that slips costs you a little more trust. Lighthouse is a self-hosted flow metrics and Monte Carlo forecasting tool for software delivery teams. It looks at what your team has finished in Jira, Azure DevOps, Linear or ServiceNow and tells you how likely each date is.</p>
<h2>What it does</h2>
<ul>
<li>Forecasts when a set of work items will be done, and how many items will be done by a date, from the team's own throughput. No story points and no estimation meeting.</li>
<li>Shows cycle time, throughput, work in progress (WIP), work item age, blocked and stale items, each with a red, amber or green signal.</li>
<li>Combines the forecasts of several teams working on one feature into one forecast, and shows a delivery timeline per feature.</li>
<li>Checks its own forecasts with Forecast Reality Check, which forecasts weeks that already happened and compares the result with what the team finished.</li>
</ul>
<h2>Where it runs</h2>
<p>You install Lighthouse yourself: a desktop app for Windows, macOS and Linux, a Docker container, or Kubernetes with the official Helm chart. It connects to Jira Cloud and Jira Server or Data Center, Azure DevOps, Linear, ServiceNow and CSV. Your work items stay on your systems. The source is public on GitHub under a source-available licence.</p>
<h2>What it costs</h2>
<p>The Community edition is free for up to 3 teams and 1 portfolio. Self-Service is ${prices.selfService} a year with no limits. Enterprise is ${prices.enterprise} a year and adds priority support. You can try Premium for 30 days without signing up or giving a credit card.</p>
<h2>Also from LetPeopleWork</h2>
<p><a href="${SITE}/sizing-poker/">Sizing Poker</a> sizes a backlog without story points: one question per item, could we finish this within the time we set? It is free and runs in the browser. The <a href="${SITE}/assessment/">delivery predictability assessment</a> is a free five-minute self-check.</p>
<p><a href="${SITE}/lighthouse/">Lighthouse in detail, with pricing and downloads</a></p>
</main>
${footer}`;

export const lighthouseBody = (faqs, prices) => `${nav}
<main>
<h1>Lighthouse: flow metrics and Monte Carlo forecasts for software delivery</h1>
<p>Know how likely your date is before you promise it. Lighthouse is a self-hosted, source-available tool that turns your team's delivery history into probabilistic forecasts and flow metrics, for one team or a whole portfolio. It runs on your laptop or inside your network and connects to Jira Cloud and Data Center, Azure DevOps, Linear and ServiceNow. It is a self-hosted alternative to ActionableAgile and Nave, and the Community edition is free for up to 3 teams.</p>

<h2>Questions Lighthouse answers</h2>
<h3>When will it be done?</h3>
<p>Ask about 10 items and you get dates with their odds, for example 50% by 14 March and 85% by 28 March. Ask about a date and you get how many items will probably make it. Lighthouse runs a Monte Carlo simulation over the team's past throughput, so nobody has to estimate. It assumes the next weeks look roughly like the last ones; holidays can be blocked out.</p>
<h3>What's stuck right now?</h3>
<p>Work in progress, work item age, blocked and stale items, each red, amber or green. Items at risk of missing the team's service level expectation (SLE) are listed while there is still time to act.</p>
<h3>Which features make the release?</h3>
<p>The delivery timeline shows one bar per feature, from the forecast start to the forecast finish, with dependencies from your tracker drawn as lines. Features that will not start before the target date are marked.</p>
<h3>How is the portfolio doing?</h3>
<p>The same flow metrics one level up, and a forecast for every feature. When several teams work on one feature, Lighthouse combines their simulations into one probability, which is lower than any single team's odds because all of them have to make it.</p>
<h3>How much should we refine?</h3>
<p>Lighthouse forecasts how many items the team will pull before the refinement after next, and the team sizes each item with one question: could we finish it within our SLE?</p>

<h2>Forecasts you can check</h2>
<p>Forecast Reality Check forecasts weeks that already happened, as if they had not, and compares the result with what the team really finished, for every percentile and sampling window. When Peter Zylka-Greger backtested his own team, the 85% forecast said 12 items for two weeks; the team finished 16.</p>

<h2>Flow metrics</h2>
<ul>
<li>Cycle time scatterplot and percentiles, named cycle times</li>
<li>Throughput run chart and total throughput</li>
<li>Work in progress and work item age, with pace bands</li>
<li>Blocked items over time and stale items</li>
<li>Risk of missing the service level expectation (SLE)</li>
<li>Process behaviour charts, percentiles over time, cumulative time in state</li>
<li>Feature size percentiles and a predictability score</li>
</ul>

<h2>Where it runs and what it connects to</h2>
<ul>
<li>Desktop app for Windows, macOS and Linux, a Docker container, or Kubernetes with the official Helm chart.</li>
<li>Jira Cloud, and Jira Server or Data Center with a personal access token. Azure DevOps, Linear, ServiceNow and CSV. OAuth for Jira Cloud and Azure DevOps on paid editions.</li>
<li>Your work items stay in Lighthouse's own database on your systems. Usage data to LetPeopleWork is off unless someone turns it on, and it never contains work items, names or queries.</li>
<li>The source is public on <a href="${GITHUB}">GitHub</a> under the Lighthouse Source Available License.</li>
<li>AI assistants such as Claude or Copilot can read the metrics and run forecasts through Lighthouse's MCP server. There is also a command line client, lh.</li>
</ul>

<h2>Editions and pricing</h2>
<ul>
<li>Community: free, up to 3 teams, 1 portfolio and 1 delivery, all core flow metrics and Monte Carlo forecasts.</li>
<li>Self-Service: ${prices.selfService} a year, unlimited teams and portfolios, sign-in and role-based access, rule-based deliveries, data sync mappings.</li>
<li>Enterprise: ${prices.enterprise} a year, everything in Self-Service plus priority support and onboarding calls.</li>
<li>Try Premium free for 30 days: the license comes by email, with no account and no credit card.</li>
</ul>
<p>Compared with ActionableAgile and Nave: <a href="${SITE}/compare/">${SITE}/compare/</a></p>

<h2>Questions people ask us</h2>
${renderFaq(faqs)}

<p>Downloads: <a href="${GITHUB}/releases">${GITHUB}/releases</a>. Documentation: <a href="${DOCS}">${DOCS}</a>. Blog: <a href="https://blog.letpeople.work">blog.letpeople.work</a>.</p>
</main>
${footer}`;

// Short pages: the earlier noscript text, now readable as page content.
export const simpleBody = (inner) => `${nav}
<main>
${inner.trim()}
</main>
${footer}`;
