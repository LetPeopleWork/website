// llms-full.txt: the long version of llms.txt, for AI assistants that want
// the whole picture in one request. Generated at build time from the same
// sources as the pages (llms.txt, the Lighthouse page text with its FAQ, and
// the guides), so it cannot fall behind them. Do not edit dist/llms-full.txt.

import { guideMarkdown, htmlToMarkdown } from "./guide-page.mjs";

export const buildLlmsFull = ({ llms, lighthouseHtml, guides, date }) =>
  [
    "# LetPeopleWork - Lighthouse in full",
    `> The complete text behind https://letpeople.work for AI assistants and search agents: the summary from llms.txt, the Lighthouse product page with its FAQ, and the guides. Generated from the site's own content on ${date}. The short version is https://letpeople.work/llms.txt.`,
    "# Part 1: Summary (llms.txt)",
    llms.replace(/^# .*\n/, "").trim(),
    "# Part 2: The Lighthouse product page",
    "URL: https://letpeople.work/lighthouse/",
    htmlToMarkdown(lighthouseHtml),
    "# Part 3: Guides",
    ...guides.map(guideMarkdown),
  ].join("\n\n") + "\n";
