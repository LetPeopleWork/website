import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The two tools, side by side, directly under the hero. This is the section
// that makes the site a product site: Lighthouse is reachable in one scroll,
// and Sizing Poker has a home. Each card has exactly one call to action.
const tools = [
  {
    name: "Lighthouse",
    eyebrow: "Flow metrics and forecasting",
    description:
      "Connects to Jira, Azure DevOps, Linear, or ServiceNow and turns your real delivery history into cycle time, throughput, work item age, and Monte Carlo forecasts you can defend. Self-hosted, open source, free to start.",
    href: "/lighthouse",
    cta: "Get Lighthouse",
    testId: "tool-card-lighthouse",
    primary: true,
  },
  {
    name: "Sizing Poker",
    eyebrow: "Backlog sizing without estimates",
    description:
      "One item at a time, one question: could we finish this within the time we set? Three answers, no story points. A round takes minutes, runs in your browser, and nothing leaves it.",
    href: "/sizing-poker",
    cta: "Try Sizing Poker",
    testId: "tool-card-sizing-poker",
    primary: false,
  },
];

function ToolCard({ tool, i }: { tool: (typeof tools)[number]; i: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-testid={tool.testId}
      style={{ transitionDelay: revealed ? `${i * 100}ms` : "0ms" }}
      className={`flex flex-col rounded-3xl border p-8 md:p-10 transition-all duration-700 ease-out ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${tool.primary ? "border-primary/30 bg-background shadow-soft" : "border-border bg-background"} hover:-translate-y-0.5 hover:shadow-soft`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
        {tool.eyebrow}
      </span>
      <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
        {tool.name}
      </h3>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light mb-8 flex-1">
        {tool.description}
      </p>
      <Link
        to={tool.href}
        className={`group inline-flex items-center gap-2 self-start rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
          tool.primary
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "border border-border text-foreground hover:border-primary hover:text-primary"
        }`}
      >
        {tool.cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

const ToolsSection = () => {
  const { ref: headRef, revealed: headRevealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="tools" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headRef}
          className={`text-center max-w-3xl mx-auto mb-14 md:mb-16 transition-all duration-700 ease-out ${
            headRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5 block">
            Two tools
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
            Why is delivery slow?
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent font-light">
              When will it be done?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Two questions every delivery team gets asked. We built a tool for each.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {tools.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
