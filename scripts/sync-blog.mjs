// Fetches the latest posts from the LetPeopleWork Substack RSS feed and
// writes them to public/blog-data.json for the homepage blog section.
// Zero dependencies: native fetch (Node 18+) and tolerant regex extraction,
// so CI needs no npm install. Same commit-the-json pattern as sync-events.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const FEED_URL = "https://blog.letpeople.work/feed";
const MAX_POSTS = 3;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "../public/blog-data.json");

function textBetween(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

function stripCdata(s) {
  return s.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1").trim();
}

function stripHtml(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const res = await fetch(FEED_URL, {
  headers: { "user-agent": "letpeople.work blog sync" },
});
if (!res.ok) {
  console.error(`Feed request failed: ${res.status}`);
  process.exit(1);
}
const xml = await res.text();

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
const posts = items.slice(0, MAX_POSTS).map((item) => {
  const title = stripHtml(stripCdata(textBetween(item, "title")));
  const link = stripCdata(textBetween(item, "link"));
  const pubDate = textBetween(item, "pubDate");
  const rawDesc = stripHtml(stripCdata(textBetween(item, "description")));
  const date = pubDate ? new Date(pubDate).toISOString() : null;
  return {
    title,
    link,
    date,
    displayDate: date ? formatDate(date) : "",
    excerpt: rawDesc.length > 180 ? `${rawDesc.slice(0, 177).trimEnd()}...` : rawDesc,
  };
});

if (posts.length === 0 || posts.some((p) => !p.title || !p.link)) {
  console.error("Feed parsed but posts look incomplete, refusing to write.");
  process.exit(1);
}

// Deliberately no timestamp in the file: the content must be byte-identical
// when the posts have not changed, so the daily sync only commits real changes.
writeFileSync(OUT_FILE, `${JSON.stringify({ posts }, null, 2)}\n`);
console.log(`Wrote ${posts.length} posts to public/blog-data.json`);
for (const p of posts) console.log(`  - ${p.displayDate}: ${p.title}`);
