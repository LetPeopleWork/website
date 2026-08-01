import {
  ArrowRight,
  BarChart3,
  Target,
  FileText,
  Gauge,
} from "lucide-react";
import MediaCarousel from "@/components/MediaCarousel";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import forecastsProjectVideo from "@/assets/videos/Forecasts_Project.mp4";
import LighthouseTestimonials from "@/components/LighthouseTestimonials";
import QuickDownloadBar from "@/components/QuickDownloadBar";

const LighthouseSection = () => {
  const mediaItems = [
    {
      type: "image" as const,
      src: lighthouseAsset("features/metrics/metricsoverview.png"),
      alt: "Team Metrics Overview"
    },
    {
      type: "image" as const,
      src: lighthouseAsset("features/teamdetail.png"),
      alt: "Team Forecasts Manual"
    },
    {
      type: "video" as const,
      src: forecastsProjectVideo,
      alt: "Project Forecasts Demo"
    }
  ];

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Visualize the flow you actually have",
      description: "See cycle time, throughput, WIP, and work item age for every team and portfolio, with the data already in the tool your team works in."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Forecast with ranges, not guesses",
      description: "Monte Carlo simulations turn your team's real history into honest delivery forecasts. Give stakeholders a range you can defend, not a date you'll regret."
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: "See where to look in five seconds",
      description: "Every widget shows a Red/Amber/Green indicator based on your team's SLE, WIP limits, and flow signals. Spot the teams and features that need attention before the steering committee does."
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: "Connects to Jira, Azure DevOps, Linear, and ServiceNow",
      description: "Four integrations, deeply built. No CSV exports, no parallel spreadsheets, no \"data engineering\" side project."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Your data never leaves your network",
      description: "Self-hosted and open source, as a Docker container for enterprise or a native desktop app on Windows, macOS, and Linux. No cloud dependencies, no third-party data processors. It runs where your work lives."
    }
  ];

  return (
    <section id="lighthouse" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Understand your delivery system.{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Forecast it with confidence.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Most teams already have the data. They just can't see what it's telling them. Lighthouse connects to Jira, Azure DevOps, Linear, and ServiceNow, turns your history into honest forecasts, and shows you exactly where your delivery system is losing speed.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-subtle rounded-2xl p-12 border border-border mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Start seeing your delivery system clearly. Free.
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            No credit card. No account. No hassle.
          </p>
          <QuickDownloadBar source="home" additionalLink={{ name: "All Downloads", url: "/lighthouse#downloads" }} />
          <p className="text-xs text-muted-foreground mt-4">Community Version free forever • 100% open source • Self-hosted, so your data and the tool stay with you.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Media Carousel */}
          <div className="order-2 lg:order-1">
            <MediaCarousel
              mediaItems={mediaItems}
              className="w-full"
              enableModal={true}
            />
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              What changes when you use Lighthouse
            </h3>

            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Slider */}
        <LighthouseTestimonials />
      </div>
    </section>
  );
};

export default LighthouseSection;
