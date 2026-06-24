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

type Workshop = {
  title: string;
  description: string;
  audience: string;
};

const WORKSHOPS: Workshop[] = [
  {
    title: "AI for Engineers",
    description:
      "Proper software engineering with agents: skills, commands, pipelines, the dangers, and the tooling.",
    audience: "Engineers and tech leads",
  },
  {
    title: "From Prototype to Product",
    description:
      "Build a working digital product as a non-technical person, with tools like Lovable and Claude Code.",
    audience: "Non-technical builders",
  },
  {
    title: "Use AI to Automate",
    description:
      "Automate real, repetitive work safely with Claude Code commands, MCP, and n8n.",
    audience: "Ops and power users",
  },
  {
    title: "The AI-Powered Business",
    description: "Run parts of your business with AI, the obAIa way.",
    audience: "Founders and leaders",
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

      {/* ── AI workshops ── */}
      <section
        id="ai-workshops"
        className="py-28 md:py-40 bg-gradient-subtle border-y border-border/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary bg-accent px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              Coming soon
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.02em] leading-[1.02] text-balance mb-6">
              AI workshops.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty">
              Dates are not set yet. Register your interest and we will let you know
              the moment a session opens.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {WORKSHOPS.map((workshop, i) => (
              <Reveal key={workshop.title} variant="scale" delay={i * 90}>
                <a
                  href={`${CONTACT_URL}?subject=${encodeURIComponent(
                    `AI workshop interest: ${workshop.title}`,
                  )}`}
                  className="group h-full flex flex-col rounded-[1.75rem] border border-border bg-white p-9 md:p-11 no-underline transition-all duration-500 ease-out-expo hover:border-primary/20 hover:shadow-medium hover:-translate-y-1"
                >
                  <span className="text-sm font-mono font-semibold text-primary/70 tracking-widest mb-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3 text-balance">
                    {workshop.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed text-pretty flex-1 mb-6">
                    {workshop.description}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/80 mb-5">
                    For {workshop.audience}
                  </span>
                  <span className="inline-flex items-center gap-2 text-base font-semibold text-primary">
                    Register interest
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
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
