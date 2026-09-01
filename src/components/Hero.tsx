import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { trackEvent } from "@/lib/plausible";

// The hero shows the product. Headline, one paragraph, two buttons, and the
// forecast screen itself - a visitor who has never heard of Lighthouse should
// know what it looks like before scrolling. The primary button is a real link
// to the product page; the secondary opens the 30-day trial in place, because
// that is the offer with the least friction.
const Hero = () => {
  const [trialOpen, setTrialOpen] = useState(false);
  const openTrial = () => {
    trackEvent("Trial dialog opened", { source: "hero" });
    setTrialOpen(true);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-background pt-32 pb-0 md:pt-40">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-accent/60 via-background to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
            Open-source flow metrics and forecasting
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            Stop defending estimates.
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent font-light">
              Start forecasting
            </span>{" "}
            <span className="font-light">with confidence.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            You're being asked when it'll be done, and{" "}
            <em className="text-foreground/80 not-italic font-normal">
              every guess that slips costs you a little more trust
            </em>
            . Lighthouse turns your real delivery history into forecasts you can defend.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button asChild variant="hero" size="lg" className="group rounded-full px-8 py-6 text-base">
              <Link to="/lighthouse">
                Get Lighthouse Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base" onClick={openTrial}>
              Try Premium free for 30 days
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-14">
            No signup, no credit card. We email you a 30-day Premium license and it expires on its own.
            {" "}
            <a href="/assessment" className="text-primary font-medium underline-offset-4 hover:underline">
              Not sure where you stand? Take the free assessment.
            </a>
          </p>
        </div>

        {/* The product, cropped at the bottom so the page reads on. */}
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-t-2xl border border-b-0 border-border bg-card shadow-medium overflow-hidden">
            <img
              src="/forecasts-project.png"
              alt="Lighthouse showing a project forecast: probability ranges for when the remaining work will be done"
              className="w-full h-auto block"
              width="1843"
              height="1090"
              loading="eager"
              fetchPriority="high"
              data-testid="hero-product-shot"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      <TrialRequestDialog open={trialOpen} onOpenChange={setTrialOpen} source="hero" />
    </section>
  );
};

export default Hero;
