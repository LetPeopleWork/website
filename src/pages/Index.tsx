import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LighthouseSection from "@/components/LighthouseSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import EventsSection from "@/components/EventsSection";
import StayConnected from "@/components/StayConnected";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";

const Index = () => {
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
      "addressCountry": "CH"
    },
    "sameAs": [
      "https://www.linkedin.com/company/let-people-work/",
      "https://github.com/LetPeopleWork"
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
          "description": "Open-source flow metrics and forecasting tool with Community and Premium editions",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Cross-platform",
          "offers": [
            {
              "@type": "Offer",
              "name": "Lighthouse Community Edition",
              "price": "0",
              "priceCurrency": "CHF",
              "description": "Free open-source version with core flow metrics and forecasting features"
            },
            {
              "@type": "Offer",
              "name": "Lighthouse Premium Edition",
              "price": "999",
              "priceCurrency": "CHF",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "999",
                "priceCurrency": "CHF",
                "unitText": "year"
              },
              "description": "Premium version with unlimited users and advanced features",
              "eligibleQuantity": {
                "@type": "QuantitativeValue",
                "value": "unlimited",
                "unitText": "users"
              }
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
      />
      <Navigation />
      <Hero />
      <LighthouseSection />
      <ServicesSection />
      <ExpertiseSection />
      <EventsSection />
      <StayConnected />
      <SimpleFooter />
    </div>
  );
};

export default Index;
