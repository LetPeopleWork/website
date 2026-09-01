import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MediaCarousel from "@/components/MediaCarousel";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import forecastsProjectVideo from "@/assets/videos/Forecasts_Project.mp4";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The one Lighthouse section on the homepage. The former "How it works" three
// steps live here now as the feature list - they were the same story told
// twice. Downloads by platform stay on /lighthouse; a visitor on the homepage
// is deciding whether to look, not which binary to fetch.
const steps = [
  {
    number: "01",
    title: "Connect your data",
    description:
      "Installs in under ten minutes and pulls from Jira, Azure DevOps, Linear, or ServiceNow. Self-hosted, so your data never leaves your network.",
  },
  {
    number: "02",
    title: "See why delivery is slow",
    description:
      "Cycle time, WIP, throughput, and work item age show the delivery system you actually have. Red, amber and green on every widget say where to look first.",
  },
  {
    number: "03",
    title: "Forecast with data you can defend",
    description:
      "Monte Carlo simulations turn your team's real history into delivery ranges that hold up in front of stakeholders, and improve as your system does.",
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
        <p className="text-base text-muted-foreground leading-relaxed font-light">
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
      type: "video" as const,
      src: forecastsProjectVideo,
      alt: "Project Forecasts Demo",
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
            Understand your delivery system.{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Forecast it with confidence.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Most teams already have the data. They just can't see what it's telling them, so the same delays keep surprising them, quarter after quarter.
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

        <div className="text-center bg-gradient-subtle rounded-2xl p-10 md:p-12 border border-border" data-testid="lighthouse-home-cta">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Free to start. Yours to keep.
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-5">
            <Button asChild size="lg" className="group rounded-full px-8">
              <Link to="/lighthouse">
                See Lighthouse
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/lighthouse#lighthouse-trial">Try Premium free for 30 days</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Community edition free forever • 100% open source • Self-hosted on Windows, macOS, Linux, or Docker
          </p>
        </div>
      </div>
    </section>
  );
};

export default LighthouseSection;
