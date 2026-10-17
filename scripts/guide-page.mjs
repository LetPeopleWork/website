// Static guide pages: /compare/, /azure-devops-forecasting/ and
// /jira-forecasting-without-story-points/.
//
// These pages answer the questions buyers type into Google and AI assistants.
// They are plain HTML with no JavaScript app behind them, so every crawler
// reads the full text, including the ones that do not run JavaScript. The
// content lives in scripts/guides/*.mjs; prerender-meta.mjs writes the pages
// with this template and adds each one to llms-full.txt as Markdown.

const SITE = "https://letpeople.work";
const DOCS = "https://docs.lighthouse.letpeople.work";
const GITHUB = "https://github.com/LetPeopleWork/Lighthouse";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const guideUrl = (guide) => `${SITE}/${guide.path}/`;

const faqHtml = (faqs) =>
  faqs.length
    ? `<section aria-labelledby="questions">
<h2 id="questions">Questions people ask</h2>
${faqs.map((f) => `<h3>${esc(f.question)}</h3>\n<p>${esc(f.answer)}</p>`).join("\n")}
</section>`
    : "";

const relatedHtml = (guide, all) => {
  const others = all.filter((g) => g.path !== guide.path);
  return `<aside class="related" aria-label="More guides">
<h2>More from LetPeopleWork</h2>
<ul>
${others.map((g) => `<li><a href="${SITE}/${g.path}/">${esc(g.navLabel)}</a></li>`).join("\n")}
<li><a href="${SITE}/lighthouse/">Lighthouse: features, pricing and downloads</a></li>
<li><a href="https://blog.letpeople.work/">The LetPeopleWork blog</a></li>
</ul>
</aside>`;
};

const STYLE = `
:root{--primary:#2f5647;--primary-soft:#eef4f1;--fg:#1f2a37;--muted:#4b5a6b;--border:#e2e8f0;--bg:#fff;--card:#f8faf9}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);background:var(--bg);line-height:1.65;font-size:17px}
a{color:var(--primary)}
.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;background:#fff;padding:.5rem;z-index:10}
header.site{border-bottom:1px solid var(--border);background:#fff}
header.site .in{max-width:1080px;margin:0 auto;padding:.9rem 1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
header.site .brand{font-weight:700;color:var(--fg);text-decoration:none;margin-right:auto;letter-spacing:-.01em}
header.site nav{display:flex;gap:1.1rem;flex-wrap:wrap;font-size:.95rem}
header.site nav a{color:var(--muted);text-decoration:none}
header.site nav a:hover{color:var(--primary)}
main{max-width:760px;margin:0 auto;padding:2.5rem 1rem 3rem}
.crumbs{font-size:.85rem;color:var(--muted);margin-bottom:1.5rem}
.crumbs a{color:var(--muted)}
.eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--primary);margin:0 0 .75rem}
h1{font-size:clamp(1.9rem,4.5vw,2.6rem);line-height:1.15;letter-spacing:-.02em;margin:0 0 1rem}
h2{font-size:1.45rem;line-height:1.3;letter-spacing:-.01em;margin:2.75rem 0 .75rem}
h3{font-size:1.1rem;margin:1.75rem 0 .4rem}
p,ul,ol{margin:0 0 1rem}
li{margin-bottom:.35rem}
.lede{font-size:1.15rem;color:var(--muted)}
.byline{font-size:.85rem;color:var(--muted);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:.6rem 0;margin:1.5rem 0 2rem}
.callout{background:var(--primary-soft);border-radius:14px;padding:1.1rem 1.25rem;margin:1.5rem 0}
.callout p:last-child{margin-bottom:0}
.wrap{overflow-x:auto;margin:1.5rem 0;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse;font-size:.92rem;min-width:560px}
th,td{text-align:left;padding:.65rem .7rem;border-bottom:1px solid var(--border);vertical-align:top}
thead th{background:var(--primary-soft);color:var(--primary)}
tbody th{font-weight:600;width:22%}
.note{font-size:.85rem;color:var(--muted)}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.85em;background:var(--primary-soft);padding:.1rem .35rem;border-radius:5px;overflow-wrap:anywhere}
.cta{background:var(--primary);color:#fff;border-radius:18px;padding:1.5rem;margin:2.75rem 0}
.cta h2{margin:0 0 .5rem;color:#fff}
.cta p{color:#e6efe9}
.cta .buttons{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1rem}
.cta a{display:inline-block;border-radius:999px;padding:.7rem 1.2rem;font-weight:600;text-decoration:none}
.cta a.primary{background:#fff;color:var(--primary)}
.cta a.secondary{border:1px solid rgba(255,255,255,.6);color:#fff}
.related{border-top:1px solid var(--border);margin-top:2.75rem;padding-top:.5rem}
.related h2{font-size:1.1rem}
footer.site{border-top:1px solid var(--border);background:var(--card);color:var(--muted);font-size:.85rem}
footer.site .in{max-width:1080px;margin:0 auto;padding:1.5rem 1rem;display:flex;gap:1rem 1.5rem;flex-wrap:wrap;justify-content:space-between}
footer.site a{color:var(--muted)}
footer.site nav{display:flex;gap:.5rem 1.1rem;flex-wrap:wrap}
`;

// The full page. `schemaTag` is the <script type="application/ld+json"> built
// by seo-schema.mjs, so the structured data comes from the same place as on
// every other route.
export const renderGuidePage = (guide, all, schemaTag) => {
  const url = guideUrl(guide);
  const image = guide.ogImage ?? `${SITE}/lighthouse-forecast.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(guide.title)}</title>
<meta name="description" content="${esc(guide.description)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="author" content="LetPeopleWork GmbH" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="LetPeopleWork" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(guide.h1)}" />
<meta property="og:description" content="${esc(guide.description)}" />
<meta property="og:image" content="${image}" />
<meta property="article:modified_time" content="${guide.updated}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(guide.h1)}" />
<meta name="twitter:description" content="${esc(guide.description)}" />
<meta name="twitter:image" content="${image}" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="alternate" type="text/plain" title="Machine-readable summary" href="${SITE}/llms-full.txt" />
${schemaTag}
<script defer data-domain="letpeople.work" src="https://plausible.io/js/script.outbound-links.js"></script>
<style>${STYLE.trim()}</style>
</head>
<body>
<a class="skip" href="#content">Skip to the content</a>
<header class="site"><div class="in">
<a class="brand" href="${SITE}/">LetPeopleWork</a>
<nav aria-label="Site">
<a href="${SITE}/lighthouse/">Lighthouse</a>
<a href="${SITE}/compare/">Compare</a>
<a href="${DOCS}/">Docs</a>
<a href="https://blog.letpeople.work/">Blog</a>
</nav>
</div></header>
<main id="content">
<p class="crumbs"><a href="${SITE}/">Home</a> › ${esc(guide.navLabel)}</p>
<p class="eyebrow">${esc(guide.eyebrow)}</p>
<h1>${esc(guide.h1)}</h1>
<p class="lede">${guide.lede}</p>
<p class="byline">By LetPeopleWork, the makers of Lighthouse · Updated ${formatDate(guide.updated)}</p>
${guide.body.trim()}
${faqHtml(guide.faqs)}
<section class="cta" aria-labelledby="try-it">
<h2 id="try-it">${esc(guide.cta?.heading ?? "Try it on your own data")}</h2>
<p>${esc(guide.cta?.text ?? "Lighthouse is free for up to 3 teams. Download it, connect your tracker and get a first forecast in about half an hour. You can try Premium for 30 days without signing up or giving us a credit card.")}</p>
<div class="buttons">
<a class="primary" href="${SITE}/lighthouse/#downloads">Download Lighthouse</a>
<a class="secondary" href="${SITE}/lighthouse/#first-forecast">Watch a first forecast in under ten minutes</a>
</div>
</section>
${relatedHtml(guide, all)}
</main>
<footer class="site"><div class="in">
<span>© ${guide.updated.slice(0, 4)} LetPeopleWork GmbH, Zürich</span>
<nav aria-label="Footer">
<a href="${SITE}/">Home</a>
<a href="${SITE}/lighthouse/">Lighthouse</a>
<a href="${SITE}/sizing-poker/">Sizing Poker</a>
<a href="${GITHUB}">Source on GitHub</a>
<a href="mailto:contact@letpeople.work">contact@letpeople.work</a>
<a href="${SITE}/?legal=impressum">Impressum</a>
<a href="${SITE}/?legal=privacy">Privacy</a>
</nav>
</div></footer>
</body>
</html>
`;
};

// ---------------------------------------------------------------------------
// Markdown for llms-full.txt. The guides use a small, known set of tags, so a
// small converter is enough; anything it does not know is dropped to text.

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&rarr;/g, "→")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const inline = (html) =>
  decode(
    html
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${text.trim()}](${href})`)
      .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, "**$2**")
      .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, "*$2*")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();

const tableToMarkdown = (table) => {
  const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(([, row]) =>
    [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(([, cell]) => inline(cell).replace(/\|/g, "/")),
  );
  if (!rows.length) return "";
  const [head, ...rest] = rows;
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rest.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
};

export const htmlToMarkdown = (html) => {
  const out = [];
  const blocks = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .match(/<(h[1-4]|p|ul|ol|table|blockquote)[^>]*>[\s\S]*?<\/\1>/g);
  for (const block of blocks ?? []) {
    const tag = block.match(/^<(\w+)/)[1];
    if (/^h[1-4]$/.test(tag)) {
      out.push(`${"#".repeat(Number(tag[1]) + 1)} ${inline(block)}`);
    } else if (tag === "ul" || tag === "ol") {
      const items = [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, li], i) =>
        `${tag === "ol" ? `${i + 1}.` : "-"} ${inline(li)}`,
      );
      out.push(items.join("\n"));
    } else if (tag === "table") {
      out.push(tableToMarkdown(block));
    } else if (tag === "blockquote") {
      out.push(`> ${inline(block)}`);
    } else {
      out.push(inline(block));
    }
  }
  return out.filter(Boolean).join("\n\n");
};

export const guideMarkdown = (guide) =>
  [
    `## ${guide.h1}`,
    `URL: ${guideUrl(guide)} (updated ${guide.updated})`,
    inline(guide.lede),
    htmlToMarkdown(guide.body),
    guide.faqs.length
      ? ["### Questions people ask", ...guide.faqs.map((f) => `**${f.question}**\n${f.answer}`)].join("\n\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
