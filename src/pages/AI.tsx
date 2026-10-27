import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  CalendarClock,
  FileText,
  GitBranch,
  GraduationCap,
  Layers,
  LibraryBig,
  MessageSquareText,
  Radar,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Github } from "@/components/icons/BrandIcons";
import workshopGraphic from "@/assets/ai/letpeopleworkshop.svg";
import growGraphic from "@/assets/ai/letpeoplegrow.svg";
import journeyData from "@/content/ai-journey.json";
import { prices } from "@/lib/pricing";
import { trackEvent } from "@/lib/plausible";

// The AI page: obAIa, how LetPeopleWork runs itself, offered as something we
// help a company set up in its own environment; the open-source plugins; and
// the workshop journey.
//
// Every claim is grounded in the founders' blog, the "Let People Behind the
// Scenes" Lighthouse Live session or the public plugin repositories. Rules
// that come from that research (October 2026), keep them when editing:
// - obAIa is not a product, a template or a download, and it has only run at
//   LetPeopleWork so far. Setups elsewhere are pilots. No setup price exists
//   yet; CHF 2,500 is the workshop price, not a build price.
// - The three lenses are marketing, social and commercial.
// - No speed-up, savings or client results: there are none to quote.
// - Agents prepare and propose; people decide, post, publish and book.

const CONTACT_URL = "mailto:contact@letpeople.work";
const SETUP_URL = `${CONTACT_URL}?subject=${encodeURIComponent("An obAIa setup for our company")}`;
const BLOG_OBAIA = "https://blog.letpeople.work/p/our-obeya-lives-in-git-now-and-it";
const SESSION_URL = "https://www.youtube.com/watch?v=9Hu0DwLBddE";

// The parts of obAIa, in the order a thought travels through them.
const BUILDING_BLOCKS = [
  {
    icon: FileText,
    title: "Records, not slides",
    text: "Decisions, cards, contacts, notes, themes and dates are plain Markdown files in a private git repository. The git history is the audit trail.",
  },
  {
    icon: MessageSquareText,
    title: "A front door for thoughts",
    text: "You type what's on your mind. obAIa proposes where it belongs and writes it down only after you say yes.",
  },
  {
    icon: Layers,
    title: "Views computed, not maintained",
    text: "The board, the pipeline and the trends come from the records by a script, so nobody keeps a second copy up to date.",
  },
  {
    icon: Scale,
    title: "Three lenses on every hard call",
    text: "Marketing, social and commercial agents argue a decision side by side. What comes out is a record with its reasoning and a date to look at it again.",
  },
  {
    icon: Radar,
    title: "Agents on a schedule",
    text: "A radar reads discussions worth answering every day and turns the best one into a card. It may add one card per run, and nothing else.",
  },
  {
    icon: LibraryBig,
    title: "Knowledge it loads",
    text: "Product facts, offerings and messaging rules live as skills the agents read before they write, so they don't have to guess.",
  },
];

const WEEK = [
  {
    when: "All week",
    what: "Thoughts, calls and ideas go in by typing. Each one becomes a record after a yes, or nothing.",
  },
  {
    when: "Every day, unattended",
    what: "The radar looks for discussions worth joining and promotes the best one to a card.",
  },
  {
    when: "When a decision is hard",
    what: "The lens panel argues it. On whether to give a talk at a conference, marketing and commercial said no and social said yes, with conditions. We declined, and the record says why.",
  },
  {
    when: "Once a week",
    what: "The review agenda is drafted from the state of things. We decide, carry or drop each point.",
  },
  {
    when: "Weeks later",
    what: "Decisions come back on their revisit date, with what actually happened next to what we expected.",
  },
];

const GUARDRAILS = [
  "People make every decision, and everything that gets posted, published or booked.",
  "Agents never commit to the repository on their own, and publishing tools are blocked for them.",
  "A demo mode hides customer names and amounts, so obAIa can be shown without exposing anyone.",
  "Meetings are only analysed with documented consent, and the notes stay on the machine.",
];

const SETUP_STEPS = [
  {
    title: "Start with one kind of record",
    text: "Decisions are a good first one, with one agent that reads them.",
  },
  {
    title: "Design day",
    text: "Together we decide which records matter, who decides what, and which lenses your company needs. Yours won't be our marketing, social and commercial.",
  },
  {
    title: "Build day",
    text: "With Claude Code we set up the repository, its templates and checks, the front door, the computed views, the lens agents and the knowledge they load.",
  },
  {
    title: "Connect and schedule",
    text: "One or two tools your team already uses, and one unattended agent with a hard limit on what it may change.",
  },
  {
    title: "The weekly habit",
    text: "The first reviews and revisits with you, and a follow-up once it has run for a few weeks.",
  },
];

const NEEDS = [
  "Claude Code for everyone who works in it. The pattern itself works with other models too.",
  "A private git repository with access control, on the git host you already use.",
  "Each person's own logins for the tools obAIa connects to. Secrets stay out of the repository.",
  "A decision about which data may live in the repository, and written consent before any meeting is analysed.",
];

type Plugin = {
  name: string;
  graphic?: string;
  alt: string;
  description: string;
  agents: string;
  practices: string;
  repo: string;
  install?: string[];
};

const PLUGINS: Plugin[] = [
  {
    name: "LetPeopleWorkShop",
    graphic: workshopGraphic,
    alt: "LetPeopleWorkShop plugin overview: design, prep, and learn agents for running workshops in markdown.",
    description: "Design, prepare and learn from workshops, all in Markdown.",
    agents: "Agents: designer, executor, feedback.",
    practices: "Facilitation practices: Liberating Structures, Training from the BACK of the Room.",
    repo: "https://github.com/LetPeopleWork/LetPeopleWorkShop",
    install: [
      "/plugin marketplace add LetPeopleWork/LetPeopleWorkShop",
      "/plugin install let-people-workshop@letpeoplework",
    ],
  },
  {
    name: "LetPeopleGrow",
    graphic: growGraphic,
    alt: "LetPeopleGrow plugin overview: prep, capture, growth, and patterns agents for 1:1s.",
    description: "Prepare for, capture and learn from 1:1s. Coaching support, never a performance dossier.",
    agents: "Agents: prep, capture, growth, patterns.",
    practices: "Conversation practices: GROW, SBI, NVC, career conversations.",
    repo: "https://github.com/LetPeopleWork/LetPeopleGrow",
  },
  {
    name: "LetPeopleAlign",
    alt: "",
    description:
      "Turn transcribed meetings into grounded notes: owned actions, missing-action flags, follow-up drafts and how positions moved across meetings.",
    agents: "Agents: analyze, drift, improve, prep, decisions.",
    practices: "Consent first, local only, no network. It refuses to build a case against anyone.",
    repo: "https://github.com/LetPeopleWork/LetPeopleAlign",
    install: [
      "claude plugin marketplace add LetPeopleWork/LetPeopleAlign",
      "claude plugin install let-people-align",
    ],
  },
];

const FOUNDERS = [
  {
    name: "Peter Zylka-Greger",
    role: "Flow, coaching, and the people side",
    brings:
      "Peter makes AI land with the people who run the work. Years of coaching teams means he turns the technical into something non-technical people actually adopt, so it still works after we leave.",
  },
  {
    name: "Benjamin Huser-Berta",
    role: "Engineering and the tools",
    brings:
      "Benjamin builds the agents, plugins, and tooling we teach. What you learn is technically real and safe to rely on, because the person teaching it is the person who writes it.",
  },
];

const PILOT_PRICE = prices.aiWorkshopPilot;

type JourneyStep = {
  n: string;
  kicker: string;
  title: string;
  loss: string;
  change: string;
};

// One progressive AI journey. Every step is equal, all at pilot price.
// The steps live in src/content/ai-journey.json so the build can describe
// them in the static structured data (scripts/seo-schema.mjs).
const JOURNEY: JourneyStep[] = journeyData;

function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "scale";
}) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const hidden =
    variant === "scale"
      ? "opacity-0 translate-y-8 scale-[0.97]"
      : "opacity-0 translate-y-8";
  const shown = "opacity-100 translate-y-0 scale-100";
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-900 ease-out-expo ${
        revealed ? shown : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-5">
    {children}
  </span>
);

const SetupButton = ({ source, light = false }: { source: string; light?: boolean }) => (
  <a
    href={SETUP_URL}
    onClick={() => trackEvent("obAIa setup asked", { source })}
    className={`group inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 ease-out-expo hover:-translate-y-0.5 no-underline ${
      light
        ? "bg-white text-primary shadow-medium hover:shadow-glow"
        : "bg-primary text-primary-foreground shadow-soft hover:shadow-medium hover:bg-primary-hover"
    }`}
  >
    Ask about an obAIa setup
    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
);

const AI = () => {
  const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <SEO
        title="Run your company with AI, in your own environment"
        description="obAIa is how LetPeopleWork runs itself: decisions and work as files in git, AI agents that argue the hard calls, people who decide. We help companies set it up in their own environment."
        keywords="obAIa, AI Obeya, AI for business, run a company with AI, Claude Code, AI agents, AI workshops, LetPeopleWorkShop, LetPeopleGrow, LetPeopleAlign, Claude Code plugins"
      />
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-gradient-hero min-h-[85vh] flex items-center pt-28 pb-24">
        <div className="absolute inset-0 hero-mesh" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-faint" aria-hidden="true" />
        <div
          className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-white/10 blur-3xl animate-float pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 right-0 w-[30rem] h-[30rem] rounded-full bg-emerald-300/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI at LetPeopleWork · obAIa
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary-foreground tracking-[-0.03em] leading-[0.98] text-balance mb-7">
              We run our company with AI. We can help you set it up in yours.
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/80 leading-relaxed text-pretty max-w-3xl mx-auto mb-11">
              obAIa is the big room of LetPeopleWork, kept as plain files in a private git repository.
              AI agents read it, argue the hard decisions and prepare the weekly review. The two of us
              decide. We help companies build the same thing inside their own environment, with their own
              tools and data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SetupButton source="ai-hero" light />
              <a
                href="#obaia"
                onClick={scrollTo("obaia")}
                className="group inline-flex items-center justify-center gap-2 border border-white/30 text-primary-foreground font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 ease-out-expo no-underline"
              >
                See how it works
              </a>
            </div>
            <p className="mt-8 text-sm text-primary-foreground/65">
              Less hype, more working AI: everything on this page is something we run ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* ── What obAIa is ── */}
      <section id="obaia" className="py-24 md:py-32 bg-background scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-14">
            <Eyebrow>
              <Bot className="w-3.5 h-3.5" />
              obAIa, how we run ourselves
            </Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-6">
              An Obeya that lives in git and thinks along
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Obeya is the lean "big room" where work, decisions and problems stay visible. Ours used to
              be a Miro board. Now it is a folder of Markdown files, and a Claude Code session on top of it
              is how we work with it, by typing. The name is Obeya with AI in the middle, and it's
              pronounced the same.
            </p>
          </Reveal>

          {/* How a thought travels */}
          <Reveal className="mb-12">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium" aria-label="How a thought travels through obAIa">
              {[
                "You type a thought",
                "obAIa proposes a record",
                "You confirm",
                "It lands in git",
                "Agents read it",
                "Views and the weekly review",
                "You decide",
              ].map((step, i, all) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3.5 py-1.5 ${
                      i === 0 || i === all.length - 1
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground"
                    }`}
                  >
                    {step}
                  </span>
                  {i < all.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-primary/50" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BUILDING_BLOCKS.map((block, i) => (
              <Reveal key={block.title} variant="scale" delay={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-card p-7">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent">
                    <block.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">{block.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{block.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="text-base text-muted-foreground">
              Peter wrote about how it came about:{" "}
              <a href={BLOG_OBAIA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline">
                Our Obeya lives in git now, and it thinks along
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── A week with obAIa, and what stays human ── */}
      <section id="week" className="py-24 md:py-32 bg-gradient-subtle border-y border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>
                <CalendarClock className="w-3.5 h-3.5" />
                A week with obAIa
              </Eyebrow>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.02em] leading-[1.1] mb-10">
                What it does while we do the work
              </h2>
            </Reveal>
            <ol className="relative space-y-7 border-l border-border pl-8">
              {WEEK.map((item, i) => (
                <Reveal key={item.when} delay={i * 60}>
                  <li className="relative">
                    <span className="absolute -left-[41px] top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-primary bg-background" aria-hidden="true">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-1.5">{item.when}</p>
                    <p className="text-base md:text-lg text-foreground/85 leading-relaxed">{item.what}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-10">
              <p className="text-sm text-muted-foreground">
                We showed it live, weekly review included:{" "}
                <a href={SESSION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline">
                  Let People Behind the Scenes, a Lighthouse Live session
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal variant="scale">
              <div className="rounded-2xl border border-border bg-card p-8 lg:sticky lg:top-28">
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-5">
                  The agents prepare, people decide
                </h3>
                <ul className="space-y-4">
                  {GUARDRAILS.map((g) => (
                    <li key={g} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {g}
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-7 border-t border-border pt-5 text-[15px] italic text-muted-foreground">
                  "Nothing here needs Claude specifically; the idea works with any model."
                  <footer className="mt-2 not-italic text-xs font-semibold text-foreground">
                    From our session Let People Behind the Scenes
                  </footer>
                </blockquote>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Set it up in your environment ── */}
      <section id="setup" className="py-24 md:py-32 bg-background scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-14">
            <Eyebrow>
              <GitBranch className="w-3.5 h-3.5" />
              obAIa for your company
            </Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-6">
              We build yours with you, inside your environment
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              obAIa isn't software you buy. It's a way of working, and every company needs a different one:
              which records matter, who decides what, which perspectives are missing when you decide. We set
              it up with you, on your accounts and in your repository, and hand it over.
            </p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-12">
            <ol className="lg:col-span-7 space-y-4">
              {SETUP_STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 60}>
                  <li className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">{step.title}</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed">{step.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="lg:col-span-5 space-y-6">
              <Reveal variant="scale">
                <div className="rounded-2xl border border-border bg-gradient-subtle p-7">
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-4">What you need</h3>
                  <ul className="space-y-3">
                    {NEEDS.map((n) => (
                      <li key={n} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {n}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">On Windows, it runs most smoothly through WSL.</p>
                </div>
              </Reveal>
              <Reveal variant="scale" delay={80}>
                <div className="rounded-2xl border border-primary/20 bg-accent/60 p-7">
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-3">What we bring</h3>
                  <p className="text-[15px] leading-relaxed text-foreground/85">
                    Our own setup as a live reference, the open-source plugins below, and both sides of the
                    work: Peter makes it land with the people who use it, Benjamin builds the agents.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                    So far obAIa runs at LetPeopleWork only. The first setups elsewhere run as pilots,
                    scoped with you on a call.
                  </p>
                  <div className="mt-6">
                    <SetupButton source="ai-setup" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lighthouse in the same room ── */}
      <section id="lighthouse" className="py-20 md:py-24 bg-gradient-subtle border-y border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>From our product · Lighthouse</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.02em] leading-[1.1] mb-5">
              Your delivery data in the same room
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-6">
              If your teams use Lighthouse, our flow metrics and forecasting tool, the same agents can read
              its metrics and forecasts through its MCP server: which team needs attention this week, whether
              the release still fits. Lighthouse runs inside your network as well, so the data stays there.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a href="/lighthouse#lighthouse-ai" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline">
                How to connect Lighthouse
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="https://github.com/LetPeopleWork/lighthouse-clients" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline">
                <Github className="w-4 h-4" />
                CLI and MCP servers
              </a>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={100}>
            <figure>
              <div className="rounded-2xl bg-[hsl(158_29%_14%)] p-5 font-mono text-[13px] leading-relaxed text-white/90 shadow-medium">
                <div className="mb-4 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-[11px] text-white/50">obAIa + Lighthouse</span>
                </div>
                <p className="mb-3 ml-auto max-w-[80%] rounded-xl bg-white/10 px-3 py-2 text-white">
                  Which team should we talk to before Thursday's review?
                </p>
                <p className="rounded-xl bg-white/5 px-3 py-2">
                  Team Alpha: three items have been in review longer than their usual cycle time, and the
                  85% date for the checkout feature moved from 12 to 19 November. Team Beta is on track.
                </p>
              </div>
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                An example, with made-up teams.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Plugins ── */}
      <section id="plugins" className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-14">
            <Eyebrow>
              <Boxes className="w-3.5 h-3.5" />
              Open source, Claude Code native
            </Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-6">
              Three toolkits we built and use, free to take
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Free, MIT-licensed and shaped by how we work. Read them, run them, and check them before you
              trust them.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PLUGINS.map((plugin, i) => (
              <Reveal key={plugin.name} variant="scale" delay={i * 100}>
                <div className="group h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-medium">
                  {plugin.graphic ? (
                    <div className="overflow-hidden border-b border-border bg-gradient-subtle">
                      <img
                        src={plugin.graphic}
                        alt={plugin.alt}
                        className="w-full block"
                        width="1200"
                        height="675"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="grid aspect-[16/9] place-items-center border-b border-border bg-gradient-subtle">
                      <div className="text-center">
                        <Users className="mx-auto mb-3 h-10 w-10 text-primary/70" aria-hidden="true" />
                        <p className="font-mono text-sm text-primary">analyze · drift · improve · prep · decisions</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 min-w-0 p-7">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">{plugin.name}</h3>
                    <p className="text-base text-foreground/80 leading-relaxed text-pretty mb-4">{plugin.description}</p>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 mb-6">
                      <li>{plugin.agents}</li>
                      <li>{plugin.practices}</li>
                    </ul>
                    {plugin.install && (
                      <div className="rounded-xl bg-[hsl(215_28%_14%)] p-4 mb-6 font-mono text-[11px] leading-relaxed text-white/85 overflow-x-auto">
                        {plugin.install.map((line) => (
                          <div key={line} className="whitespace-pre">
                            <span className="text-emerald-300/80 select-none">$ </span>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                    <a
                      href={plugin.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover no-underline group/link"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section id="why-us" className="py-24 md:py-32 bg-background border-t border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary bg-accent px-4 py-1.5 rounded-full mb-6">
              <Users className="w-3.5 h-3.5" />
              Why us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-6">
              We teach and build what we use ourselves
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Most AI training is someone reading the docs back to you. We teach it the way we use it every
              day, to run our own business with obAIa and to ship our own product.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} variant="scale" delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-card p-8">
                  <div className="mb-5">
                    <div className="text-lg font-bold text-foreground tracking-tight">{f.name}</div>
                    <div className="text-sm font-medium text-primary">{f.role}</div>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">{f.brings}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI workshops (the journey) ── */}
      <section id="ai-workshops" className="py-24 md:py-32 bg-gradient-subtle border-y border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary bg-accent px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              AI workshops
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-6">
              Or start with your people: an AI journey in four workshops
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Everyone has AI open in a tab. Almost none of it becomes work. This is the path from "huh,
              neat" to AI doing real work across your business. Four steps, each bookable on its own, at
              pilot pricing while it lasts.
            </p>
          </Reveal>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden md:block" aria-hidden="true" />
            <div className="space-y-6 md:space-y-8">
              {JOURNEY.map((step, i) => (
                <Reveal key={step.n} variant="scale" delay={i * 80}>
                  <div className="relative md:pl-20">
                    <div className="hidden md:flex absolute left-0 top-1 items-center justify-center w-12 h-12 rounded-full bg-accent text-primary font-mono font-semibold ring-1 ring-primary/20">
                      {step.n}
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-7 md:p-9 transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-soft">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="md:hidden font-mono font-semibold text-primary/70">{step.n}</span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{step.kicker}</span>
                        <span className="inline-flex items-center rounded-full bg-accent text-primary text-[11px] font-semibold px-3 py-1">
                          Pilot price · {PILOT_PRICE} per team
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-balance mb-3">{step.title}</h3>
                      <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-pretty mb-3">{step.loss}</p>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">{step.change}</p>
                      <a
                        href={`${CONTACT_URL}?subject=${encodeURIComponent(`Workshop booking: ${step.title}`)}`}
                        className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline"
                      >
                        Book this workshop
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="text-center max-w-2xl mx-auto mt-16">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
              Every workshop is {PILOT_PRICE} at pilot pricing, and that covers your entire team, not a seat.
              Pricing is subject to change once the pilot cohorts fill up. Each one stands on its own: book a
              single workshop, or design the whole journey with us.
            </p>
            <a
              href={`${CONTACT_URL}?subject=${encodeURIComponent("Design our AI journey")}`}
              className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-base px-8 py-4 rounded-full shadow-soft hover:shadow-medium hover:bg-primary-hover transition-all duration-300 ease-out-expo hover:-translate-y-0.5 no-underline"
            >
              Design your AI journey
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>

          <Reveal className="max-w-4xl mx-auto mt-16">
            <div className="rounded-2xl border border-dashed border-border bg-background/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-2">
                  Separate track · coming soon
                </span>
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">AI for Engineers</h3>
                <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                  Proper software engineering with agents: skills, commands, pipelines, and the dangers. Built
                  for engineering teams, not part of the journey above.
                </p>
              </div>
              <a
                href={`${CONTACT_URL}?subject=${encodeURIComponent("AI for Engineers workshop interest")}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline whitespace-nowrap"
              >
                Register interest
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative isolate overflow-hidden bg-gradient-hero py-24 md:py-32">
        <div className="absolute inset-0 hero-mesh" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-faint" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-[-0.02em] leading-[1.06] text-balance mb-7">
              Want an obAIa of your own?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed text-pretty mb-11">
              Write to us. We'll show you ours, live, and work out with you what yours would need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SetupButton source="ai-closing" light />
              <a
                href="#plugins"
                onClick={scrollTo("plugins")}
                className="group inline-flex items-center justify-center gap-2 border border-white/30 text-primary-foreground font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 ease-out-expo no-underline"
              >
                Explore the plugins
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default AI;
