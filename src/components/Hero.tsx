import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFlow from "@/assets/hero-flow.jpg";

const Hero = () => {
  const handleGetLighthouse = () => {
    const lighthouseSection = document.getElementById("lighthouse");
    if (lighthouseSection) {
      lighthouseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroFlow} 
          alt="Flow visualization background showing agile workflow"
          className="w-full h-full object-cover opacity-10"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Stop defending estimates.{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Start forecasting
            </span>
            {" "}with confidence.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            You're being asked when it'll be done — and right now, your honest answer is a guess. Lighthouse shows you <em>why</em> delivery is slow and <em>when</em> it'll finish — so you fix the system and stop defending the date.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="group" onClick={handleGetLighthouse}>
              Get Lighthouse Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button variant="outline" size="lg" className="group" onClick={handleHowItWorks}>
              <Play className="mr-2 group-hover:scale-110 transition-transform" />
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <p className="text-sm text-muted-foreground mb-6 italic">
            We've watched capable teams drown in estimate theater. Here's what we built to end it:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Professionals Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Open Source</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;