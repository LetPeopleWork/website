// Builds the Lighthouse executive briefing (public/Lighthouse_Pitch_Deck.pdf),
// the deck the Lighthouse page offers to "convince someone who decides".
//
//   node deck/build-deck.mjs        writes deck/lighthouse-pitch.html and the PDF
//
// The slides are HTML, printed to PDF by a local Chrome or Chromium (headless;
// found on macOS, Windows and Linux, or set CHROME=<path>),
// so they use the site's brand: its colours, the #LetPeople.Work wordmark and
// the product screenshots from the Lighthouse docs. Prices come from
// src/lib/pricing.json, like everywhere else on the site. Every number on a
// slide comes from the founders' blog posts, the Lighthouse docs or simple
// arithmetic shown on the slide, and each exhibit names its source.
//
// Style: consulting-style action titles (the headline states the point),
// one message per slide, an executive summary up front, sources on every
// exhibit. Voice rules from the website apply: no em dashes, no slogans.
//
// A tailored version for one organisation (used by the obAIa pitch-deck skill):
//
//   node deck/build-deck.mjs --config briefing.json --out ~/somewhere/briefing.pdf
//
// The config is JSON; every field is optional and anything left out stays as
// in the public deck. Prices, bios, screenshots and quotes still come from this
// repo, so a tailored deck never carries stale facts.
//   customer            name shown on the cover and in the footer
//   label               footer text instead of "Lighthouse briefing for <customer>"
//   edition             e.g. "November 2026" (default below)
//   slides              slide ids in the order to show them (default: all, see SLIDE_IDS)
//   cover               { kicker, title, subtitle }
//   summary             { title, points: [{ lead, text }] }
//   context             { title, heard: [..], answer: [..] } for the "context" slide
//   integrations        { highlight: ["Jira Cloud", ...] }
//   quotes              names to keep, in order, e.g. ["Chris Graves"]
//   start               { tracker, title, phases: [[when, what, detail], ...], itTitle, it: [[title, text], ...], source }
//   closing             { kicker, title, subtitle, contact }
//   notes               { slideId: "one callout line added below that slide's content" }
//   pages               { slideId: { tracker, title, intro, cards: [{ lead, text, url, link }], source } }
//                       extra slides of link cards (e.g. an onboarding deck); list their
//                       ids in `slides`. `link` is the visible link text, `url` the target.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const configPath = arg("--config");
const cfg = configPath ? JSON.parse(readFileSync(resolve(configPath), "utf8")) : {};
const outArg = arg("--out");
if (configPath && !outArg) {
  console.error("[deck] a tailored deck needs --out, so it never overwrites the public PDF");
  process.exit(1);
}
const prices = JSON.parse(readFileSync(join(root, "src/lib/pricing.json"), "utf8"));
// The founders' bios in their own words, the same file the homepage reads.
const founders = JSON.parse(readFileSync(join(root, "src/content/founders.json"), "utf8"));
const asset = (p) => pathToFileURL(join(root, p)).href;
const cdn = (p) => `https://cdn.jsdelivr.net/gh/LetPeopleWork/Lighthouse@main/docs/assets/${p}`;
const BLOG = "blog.letpeople.work";
const EDITION = cfg.edition || "October 2026";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const BRIEFING = cfg.label ? esc(cfg.label) : cfg.customer ? `Lighthouse briefing for ${esc(cfg.customer)}` : "Lighthouse executive briefing";

// ---------------------------------------------------------------------------
// Slide frame

let pageNo = 0;
let currentId = "";
const slide = ({ tracker, title, body, source, dark = false, cls = "" }) => {
  pageNo += 1;
  if (dark) {
    return `<section class="slide dark ${cls}">${body}</section>`;
  }
  const note = cfg.notes?.[currentId];
  return `<section class="slide ${cls}">
  <header>
    ${tracker ? `<p class="tracker">${esc(tracker)}</p>` : ""}
    <h2>${title}</h2>
  </header>
  <div class="content">${body}${note ? `<div class="callout wide custom">${esc(note)}</div>` : ""}</div>
  <footer>
    <div class="source">${source ? `Source: ${source}` : ""}</div>
    <div class="foot">
      <img class="wordmark" src="${asset("src/assets/LPW_Banner_White.png")}" alt="LetPeopleWork" />
      <span>${BRIEFING} · ${EDITION}</span>
      <span class="num">${String(pageNo).padStart(2, "0")}</span>
    </div>
  </footer>
</section>`;
};

const wordmarkDark = `<span class="wm"><span>#LetPeople</span><span class="wm-green">.Work</span></span>`;

// ---------------------------------------------------------------------------
// Charts (inline SVG, drawn from the numbers given)

const barChart = ({ rows, max, unit = "", width = 620, rowH = 46, labelW = 230 }) => {
  const chartW = width - labelW - 60;
  const h = rows.length * rowH + 10;
  const bars = rows
    .map((r, i) => {
      const y = i * rowH + 8;
      const w = Math.max(2, (r.value / max) * chartW);
      const fill = r.highlight ? "var(--green)" : r.muted ? "#C9D3DD" : "#8FB3A3";
      return `<text x="${labelW - 14}" y="${y + rowH / 2}" class="bar-label" text-anchor="end" dominant-baseline="middle">${esc(r.label)}</text>
<rect x="${labelW}" y="${y + 8}" width="${w}" height="${rowH - 20}" rx="3" fill="${fill}" />
<text x="${labelW + w + 10}" y="${y + rowH / 2}" class="bar-value${r.highlight ? " strong" : ""}" dominant-baseline="middle">${esc(r.display ?? r.value)}${unit}</text>`;
    })
    .join("\n");
  return `<svg viewBox="0 0 ${width} ${h}" width="${width}" height="${h}" class="chart">${bars}</svg>`;
};

const columnChart = ({ cols, max, width = 560, height = 300 }) => {
  const gap = 26;
  const colW = (width - gap * (cols.length + 1)) / cols.length;
  const base = height - 40;
  const items = cols
    .map((c, i) => {
      const x = gap + i * (colW + gap);
      const h = (c.value / max) * (base - 30);
      const y = base - h;
      return `<rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="3" fill="${c.highlight ? "var(--green)" : "#8FB3A3"}" />
<text x="${x + colW / 2}" y="${y - 10}" text-anchor="middle" class="col-value">${esc(c.display)}</text>
<text x="${x + colW / 2}" y="${base + 24}" text-anchor="middle" class="col-label">${esc(c.label)}</text>`;
    })
    .join("\n");
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="chart">
<line x1="${gap / 2}" y1="${base}" x2="${width - gap / 2}" y2="${base}" stroke="#C9D3DD" stroke-width="1.5" />
${items}</svg>`;
};

// ---------------------------------------------------------------------------
// The slides

const defs = {};

// 1. Cover
defs["cover"] = () =>
  slide({
    dark: true,
    cls: "cover",
    body: `
  <div class="cover-top">${wordmarkDark}<span class="cover-kicker">${cfg.cover?.kicker ? esc(cfg.cover.kicker) : cfg.customer ? `Briefing for ${esc(cfg.customer)}` : "Executive briefing"} · ${EDITION}</span></div>
  <div class="cover-main">
    <img class="cover-logo" src="${asset("src/assets/LighthouseLogo.png")}" alt="" />
    <p class="cover-product">Lighthouse</p>
    <h1>${esc(cfg.cover?.title ?? "Know how likely your date is before you promise it")}</h1>
    <p class="cover-sub">${esc(cfg.cover?.subtitle ?? "Flow metrics and Monte Carlo forecasts for software delivery, running on your own systems")}</p>
  </div>
  <div class="cover-bottom"><span>letpeople.work/lighthouse</span><span>LetPeopleWork GmbH · Zürich</span></div>`,
  });

// 2. Executive summary
defs["summary"] = () =>
  slide({
    tracker: "Executive summary",
    title: cfg.summary?.title ? esc(cfg.summary.title) : "Lighthouse replaces estimated dates with forecasts you can check, without moving your data",
    body: cfg.summary?.points
      ? `<ol class="summary">${cfg.summary.points.map((p, i) => `<li><span class="n">${i + 1}</span><div><strong>${esc(p.lead)}</strong> ${esc(p.text ?? "")}</div></li>`).join("")}</ol>`
      : `
  <ol class="summary">
    <li><span class="n">1</span><div><strong>Dates built on estimates miss.</strong> Story points barely track how long work really takes, and a forecast from an average promises more than the team delivers.</div></li>
    <li><span class="n">2</span><div><strong>Lighthouse forecasts from what teams have already finished.</strong> It turns their throughput into dates with odds, for one team or a whole portfolio, with no estimation meetings.</div></li>
    <li><span class="n">3</span><div><strong>The forecasts can be checked.</strong> Forecast Reality Check forecasts weeks that already happened and compares the result with what the team really finished.</div></li>
    <li><span class="n">4</span><div><strong>It runs inside your network.</strong> One installation connects Jira, Azure DevOps, Linear and ServiceNow, and the work items stay in its own database on your systems.</div></li>
    <li><span class="n">5</span><div><strong>It is free to start.</strong> Community covers 3 teams. Self-Service is ${esc(prices.selfService)} and Enterprise ${esc(prices.enterprise)} a year, flat, not per user.</div></li>
  </ol>`,
  });

// 3. The problem: estimates
defs["estimates"] = () =>
  slide({
    tracker: "The problem",
    title: "The same story-point estimate covers work that takes a few days and work that takes almost half a year",
    body: `
  <div class="two-col">
    <div class="exhibit">
      <p class="exhibit-title">Exhibit 1 · How long items estimated at 2 story points really took</p>
      <svg viewBox="0 0 620 230" width="620" height="230" class="chart">
        <text x="47" y="40" class="bar-value strong">a few days</text>
        <text x="${40 + 158 * 3.5}" y="40" text-anchor="end" class="bar-value strong">almost 160 days</text>
        <line x1="47" y1="48" x2="47" y2="64" stroke="var(--green)" stroke-width="2" />
        <line x1="${40 + 158 * 3.5}" y1="48" x2="${40 + 158 * 3.5}" y2="64" stroke="var(--green)" stroke-width="2" />
        <rect x="47" y="64" width="${(158 - 2) * 3.5}" height="52" rx="6" fill="var(--green)" opacity="0.14" />
        <rect x="47" y="64" width="${(158 - 2) * 3.5}" height="52" rx="6" fill="none" stroke="var(--green)" stroke-width="2" />
        <text x="${40 + 80 * 3.5}" y="96" text-anchor="middle" class="bar-label">every item estimated at 2 points</text>
        <line x1="40" y1="150" x2="600" y2="150" stroke="#9AA8B6" stroke-width="1.5" />
        ${[0, 40, 80, 120, 160].map((d) => `<line x1="${40 + d * 3.5}" y1="145" x2="${40 + d * 3.5}" y2="155" stroke="#9AA8B6"/><text x="${40 + d * 3.5}" y="176" text-anchor="middle" class="col-label">${d}</text>`).join("")}
        <text x="320" y="206" text-anchor="middle" class="axis-title">Days from start to finish</text>
      </svg>
      <p class="note">One estimate, one size on the board, and a spread that no plan built on it can absorb.</p>
    </div>
    <div class="side">
      <h3>Why estimates make weak forecasts</h3>
      <ul class="ticks">
        <li>Points barely track time. Plotted against cycle time, they showed almost no relationship.</li>
        <li>Estimates are noisy. Teams estimating similar features land far apart.</li>
        <li>Velocity drifts toward the plan once teams are compared on it.</li>
      </ul>
      <div class="callout">If your teams find points useful for talking through work, keep them for that. A forecast doesn't need them.</div>
    </div>
  </div>`,
    source: `Peter Zylka-Greger, "Reality check through scatter plotting" (2024); "The hidden cost of noise in your delivery predictions" (2026), ${BLOG}`,
  });

// 4. Averages
defs["averages"] = () =>
  slide({
    tracker: "The problem",
    title: "An average promised 37.5 items in 30 days; the team finished 30, close to the 85% forecast of 31",
    body: `
  <div class="two-col">
    <div class="exhibit">
      <p class="exhibit-title">Exhibit 2 · Items forecast for the next 30 days, one team of six developers</p>
      ${barChart({
        max: 40,
        rows: [
          { label: "From the average", value: 37.5, muted: true },
          { label: "Monte Carlo 50%", value: 38 },
          { label: "Monte Carlo 70%", value: 35 },
          { label: "Monte Carlo 85%", value: 31 },
          { label: "Monte Carlo 95%", value: 27 },
          { label: "Actually finished", value: 30, highlight: true },
        ],
      })}
    </div>
    <div class="side">
      <h3>What the exhibit shows</h3>
      <ul class="ticks">
        <li>A forecast from the average is about as good as a coin flip: half the time the team does worse.</li>
        <li>A Monte Carlo forecast puts a probability on every number, so the risk is visible before anyone commits.</li>
        <li>For a promise outside the team, use the 85% line. For something that must make it, use 95%.</li>
      </ul>
    </div>
  </div>`,
    source: `Benjamin Huser-Berta, "The flaw of averages: comparing Monte Carlo simulations with estimates based on averages" (2023), ${BLOG}`,
  });

// 5. How it works
defs["how"] = () =>
  slide({
    tracker: "The solution",
    title: "Lighthouse turns the work a team has finished into dates with their odds",
    body: `
  <div class="two-col wide-right">
    <div class="steps">
      <div class="step"><span class="n">1</span><div><strong>Finished items per day</strong><p>Read from the team's tracker. Every item that reached done has a date; no extra field and no estimate.</p></div></div>
      <div class="step"><span class="n">2</span><div><strong>10,000 simulated futures</strong><p>Each future draws its days at random from the team's own history, holidays and sick days included.</p></div></div>
      <div class="step"><span class="n">3</span><div><strong>Dates with odds</strong><p>When will these items be done, or how many by a date, at 50, 70, 85 and 95%. Forecasts refresh as work finishes.</p></div></div>
    </div>
    <figure class="shot">
      <div class="shot-frame">
        <img src="${asset("public/lighthouse-forecast-panel.png")}" alt="" />
        ${[
          ["95% likely", "61%"],
          ["85% likely", "65.8%"],
          ["70% likely", "70.6%"],
          ["50% likely", "75.4%"],
        ]
          .map(([l, t]) => `<span class="pct" style="top:${t}">${l}</span>`)
          .join("")}
      </div>
      <figcaption>A forecast in Lighthouse for a demo team: 10 items, 85% likely by 13 October.</figcaption>
    </figure>
  </div>`,
    source: "Lighthouse documentation, How Lighthouse forecasts (docs.lighthouse.letpeople.work)",
  });

// 6. Reality Check
defs["reality-check"] = () =>
  slide({
    tracker: "The solution",
    title: "Lighthouse checks its own forecasts against weeks that already happened",
    body: `
  <div class="two-col">
    <div class="side">
      <div class="big-stat">
        <div><span class="stat">12</span><span class="stat-label">items: the 85% forecast for two weeks</span></div>
        <div><span class="stat green">16</span><span class="stat-label">items the team really finished</span></div>
      </div>
      <p class="lead">When Peter backtested his own team, the forecast he would have promised held, with room to spare.</p>
      <ul class="ticks">
        <li>Forecast Reality Check forecasts past weeks as if they hadn't happened yet.</li>
        <li>It compares every percentile and history window with what the team then delivered.</li>
        <li>It tells you which percentile to trust for this team, before a steering committee asks.</li>
      </ul>
    </div>
    <figure class="shot">
      <img class="framed" src="${cdn("features/realitycheck.png")}" alt="" />
      <figcaption>Forecast Reality Check in Lighthouse: backtests per percentile and history window.</figcaption>
    </figure>
  </div>`,
    source: `Peter Zylka-Greger, "How Lighthouse changed the way I work" (2026), ${BLOG}; Lighthouse documentation`,
  });

// 7. Portfolio odds
defs["portfolio"] = () =>
  slide({
    tracker: "Portfolio",
    title: "When several teams work on one feature, the odds of making a date drop fast; Lighthouse shows the joint probability",
    body: `
  <div class="two-col">
    <div class="exhibit">
      <p class="exhibit-title">Exhibit 3 · Chance that every team makes a date each team is 85% sure of</p>
      ${columnChart({
        max: 100,
        cols: [1, 2, 3, 4, 5].map((n) => ({
          label: `${n} team${n > 1 ? "s" : ""}`,
          value: 0.85 ** n * 100,
          display: `${Math.round(0.85 ** n * 100)}%`,
          highlight: n === 1,
        })),
      })}
      <p class="note">0.85 multiplied by itself once per team, assuming the teams don't depend on each other.</p>
    </div>
    <div class="side">
      <h3>What Lighthouse does with it</h3>
      <ul class="ticks">
        <li>Simulates every contributing team and combines them into one probability per feature and per delivery.</li>
        <li>Forecasts every feature in a portfolio continuously, in backlog order.</li>
        <li>Draws a delivery timeline per release, with dependencies from your tracker, so features that won't even start in time show up early.</li>
      </ul>
      <img class="framed small" src="${cdn("features/deliveryTimeline.png")}" alt="" />
    </div>
  </div>`,
    source: `Benjamin Huser-Berta, "An introduction and step-by-step guide to multi-team Monte Carlo simulations" (2026), ${BLOG}; arithmetic as shown`,
  });

// 8. Flow metrics
defs["flow"] = () =>
  slide({
    tracker: "Flow metrics",
    title: "Flow metrics show where work gets stuck while there is still time to act",
    body: `
  <div class="two-col wide-left">
    <figure class="shot">
      <img class="framed" src="${cdn("features/metrics/metricsoverview.png")}" alt="" />
      <figcaption>Team metrics in Lighthouse, each widget red, amber or green.</figcaption>
    </figure>
    <div class="side">
      <dl class="defs">
        <dt>Work item age</dt><dd>Which items have been running for days, against the team's own cycle time</dd>
        <dt>Risk of missing the SLE</dt><dd>Items about to take longer than the service level expectation</dd>
        <dt>Blocked and stale items</dt><dd>What is waiting, and for how long</dd>
        <dt>Cycle time and throughput</dt><dd>Percentiles, run charts and process behaviour charts</dd>
        <dt>Reports</dt><dd>Then and Now compares the flow before a change with today</dd>
      </dl>
    </div>
  </div>`,
    source: "Lighthouse documentation (docs.lighthouse.letpeople.work)",
  });

// 9. Where it runs
defs["hosting"] = () =>
  slide({
    tracker: "Security and hosting",
    title: "Lighthouse runs where your data lives, so a tracker inside your network needs no way out",
    body: `
  <div class="two-col">
    <div class="net">
      <p class="net-label">Your network</p>
      <div class="net-row">
        <div class="node"><strong>Browser</strong><span>Opens Lighthouse like any internal web app</span></div>
        <div class="arrow">→</div>
        <div class="node main"><strong>Lighthouse</strong><span>Desktop app, Docker or Kubernetes (Helm). Its database stays with it.</span></div>
        <div class="arrow">→</div>
        <div class="node"><strong>Your tracker</strong><span>Jira Data Center or Azure DevOps Server, with a personal access token</span></div>
      </div>
    </div>
    <div class="side">
      <div class="node out"><strong>Hosted trackers</strong><span>Jira Cloud, Azure DevOps Services, Linear and ServiceNow, through their API</span></div>
      <div class="node us"><strong>LetPeopleWork</strong><span>Receives nothing. Usage data is off unless someone turns it on, and never contains work items, names or queries.</span></div>
      <ul class="ticks tight">
        <li>Source public on GitHub under the Lighthouse Source Available License, so security teams can read it</li>
        <li>SQLite by default, PostgreSQL supported</li>
        <li>Sign-in through your identity provider and role-based access on paid editions</li>
      </ul>
    </div>
  </div>`,
    source: "Lighthouse documentation; LetPeopleWork privacy policy",
  });

// 10. Integrations and AI
defs["integrations"] = () =>
  slide({
    tracker: "Integrations",
    title: "One installation connects the trackers your teams already use, and your AI assistant",
    body: `
  <div class="tiles">
    ${[
      ["Jira Cloud", "API token, or OAuth on paid editions"],
      ["Jira Data Center", "Version 8 or later, personal access token"],
      ["Azure DevOps Services", "Personal access token, or OAuth through Entra ID on paid editions"],
      ["Azure DevOps Server", "Personal access token, inside your network"],
      ["Linear", "Connected through its API"],
      ["ServiceNow", "Connected through its API"],
      ["CSV", "For anything else"],
      ["AI assistants", "MCP server for Claude, Copilot and others, and the lh command line"],
    ]
      .map(([t, d], i) => `<div class="tile${(cfg.integrations?.highlight ? cfg.integrations.highlight.includes(t) : i === 7) ? " accent" : ""}"><strong>${t}</strong><span>${d}</span></div>`)
      .join("")}
  </div>
  <div class="callout wide">Teams on different trackers end up in one portfolio forecast. On paid editions, Lighthouse can write forecasts such as the 85% date back into a field in Jira or Azure DevOps.</div>`,
    source: "Lighthouse documentation, work tracking systems and AI integration",
  });

// 11. Comparison
defs["compare"] = () =>
  slide({
    tracker: "Alternatives",
    title: "Compared with ActionableAgile and Nave, Lighthouse is the option that runs on your own systems at a flat price",
    body: `
  <table class="cmp">
    <thead><tr><th></th><th class="us">Lighthouse</th><th>ActionableAgile</th><th>Nave</th></tr></thead>
    <tbody>
      <tr><th>Where it runs</th><td class="us">On your systems: desktop app, Docker or Kubernetes</td><td>Web app, Jira Cloud and Data Center apps, Azure DevOps Services extension</td><td>Web app, Jira app</td></tr>
      <tr><th>Where your data ends up</th><td class="us">Lighthouse's own database on your systems</td><td>Data Center app inside your Jira; other editions in the vendor's or Atlassian's cloud</td><td>Nave's cloud, hosted in the EU</td></tr>
      <tr><th>Trackers</th><td class="us">Jira Cloud and Data Center, Azure DevOps Services and Server, Linear, ServiceNow, CSV</td><td>Jira Cloud and Data Center, Azure DevOps Services, Trello, files</td><td>Jira, Azure DevOps, Trello, Asana, CSV and JSON</td></tr>
      <tr><th>Monte Carlo forecasts</th><td class="us">Team, feature and portfolio, with backtests</td><td>Team; multi-team in a separate product for Jira Cloud</td><td>Completion dates and how many</td></tr>
      <tr><th>Pricing model</th><td class="us">Free for 3 teams; flat yearly licence</td><td>Per user</td><td>Per connected board</td></tr>
      <tr><th>Source code</th><td class="us">Public on GitHub</td><td>Not public</td><td>Not public</td></tr>
    </tbody>
  </table>`,
    source: "Vendors' public pages and the Atlassian and Visual Studio marketplaces, checked October 2026; letpeople.work/compare",
  });

// 12. Pricing
defs["pricing"] = () =>
  slide({
    tracker: "Editions and pricing",
    title: "Start free, then pay one flat yearly licence, whatever the number of users",
    body: `
  <div class="prices">
    <div class="price">
      <p class="ed">Community</p><p class="amt">Free</p><p class="per">no time limit</p>
      <ul class="ticks tight"><li>All flow metrics and Monte Carlo forecasts</li><li>Up to 3 teams and 1 portfolio with 1 delivery</li><li>Every tracker, AI integration</li></ul>
    </div>
    <div class="price rec">
      <p class="badge">Recommended</p>
      <p class="ed">Self-Service</p><p class="amt">${esc(prices.selfService)}</p><p class="per">per year</p>
      <ul class="ticks tight"><li>Unlimited teams, portfolios and deliveries</li><li>Sign-in through your identity provider, role-based access</li><li>Rule-based deliveries, forecasts written back to your tracker</li></ul>
    </div>
    <div class="price">
      <p class="ed">Enterprise</p><p class="amt">${esc(prices.enterprise)}</p><p class="per">per year</p>
      <ul class="ticks tight"><li>Everything in Self-Service</li><li>Prioritised support, 24h acknowledgement</li><li>Two 60-minute onboarding calls, named contacts</li></ul>
    </div>
  </div>
  <p class="note center">The paid features are called Premium in the app; both paid editions include all of them. Setup help is free for every edition. Premium can be tried for 30 days without signing up.</p>`,
    source: "letpeople.work/lighthouse, pricing",
  });

// 13. Testimonials (verbatim)
const quote = (text, mark, who, role) => {
  const i = text.indexOf(mark);
  const html = i < 0 ? esc(text) : `${esc(text.slice(0, i))}<mark>${esc(mark)}</mark>${esc(text.slice(i + mark.length))}`;
  return `<figure class="quote" data-who="${esc(who)}"><blockquote>${html}</blockquote><figcaption><strong>${esc(who)}</strong><span>${esc(role)}</span></figcaption></figure>`;
};
// Keep the quotes named in the config, in that order (all three by default).
const pickQuotes = (all) => {
  if (!cfg.quotes) return all.join("\n");
  const by = Object.fromEntries(all.map((q) => [q.match(/data-who="([^"]*)"/)[1], q]));
  return cfg.quotes.map((n) => by[esc(n)] ?? (() => { throw new Error(`[deck] unknown quote: ${n}`); })()).join("\n");
};
defs["quotes"] = () =>
  slide({
    tracker: "What teams say",
    title: "Teams use Lighthouse to plan across release trains, surface risk earlier and set clearer expectations",
    body: `
  <div class="quotes">
    ${pickQuotes([quote(
      "Lighthouse transformed how our Agile Release Train operates: moving us from guesstimations and overcommitment to data-driven PI Planning. It streamlined progress tracking across teams, making delivery more transparent and predictable. With continuous forecasting, we're now better equipped to anticipate risks, align expectations, and deliver value with confidence.",
      "from guesstimations and overcommitment to data-driven PI Planning",
      "Agnieszka Reginek",
      "Professional Kanban Trainer, Scrum Master",
    ),
    quote(
      "Lighthouse has transformed how we approach delivery. By prompting the right questions earlier and using the default feature size function to quickly forecast “how much?”, it provides a lean, cost‑effective way to surface risk and enable better decisions.",
      "a lean, cost‑effective way to surface risk and enable better decisions",
      "Chris Graves",
      "Agile Coach, Focusrite",
    ),
    quote(
      "Lighthouse helped us be more on to it. We’re now more predictable, efficient, and responsive when it comes to delivering value and serving our customers. It’s made planning sessions run smoother and helped set clearer expectations with our stakeholders. The insights we get from the data really sharpen our conversations and keep us focused on what matters.",
      "We’re now more predictable, efficient, and responsive",
      "Gonzalo Mendez",
      "Scrum Master, Mitre 10 (New Zealand)",
    )])}
  </div>`,
    source: "Quotes as given by the people named; letpeople.work/lighthouse",
  });

// 14. How to start
defs["start"] = () =>
  slide({
    tracker: cfg.start?.tracker ?? "Next steps",
    title: cfg.start?.title ? esc(cfg.start.title) : "A first forecast on your own data takes an afternoon, and the decision can wait until it has proven itself",
    body: `
  <div class="timeline">
    ${(cfg.start?.phases ?? [
      ["Day 1", "Install and connect", "On a laptop or a server, next to your tracker. Plan for about half an hour; in a recorded session, a Scrum Master did it in under ten minutes."],
      ["Week 1", "First forecasts", "Forecasts and flow metrics for up to 3 teams, free. We help with setup at no cost."],
      ["Weeks 2 to 4", "Check the forecasts", "Run Forecast Reality Check on your history. Try Premium for 30 days for the portfolio views."],
      ["Then", "Decide", "Stay on Community, or choose Self-Service or Enterprise."],
    ])
      .map(([when, what, detail], i) => `<div class="phase"><span class="dot">${i + 1}</span><p class="when">${esc(when)}</p><p class="what">${esc(what)}</p><p class="detail">${esc(detail)}</p></div>`)
      .join("")}
  </div>
  <div class="it-box">
    <p class="it-title">${esc(cfg.start?.itTitle ?? "What it needs from IT")}</p>
    <div class="it-grid">
      ${cfg.start?.it ? cfg.start.it.map(([t, d]) => `<div><strong>${esc(t)}</strong><span>${esc(d)}</span></div>`).join("") : `<div><strong>A machine</strong><span>A laptop, a VM, a Docker host or a Kubernetes cluster inside your network</span></div>
      <div><strong>Read access to the tracker</strong><span>An API token or a personal access token for the projects in question</span></div>
      <div><strong>Nothing opened to the internet</strong><span>Lighthouse calls your tracker; LetPeopleWork receives no work items</span></div>`}
    </div>
  </div>`,
    source: cfg.start?.source != null ? esc(cfg.start.source) : "Lighthouse documentation; Lighthouse Live session with Gábor Bittera (May 2026)",
  });

// 15. Team
defs["team"] = () =>
  slide({
    tracker: "Who we are",
    title: "Built by two practitioners who use it with their own teams",
    body: `
  <div class="team">
    ${founders
      .slice()
      .reverse()
      .map(
        (f) => `<div class="person">
      <img src="${asset(`src/assets/${f.photo}`)}" alt="" />
      <div><strong>${esc(f.name)}</strong><span class="role">${esc(f.role)}</span><p>${esc(f.bio)}</p></div>
    </div>`,
      )
      .join("\n")}
  </div>
  <div class="why">
    <h3>Why we built it</h3>
    <p>The tools we found were fragmented, expensive and tied to the cloud, and their price grew with every user. So we built one that runs where the data lives, with the source public, and use it with our own teams first.</p>
  </div>
  <div class="callout wide">LetPeopleWork GmbH, Zürich. We write about forecasting and flow, with step-by-step guides and real team data, at ${BLOG}.</div>`,
  });

// 16. Closing
defs["closing"] = () =>
  slide({
    dark: true,
    cls: "cover closing",
    body: `
  <div class="cover-top">${wordmarkDark}<span class="cover-kicker">${esc(cfg.closing?.kicker ?? "Next step")}</span></div>
  <div class="cover-main">
    <h1>${esc(cfg.closing?.title ?? "See your own forecast before you decide anything")}</h1>
    <p class="cover-sub">${esc(cfg.closing?.subtitle ?? "Download Lighthouse free at letpeople.work/lighthouse, or ask us for a 20-minute call.")}</p>
    <p class="contact">${esc(cfg.closing?.contact ?? "contact@letpeople.work · +41 79 471 82 33")}</p>
  </div>
  <div class="cover-bottom"><span>letpeople.work</span><span>LetPeopleWork GmbH · Zürich</span></div>`,
  });

// Tailored decks only: what we heard from this organisation, and what answers it.
defs["context"] = () =>
  slide({
    tracker: cfg.customer ? `What we heard from ${cfg.customer}` : "What we heard",
    title: esc(cfg.context?.title ?? "What you told us, and where Lighthouse fits"),
    body: `
  <div class="two-col">
    <div class="side"><h3>What we heard</h3><ul class="ticks">${(cfg.context?.heard ?? []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
    <div class="side"><h3>What Lighthouse does about it</h3><ul class="ticks">${(cfg.context?.answer ?? []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
  </div>`,
    source: cfg.context?.source ? esc(cfg.context.source) : "",
  });

// The public deck: every slide except the tailored context slide, in this order.
const SLIDE_IDS = ["cover", "summary", "estimates", "averages", "how", "reality-check", "portfolio", "flow", "hosting", "integrations", "compare", "pricing", "quotes", "start", "team", "closing"];
const order = cfg.slides ?? (cfg.context ? ["cover", "summary", "context", ...SLIDE_IDS.slice(2)] : SLIDE_IDS);
// Tailored decks only: slides of link cards, one per entry in cfg.pages.
for (const [id, p] of Object.entries(cfg.pages ?? {})) {
  defs[id] ??= () =>
    slide({
      tracker: p.tracker,
      title: esc(p.title ?? ""),
      body: `${p.intro ? `<p class="lead">${esc(p.intro)}</p>` : ""}
  <div class="cards cards-${(p.cards ?? []).length === 4 ? 2 : Math.min((p.cards ?? []).length, 3)}">${(p.cards ?? [])
    .map((c) => `<div class="card"><strong>${esc(c.lead)}</strong>${c.text ? `<span>${esc(c.text)}</span>` : ""}${c.url ? `<a href="${esc(c.url)}">${esc(c.link ?? c.url.replace(/^https?:\/\//, ""))}</a>` : ""}</div>`)
    .join("")}</div>`,
      source: p.source ? esc(p.source) : "",
    });
}

const slides = order.map((id) => {
  if (!defs[id]) throw new Error(`[deck] unknown slide "${id}"; known: ${Object.keys(defs).join(", ")}`);
  currentId = id;
  return defs[id]();
});

// ---------------------------------------------------------------------------
// Styles

const css = `
@page { size: 1280px 720px; margin: 0; }
:root { --green: #2F5547; --green-dark: #24443A; --green-light: #EFF6F3; --ink: #1F2A37; --text: #344256; --muted: #5A6B80; --line: #DCE3EA; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.slide { width: 1280px; height: 720px; position: relative; overflow: hidden; page-break-after: always; break-after: page; padding: 54px 72px 0; display: flex; flex-direction: column; }
.slide header { margin-bottom: 26px; }
.tracker { margin: 0 0 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--green); }
h2 { margin: 0; font-size: 30px; line-height: 1.22; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); max-width: 1080px; }
.slide header::after { content: ""; display: block; height: 2px; width: 64px; background: var(--green); margin-top: 18px; }
.content { flex: 1; min-height: 0; }
footer { position: absolute; left: 72px; right: 72px; bottom: 22px; }
.source { font-size: 11px; color: var(--muted); margin-bottom: 10px; min-height: 14px; max-width: 980px; }
.foot { display: flex; align-items: center; gap: 16px; border-top: 1px solid var(--line); padding-top: 10px; font-size: 11px; color: var(--muted); }
.foot .wordmark { height: 14px; width: auto; }
.foot .num { margin-left: auto; font-weight: 700; color: var(--ink); }

/* dark slides */
.slide.dark { background: var(--green); color: #fff; padding: 64px 88px; justify-content: space-between; }
.cover-top { display: flex; justify-content: space-between; align-items: center; }
.wm { font-family: Impact, "Haettenschweiler", "Arial Narrow Bold", sans-serif; font-size: 30px; letter-spacing: 0.01em; color: #fff; }
.wm-green { color: #A9D3C1; }
.cover-kicker { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #CFE6DC; font-weight: 600; }
.cover-main { max-width: 980px; }
.cover-logo { width: 64px; height: 64px; border-radius: 14px; background: #fff; padding: 6px; margin-bottom: 18px; }
.cover-product { margin: 0 0 14px; font-size: 16px; letter-spacing: 0.2em; text-transform: uppercase; color: #CFE6DC; font-weight: 700; }
.slide.dark h1 { margin: 0; font-size: 60px; line-height: 1.06; letter-spacing: -0.02em; font-weight: 700; }
.cover-sub { margin: 22px 0 0; font-size: 22px; line-height: 1.4; color: #DCEDE6; max-width: 860px; }
.contact { margin-top: 26px; font-size: 20px; color: #fff; font-weight: 600; }
.cover-bottom { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.25); padding-top: 16px; font-size: 13px; color: #CFE6DC; }

/* layout */
.two-col { display: grid; grid-template-columns: 1.15fr 1fr; gap: 48px; align-items: start; height: 100%; }
.two-col.wide-right { grid-template-columns: 0.9fr 1.2fr; }
.two-col.wide-left { grid-template-columns: 1.35fr 1fr; }
h3 { margin: 0 0 14px; font-size: 18px; color: var(--ink); }
.exhibit-title { margin: 0 0 14px; font-size: 13px; font-weight: 700; color: var(--ink); text-transform: none; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.note { font-size: 13px; color: var(--muted); margin: 10px 0 0; }
.note.center { text-align: center; margin-top: 18px; }
.lead { font-size: 18px; color: var(--ink); line-height: 1.45; margin: 18px 0; }
ul.ticks { list-style: none; padding: 0; margin: 0; }
ul.ticks li { position: relative; padding-left: 22px; margin-bottom: 12px; font-size: 16px; line-height: 1.45; }
ul.ticks li::before { content: ""; position: absolute; left: 0; top: 8px; width: 9px; height: 9px; border-radius: 2px; background: var(--green); }
ul.ticks.tight li { font-size: 14px; margin-bottom: 8px; }
.callout { margin-top: 20px; background: var(--green-light); border-left: 4px solid var(--green); padding: 14px 18px; font-size: 15px; line-height: 1.45; color: var(--ink); }
.callout.wide { margin-top: 22px; }

/* charts */
.chart text { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
.bar-label, .col-label { font-size: 14px; fill: var(--text); }
.bar-value, .col-value { font-size: 15px; fill: var(--ink); font-weight: 600; }
.bar-value.strong { fill: var(--green); font-weight: 700; }
.axis-title { font-size: 12px; fill: var(--muted); }

/* link cards (cfg.pages) */
.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.cards.cards-3 { grid-template-columns: repeat(3, 1fr); }
.cards.cards-1 { grid-template-columns: 1fr; }
.card { display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--line); border-top: 4px solid var(--green); border-radius: 6px; padding: 16px 18px; }
.card strong { font-size: 17px; color: var(--ink); }
.card span { font-size: 14px; line-height: 1.45; }
.card a { margin-top: auto; font-size: 14px; font-weight: 700; color: var(--green); text-decoration: none; word-break: break-all; }

/* summary */
ol.summary { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
ol.summary li { display: grid; grid-template-columns: 44px 1fr; gap: 16px; align-items: start; font-size: 17px; line-height: 1.45; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
ol.summary li:last-child { border-bottom: 0; }
ol.summary strong { color: var(--ink); }
.n { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--green); color: #fff; font-weight: 700; font-size: 15px; }

/* steps and shots */
.steps { display: grid; gap: 22px; }
.step { display: grid; grid-template-columns: 44px 1fr; gap: 14px; }
.step strong { font-size: 17px; color: var(--ink); }
.step p { margin: 4px 0 0; font-size: 15px; line-height: 1.45; }
figure.shot { margin: 0; }
.shot-frame { position: relative; container-type: inline-size; }
.shot-frame img, img.framed { width: 100%; display: block; border: 1px solid var(--line); border-radius: 10px; }
img.framed.small { margin-top: 16px; }
.pct { position: absolute; left: 16.5%; transform: translateY(-50%); background: var(--green-light); color: var(--green); font-weight: 700; font-size: 1.35cqw; padding: 0.15cqw 0.9cqw; border-radius: 999px; border: 1px solid rgba(47,85,71,0.25); white-space: nowrap; }
figcaption { font-size: 12px; color: var(--muted); margin-top: 8px; }

/* stats */
.big-stat { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.big-stat > div { border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; }
.stat { display: block; font-size: 56px; font-weight: 700; color: var(--ink); line-height: 1; }
.stat.green { color: var(--green); }
.stat-label { display: block; margin-top: 8px; font-size: 14px; line-height: 1.35; }

/* definitions */
dl.defs { margin: 0; display: grid; gap: 12px; }
dl.defs dt { font-weight: 700; color: var(--ink); font-size: 16px; }
dl.defs dd { margin: 2px 0 0; font-size: 14px; line-height: 1.4; }

/* network */
.net { border: 2px dashed #9FB7AC; border-radius: 16px; padding: 18px 18px 22px; }
.net-label { margin: 0 0 12px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: var(--green); }
.net-row { display: grid; grid-template-columns: 1fr 24px 1.1fr 24px 1fr; align-items: stretch; gap: 6px; }
.net-row .arrow { align-self: center; }
.arrow { text-align: center; color: var(--green); font-weight: 700; }
.node { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; background: #fff; }
.node strong { display: block; color: var(--ink); font-size: 15px; margin-bottom: 4px; }
.node span { font-size: 13px; line-height: 1.4; }
.node.main { border: 2px solid var(--green); }
.node.out { margin-bottom: 12px; }
.node.us { background: var(--green-light); margin-bottom: 18px; }

/* tiles */
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.tile { border: 1px solid var(--line); border-radius: 10px; padding: 16px; min-height: 104px; }
.tile strong { display: block; color: var(--ink); font-size: 16px; margin-bottom: 6px; }
.tile span { font-size: 13px; line-height: 1.4; }
.tile.accent { background: var(--green); border-color: var(--green); }
.tile.accent strong, .tile.accent span { color: #fff; }

/* comparison */
table.cmp { width: 100%; border-collapse: collapse; font-size: 13.5px; }
table.cmp th, table.cmp td { text-align: left; vertical-align: top; padding: 9px 12px; border-bottom: 1px solid var(--line); line-height: 1.35; }
table.cmp thead th { font-size: 14px; color: var(--ink); border-bottom: 2px solid var(--ink); }
table.cmp tbody th { width: 17%; color: var(--ink); font-weight: 700; }
table.cmp .us { background: var(--green-light); }
table.cmp thead th.us { background: var(--green); color: #fff; border-bottom-color: var(--green); }

/* prices */
.prices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: stretch; }
.price { border: 1px solid var(--line); border-radius: 12px; padding: 20px 22px; position: relative; }
.price.rec { border: 2px solid var(--green); }
.badge { position: absolute; top: -12px; left: 22px; margin: 0; background: var(--green); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
.ed { margin: 0; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--green); }
.amt { margin: 8px 0 0; font-size: 38px; font-weight: 700; color: var(--ink); }
.per { margin: 2px 0 14px; font-size: 13px; color: var(--muted); }

/* quotes */
.quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.quote { margin: 0; border: 1px solid var(--line); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; }
.quote blockquote { margin: 0; flex: 1; font-size: 14.5px; line-height: 1.5; position: relative; padding-top: 26px; }
.quote blockquote::before { content: "“"; position: absolute; top: -14px; left: -2px; font-size: 56px; color: #A9C7BA; font-family: Georgia, serif; }
.quote mark { background: var(--green-light); color: var(--ink); font-weight: 700; padding: 0 2px; }
.quote figcaption { margin-top: 14px; border-top: 1px solid var(--line); padding-top: 10px; font-size: 13px; }
.quote figcaption strong { display: block; color: var(--ink); font-size: 14px; }

/* timeline */
.timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; position: relative; padding-top: 12px; }
.timeline::before { content: ""; position: absolute; left: 18px; right: 18px; top: 30px; height: 2px; background: var(--line); }
.phase { position: relative; }
.dot { position: relative; z-index: 1; display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--green); color: #fff; font-weight: 700; }
.when { margin: 14px 0 2px; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); }
.what { margin: 0 0 8px; font-size: 19px; font-weight: 700; color: var(--ink); }
.detail { margin: 0; font-size: 15px; line-height: 1.45; }

/* team */
.team { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.it-box { margin-top: 36px; border: 1px solid var(--line); border-radius: 12px; padding: 18px 22px; background: var(--green-light); }
.it-title { margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--green); }
.it-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.it-grid strong { display: block; color: var(--ink); font-size: 15px; margin-bottom: 4px; }
.it-grid span { font-size: 14px; line-height: 1.45; }
.why { margin-top: 24px; display: grid; grid-template-columns: 220px 1fr; gap: 28px; border-top: 1px solid var(--line); padding-top: 22px; }
.why h3 { margin: 0; }
.why p { margin: 0; font-size: 16px; line-height: 1.55; color: var(--ink); }
.person { display: grid; grid-template-columns: 140px 1fr; gap: 20px; border: 1px solid var(--line); border-radius: 12px; padding: 20px; }
.person img { width: 140px; height: 140px; object-fit: cover; border-radius: 10px; }
.person strong { display: block; font-size: 19px; color: var(--ink); }
.person .role { display: block; margin-top: 4px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); }
.person p { margin: 10px 0 0; font-size: 15px; line-height: 1.5; }
`;

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>${BRIEFING}</title><style>${css}</style></head>
<body>
${slides.join("\n")}
</body></html>`;

const pdfPath = outArg ? resolve(outArg) : join(root, "public", "Lighthouse_Pitch_Deck.pdf");
mkdirSync(dirname(pdfPath), { recursive: true });
const htmlPath = outArg ? pdfPath.replace(/\.pdf$/i, "") + ".html" : join(here, "lighthouse-pitch.html");
writeFileSync(htmlPath, html);
console.log(`[deck] wrote ${htmlPath} (${slides.length} slides)`);

// Chrome's usual install paths per OS, then Chrome or Chromium on the PATH.
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const winDirs = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA];
  const installed = {
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ],
    win32: winDirs.filter(Boolean).map((dir) => join(dir, "Google", "Chrome", "Application", "chrome.exe")),
  }[process.platform] ?? [];
  const onPath = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"].flatMap((name) =>
    (process.env.PATH ?? "").split(delimiter).map((dir) => join(dir, name)),
  );
  return [...installed, ...onPath].find((path) => existsSync(path));
}

const CHROME = findChrome();
if (!CHROME || !existsSync(CHROME)) {
  console.error("[deck] Chrome or Chromium not found (set CHROME=<path>); open the HTML file and print it to PDF instead.");
  process.exit(1);
}
execFileSync(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--virtual-time-budget=15000",
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: "inherit" },
);
console.log(`[deck] wrote ${pdfPath}`);
