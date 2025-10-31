import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFlow from "@/assets/hero-flow.jpg";

const Hero = () => {
  const handleExploreLighthouse = () => {
    const lighthouseSection = document.getElementById("lighthouse");
    if (lighthouseSection) {
      lighthouseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOurServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
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
            Unlock the Full{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Potential
            </span>
            {" "}  of your Organization
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            LetPeopleWork combines the powerful tooling of Lighthouse with deep expertise and experience in Flow, Delivery, and Obeya. <br />
            We combine the know-how and the tooling, so that we can provide you the services that creates a measurable impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="group" onClick={handleExploreLighthouse}>
              Explore Lighthouse
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="group" onClick={handleOurServices}>
              <Play className="mr-2 group-hover:scale-110 transition-transform" />
              Our Services
            </Button>
          </div>

          {/* Stats */}
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