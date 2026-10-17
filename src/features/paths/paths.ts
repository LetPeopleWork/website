import { lighthouseAsset } from "@/lib/lighthouseAsset";
import type { VideoKey } from "@/features/film/videos";

// "What brings you here?" chips (homepage hero and /lighthouse).
//
// Labelled by situation, never by job title: research on audience-based
// navigation (NN/g, GOV.UK) found people do not sort themselves by role, and
// skip content labelled for someone else. Nothing is hidden by a choice. The
// default page stays complete, and a choice only swaps the hero subhead and
// screenshot and points to the section that answers that situation.
//
// The choice lives in the URL as ?for=<key>. Nothing is stored on the device,
// so no consent banner is needed, and links in posts and emails can arrive
// pre-sorted. "Path chosen" in Plausible shows which situations people pick.

export type PathKey = "date" | "portfolio" | "team" | "security";

export const QUESTION_TABS = ["when", "stuck", "release", "portfolio", "refine", "change"] as const;
export type QuestionTab = (typeof QUESTION_TABS)[number];

export type Path = {
  key: PathKey;
  /** Chip text, first person, a situation the visitor recognises. */
  chip: string;
  /** Replaces the homepage hero subhead while the chip is selected. */
  subhead: string;
  /** Replaces the homepage hero screenshot. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Shows a diagram instead of a screenshot, where a picture of the UI says less. */
  visual?: "where-it-runs";
  /** Where on /lighthouse this situation is answered. */
  anchor: string;
  /** Which "What Lighthouse answers" tab opens first on /lighthouse. */
  tab: QuestionTab;
  /** Link text under the subhead, pointing to that answer. */
  linkLabel: string;
  /**
   * A short video that answers this situation, offered under the subhead.
   * Without one, the hero keeps the film. Short videos only; add one here
   * when it exists (a Deliveries video for "several teams" is the next).
   */
  video?: { key: VideoKey; label: string };
};

export const PATHS: readonly Path[] = [
  {
    key: "date",
    chip: "I need to give a date",
    subhead:
      "Ask about 10 items and you get dates with their odds. Ask about a date and you get how many items will probably make it. It all comes from what your team finished recently, so there's no estimation meeting.",
    image: {
      src: "/lighthouse-forecast.png",
      alt: "Lighthouse team forecast: when will 10 work items be done, four dates with their probabilities, and a 72% likelihood of making the target date",
      width: 1920,
      height: 1080,
    },
    anchor: "lighthouse-overview",
    tab: "when",
    linkLabel: "See how the forecast works",
  },
  {
    key: "portfolio",
    chip: "I look after several teams",
    subhead:
      "Three teams on one feature? Lighthouse combines their three forecasts into one. Taking the slowest team's date flatters you every time. The delivery timeline then shows which features miss the release, early enough to cut scope.",
    image: {
      src: lighthouseAsset("features/portfoliodetail.png"),
      alt: "Lighthouse portfolio view: features with their progress, forecast dates and dependencies",
      width: 1920,
      height: 1080,
    },
    anchor: "lighthouse-overview",
    tab: "release",
    linkLabel: "See the delivery timeline",
  },
  {
    key: "team",
    chip: "I'm on the team doing the work",
    subhead:
      "Keep your burndown. It shows how much is left. Lighthouse shows what's stuck: which items have been ageing for days, and which ones are about to take longer than your usual cycle time.",
    image: {
      src: lighthouseAsset("features/metrics/metricsoverview.png"),
      alt: "Lighthouse team metrics: work in progress, blocked and stale items, item age and throughput, each with a red, amber or green signal",
      width: 1920,
      height: 1080,
    },
    anchor: "lighthouse-overview",
    tab: "stuck",
    linkLabel: "See what it shows a team",
  },
  {
    key: "security",
    chip: "I need to check hosting and security",
    subhead:
      "Jira only reachable inside your network? Then run Lighthouse there too, on a laptop, a VM, Docker or Kubernetes. Your work items stay on your systems. If IT wants to know what it does, the source is on GitHub.",
    visual: "where-it-runs",
    anchor: "where-it-runs",
    tab: "when",
    linkLabel: "See where it runs",
    video: { key: "install", label: "Watch it go from install to data" },
  },
];

export const findPath = (value: string | null | undefined): Path | undefined =>
  PATHS.find((path) => path.key === value);

/** The ?for= value from a search string, or undefined when absent or unknown. */
export const pathFromSearch = (search: string): Path | undefined =>
  findPath(new URLSearchParams(search).get("for"));

/**
 * Writes the choice into the address bar without a navigation, keeping the
 * hash. replaceState, not pushState: a chip is not a page, so it neither adds
 * a history entry nor counts as a pageview.
 */
export const writePathToUrl = (key: PathKey | undefined) => {
  const url = new URL(window.location.href);
  if (key) url.searchParams.set("for", key);
  else url.searchParams.delete("for");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

/** Link to the /lighthouse section that answers a situation. */
export const lighthouseHref = (path: Path) => `/lighthouse?for=${path.key}#${path.anchor}`;

/** The ?question= value from a search string, or undefined when absent or unknown. */
export const questionFromSearch = (search: string): QuestionTab | undefined => {
  const value = new URLSearchParams(search).get("question");
  return QUESTION_TABS.find((tab) => tab === value);
};

/**
 * Link to one "Which question do you get asked?" tab on /lighthouse, opened
 * and scrolled to. Sizing Poker uses it to land on Refinement directly.
 */
export const lighthouseQuestionHref = (tab: QuestionTab) =>
  `/lighthouse?question=${tab}#lighthouse-overview`;
