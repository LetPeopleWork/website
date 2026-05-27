import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Connect your data",
    description:
      "Lighthouse installs in under ten minutes and pulls from Jira, Azure DevOps, or Linear. No spreadsheets. No manual exports.",
  },
  {
    number: "02",
    title: "See why delivery is slow",
    description:
      "Cycle time, WIP, throughput, and work item age reveal your actual delivery system — not the idealised version. Spot bottlenecks before the steering committee does.",
  },
  {
    number: "03",
    title: "Forecast with data you can defend",
    description:
      "Monte Carlo simulations turn your team's real history into delivery ranges that hold up in stakeholder conversations — and improve as your system does.",
  },
];

function Step({ step, i }: { step: (typeof steps)[number]; i: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${i * 100}ms` : "0ms" }}
      className={`relative bg-background rounded-3xl border border-border p-8 md:p-10 transition-all duration-700 ease-out ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } hover:border-primary/20 hover:shadow-soft hover:-translate-y-0.5`}
    >
      <div className="text-sm font-mono font-semibold text-primary tracking-widest mb-6">
        {step.number}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">
        {step.title}
      </h3>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
        {step.description}
      </p>
    </div>
  );
}

const HowItWorks = () => {
  const { ref: headRef, revealed: headRevealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headRef}
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700 ease-out ${
            headRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5 block">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
            From guessing to knowing.
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent font-light">In three steps.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Most teams use Lighthouse to stop defending estimates. Then they realise they're delivering faster too.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
