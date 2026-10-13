import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { trackEvent } from "@/lib/plausible";

// The homepage used to end on five equal social cards with no way forward.
// This is the closing offer, and it carries the page's one strong background:
// colour marks the moment to act, not a secondary feature.
const ClosingOffer = () => {
  const [trialOpen, setTrialOpen] = useState(false);
  const openTrial = () => {
    trackEvent("Trial dialog opened", { source: "home-closing" });
    setTrialOpen(true);
  };

  return (
    <section id="get-started" className="py-20 md:py-24 bg-gradient-hero" data-testid="closing-offer">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight mb-5">
          Try it on your own team's data
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/85 leading-relaxed mb-9">
          Point the free Community edition at your own Jira or Azure DevOps and look at your forecast before you decide anything. Want to try everything? We'll email you a 30-day Premium license. You don't sign up, and we don't ask for a card.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button asChild size="lg" className="group rounded-full px-8 py-6 text-base bg-white text-primary hover:bg-white/90">
            <Link to="/lighthouse#downloads">
              Get Lighthouse free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-base border-white/60 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            onClick={openTrial}
          >
            Try Premium free for 30 days
          </Button>
        </div>
        <p className="text-sm text-primary-foreground/80">
          Not sure where you stand?{" "}
          <Link to="/assessment" className="font-semibold text-primary-foreground underline underline-offset-4">
            Take the five-minute flow assessment
          </Link>
        </p>
      </div>
      <TrialRequestDialog open={trialOpen} onOpenChange={setTrialOpen} source="home-closing" />
    </section>
  );
};

export default ClosingOffer;
