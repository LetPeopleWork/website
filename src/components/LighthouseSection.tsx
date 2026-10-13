import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MediaCarousel from "@/components/MediaCarousel";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The one Lighthouse section on the homepage. The former "How it works" three
// steps live here now as the feature list - they were the same story told
// twice. Downloads by platform stay on /lighthouse; a visitor on the homepage
// is deciding whether to look, not which binary to fetch.
const steps = [
  {
    number: "01",
    title: "Connect your tracker",
    description:
      "Install it on a laptop or a server inside your network, then connect Jira Cloud or Data Center, Azure DevOps, Linear or ServiceNow. A Jira behind your firewall works the same way.",
  },
  {
    number: "02",
    title: "See where work gets stuck",
    description:
      "Cycle time, work in progress, throughput and item age, each with a red, amber or green signal, so you know where to look first.",
  },
  {
    number: "03",
    title: "Forecast from what you finish",
    description:
      "Lighthouse simulates the coming weeks from your team's past throughput and gives dates with odds, for example 85% by 28 March. No story points needed.",
  },
];

function Step({ step, i }: { step: (typeof steps)[number]; i: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${i * 100}ms` : "0ms" }}
      className={`flex gap-5 transition-all duration-700 ease-out ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="text-sm font-mono font-semibold text-primary tracking-widest pt-1.5 shrink-0">
        {step.number}
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight leading-tight mb-2">
          {step.title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

const LighthouseSection = () => {
  const mediaItems = [
    {
      type: "image" as const,
      src: lighthouseAsset("features/metrics/metricsoverview.png"),
      alt: "Team Metrics Overview",
    },
    {
      type: "image" as const,
      src: lighthouseAsset("features/teamdetail.png"),
      alt: "Team Forecasts Manual",
    },
    {
      type: "image" as const,
      src: lighthouseAsset("features/deliveryTimeline.png"),
      alt: "Delivery Timeline",
    },
  ];

  return (
    <section id="lighthouse" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <img
              src={lighthouseLogo}
              alt="Lighthouse Flow Metrics and Forecasting Tool Logo"
              className="h-16 w-auto"
              width="64"
              height="64"
              loading="lazy"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            The answer is already in your tracker
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Every finished ticket has a start and an end date. Lighthouse reads them to show where work gets stuck and when the rest is likely to be done.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          <div className="order-2 lg:order-1">
            <MediaCarousel mediaItems={mediaItems} className="w-full" enableModal={true} />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            {steps.map((step, i) => (
              <Step key={step.number} step={step} i={i} />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Proof that the forecasts can be trusted, early on the page. */}
          <div className="rounded-2xl border border-border bg-background p-8 flex flex-col gap-5" data-testid="lighthouse-home-proof">
            <img
              src={lighthouseAsset("features/realitycheck.png")}
              alt="Forecast Reality Check: past forecasts per percentile and sampling window, checked against what the team delivered"
              className="w-full h-44 object-cover object-top rounded-lg border border-border"
              width="1200"
              height="1016"
              loading="lazy"
            />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Lighthouse checks its own forecasts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Forecast Reality Check replays past forecasts against what your team then delivered, so you know which percentile to trust before you quote a date.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-subtle p-8 flex flex-col justify-center text-center" data-testid="lighthouse-home-cta">
            <h3 className="text-2xl font-bold text-foreground mb-2">Free for up to 3 teams and 1 portfolio</h3>
            <p className="text-muted-foreground mb-6">
              Paid editions remove the limits. Every edition runs on your own infrastructure, with the source on GitHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button asChild size="lg" className="group rounded-full px-8">
                <Link to="/lighthouse">
                  See Lighthouse
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/lighthouse#lighthouse-premium">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LighthouseSection;
