import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { trackEvent } from "@/lib/plausible";
import heroFlow from "@/assets/hero-flow.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The primary button is a real link to the product page; the secondary one
// opens the 30-day trial right here, because the trial is the offer with the
// least friction and it should not be three scrolls away.
const Hero = () => {
  const [trialOpen, setTrialOpen] = useState(false);
  const openTrial = () => {
    trackEvent("Trial dialog opened", { source: "hero" });
    setTrialOpen(true);
  };
  const { ref: statsRef, revealed: statsRevealed } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-16">
      {/* Background Image — very subtle */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFlow}
          alt="Flow visualization background showing agile workflow"
          className="w-full h-full object-cover opacity-[0.04]"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
            Open-source flow metrics and forecasting
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-foreground mb-8 leading-[1.02] tracking-tight">
            Stop defending estimates.
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent font-light">
              Start forecasting
            </span>{" "}
            <span className="font-light">with confidence.</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            You're being asked when it'll be done. Right now your honest answer is a guess, <em className="text-foreground/80 not-italic font-normal">and every guess that slips costs you a little more trust</em>. Lighthouse turns your real delivery history into forecasts you can defend, so you stop losing the room every time a date moves.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button asChild variant="hero" size="lg" className="group rounded-full px-8 py-6 text-base">
              <Link to="/lighthouse">
                Get Lighthouse Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="group rounded-full px-8 py-6 text-base" onClick={openTrial}>
              Try Self-Service free for 30 days
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            No signup, no credit card. We send you a 30-day Self-Service license and it expires on its own.
          </p>
          <p className="text-sm text-muted-foreground mb-20">
            Not sure where to start? Take our{" "}
            <a href="/assessment" className="text-primary font-medium underline-offset-4 hover:underline">
              free Flow Assessment
            </a>{" "}
            and see where you stand.
          </p>

          {/* Stats with scroll reveal */}
          <div
            ref={statsRef}
            className={`transition-all duration-700 ease-out ${
              statsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-sm text-muted-foreground mb-8 italic font-light">
              We've spent years helping teams move from guesswork to data. Lighthouse is what we built along the way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "4", label: "Work tracking integrations" },
                { value: "100%", label: "Open Source" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{ transitionDelay: statsRevealed ? `${100 + i * 90}ms` : "0ms" }}
                  className={`text-center transition-all duration-700 ease-out ${
                    statsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="text-5xl md:text-6xl font-semibold text-primary mb-2 tracking-tight">{s.value}</div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-light">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TrialRequestDialog open={trialOpen} onOpenChange={setTrialOpen} source="hero" />
    </section>
  );
};

export default Hero;
