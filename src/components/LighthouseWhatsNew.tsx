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
    tag: "Flow Signals",
    title: "Time in State & stale items",
    description:
      "Every item now shows how long it has been sitting in its current state, with a staleness threshold that flags work that has stalled right now.",
  },
  {
    tag: "Metrics",
    title: "Cumulative Time per State & pace bands",
    description:
      "See where work actually spends its time, and read per-state pace percentile bands on the aging chart to spot items running hot.",
  },
  {
    tag: "Forecasting",
    title: "Exclude items for throughput",
    description:
      "Keep maintenance and unplanned work out of your numbers so forecasts reflect the work your team actually delivers.",
  },
  {
    tag: "Access",
    title: "OAuth, RBAC & API keys",
    description:
      "Connect Jira and Azure DevOps over OAuth, control who sees what with role-based access, and scope API keys for automation.",
  },
  {
    tag: "AI & Automation",
    title: "CLI and MCP clients",
    description:
      "Drive Lighthouse from the terminal, CI, or your AI assistant through a dedicated CLI and MCP servers.",
  },
  {
    tag: "Less ceremony",
    title: "Auto-save and auto-run",
    description:
      "Settings save the moment they are valid and forecasts run on their own. No more hunting for the Save or Forecast button.",
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
              A steady stream of releases, shaped by what practitioners actually ask for. Here's a sample from the last few months.
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
