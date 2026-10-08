import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Item = {
  tag: string;
  title: string;
  description: string;
};

// TODO(peter): keep this list fresh as new releases ship. Full notes live at
// https://github.com/LetPeopleWork/Lighthouse/releases
const ITEMS: Item[] = [
  {
    tag: "Forecasting",
    title: "Forecast Reality Check",
    description:
      "How good are your forecasts, really? Lighthouse backtests its own predictions against what your team then delivered, across sampling windows and horizons, and tells you which percentile to trust and whether your settings are helping.",
  },
  {
    tag: "Portfolio",
    title: "Delivery Timeline",
    description:
      "A forecast says when a delivery lands. The timeline shows how: one bar per feature from forecast start to finish, in board order, with dependencies drawn between them and the features that will not start before the target date called out.",
  },
  {
    tag: "Forecasting",
    title: "Forecasted start dates",
    description:
      "Beside every completion forecast now sits a start forecast, from the same simulation. A start date far in the future is Lighthouse telling you the queue in front of that feature is the problem, not the feature.",
  },
  {
    tag: "Flow Signals",
    title: "Risk of missing your SLE",
    description:
      "Every in-progress item carries the probability that it will still finish inside your service level expectation, and a widget collects the ones already at risk, so you act while there is still time.",
  },
  {
    tag: "Forecasting",
    title: "Dependencies, from your tracker",
    description:
      "Predecessor links in Azure DevOps, blocked-by links in Jira, relations in Linear: Lighthouse reads them, shows them on every feature list, and on paid tiers the forecast waits for the blocker to finish before the blocked feature starts.",
  },
  {
    tag: "Forecasting",
    title: "Honest multi-team odds",
    description:
      "A feature worked by two teams is done when both are done. Lighthouse now combines every contributing team's simulation into one joint probability, and a delivery reports the odds that all of its features land, not just the slowest one.",
  },
  {
    tag: "Portfolio",
    title: "Features over Time",
    description:
      "A burnup says the delivery grew. This chart says which feature grew and when: one stacked bar per day with a band per feature, hatched while its size is still an estimate.",
  },
  {
    tag: "Portfolio",
    title: "Own the order, archive the past",
    description:
      "Let Lighthouse own the order of your features across every portfolio on one Features page, and archive a finished delivery so what you forecast in August still reads the same in October.",
  },
];

function NewsCard({ item, index }: { item: Item; index: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${index * 70}ms` : "0ms" }}
      className={`rounded-2xl border border-border bg-white p-6 transition-all duration-700 ease-out hover:border-primary/20 hover:shadow-soft ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary bg-accent px-2.5 py-1 rounded-full mb-4">
        {item.tag}
      </span>
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-2 leading-snug">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

export default function LighthouseWhatsNew() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="lighthouse-whats-new" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16 transition-all duration-700 ease-out ${
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
              Here's a sample from the last few months.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item, i) => (
            <NewsCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
