import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "What is the difference between Lighthouse Community and Premium?",
    answer:
      "Community is free, open source, and includes all core flow metrics and forecasting features — cycle time, throughput, WIP, work item age, and Monte Carlo simulations. Premium (CHF 999/year) adds unlimited teams and projects, priority support, and advanced features including an AI integration via MCP. Most teams start with Community and upgrade when they need to scale.",
  },
  {
    question: "Does Lighthouse work with Jira, Azure DevOps, and Linear?",
    answer:
      "Yes. Lighthouse has native integrations with all three. No CSV exports, no parallel spreadsheets — it reads directly from the tools your teams already work in. Setup takes under 10 minutes per integration.",
  },
  {
    question: "How long does it take to get started with Lighthouse?",
    answer:
      "Under 10 minutes from download to first forecast. Connect your Jira, Azure DevOps, or Linear account, and Lighthouse pulls your historical data automatically. The installation video on this page shows the full process.",
  },
  {
    question: "What is probabilistic forecasting and why is it better than estimates?",
    answer:
      "Probabilistic forecasting uses your team's actual delivery history — how many items you complete per week — to simulate thousands of possible futures and produce a confidence range (for example, '85% chance of delivery by October 14'). Unlike estimates, it is based on what your team actually does, not what you think you can do. The range is honest because it reflects real variability in your system.",
  },
  {
    question: "How is flow metrics different from velocity?",
    answer:
      "Velocity measures how much work a team planned to complete in a sprint — in points, which vary by team and sprint. Flow metrics measure what actually happens: how long work takes (cycle time), how much is in progress at once (WIP), and how reliably work flows through the system. Flow metrics are based on elapsed time, not points, which makes them more stable, more honest, and far more useful for forecasting.",
  },
  {
    question: "Do you work with teams using Scrum or SAFe?",
    answer:
      "Yes. Flow metrics and probabilistic forecasting work regardless of your process framework. We have worked with teams using Kanban, Scrum, SAFe, and hybrid approaches. The data-driven approach works wherever work flows through a system — the framework is just context.",
  },
  {
    question: "Can we book a single workshop, or do we need a full engagement?",
    answer:
      "Single workshops start at CHF 1,000 and run 2 to 4 hours. There is no minimum commitment. Many teams start with one session — Introduction to Probabilistic Forecasting or Flow Metrics and Little's Law — to see what resonates before going deeper. The Complete Flow Transformation Package is there for teams that want the full journey in one go.",
  },
  {
    question: "Is our data safe? Does anything leave our network?",
    answer:
      "Lighthouse runs entirely on your infrastructure, either as a Docker container or as a native desktop app. Nothing is sent to the cloud. Your Jira, Azure DevOps, or Linear data never leaves your network. Lighthouse uses SQLite by default and stores all data locally.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section id="faq" className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4 block">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Common questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Anything not covered here? Email us at{" "}
              <a
                href="mailto:contact@letpeople.work"
                className="text-primary underline underline-offset-2"
              >
                contact@letpeople.work
              </a>
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 bg-white ${
                  openIndex === i
                    ? "border-primary/30 shadow-soft"
                    : "border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-base font-semibold text-foreground leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
