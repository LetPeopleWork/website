import { useState } from "react";
import { ChevronDown, MessageSquare, GraduationCap, Zap, Search as SearchIcon, CheckCircle2 } from "lucide-react";
import PeterImage from '../assets/Peter.png';
import BenjiImage from '../assets/Benji.png';

// ─── DATA ────────────────────────────────────────────────────────────────────


interface OfferingItem {
  name: string;
  description: string;
  duration?: string;
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
    tagline: "ProKanban.org accredited training. Leave with a credential and a skillset.",
    icon: GraduationCap,
    items: [
      {
        name: "Applying Professional Kanban (APK)",
        description: "Master Kanban fundamentals with hands-on exercises. Build your own board, define policies, and learn to manage flow, not just tasks.",
        duration: "2 days",
        format: "Starting at CHF 5,000 · Min. 5 participants",
        badge: "Certification",
      },
      {
        name: "Applying Metrics for Predictability (AMP)",
        description: "Go beyond velocity. Learn to use cycle time, throughput, and Monte Carlo simulations to answer \"when will it be done?\" with confidence.",
        duration: "2 days",
        format: "Starting at CHF 5,000 · Min. 5 participants",
        badge: "Certification",
      },
    ],
  },
  workshops: {
    label: "Hands-On Workshops",
    tagline: "Practical, focused sessions built around your real challenges. Two to four hours each.",
    icon: Zap,
    items: [
      {
        name: "Bring Your Own Data Workshop",
        description: "Stop pretending sample datasets represent your reality. We configure Lighthouse Premium with your live data and build a working system that reflects how work actually moves through your organization.",
        duration: "1 day",
        format: "Starting at CHF 3,500",
        badge: "Most Popular",
        highlight: true,
      },
      {
        name: "Introduction to Probabilistic Forecasting",
        description: "Learn how Monte Carlo simulations turn historical throughput into reliable delivery date ranges. No estimates required.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Flow Metrics & Little's Law",
        description: "Understand the physics of your delivery system. WIP, throughput, cycle time, and why controlling one changes everything.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Visualization & Interpretation of Flow Metrics",
        description: "Reading charts is easy. Knowing what they're telling you to do is the hard part. Learn to spot signals and take action.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "SLE & Right Sizing",
        description: "Define meaningful Service Level Expectations and learn to slice work into predictable sizes that actually flow.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Working in Small Batches",
        description: "Why smaller is faster, and how to convince your organization to stop building everything at once.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Epic Right Sizing & Slicing",
        description: "Your Epics are too big. Learn practical techniques to decompose them into pieces that flow and can be forecasted.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Signal & Noise",
        description: "Not every metric movement matters. Learn to distinguish meaningful signals from random variation using process behavior charts.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Actively Manage Items in a Workflow",
        description: "A board without active management is just wallpaper. Learn the daily practices that keep work flowing.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
      {
        name: "Workflow Definition & Visualization",
        description: "Design workflows that reveal reality instead of hiding it. Map your actual process, not the idealized version.",
        duration: "2–4 hours",
        format: "Starting at CHF 1,000 · Up to 30 participants",
      },
    ],
  },
  consulting: {
    label: "Consulting & Assessment",
    tagline: "Deep diagnostic work and ongoing advisory to see what your data actually says.",
    icon: SearchIcon,
    items: [
      {
        name: "Flow Clarity Assessment",
        description: "A standardized, data-driven diagnostic that cuts through assumptions and reveals what your historical data says about how work flows through your teams. No opinions, just objective analysis.",
        duration: "3–6 months of data analyzed",
        format: "CHF 3,500 · Includes Lighthouse Premium License",
        badge: "Diagnostic",
      },
      {
        name: "Flow Health Check",
        description: "A focused snapshot of your team or portfolio's delivery health. Get a clear report with actionable findings, the fastest way to know where you stand.",
        duration: "Report or half-day workshop",
        format: "From CHF 200/team · CHF 500/portfolio",
        badge: "Quick Start",
      },
      {
        name: "Lighthouse Setup & Introduction",
        description: "Get Lighthouse configured and running in your environment. We set up 3 teams and 1 portfolio, connect your data sources, and walk your team through the tool so they can use it from day one.",
        format: "Starting at CHF 500 · 3 teams + 1 portfolio",
      },
    ],
  },
};

const PACKAGE = {
  name: "Complete Flow Transformation Package",
  subtitle: "End-to-End: Assessment + Implementation + Sustaining Capability",
  description: "The complete journey from understanding your delivery system's current state to implementing a working solution that provides ongoing visibility. This package combines diagnostic assessment with hands-on implementation and sustained capability through Lighthouse Premium.",
  savings: "You get the strategic insight of the Flow Clarity Assessment combined with the practical implementation of the BYOD Workshop, plus the ongoing capability to maintain visibility into your delivery system. This is 25% less than purchasing separately, the most comprehensive and cost-effective way to transform your delivery predictability.",
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

                <div className="flex flex-col gap-1 pt-3 border-t border-border text-[12px] text-muted-foreground mt-auto">
                  {item.duration && <span>⏱ {item.duration}</span>}
                  <span>{item.format}</span>
                </div>
              </div>
            ))}
          </div>

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
    <section id="services" className="bg-background">
      {/* ── Section Header ── */}
      <div className="text-center max-w-4xl mx-auto px-4 pt-20 pb-8 md:pt-28 md:pb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-5 block">
          How we help
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight tracking-tight">
          <span className="text-foreground">Your team shouldn't have to guess.</span>
          <br />
          <span className="text-primary">We replace gut feel with flow data and help you identify improvements you can actually measure.</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mt-5 leading-relaxed max-w-xl mx-auto">
          We bring both the tool and the expertise to make it work — from official certifications to deep diagnostic assessments.
        </p>
      </div>

      {/* ── Full Catalogue ── */}
      <div id="workshops" className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="text-center mb-10 md:mb-14">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Where to Start
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-lg mx-auto">
            Every engagement delivered by two practitioners, two perspectives, one coherent outcome.
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

        <div className="mt-10 text-center">
          <a
            href="mailto:contact@letpeople.work?subject=Workshop%20Booking"
            className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm md:text-base px-8 py-3.5 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            Book a Workshop →
          </a>
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
              Six months from now, your team walks into any steering committee meeting with a forecast range built from real data, not gut feeling. And you'll know which parts of your delivery system to fix to make the next one even better. This package is how you get there.
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

                <a
                  href={`mailto:contact@letpeople.work?subject=Request for ${encodeURIComponent(PACKAGE.name)}`}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm md:text-base px-7 py-3.5 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap no-underline"
                >
                  Schedule Workshop →
                </a>
              </div>
              <div className="text-[13px] text-muted-foreground mt-3">
                {PACKAGE.includes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom / Tailored ── */}
      <div id="custom-events" className="max-w-5xl mx-auto px-4 pb-20 md:pb-28">
        <div className="rounded-xl border border-border bg-white p-8 md:p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            Your context is unique. Let's design something that fits.
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

          <a
            href="mailto:contact@letpeople.work"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 cursor-pointer no-underline"
          >
            Reach Out To Talk About How We Can Support →
          </a>
        </div>
      </div>
      {/* ── About Us ── */}
      <div className="max-w-5xl mx-auto px-4 pb-20 md:pb-28">
        <div className="text-center bg-background/80 backdrop-blur-sm rounded-2xl p-12 border border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            The practitioners behind the tools
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Peter Zylka-Greger</h3>
                <img
                  src={PeterImage}
                  alt="Peter Zylka-Greger - Flow and Kanban Expert"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
              <p className="text-muted-foreground">
                For years I have been working with teams worldwide, experiencing what great teams can achieve.
                But also seeing that success isn't just about putting individuals together—it requires the right
                techniques, emotional intelligence, and toolkit.
              </p>
              <p className="text-muted-foreground">
                We see frustrated team members, overwhelmed managers, and complaining customers because people
                are drowning in meetings instead of delivering value. People want to contribute and be part of
                something successful—we just need to let them work.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Benjamin Huser-Berta</h3>
                <img
                  src={BenjiImage}
                  alt="Benjamin Huser-Berta - Software Engineer and Scrum Master"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
              <p className="text-muted-foreground">
                As a Software Engineer and Scrum Master, I've seen teams struggle with wasteful processes
                and overwhelming workloads that kill motivation. I believe work can be creative and fun when
                we reduce waste and create environments focused on delivering value.
              </p>
              <p className="text-muted-foreground">
                We bring you everything you need: the tools, know-how, and real-world experience.
                Unlike traditional consultancies, we create the tools we recommend and have hands-on
                experience making them work in complex organizational environments.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-primary mb-4">
              We don't just give advice—we build the tools and have proven they work.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our unique combination of tool creation, practical implementation experience, and deep
              methodological expertise means you get solutions that actually work in the real world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
