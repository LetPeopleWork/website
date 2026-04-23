const steps = [
  {
    number: "1",
    title: "Connect your data",
    description:
      "Lighthouse installs in under 10 minutes and pulls from Jira, Azure DevOps, or Linear. No spreadsheets, no manual exports.",
  },
  {
    number: "2",
    title: "See why delivery is slow",
    description:
      "Cycle time, WIP, throughput, and work item age reveal your actual delivery system — not the idealized version. Spot bottlenecks before the steering committee does.",
  },
  {
    number: "3",
    title: "Forecast with data you can defend",
    description:
      "Monte Carlo simulations turn your team's real history into delivery ranges that hold up in stakeholder conversations — and improve as your system does.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4 block">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            From guessing to knowing —{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              in three steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most teams use Lighthouse to stop defending estimates. Then they realize they're also delivering faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-background rounded-2xl border border-border p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
