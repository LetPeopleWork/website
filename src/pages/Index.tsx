import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LighthouseSection from "@/components/LighthouseSection";
import AIIntegrationSection from "@/components/AIIntegrationSection";
import ExpertiseAndServices from "@/components/ExpertiseAndServices";
import BlogSection from "@/components/BlogSection";
import StayConnected from "@/components/StayConnected";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { prices } from "@/lib/pricing";

const Index = () => {
  const { selfServiceAmount } = prices();

  // Structured data for organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LetPeopleWork GmbH",
    "url": "https://letpeople.work",
    "logo": "https://letpeople.work/assets/LPW_Banner_White-DTCn4RDr.png",
    "description": "Expert consulting and training in Flow, Delivery, and Obeya methodologies. Creators of Lighthouse - the leading open-source flow metrics and forecasting tool.",
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
          "@type": "Service",
          "name": "Flow Consulting",
          "description": "Expert guidance to improve your flow metrics and organizational performance",
          "serviceType": "Consulting"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Workshops & Training",
          "description": "Custom trainings and workshops on Flow, Kanban, and forecasting methodologies",
          "serviceType": "Training"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "Lighthouse",
          "description": "Open-source flow metrics and forecasting tool. Connects to Jira, Azure DevOps, and Linear. AI integration via MCP. Community, Self-Service, and Enterprise editions.",
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
              "description": "Annual self-hosted license with prioritised support, named contacts, onboarding calls, and workshop discounts."
            }
          ]
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="LetPeopleWork - Flow Metrics Consulting & Lighthouse Tool"
        description="Transform your organization with expert Flow consulting and Lighthouse, the leading open-source flow metrics tool. Get data-driven insights, improve predictability, and deliver value faster with Monte Carlo forecasting."
        keywords="flow metrics consulting, agile consulting, kanban consulting, delivery forecasting, lighthouse tool, flow metrics tool, agile coaching, scrum coaching, Monte Carlo forecasting, predictability, throughput, cycle time, lead time, agile transformation, organizational improvement"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "/" }
        ]}
      />
      <Navigation />
      <Hero />
      <HowItWorks />
      <LighthouseSection />
      <AIIntegrationSection />
      <ExpertiseAndServices />
      <BlogSection />
      <StayConnected />
      <SimpleFooter />
    </div>
  );
};

export default Index;
