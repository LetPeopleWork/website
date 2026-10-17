// Structured data (schema.org JSON-LD) for each route's static HTML.
//
// It used to be rendered by React at runtime, so only crawlers that run
// JavaScript ever saw it. prerender-meta.mjs now writes one
// <script type="application/ld+json"> per route into the <head> of that
// route's index.html, built here. The React pages render none.
//
// Every value comes from a file the pages read too, so the two cannot drift:
// prices from src/lib/pricing.json, the film from
// src/content/lighthouse-film.json, the FAQ from src/content/lighthouse-faq.json
// and the AI workshops from src/content/ai-journey.json. Do not type a price
// into this file; the test in src/seo-schema.test.ts checks for that.
//
// No aggregateRating and no review: the testimonials are real quotes, but the
// people never gave star ratings, and the old runtime schema invented 5/5 for
// each of them. Without them Google shows no star snippet, which is the honest
// outcome.

import { readFileSync } from "node:fs";

const SITE = "https://letpeople.work";
const DOCS = "https://docs.lighthouse.letpeople.work";
const REPO = "https://github.com/LetPeopleWork/Lighthouse";

const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const LIGHTHOUSE_ID = `${SITE}/lighthouse/#software`;
const SIZING_POKER_ID = `${SITE}/sizing-poker/#app`;
const orgRef = { "@id": ORG_ID };

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

export const loadSchemaData = () => ({
  prices: readJson("src/lib/pricing.json"),
  film: readJson("src/content/lighthouse-film.json"),
  videos: readJson("src/content/videos.json"),
  faqs: readJson("src/content/lighthouse-faq.json"),
  journey: readJson("src/content/ai-journey.json"),
});

const organization = ({ full }) => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: "LetPeopleWork GmbH",
  alternateName: "LetPeopleWork",
  url: `${SITE}/`,
  logo: `${SITE}/apple-touch-icon.png`,
  sameAs: [
    "https://www.linkedin.com/company/let-people-work/",
    "https://github.com/LetPeopleWork",
    "https://www.youtube.com/@LetPeopleWork",
    "https://www.meetup.com/lighthouselive/",
    "https://blog.letpeople.work/",
  ],
  ...(full && {
    description:
      "Makers of Lighthouse, the self-hosted, source-available flow metrics and forecasting tool, and Sizing Poker, a free way to size a backlog without estimating it.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mühlackerstrasse 108",
      addressLocality: "Zürich",
      postalCode: "8046",
      addressCountry: "CH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@letpeople.work",
      contactType: "customer service",
    },
    founder: [
      { "@type": "Person", name: "Peter Zylka-Greger" },
      { "@type": "Person", name: "Benjamin Huser-Berta" },
    ],
  }),
});

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "LetPeopleWork",
  url: `${SITE}/`,
  inLanguage: "en",
  publisher: orgRef,
  // Deliberately no SearchAction: the site has no search, and advertising one
  // made Google crawl the literal template URL into Search Console's
  // "Crawled - currently not indexed" report.
};

// URLs in the trailing-slash form, which is what GitHub Pages serves and what
// each page's canonical link says.
const breadcrumbs = (...items) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...items].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE}${path}`,
  })),
});

// The paid editions are yearly; the description says so. Google's software
// app check rejects a UnitPriceSpecification here, so there is none.
const lighthouseOffers = (prices) =>
  [
    {
      name: "Lighthouse Community",
      price: "0",
      description:
        "Free for up to 3 teams and 1 portfolio with 1 delivery, with all core flow metrics and Monte Carlo forecasts.",
    },
    {
      name: "Lighthouse Self-Service",
      price: prices.selfServiceAmount,
      description:
        "Yearly Premium licence: unlimited teams and portfolios, sign-in through your identity provider, role-based access, rule-based deliveries and data sync mappings.",
    },
    {
      name: "Lighthouse Enterprise",
      price: prices.enterpriseAmount,
      description:
        "Yearly Premium licence with everything in Self-Service, plus a prioritised support queue, 24h acknowledgement on async requests, two 60-minute onboarding calls in the first 90 days and named contacts.",
    },
  ].map((offer) => ({
    "@type": "Offer",
    priceCurrency: "CHF",
    url: `${SITE}/lighthouse/#lighthouse-premium`,
    seller: orgRef,
    ...offer,
  }));

const lighthouseCore = (prices) => ({
  "@type": "SoftwareApplication",
  "@id": LIGHTHOUSE_ID,
  name: "Lighthouse",
  url: `${SITE}/lighthouse/`,
  description:
    "Self-hosted, source-available tool for flow metrics and Monte Carlo delivery forecasts. It reads what teams have finished in Jira Cloud, Jira Server or Data Center, Azure DevOps, Linear or ServiceNow and says how likely each date is, for one team or a whole portfolio.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Flow metrics and delivery forecasting",
  operatingSystem: "Windows, macOS, Linux, Docker, Kubernetes",
  publisher: orgRef,
  offers: lighthouseOffers(prices),
});

const isoDuration = (seconds) => `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;

// Google wants a full date and time with a time zone. The JSON holds the
// YouTube publish date only, so midnight UTC stands in for the time.
const isoDateTime = (date) => (date.includes("T") ? date : `${date}T00:00:00Z`);

export const filmVideo = (film) => ({
  "@type": "VideoObject",
  name: film.title,
  description: film.description,
  thumbnailUrl: [film.posterUrl, `https://i.ytimg.com/vi/${film.youtubeId}/maxresdefault.jpg`],
  uploadDate: isoDateTime(film.uploadDate),
  duration: isoDuration(film.durationSeconds),
  embedUrl: `https://www.youtube-nocookie.com/embed/${film.youtubeId}`,
  url: `https://www.youtube.com/watch?v=${film.youtubeId}`,
  publisher: orgRef,
});

const demoVideo = {
  "@type": "VideoObject",
  name: "From nothing to a Monte Carlo forecast in under ten minutes",
  description:
    "Live, unedited demo: Gábor Bittera downloads Lighthouse, connects Jira, adds a team and forecasts the team's next ten work items, finishing with 1:25 left on a ten-minute timer.",
  thumbnailUrl: `${SITE}/lighthouse-first-forecast-poster.jpg`,
  contentUrl: `${SITE}/lighthouse-first-forecast.mp4`,
  uploadDate: "2026-08-01T00:00:00Z",
  duration: "PT1M30S",
  publisher: orgRef,
};

// A short YouTube video shown on the page (src/content/videos.json).
const youtubeVideo = (v) => ({
  "@type": "VideoObject",
  name: v.title,
  description: v.description,
  thumbnailUrl: [v.posterUrl, `https://i.ytimg.com/vi/${v.youtubeId}/maxresdefault.jpg`],
  uploadDate: isoDateTime(v.uploadDate),
  duration: isoDuration(v.durationSeconds),
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
  url: `https://www.youtube.com/watch?v=${v.youtubeId}`,
  publisher: orgRef,
});

const lighthouseFull = ({ prices, film, videos }) => ({
  ...lighthouseCore(prices),
  featureList: [
    "Monte Carlo forecasts: when will these items be done, and how many items by a date",
    "Forecast Reality Check: backtests forecasts against what the team really finished",
    "Cycle time, throughput, work in progress and work item age",
    "Blocked and stale items, and the risk of missing the service level expectation",
    "Feature forecasts across several teams and a delivery timeline per release",
    "Portfolio flow metrics and process behaviour charts",
    "Reports for every team and portfolio, starting with Then & Now: flow metrics from before a change next to today's",
    "Connects to Jira Cloud, Jira Server and Data Center, Azure DevOps, Linear, ServiceNow and CSV",
    "MCP server for AI assistants and the lh command line client",
    "Self-hosted: desktop app, Docker container or Kubernetes with the official Helm chart",
  ],
  screenshot: `${SITE}/lighthouse-forecast.png`,
  downloadUrl: `${REPO}/releases`,
  softwareHelp: { "@type": "CreativeWork", url: DOCS },
  // The Refinement video plays on the "How much should we refine?" tab.
  video: [...(film.youtubeId ? [filmVideo(film)] : []), demoVideo, ...(videos ? [youtubeVideo(videos.refinement)] : [])],
});

const faqPage = (faqs, id = `${SITE}/lighthouse/#faq`) => ({
  "@type": "FAQPage",
  "@id": id,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

const sizingPoker = {
  "@type": "WebApplication",
  "@id": SIZING_POKER_ID,
  name: "Sizing Poker",
  url: `${SITE}/sizing-poker/`,
  description:
    "Size a backlog by asking one question per item instead of estimating it: could we finish this within the time we set? Three answers, no story points. Free, and it runs in the browser.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  publisher: orgRef,
};

const aiGraph = ({ prices, journey }) => [
  {
    "@type": "Service",
    name: "AI Services and Workshops",
    provider: orgRef,
    serviceType: "AI consulting and training",
    url: `${SITE}/ai/`,
    description:
      "AI from LetPeopleWork: the obAIa way of working, the open-source LetPeopleWorkShop and LetPeopleGrow plugins for Claude Code, and hands-on AI workshops.",
  },
  ...journey.map((step) => ({
    "@type": "Course",
    name: step.title,
    description: step.change,
    provider: orgRef,
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: prices.aiWorkshopPilotAmount,
      priceCurrency: "CHF",
      description:
        "Pilot price per team, covering the entire team. Subject to change once the pilot cohorts fill up.",
      url: `${SITE}/ai/#ai-workshops`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Onsite", "Online"],
      courseWorkload: "P1D",
    },
  })),
];

// The graph for each route, keyed by its path without slashes ("" is the
// homepage). Routes not listed here get no structured data.
const graphs = {
  "": (data) => [organization({ full: true }), website, lighthouseCore(data.prices), sizingPoker],
  lighthouse: (data) => [
    organization({ full: false }),
    website,
    breadcrumbs(["Lighthouse", "/lighthouse/"]),
    lighthouseFull(data),
    faqPage(data.faqs),
  ],
  "sizing-poker": () => [
    organization({ full: false }),
    website,
    breadcrumbs(["Sizing Poker", "/sizing-poker/"]),
    sizingPoker,
  ],
  ai: (data) => [
    organization({ full: false }),
    website,
    breadcrumbs(["AI", "/ai/"]),
    ...aiGraph(data),
  ],
  assessment: () => [
    organization({ full: false }),
    website,
    breadcrumbs(["Delivery Predictability Assessment", "/assessment/"]),
  ],
};

// The guide pages (scripts/guides/*.mjs): an article about Lighthouse, with
// its questions as a FAQPage. The author is the company; the guides draw on
// the founders' blog posts, which they link to.
export const guideSchema = (guide) => {
  const url = `${SITE}/${guide.path}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization({ full: false }),
      website,
      breadcrumbs([guide.navLabel, `/${guide.path}/`]),
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: guide.h1,
        description: guide.description,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        image: guide.ogImage ?? `${SITE}/lighthouse-forecast.png`,
        datePublished: isoDateTime(guide.published),
        dateModified: isoDateTime(guide.updated),
        author: orgRef,
        publisher: orgRef,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": LIGHTHOUSE_ID },
      },
      ...(guide.faqs.length ? [faqPage(guide.faqs, `${url}#questions`)] : []),
    ],
  };
};

export const schemaFor = (route, data) => {
  const build = graphs[route];
  return build ? { "@context": "https://schema.org", "@graph": build(data) } : null;
};

// "<" is escaped so no text inside the JSON can close the script tag early.
export const jsonLdTag = (schema) =>
  `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
