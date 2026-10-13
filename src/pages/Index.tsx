import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SizingPokerTeaser from "@/components/SizingPokerTeaser";
import TestimonialsSection from "@/components/TestimonialsSection";
import LighthouseSection from "@/components/LighthouseSection";
import AIIntegrationSection from "@/components/AIIntegrationSection";
import WhoBuildsThis from "@/components/WhoBuildsThis";
import ClosingOffer from "@/components/ClosingOffer";
import BlogSection from "@/components/BlogSection";
import StayConnected from "@/components/StayConnected";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="LetPeopleWork - Lighthouse flow metrics and delivery forecasts"
        description="Lighthouse forecasts when work will be done from what your teams have already finished in Jira, Azure DevOps, Linear or ServiceNow. It runs on your own systems and is free for up to 3 teams. Also from LetPeopleWork: Sizing Poker."
        keywords="flow metrics, delivery forecasting, lighthouse tool, flow metrics tool, Monte Carlo forecasting, predictability, throughput, cycle time, lead time, sizing poker, right sizing, no estimates, backlog refinement"
      />
      <Navigation />
      <Hero />
      <LighthouseSection />
      <TestimonialsSection />
      <SizingPokerTeaser />
      <AIIntegrationSection />
      <WhoBuildsThis />
      <ClosingOffer />
      <BlogSection />
      <StayConnected />
      <SimpleFooter />
    </div>
  );
};

export default Index;
