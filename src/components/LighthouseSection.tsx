import {
  ArrowRight,
  BarChart3,
  Target,
  FileText,
  Gauge,
} from "lucide-react";
import MediaCarousel from "@/components/MediaCarousel";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import metricsTeam1 from "@/assets/screenshots/Metrics_Team_1.png";
import forecastsTeamManual from "@/assets/screenshots/Forecasts_Team_Manual.png";
import forecastsProjectVideo from "@/assets/videos/Forecasts_Project.mp4";
import installationVideo from "@/assets/videos/Installation.mp4";
import LighthouseTestimonials from "@/components/LighthouseTestimonials";
import QuickDownloadBar from "@/components/QuickDownloadBar";

const LighthouseSection = () => {
  const mediaItems = [
    {
      type: "image" as const,
      src: metricsTeam1,
      alt: "Team Metrics Overview"
    },
    {
      type: "image" as const,
      src: forecastsTeamManual,
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
      description: "See cycle time, throughput, WIP, and work item age for every team and portfolio — with the data already in the tool your team works in."
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
      title: "Connects to Jira, Azure DevOps, and Linear",
      description: "Three integrations, deeply built. No CSV exports, no parallel spreadsheets, no \"data engineering\" side project."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Your data never leaves your network",
      description: "Self-hosted and open source — as a Docker container for enterprise, or as a native desktop app on Windows, macOS, and Linux. No cloud dependencies, no third-party data processors, it runs where your work lives."
    }
  ];

  return (
    <section id="lighthouse" className="py-20 bg-background">
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
            Meet{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Lighthouse
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flow metrics and probabilistic forecasts, built on your team's real data. Self-hosted. Open source. Yours to trust.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Works with Jira, Azure DevOps, and Linear.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-subtle rounded-2xl p-12 border border-border mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Try the Community Version of Lighthouse Today
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            No credit card. No account. No hassle.
          </p>
          <QuickDownloadBar additionalLink={{ name: "All Downloads", url: "/lighthouse#downloads" }} />
          <p className="text-xs text-muted-foreground mt-4">Community Version free forever • 100% open source • Runs on your infrastructure — nothing sent to the cloud</p>
        </div>

        {/* Installation Simplicity Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Simple to Install. Simple to Use.
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From download to first forecast in under ten minutes. Here's what that looks like.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border">
              <video
                className="w-full"
                controls
                preload="metadata"
                aria-label="Lighthouse installation demo video"
              >
                <source src={installationVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
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
              Highlights
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
