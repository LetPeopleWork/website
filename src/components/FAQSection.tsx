import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "I need lots of data first.",
    answer:
      "You need around ten finished work items to get a first useful forecast. Most teams already have that from two weeks of throughput. You don't need a year of history. You need what you've already done.",
  },
  {
    question: "Our tracker is messy. I don't have clean data.",
    answer:
      "Messy is normal. Lighthouse pulls from Jira, Azure DevOps, Linear, ServiceNow, or CSV, and the math holds up against noisy data. The signal you need is when items started and when they finished, and that survives even in trackers that have been through three reorgs.",
  },
  {
    question: "I can't run this in my org. IT will block it.",
    answer:
      "It runs on your laptop. Docker container or native .NET, with no external network calls by default. Your Jira, Azure DevOps, Linear, or ServiceNow data never leaves your machine. You don't need to file a ticket to try it for two weeks.",
  },
  {
    question: "My team's not mature enough for this.",
    answer:
      "Probabilistic forecasting works on whatever flow you have today. Maturity is the result, not the requirement. The reason to start now is that the forecast shows you what to improve. Waiting until you feel ready means waiting forever.",
  },
  {
    question: "I need management buy-in first.",
    answer:
      "Not to try it. Maybe to roll it out. Try it on your own, produce a forecast you couldn't have produced before, then decide whether to share it. The cheapest way to show the value is to run it yourself.",
  },
  {
    question: "I'm just an IC, Scrum Master, or coach. This isn't my call.",
    answer:
      "Most of Lighthouse's early users are exactly that: ICs, Scrum Masters, and coaches running it for their own team. The idea that you need permission to introduce a tool is your story, not your manager's. It installs on your laptop, and nobody else needs to know until you have something worth showing.",
  },
  {
    question: "It looks complicated.",
    answer:
      "Your first useful output is about thirty minutes from download. Pre-loaded sample data lets you see the shape of it before you connect anything. If you've ever opened Excel and built a pivot table, you're already past the hardest part.",
  },
  {
    question: "Do you help with setup and onboarding?",
    answer:
      "Yes, and it's free. We help you get Lighthouse running, connect Jira, Azure DevOps, Linear, or ServiceNow, and walk your team through the tool, at no cost and for every edition. Write to contact@letpeople.work with the subject \"Lighthouse onboarding\". If you want to go deeper, the BYOD pilot workshop puts your team on your own data, and Enterprise licenses include structured onboarding calls.",
  },
  {
    question: "I tried something like this before and it didn't stick.",
    answer:
      "Was it Actionable Agile, Nave, or Jira's native forecasting? Lighthouse is self-hosted, open source, and free to start, which removes most of the reasons these tools die in real orgs. IT blocks the SaaS, the budget gets cut, the champion leaves. None of those land the same way when the tool is free and runs on your laptop.",
  },
  {
    question: "Is this even for me?",
    answer:
      "We'd rather you not download Lighthouse than download it and bounce. It's probably not for you if you're a single team with no portfolio question, since a cycle-time chart in Jira will do. Or if your project is a one-off that's nearly done, because forecasting can't help after the fact. Or if you work in a hard fixed-deadline culture where the date is non-negotiable, because the math doesn't matter if the answer is always to work weekends. If that sounds like you, save yourself the download.",
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
              The honest answers
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              What's stopping you?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              We've heard every reason not to try Lighthouse. Here are the ones that come up most, and what we actually think about them.
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
