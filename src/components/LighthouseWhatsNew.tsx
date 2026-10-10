import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Item = {
  tag: string;
  title: string;
  description: string;
  /** Release tag, or null for something on main that the next release will carry. */
  version: string | null;
  /** ISO date the release was published; null while unreleased. */
  released: string | null;
};

// TODO(peter): keep this list fresh as new releases ship. Full notes live at
// https://github.com/LetPeopleWork/Lighthouse/releases
const ITEMS: Item[] = [
  {
    tag: "Refinement",
    title: "Refine enough, then stop",
    description:
      "The Refinement tab tells your team how many Work Items to have ready before the next Refinement, a range from your own Throughput with a below, in or above verdict, and lets everyone vote on each one: doable within our SLE? Yes, Yes if…, or No. No story points.",
    version: "v26.10.10.1",
    released: "2026-10-10",
  },
  {
    tag: "Forecasting",
    title: "Forecast Reality Check",
    description:
      "How good are your forecasts, really? Lighthouse backtests its own predictions against what your team then delivered, across sampling windows and horizons, and tells you which percentile to trust and whether your settings are helping.",
    version: "v26.10.3.6",
    released: "2026-10-03",
  },
  {
    tag: "Portfolio",
    title: "Delivery Timeline",
    description:
      "A forecast says when a delivery lands. The timeline shows how: one bar per feature from forecast start to finish, in board order, with dependencies drawn between them and the features that will not start before the target date called out.",
    version: "v26.9.24.6",
    released: "2026-09-24",
  },
  {
    tag: "Forecasting",
    title: "Forecasted start dates",
    description:
      "Beside every completion forecast now sits a start forecast, from the same simulation. A start date far in the future is Lighthouse telling you the queue in front of that feature is the problem, not the feature.",
    version: "v26.9.24.6",
    released: "2026-09-24",
  },
  {
    tag: "Flow Signals",
    title: "Risk of missing your SLE",
    description:
      "Every in-progress item carries the probability that it will still finish inside your service level expectation, and a widget collects the ones already at risk, so you act while there is still time.",
    version: "v26.9.19.10",
    released: "2026-09-20",
  },
  {
    tag: "Operations",
    title: "Task Manager",
    description:
      "Is Lighthouse doing anything right now? Watch what is refreshing and what is queued, the health of every connection to your work tracking systems, and what went wrong recently, and stop a refresh that is taking too long.",
    version: "v26.9.19.10",
    released: "2026-09-20",
  },
  {
    tag: "Trust",
    title: "Source available",
    description:
      "The source stays public: read it, run it, audit it and change it for your own use, so you can check for yourself that your delivery data never leaves your infrastructure. And there is a free Community edition, for good.",
    version: "v26.9.19.10",
    released: "2026-09-20",
  },
  {
    tag: "Flow Signals",
    title: "Work Item Age bands",
    description:
      "Every in-progress item now says how its age compares with how long finished work usually stays in the same state. Sort worst first, filter to one band, or export the list for your next daily.",
    version: "v26.9.9.9",
    released: "2026-09-09",
  },
  {
    tag: "Forecasting",
    title: "Dependencies, from your tracker",
    description:
      "Predecessor links in Azure DevOps, blocked-by links in Jira, relations in Linear: Lighthouse reads them, shows them on every feature list, and on paid tiers the forecast waits for the blocker to finish before the blocked feature starts.",
    version: "v26.8.31.7",
    released: "2026-08-31",
  },
  {
    tag: "Portfolio",
    title: "Own the order, archive the past",
    description:
      "Let Lighthouse own the order of your features across every portfolio on one Features page, and archive a finished delivery so what you forecast in August still reads the same in October.",
    version: "v26.8.31.7",
    released: "2026-08-31",
  },
  {
    tag: "Portfolio",
    title: "Features over Time",
    description:
      "A burnup says the delivery grew. This chart says which feature grew and when: one stacked bar per day with a band per feature, hatched while its size is still an estimate.",
    version: "v26.8.3.8",
    released: "2026-08-03",
  },
  {
    tag: "Forecasting",
    title: "Honest multi-team odds",
    description:
      "A feature worked by two teams is done when both are done. Lighthouse now combines every contributing team's simulation into one joint probability, and a delivery reports the odds that all of its features land, not just the slowest one.",
    version: "v26.8.1.14",
    released: "2026-08-01",
  },
  {
    tag: "Predictability",
    title: "Percentiles over Time",
    description:
      "Are we improving? One line per percentile, recorded every day, for Cycle Time and Work Item Age, so a retrospective can see whether your percentiles are tightening, drifting apart or holding steady.",
    version: "v26.7.26.8",
    released: "2026-07-26",
  },
];

// Every published Lighthouse release since May 2026, newest first. Add the
// date of each new release here, together with its card above.
const RELEASE_DATES: string[] = [
  "2026-10-10", "2026-10-03", "2026-09-24", "2026-09-20", "2026-09-09", "2026-09-01",
  "2026-08-31", "2026-08-14", "2026-08-08", "2026-08-03", "2026-08-01",
  "2026-07-26", "2026-07-12", "2026-07-03", "2026-06-16", "2026-06-12",
  "2026-06-07", "2026-05-29", "2026-05-24", "2026-05-19", "2026-05-14",
  "2026-05-03",
];

type Range = { key: string; label: string; days: number | null };

const RANGES: Range[] = [
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 90 days", days: 90 },
  { key: "all", label: "All", days: null },
];

const DAY_MS = 24 * 60 * 60 * 1000;

const withinDays = (iso: string, days: number | null, now: number) =>
  days === null || Math.floor((now - Date.parse(`${iso}T00:00:00Z`)) / DAY_MS) <= days;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

const releaseCountLine = (range: Range, now: number) => {
  const count = RELEASE_DATES.filter((d) => withinDays(d, range.days, now)).length;
  const releases = count === 1 ? "release" : "releases";
  if (range.days === null) {
    const oldest = RELEASE_DATES[RELEASE_DATES.length - 1];
    const since = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${oldest}T00:00:00Z`));
    return `${count} ${releases} since ${since}.`;
  }
  return `${count} ${releases} in the last ${range.days} days.`;
};

function NewsCard({ item, index }: { item: Item; index: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${index * 70}ms` : "0ms" }}
      className={`flex flex-col rounded-2xl border border-border bg-white p-6 transition-all duration-700 ease-out hover:border-primary/20 hover:shadow-soft ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary bg-accent px-2.5 py-1 rounded-full">
          {item.tag}
        </span>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {item.released ? formatDate(item.released) : "Next release"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-2 leading-snug">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {item.description}
      </p>
      {item.version && (
        <a
          href={`https://github.com/LetPeopleWork/Lighthouse/releases/tag/${item.version}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-4 inline-flex items-center gap-1 self-start text-xs font-semibold text-primary hover:text-primary-hover"
        >
          {item.version}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

interface LighthouseWhatsNewProps {
  /** Injectable so tests can pin "today". */
  now?: () => number;
}

export default function LighthouseWhatsNew({ now = Date.now }: LighthouseWhatsNewProps) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [rangeKey, setRangeKey] = useState("90");
  const range = RANGES.find((r) => r.key === rangeKey) ?? RANGES[1];
  const today = now();
  // An unreleased card is newer than anything in any range, so it always shows.
  const visible = ITEMS.filter(
    (item) => item.released === null || withinDays(item.released, range.days, today),
  );
  const wider = RANGES[RANGES.indexOf(range) + 1];

  return (
    <section id="lighthouse-whats-new" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5 block">
              Recently shipped
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.05]">
              Lighthouse keeps moving.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mt-5">
              A steady stream of releases, shaped by what practitioners actually ask for.
              <br />
              <span className="font-medium text-foreground" data-testid="whats-new-release-count">
                {releaseCountLine(range, today)}
              </span>
            </p>
          </div>
          <a
            href="https://github.com/LetPeopleWork/Lighthouse/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover whitespace-nowrap"
          >
            See all release notes
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 md:mb-12" role="group" aria-label="Shipped within">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={r.key === range.key}
              onClick={() => setRangeKey(r.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                r.key === range.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item, i) => (
              <NewsCard key={item.title} item={item} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Nothing shipped in the {range.label.toLowerCase()}.{" "}
            {wider && (
              <button
                type="button"
                onClick={() => setRangeKey(wider.key)}
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Show {wider.label.toLowerCase()}
              </button>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
