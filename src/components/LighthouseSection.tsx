import {
  ArrowRight,
  BarChart3,
  Target,
  FileText,
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
      title: "Visualize your Flow",
      description: "Take action based on real data - with Lighthouse you have all relevant Flow Metrics at your disposal"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Forecast Delivery Dates",
      description: "Stop wasting time with guesses - Lighthouse is using your historical data to create realistic timelines in seconds"
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: "Integrate with most popular ALM Tools",
      description: "No need to maintain multiple data sources - Lighthouse connects to Jira and Azure DevOps"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Full Transparency - Full Control",
      description: "No need to send your data to some cloud provider in a foreign country - Lighthouse is 100% Open-Source, runs fully on your infrastructure and will not send anything to the cloud"
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
            See Your Flow — Predict Your Delivery <br />
            Lighthouse turns your data into flow metrics and date-accurate delivery forecasts <br />
            Simple to install, simple to use — Most teams see measurable improvements in the first month <br />
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
          <p className="text-xs text-muted-foreground mt-4">Community Version Free forever • All Code is Open Source • Everything runs on your Infrstructure - No Third-Party Cloud Services involved</p>
        </div>

        {/* Installation Simplicity Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Simple to Install. Simple to Use.
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes, not hours. See how easy it is to install Lighthouse.
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