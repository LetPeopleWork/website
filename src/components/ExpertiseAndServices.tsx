import { useState } from "react";
import { ChevronDown, GraduationCap, Zap, Search as SearchIcon } from "lucide-react";
import PeterImage from '../assets/Peter.png';
import BenjiImage from '../assets/Benji.png';
import EngagementPath from './EngagementPath';
import { prices } from "@/lib/pricing";

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

const categories: Record<string, Category> = {
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
        format: `${prices.assessment} · Includes Lighthouse Premium License`,
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
        description: "Get Lighthouse configured and running in your environment. We connect your data sources and walk your team through the tool so they can use it from day one. Free of charge, because an easy start is the best pitch for Lighthouse we have.",
        format: "Free · every edition",
        badge: "Free",
      },
    ],
  },
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
      {/* ── Quick-start: 3-tier engagement path ── */}
      <EngagementPath />

      {/* ── Full Catalogue (Depth view) ── */}
      <div id="workshops" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-10 md:pb-14">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
            The full catalogue
          </span>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Workshops, certifications, consulting.
          </h3>
          <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-xl mx-auto font-light leading-relaxed">
            Every engagement delivered by two practitioners. Two perspectives, one coherent outcome.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(categories).map(([id, data]) => (
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

      {/* ── About Us ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
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
