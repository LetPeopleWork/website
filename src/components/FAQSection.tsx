import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "I need lots of data first.",
    answer:
      "You need around ten finished work items to get a first useful forecast. Most teams already have that from two weeks of throughput, so a year of history is not needed.",
  },
  {
    question: "Our tracker is messy. I don't have clean data.",
    answer:
      "Messy is normal. Lighthouse pulls from Jira, Azure DevOps, Linear, ServiceNow, or CSV, and the math holds up against noisy data. The signal you need is when items started and when they finished, and that survives even in trackers that have been through three reorgs.",
  },
  {
    question: "IT will block it. Our Jira isn't even reachable from the internet.",
    answer:
      "Lighthouse runs where you install it: your laptop, a VM, Docker or Kubernetes inside your network. It connects to Jira Cloud, and to Jira Server or Data Center with a personal access token. Your work items stay on your infrastructure, and Lighthouse sends nothing to us unless someone switches on usage data, which carries no content. To try it, it runs on your own laptop without a ticket to IT.",
  },
  {
    question: "Won't Jira or Azure DevOps just build this in?",
    answer:
      "They may add more charts, and for one team in one tool those can be enough. Lighthouse does flow and forecasting only and works the same across Jira, Azure DevOps, Linear and ServiceNow. It checks its own past forecasts, so you know how far to trust them, and a feature worked by several teams gets one forecast that combines all of them. The source is public, so you are not locked in to us or to your tracker.",
  },
  {
    question: "My team's not mature enough for this.",
    answer:
      "Probabilistic forecasting works on whatever flow you have today. Starting early helps, because the forecast shows you what to improve first.",
  },
  {
    question: "I need management buy-in first.",
    answer:
      "Not to try it. Maybe to roll it out. Try it on your own, produce a forecast you couldn't have produced before, then decide whether to share it. The cheapest way to show the value is to run it yourself.",
  },
  {
    question: "I'm just an IC, Scrum Master, or coach. This isn't my call.",
    answer:
      "Most of Lighthouse's early users are exactly that: ICs, Scrum Masters, and coaches running it for their own team. It installs on your laptop, and nobody else needs to know until you have something worth showing.",
  },
  {
    question: "It looks complicated.",
    answer:
      "Plan for half an hour from download to a first forecast. Gábor Bittera did it live in under ten minutes, which you can watch further up this page. Pre-loaded sample data lets you look around before you connect anything.",
  },
  {
    question: "Do you help with setup and onboarding?",
    answer:
      "Yes, and it's free. We help you get Lighthouse running, connect Jira, Azure DevOps, Linear, or ServiceNow, and walk your team through the tool, at no cost and for every edition. Write to contact@letpeople.work with the subject \"Lighthouse onboarding\". Enterprise licenses also include structured onboarding calls.",
  },
  {
    question: "I tried something like this before and it didn't stick.",
    answer:
      "Was it Actionable Agile, Nave, or Jira's native forecasting? Lighthouse is self-hosted, source available, and free to start, which removes most of the reasons these tools die in real orgs. IT blocks the SaaS, the budget gets cut, the champion leaves. None of those land the same way when the tool is free and runs on your laptop.",
  },
  {
    question: "Is this even for me?",
    answer:
      "Maybe not if you are one team with nothing bigger than the next sprint to plan; the charts in your tracker may be enough. Or if your project is nearly done, because a forecast can't help after the fact. Fixed deadlines are different: when the date can't move, the useful question is how much will fit by then, and Lighthouse answers that.",
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
      {/* JSON-LD rendered directly: react-helmet-async does not inject with
          React 19, and Google reads JSON-LD anywhere in the document. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section id="faq" className="py-24 sm:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Questions people ask us
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              The reasons people give for not trying Lighthouse, and what we think about each.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 bg-white ${
                  openIndex === i
                    ? "border-primary/40 shadow-medium"
                    : "border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-base md:text-lg font-semibold text-foreground leading-snug">
                    "{faq.question}"
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === i ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed text-base md:text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-12">
            Something else on your mind? Email us at{" "}
            <a
              href="mailto:contact@letpeople.work"
              className="text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              contact@letpeople.work
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
