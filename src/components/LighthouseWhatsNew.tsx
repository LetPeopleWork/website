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
    tag: "Predictability",
    title: "Percentiles Over Time",
    description:
      "Every percentile widget tells you where you stand today. This chart records your 50th to 95th percentiles daily and shows whether they are tightening or drifting, for teams and portfolios.",
  },
  {
    tag: "Predictability",
    title: "PBC Over Time",
    description:
      "Process Behaviour Charts tell you what is normal for your system. This chart shows whether normal itself is drifting, plotting your process limits daily across throughput, cycle time, WIP, and more.",
  },
  {
    tag: "Flow Signals",
    title: "Blocked work, first class",
    description:
      "Define what blocked means for your workflow once, by rule. See how long each item has been stuck, watch Blocked Over Time for teams and portfolios, and let long-blocked work surface as stale.",
  },
  {
    tag: "Deployment",
    title: "Official Kubernetes Helm chart",
    description:
      "Run the Server edition on any cluster with a single helm install. Optional OIDC login, MCP with OAuth auto-discovery, and horizontal scaling via Redis, all through values.yaml.",
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
      "Drive Lighthouse from the terminal, CI, or your AI assistant. Scripts and agents can query metrics, forecasts, and now the blocked trend directly.",
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
