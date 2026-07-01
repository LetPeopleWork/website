import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Boxes,
  Code2,
  GraduationCap,
  Github,
  Sparkles,
  Users,
} from "lucide-react";
import obaiaGraphic from "@/assets/ai/obaia.svg";
import workshopGraphic from "@/assets/ai/letpeopleworkshop.svg";
import growGraphic from "@/assets/ai/letpeoplegrow.svg";

const CONTACT_URL = "mailto:contact@letpeople.work";

type Plugin = {
  name: string;
  graphic: string;
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
    description:
      "Let people work(shop). Design, prepare, and learn from workshops, all in markdown.",
    agents: "Agents: designer, then executor, then feedback.",
    practices:
      "Facilitation-practices library: Liberating Structures, Training from the BACK of the Room.",
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
    description:
      "Prepare for, capture, and learn from 1:1s. Coaching support, never a performance dossier.",
    agents: "Agents: prep, capture, growth, and patterns.",
    practices:
      "Conversation-practices library: GROW, SBI, NVC, career conversations.",
    repo: "https://github.com/LetPeopleWork/LetPeopleGrow",
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

const PILOT_PRICE = "CHF 2,500";

type JourneyStep = {
  n: string;
  kicker: string;
  title: string;
  loss: string;
  change: string;
};

// One progressive AI journey. Every step is equal, all at pilot price.
const JOURNEY: JourneyStep[] = [
  {
    n: "01",
    kicker: "Literacy",
    title: "The bAsIcs",
    loss:
      "Most of your people think AI is the chat box. Agents, commands, and skills, the parts that actually do work, are invisible to them. Nobody can use, buy, or ask for what they cannot see.",
    change:
      "Everyone leaves with the vocabulary and the mental model, and stops treating the chat window as the whole of AI.",
  },
  {
    n: "02",
    kicker: "Your first build",
    title: "BIYA: Build It Yourself Agent",
    loss:
      "You have heard \"agent\" a hundred times and built exactly zero. Reading about it is not the same as watching one run your work, and every month it stays abstract is a month you do not get back.",
    change:
      "You build your first working agent with your own hands. The idea stops being a slide and becomes something you own.",
  },
  {
    n: "03",
    kicker: "Ship something real",
    title: "From Prototype to Product",
    loss:
      "The tool your team actually needs dies in a backlog because \"we would need a developer.\" That queue is quietly costing you the thing you could have shipped this week.",
    change:
      "Build a real, working product yourself with Lovable and Claude Code, and stop waiting in line for it.",
  },
  {
    n: "04",
    kicker: "Run on it",
    title: "Filling the Gap: The AI-Powered Business",
    loss:
      "Everyone has AI open in a tab; almost none of it becomes work. That gap, between having AI and AI actually doing your work, is the most expensive thing in your building.",
    change:
      "Run your business the obAIa way, with agents doing real work across marketing and operations, connected to the tools you already use.",
  },
];

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
      className={`transition-all duration-[900ms] ease-out-expo ${
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

const AI = () => {
  const scrollToPlugins = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById("plugins")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Services and Workshops",
    provider: {
      "@type": "Organization",
      name: "LetPeopleWork GmbH",
      url: "https://letpeople.work",
    },
    serviceType: "AI consulting and training",
    description:
      "Practical AI from LetPeopleWork: our obAIa way of working, the open-source LetPeopleWorkShop and LetPeopleGrow plugins for Claude Code, and hands-on AI workshops.",
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <SEO
        title="Less Hype. More Working AI."
        description="Practical AI from LetPeopleWork: obAIa, our two open-source Claude Code plugins (LetPeopleWorkShop and LetPeopleGrow), and hands-on AI workshops grounded in real delivery."
        keywords="AI consulting, AI workshops, obAIa, LetPeopleWorkShop, LetPeopleGrow, Claude Code plugins, AI for business, AI in engineering, agentic workflows"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "AI", url: "/ai" },
        ]}
      />
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center pt-28 pb-24">
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
              AI at LetPeopleWork
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-[-0.03em] leading-[0.95] text-balance mb-7">
              Less hype.
              <br />
              More working AI.
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/75 font-light leading-relaxed text-pretty max-w-3xl mx-auto mb-11">
              We are practitioners in flow, forecasting, and delivery, and we use AI
              every day to run our business and ship our product. We help teams and
              non-technical businesses put AI to work in a grounded, practical way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#plugins"
                onClick={scrollToPlugins}
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold text-base px-8 py-4 rounded-full shadow-medium hover:shadow-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 no-underline"
              >
                <Boxes className="w-4 h-4" />
                Explore the plugins
              </a>
              <a
                href={CONTACT_URL}
                className="group inline-flex items-center justify-center gap-2 border border-white/30 text-primary-foreground font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 ease-out-expo no-underline"
              >
                Talk to us
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our approach ── */}
      <section id="approach" className="py-28 md:py-40 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-6">
              Practice over promises.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              We work with AI the same way we work with delivery: small steps, real
              evidence, and a healthy dose of scepticism. Two angles we care about.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal variant="scale">
              <div className="group h-full rounded-[1.75rem] border border-border bg-white p-9 md:p-11 transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-medium hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-7 transition-transform duration-500 ease-out-expo group-hover:scale-110">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">
                  AI for business
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Practical ways for non-technical leaders to put AI to work,
                  without the hype and without the risk you cannot see.
                </p>
              </div>
            </Reveal>
            <Reveal variant="scale" delay={120}>
              <div className="group h-full rounded-[1.75rem] border border-border bg-white p-9 md:p-11 transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-medium hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-7 transition-transform duration-500 ease-out-expo group-hover:scale-110">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">
                  AI in engineering
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  TDD, CI/CD, and agents that follow your rules. Engineering
                  discipline applied to the way you build with AI.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── obAIa ── */}
      <section
        id="obaia"
        className="py-28 md:py-40 bg-gradient-subtle border-y border-border/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
            <Eyebrow>
              <Bot className="w-3.5 h-3.5" />
              How we run ourselves
            </Eyebrow>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-7">
              We run our own company with AI.
              <br className="hidden sm:block" />
              We call it obAIa.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              obAIa is our AI-augmented big room. Decisions get pressure-tested by
              three perspectives, commercial, marketing, and go-to-market, and are
              kept with their reasoning. It keeps our work, pipeline, and dates in
              one place, and surfaces what needs attention.
            </p>
          </Reveal>

          <Reveal variant="scale" delay={120} className="relative">
            <div
              className="absolute inset-0 spotlight-soft scale-125"
              aria-hidden="true"
            />
            <figure className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl border border-border bg-white shadow-medium overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background/80">
                  <span className="w-3 h-3 rounded-full bg-foreground/15" />
                  <span className="w-3 h-3 rounded-full bg-foreground/15" />
                  <span className="w-3 h-3 rounded-full bg-foreground/15" />
                  <span className="ml-3 text-xs font-medium text-muted-foreground">
                    obAIa
                  </span>
                </div>
                <img
                  src={obaiaGraphic}
                  alt="obAIa: our AI-augmented big room, showing visibility, attention, pipeline, capture, decisions, and direction."
                  className="w-full block"
                  width="1200"
                  height="675"
                  loading="lazy"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Plugins ── */}
      <section id="plugins" className="py-28 md:py-40 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <Eyebrow>Open-source, Claude-Code-native</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-6">
              Two toolkits we built and use ourselves.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              Free, open source, and shaped by how we actually work. Read them,
              run them, and verify them before you trust them.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {PLUGINS.map((plugin, i) => (
              <Reveal key={plugin.name} variant="scale" delay={i * 120}>
                <div className="group h-full flex flex-col rounded-[1.75rem] border border-border bg-white overflow-hidden transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-medium hover:-translate-y-1">
                  <div className="overflow-hidden border-b border-border bg-gradient-subtle">
                    <img
                      src={plugin.graphic}
                      alt={plugin.alt}
                      className="w-full block transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                      width="1200"
                      height="675"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 p-8 md:p-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
                      {plugin.name}
                    </h3>
                    <p className="text-lg text-foreground/80 leading-relaxed text-pretty mb-5">
                      {plugin.description}
                    </p>
                    <ul className="text-base text-muted-foreground leading-relaxed space-y-2 mb-7">
                      <li>{plugin.agents}</li>
                      <li>{plugin.practices}</li>
                    </ul>

                    {plugin.install && (
                      <div className="rounded-2xl bg-[hsl(215_28%_14%)] p-4 mb-7 font-mono text-xs leading-relaxed text-white/85 overflow-x-auto">
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        </div>
                        {plugin.install.map((line) => (
                          <div key={line} className="whitespace-pre">
                            <span className="text-emerald-300/80 select-none">
                              ${" "}
                            </span>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}

                    <a
                      href={plugin.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-hover no-underline group/link"
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

      {/* ── Why learn AI with us ── */}
      <section
        id="why-us"
        className="py-28 md:py-40 bg-background border-t border-border/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary bg-accent px-4 py-1.5 rounded-full mb-6">
              <Users className="w-3.5 h-3.5" />
              Why us
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-6">
              Why learn AI with us?
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              Most AI training is someone reading the docs back to you. We teach it
              the way we use it every day, to run our own business with obAIa and to
              ship our own product. You learn from people who live with the results,
              not from a slide deck.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} variant="scale" delay={i * 120}>
                <div className="h-full rounded-[1.75rem] border border-border bg-white p-8 md:p-10">
                  <div className="mb-6">
                    <div className="text-lg font-bold text-foreground tracking-tight">
                      {f.name}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {f.role}
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
                    {f.brings}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="max-w-3xl mx-auto mt-10 md:mt-12">
            <p className="text-center text-base md:text-lg text-foreground leading-relaxed text-pretty">
              Together you get both sides in one room, the business view and the
              engineering view, so the non-technical leader and the builder both
              leave with an answer. As always, we deliver in pairs: two
              practitioners, two perspectives.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI workshops (the journey) ── */}
      <section
        id="ai-workshops"
        className="py-28 md:py-40 bg-gradient-subtle border-y border-border/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary bg-accent px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              AI workshops
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-6">
              An AI journey we build with you.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              Everyone has AI open in a tab. Almost none of it becomes work. This is
              the path from "huh, neat" to AI doing real work across your business.
              Four steps, each bookable on its own, at pilot pricing while it lasts.
            </p>
          </Reveal>

          {/* The journey: four equal steps */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="absolute left-6 top-8 bottom-8 w-px bg-border hidden md:block"
              aria-hidden="true"
            />
            <div className="space-y-6 md:space-y-8">
              {JOURNEY.map((step, i) => (
                <Reveal key={step.n} variant="scale" delay={i * 80}>
                  <div className="relative md:pl-20">
                    <div className="hidden md:flex absolute left-0 top-1 items-center justify-center w-12 h-12 rounded-full bg-accent text-primary font-mono font-semibold ring-1 ring-primary/20">
                      {step.n}
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-7 md:p-9 transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-soft">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="md:hidden font-mono font-semibold text-primary/70">
                          {step.n}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {step.kicker}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-accent text-primary text-[11px] font-semibold px-3 py-1">
                          Pilot price · {PILOT_PRICE} per team
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-balance mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-pretty mb-3">
                        {step.loss}
                      </p>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
                        {step.change}
                      </p>
                      <a
                        href={`${CONTACT_URL}?subject=${encodeURIComponent(
                          `Workshop booking: ${step.title}`,
                        )}`}
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

          {/* Booking */}
          <Reveal className="text-center max-w-2xl mx-auto mt-16 md:mt-20">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
              Every workshop is {PILOT_PRICE} at pilot pricing, and that covers your
              entire team, not a seat. Pricing is subject to change once the pilot
              cohorts fill up. Each one stands on its own: book a single workshop,
              or design the whole journey with us.
            </p>
            <a
              href={`${CONTACT_URL}?subject=${encodeURIComponent(
                "Design our AI journey",
              )}`}
              className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-base px-8 py-4 rounded-full shadow-soft hover:shadow-medium hover:bg-primary-hover transition-all duration-300 ease-out-expo hover:-translate-y-0.5 no-underline"
            >
              Design your AI journey
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>

          {/* Separate track: AI for Engineers */}
          <Reveal className="max-w-4xl mx-auto mt-16 md:mt-20">
            <div className="rounded-2xl border border-dashed border-border bg-background/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-2">
                  Separate track · coming soon
                </span>
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                  AI for Engineers
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                  Proper software engineering with agents: skills, commands,
                  pipelines, and the dangers. Built for engineering teams, not part
                  of the journey above.
                </p>
              </div>
              <a
                href={`${CONTACT_URL}?subject=${encodeURIComponent(
                  "AI for Engineers workshop interest",
                )}`}
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
      <section className="relative isolate overflow-hidden bg-gradient-hero py-28 md:py-40">
        <div className="absolute inset-0 hero-mesh" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-faint" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-[-0.02em] leading-[1.04] text-balance mb-7">
              Want to put AI to work?
            </h2>
            <p className="text-lg md:text-2xl text-primary-foreground/75 font-light leading-relaxed text-pretty mb-11">
              Try the open-source plugins we built and use ourselves, or write to us
              about putting AI to work in your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CONTACT_URL}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold text-base px-8 py-4 rounded-full shadow-medium hover:shadow-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 no-underline"
              >
                Talk to us
              </a>
              <a
                href="#plugins"
                onClick={scrollToPlugins}
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
