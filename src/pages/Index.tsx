import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import HowItWorks from "@/components/HowItWorks";
import LighthouseSection from "@/components/LighthouseSection";
import AIIntegrationSection from "@/components/AIIntegrationSection";
import WhoBuildsThis from "@/components/WhoBuildsThis";
import BlogSection from "@/components/BlogSection";
import StayConnected from "@/components/StayConnected";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { prices } from "@/lib/pricing";

const Index = () => {
  const { selfServiceAmount } = prices;

  // Structured data for organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LetPeopleWork GmbH",
    "url": "https://letpeople.work",
    "logo": "https://letpeople.work/assets/LPW_Banner_White-DTCn4RDr.png",
    "description": "Makers of Lighthouse, the open-source flow metrics and forecasting tool, and Sizing Poker, a free way to size a backlog without estimating it.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mühlackerstrasse 108",
      "addressLocality": "Zürich",
      "postalCode": "8046",
      "addressCountry": "CH"
    },
    "sameAs": [
      "https://www.linkedin.com/company/let-people-work/",
      "https://github.com/LetPeopleWork",
      "https://www.youtube.com/@LetPeopleWork",
      "https://www.meetup.com/lighthouselive/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@letpeople.work",
      "contactType": "Customer Service"
    },
    "founder": [
      {
        "@type": "Person",
        "name": "Peter Zylka-Greger"
      },
      {
        "@type": "Person",
        "name": "Benjamin Huser-Berta"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "Lighthouse",
          "description": "Open-source flow metrics and forecasting tool. Connects to Jira, Azure DevOps, Linear, and ServiceNow. AI integration via MCP. Community, Self-Service, and Enterprise editions.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Cross-platform",
          "offers": [
            {
              "@type": "Offer",
              "name": "Lighthouse Community Edition",
              "price": "0",
              "priceCurrency": "CHF",
              "description": "Free open-source edition with core flow metrics and forecasting features. Capped to 3 teams and 1 portfolio."
            },
            {
              "@type": "Offer",
              "name": "Lighthouse Self-Service",
              "price": selfServiceAmount,
              "priceCurrency": "CHF",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": selfServiceAmount,
                "priceCurrency": "CHF",
                "unitText": "year"
              },
              "description": "Annual self-hosted license. Unlimited teams, portfolios, and all paid-tier features. Community Slack support."
            },
            {
              "@type": "Offer",
              "name": "Lighthouse Enterprise",
              "price": "10000",
              "priceCurrency": "CHF",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "10000",
                "priceCurrency": "CHF",
                "unitText": "year"
              },
              "description": "Annual self-hosted license with prioritised support, named contacts, and onboarding calls."
            }
          ]
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "WebApplication",
          "name": "Sizing Poker",
          "url": "https://letpeople.work/sizing-poker",
          "description": "Size a backlog by asking one question per item instead of estimating it: could we finish this within the time we set? Three answers, no story points. Free, runs entirely in the browser.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CHF" }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="LetPeopleWork - Lighthouse and Sizing Poker: flow metrics, forecasting, sizing"
        description="Two tools for delivery teams. Lighthouse turns your real delivery data into flow metrics and Monte Carlo forecasts you can defend. Sizing Poker sizes a backlog without estimating it. Both free, both from LetPeopleWork."
        keywords="flow metrics, delivery forecasting, lighthouse tool, flow metrics tool, Monte Carlo forecasting, predictability, throughput, cycle time, lead time, sizing poker, right sizing, no estimates, backlog refinement"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "/" }
        ]}
      />
      <Navigation />
      <Hero />
      <ToolsSection />
      <HowItWorks />
      <LighthouseSection />
      <AIIntegrationSection />
      <WhoBuildsThis />
      <BlogSection />
      <StayConnected />
      <SimpleFooter />
    </div>
  );
};

export default Index;
