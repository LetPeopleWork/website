import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqData from "@/content/lighthouse-faq.json";

// The questions live in a JSON file so the build can put the same answers
// into the static HTML that crawlers without JavaScript read, as text
// (scripts/seo-content.mjs) and as FAQPage structured data
// (scripts/seo-schema.mjs). Edit them there.
const faqs: { question: string; answer: string }[] = faqData;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <section id="faq" className="py-24 sm:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Questions people ask us
            </h2>
            <p className="text-lg md:text-xl/7 text-muted-foreground leading-relaxed">
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
                  <span className="text-base md:text-lg/7 font-semibold text-foreground leading-snug">
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
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed text-base md:text-lg/7">
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
