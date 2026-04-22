import { useState } from "react";
import { ChevronDown, Wrench, BookOpen, MessageSquare, GraduationCap, Zap, Search as SearchIcon, CheckCircle2, ArrowRight } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ENTRY_CARDS = [
  {
    question: "Don't see the numbers?",
    answer: "We help you customize Lighthouse to fit your specific organizational needs, ensuring you get the most value from your data.",
    cta: "Need a Hand with the Setup?",
    who: "If you need technical assistance",
    icon: Wrench,
  },
  {
    question: "Don't understand the numbers?",
    answer: "Through custom trainings and workshops, we help your team understand and effectively use flow metrics to drive improvements and get more accurate delivery forecasts.",
    cta: "Book a Workshop or Training",
    who: "If you want to become more data-driven",
    icon: BookOpen,
  },
  {
    question: "Don't like the numbers?",
    answer: "Our expert guidance helps you interpret your metrics and develop actionable strategies to achieve better flow and organizational performance.",
    cta: "Talk To Us",
    who: "If you want continuous guidance",
    icon: MessageSquare,
  },
];

interface OfferingItem {
  name: string;
  description: string;
  duration: string;
  format: string;
  badge?: string;
  highlight?: boolean;
}

interface Category {
  label: string;
  tagline: string;
  icon: typeof GraduationCap;
  items: OfferingItem[];
}

const CATEGORIES: Record<string, Category> = {
  certifications: {
    label: "Official Certifications",
    tagline: "ProKanban.org accredited training — leave with a credential and a skillset",
    icon: GraduationCap,
    items: [
      {
        name: "Applying Professional Kanban (APK)",
        description: "Master Kanban fundamentals with hands-on exercises. Build your own board, define policies, and learn to manage flow — not just tasks.",
        duration: "2 days",
        format: "Remote or On-Site",
        badge: "Certification",
      },
      {
        name: "Applying Metrics for Predictability (AMP)",
        description: "Go beyond velocity. Learn to use cycle time, throughput, and Monte Carlo simulations to answer \"when will it be done?\" with confidence.",
        duration: "2 days",
        format: "Remote or On-Site",
        badge: "Certification",
      },
    ],
  },
  workshops: {
    label: "Hands-On Workshops",
    tagline: "Practical, focused sessions built around your real challenges — 2 to 4 hours each",
    icon: Zap,
    items: [
      {
        name: "Bring Your Own Data Workshop",
        description: "Stop pretending sample datasets represent your reality. We configure Lighthouse Premium with your live data and build a working system that reflects how work actually moves through your organization.",
        duration: "1 day",
        format: "Remote CHF 3,500 · On-Site CHF 4,500",
        badge: "Most Popular",
        highlight: true,
      },
      {
        name: "Introduction to Probabilistic Forecasting",
        description: "Learn how Monte Carlo simulations turn historical throughput into reliable delivery date ranges — no estimates required.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Flow Metrics & Little's Law",
        description: "Understand the physics of your delivery system. WIP, throughput, cycle time — and why controlling one changes everything.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Visualization & Interpretation of Flow Metrics",
        description: "Reading charts is easy. Knowing what they're telling you to do is the hard part. Learn to spot signals and take action.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "SLE & Right Sizing",
        description: "Define meaningful Service Level Expectations and learn to slice work into predictable sizes that actually flow.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Working in Small Batches",
        description: "Why smaller is faster — and how to convince your organization to stop building everything at once.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Epic Right Sizing & Slicing",
        description: "Your Epics are too big. Learn practical techniques to decompose them into pieces that flow and can be forecasted.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Signal & Noise",
        description: "Not every metric movement matters. Learn to distinguish meaningful signals from random variation using process behavior charts.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Actively Manage Items in a Workflow",
        description: "A board without active management is just wallpaper. Learn the daily practices that keep work flowing.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
      {
        name: "Workflow Definition & Visualization",
        description: "Design workflows that reveal reality instead of hiding it. Map your actual process — not the idealized version.",
        duration: "2–4 hours",
        format: "Remote or On-Site",
      },
    ],
  },
  consulting: {
    label: "Consulting & Assessment",
    tagline: "Deep diagnostic work and ongoing advisory — see what your data actually says",
    icon: SearchIcon,
    items: [
      {
        name: "Flow Clarity Assessment",
        description: "A standardized, data-driven diagnostic that cuts through assumptions and reveals what your historical data says about how work flows through your teams. No opinions — just objective analysis.",
        duration: "3–6 months of data analyzed",
        format: "CHF 3,500 · Includes Lighthouse Premium License",
        badge: "Diagnostic",
      },
      {
        name: "Flow Health Check",
        description: "A focused snapshot of your team or portfolio's delivery health. Get a clear report with actionable findings — the fastest way to know where you stand.",
        duration: "Report or half-day workshop",
        format: "From CHF 200/team · CHF 500/portfolio",
        badge: "Quick Start",
      },
      {
        name: "Lighthouse Setup & Introduction",
        description: "Get Lighthouse configured and running in your environment. We handle the technical setup so your teams can focus on the insights from day one.",
        duration: "Flexible",
        format: "Remote or On-Site",
      },
    ],
  },
};

const PACKAGE = {
  name: "Complete Flow Transformation Package",
  subtitle: "End-to-End: Assessment + Implementation + Sustaining Capability",
  description: "The complete journey from understanding your delivery system's current state to implementing a working solution that provides ongoing visibility. This package combines diagnostic assessment with hands-on implementation and sustained capability through Lighthouse Premium.",
  savings: "You get the strategic insight of the Flow Clarity Assessment combined with the practical implementation of the BYOD Workshop, plus the ongoing capability to maintain visibility into your delivery system. This is 25% less than purchasing separately — the most comprehensive and cost-effective way to transform your delivery predictability.",
  scope: [
    "Two-phase engagement: Assessment followed by Implementation",
    "Remote or on-site delivery options",
    "Analysis of your historical data (3–6 months)",
    "Private 1-day implementation workshop with your team",
    "Uses your actual business data and workflows",
  ],
  deliverables: [
    { title: "Complete diagnostic report", detail: "Flow constraints, WIP patterns, aging trends, and predictability indicators from your historical data" },
    { title: "Lighthouse Premium configured to your workflows", detail: "Custom configuration matching your team structures and processes" },
    { title: "Your historical data integrated and validated", detail: "Real data from your systems, cleaned and ready for ongoing analysis" },
    { title: "Immediate visibility into flow metrics", detail: "Answer the questions you're constantly being asked with live data" },
    { title: "A production-ready system your teams can use immediately", detail: "Walk away with both understanding and capability to sustain it" },
    { title: "60-minute diagnostic debrief + full-day implementation workshop", detail: "Comprehensive engagement from assessment to working solution" },
  ],
  priceOnsite: "CHF 7,000",
  priceRemote: "CHF 6,000",
  includes: "Flow Clarity Assessment + BYOD Workshop + 1 Annual Lighthouse Premium License (Save 25%)",
};


// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function CategoryAccordion({
  id,
  data,
  isOpen,
  onToggle,
}: {
  id: string;
  data: Category;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = data.icon;

  return (
    <div
      className={`
        rounded-xl border transition-all duration-300
        ${isOpen
          ? "border-primary/30 shadow-soft bg-white"
          : "border-border bg-white hover:border-primary/20 hover:shadow-soft"
        }
      `}
    >
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300
            ${isOpen ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground group-hover:bg-primary/10"}
          `}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg md:text-xl font-semibold text-foreground leading-tight">
              {data.label}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
              {data.tagline}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs font-medium text-primary bg-accent px-3 py-1 rounded-full hidden sm:inline-block">
            {data.items.length} {data.items.length === 1 ? "offering" : "offerings"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pb-6 md:px-8 md:pb-8">
          <div className={`
            grid gap-4
            ${data.items.length <= 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }
          `}>
            {data.items.map((item, i) => (
              <div
                key={i}
                className={`
                  rounded-lg border p-5 flex flex-col gap-3 transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-soft
                  ${item.highlight
                    ? "border-primary/30 bg-accent/50 hover:border-primary/50"
                    : "border-border bg-muted/30 hover:border-primary/20"
                  }
                `}
              >
                {item.badge && (
                  <span
                    className={`
                      text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full self-start
                      ${item.badge === "Most Popular"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}

                <div className="text-[15px] font-semibold text-foreground leading-snug">
                  {item.name}
                </div>

                <div className="text-[13px] text-muted-foreground leading-relaxed flex-1">
                  {item.description}
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-1 pt-3 border-t border-border text-[12px] text-muted-foreground">
                  <span>⏱ {item.duration}</span>
                  <span>· {item.format}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lighthouse trial bonus (workshops only) */}
          {id === "workshops" && (
            <div className="mt-4 px-5 py-4 rounded-lg border border-dashed border-primary/25 bg-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Book any workshop → get 1 month Lighthouse Premium trial
                </div>
                <div className="text-[13px] text-muted-foreground mt-0.5">
                  Including the full PDF export capability for your reports
                </div>
              </div>
              <span className="text-[13px] text-primary font-semibold whitespace-nowrap">
                Included free ↗
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── MAIN SECTION ────────────────────────────────────────────────────────────

export default function ExpertiseAndServices() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    certifications: false,
    workshops: true,
    consulting: false,
  });

  const toggle = (id: string) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className="bg-background">
      {/* ── Section Header ── */}
      <div className="text-center max-w-2xl mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-5 block">
          Expertise & Services
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-foreground leading-tight tracking-tight">
          Comprehensive support from tool to{" "}
          <span className="text-primary">transformation</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mt-5 leading-relaxed max-w-xl mx-auto">
          We bring both the technology and the know-how to make it work for you.
          From official certifications to deep diagnostic assessments.
        </p>
      </div>

      {/* ── Entry Point Cards ── */}
      <div className="max-w-5xl mx-auto px-4 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ENTRY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="group rounded-xl border border-border bg-white p-6 md:p-7 flex flex-col gap-4 transition-all duration-300 hover:border-primary/30 hover:shadow-medium hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {card.question}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {card.answer}
                </p>

                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block mb-2">
                    {card.who}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                    {card.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Full Catalogue ── */}
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Our Full Catalogue
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-lg mx-auto">
            Every engagement is delivered in pairs — two senior practitioners,
            two perspectives, maximum impact.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(CATEGORIES).map(([id, data]) => (
            <CategoryAccordion
              key={id}
              id={id}
              data={data}
              isOpen={openCategories[id]}
              onToggle={() => toggle(id)}
            />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Featured Package ── */}
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-white to-accent/30 p-6 md:p-10 lg:p-12 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Best Value
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-accent text-primary px-3 py-1 rounded-full">
                Save 25%
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider bg-muted text-muted-foreground px-3 py-1 rounded-full">
                Popular
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1">
              {PACKAGE.name}
            </h3>
            <div className="text-sm md:text-base font-medium text-primary mb-5">
              {PACKAGE.subtitle}
            </div>

            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {PACKAGE.description}
            </p>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-2xl mb-8">
              {PACKAGE.savings}
            </p>

            {/* Scope & Deliverables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  Scope
                </h4>
                <div className="space-y-2.5">
                  {PACKAGE.scope.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  What You Receive
                </h4>
                <div className="space-y-3">
                  {PACKAGE.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.title}</div>
                        <div className="text-[13px] text-muted-foreground">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing + CTA */}
            <div className="border-t border-border pt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                Investment
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div className="flex items-end gap-6 md:gap-10">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">On-Site</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{PACKAGE.priceOnsite}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remote</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{PACKAGE.priceRemote}</div>
                  </div>
                </div>

                <button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm md:text-base px-7 py-3.5 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
                  Schedule Workshop →
                </button>
              </div>
              <div className="text-[13px] text-muted-foreground mt-3">
                {PACKAGE.includes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom / Tailored ── */}
      <div className="max-w-5xl mx-auto px-4 pb-20 md:pb-28">
        <div className="rounded-xl border border-border bg-white p-8 md:p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            Need Something Tailored to Your Needs?
          </h3>

          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed mb-2">
            We believe in the power of collaboration. All our trainings, workshops,
            and consulting services are designed together with you to match your needs.
            We always deliver them in pairs, so you get the best insights and diverse perspectives.
          </p>

          <p className="text-sm text-muted-foreground/70 mb-7">
            Private events start at CHF 1,000 per event (not per attendee).
            Perfect for teams of up to 30.
          </p>

          <button className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 cursor-pointer">
            Reach Out To Talk About How We Can Support →
          </button>
        </div>
      </div>
    </section>
  );
}
