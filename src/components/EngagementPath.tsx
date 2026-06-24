import { ArrowRight, Compass, Wrench, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Tier = {
  id: string;
  label: string;
  icon: typeof Compass;
  duration: string;
  headline: string;
  description: string;
  highlights: string[];
  price: string;
  priceFrom?: boolean;
  cta: { label: string; href: string };
  recommended?: boolean;
  comingSoon?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "assess",
    label: "Assess",
    icon: Compass,
    duration: "Free",
    headline: "See where you stand today.",
    description:
      "Answer a handful of honest questions and get a clear read on how you measure flow and how you forecast, with the one or two things worth changing first.",
    highlights: [
      "A few questions, a straight answer in a couple of minutes",
      "Grounded in flow metrics and probabilistic forecasting",
      "A concrete next step, no cost and no sales pitch",
    ],
    price: "Free",
    cta: { label: "Start your assessment", href: "/assessment" },
  },
  {
    id: "implement",
    label: "Implement",
    icon: Wrench,
    duration: "1 to 2 weeks",
    headline: "Run the pilot. Get the first forecast.",
    description:
      "We work with your team on your real data.\nWe set up Lighthouse, configure your flow metrics, and run forecasts your team can stand behind.\nYou walk away with a working pilot, not slides.",
    highlights: [
      "Bring-Your-Own-Data workshop with your actual delivery history",
      "Lighthouse configured to your workflow and tracker",
      "Your team knows how to maintain and extend it",
      "A forecast you can stand behind, or we keep working until you have one",
    ],
    price: "CHF 2,000",
    cta: { label: "Plan your pilot", href: "mailto:contact@letpeople.work?subject=BYOD%20Workshop%20%2B%20Lighthouse%20Pilot" },
    recommended: true,
  },
  {
    id: "transform",
    label: "Transform",
    icon: TrendingUp,
    duration: "1 quarter and up",
    headline: "Roll it out. Make it stick.",
    description:
      "Assessment, implementation, and the time it takes to embed the change for good.\nWe pair with you across the quarter, from the first forecast to a predictable delivery cadence across your teams.",
    highlights: [
      "Full assessment and workshop programme bundled",
      "Lighthouse rolled out across multiple teams",
      "Built for portfolios, with one coherent view",
    ],
    price: "CHF 10,000",
    priceFrom: true,
    cta: { label: "Design your rollout", href: "mailto:contact@letpeople.work?subject=Flow%20Transformation%20Package" },
  },
];

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const Icon = tier.icon;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${index * 90}ms` : "0ms" }}
      className={`
        relative flex flex-col rounded-3xl border bg-white p-8 md:p-10
        transition-all duration-700 ease-out
        ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${tier.recommended
          ? "border-primary/40 shadow-medium md:scale-[1.02] md:-translate-y-1"
          : "border-border hover:border-primary/20 hover:shadow-soft"
        }
      `}
    >
      {tier.recommended && (
        <span className="absolute -top-3 right-6 text-[11px] font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-soft">
          Recommended
        </span>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            {tier.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {tier.duration}
          </div>
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3">
        {tier.headline}
      </h3>

      <p className="text-base text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
        {tier.description}
      </p>

      <ul className="space-y-2.5 mb-8 flex-1">
        {tier.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px] text-foreground/80 leading-relaxed">
            <span className="text-primary mt-1.5 shrink-0">·</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-border pt-6 flex flex-col gap-4">
        <div>
          {tier.priceFrom && (
            <div className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
              From
            </div>
          )}
          <div className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            {tier.price}
          </div>
        </div>
        {tier.comingSoon ? (
          <span className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-foreground/5 text-muted-foreground cursor-default">
            {tier.cta.label}
          </span>
        ) : (
          <a
            href={tier.cta.href}
            className={`
              inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm
              transition-all duration-200 no-underline group
              ${tier.recommended
                ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium hover:-translate-y-0.5"
                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
              }
            `}
          >
            {tier.cta.label}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function EngagementPath() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="engagement-path" className="bg-gradient-subtle py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5 block">
            How we work with you
          </span>
          {/* TODO(peter): replace headline with final wording when ready */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05]">
            Three ways to work with us.
            <br />
            <span className="text-primary font-light">All grounded in your real flow.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mt-6">
            Start with a free assessment. From there, go as far as you need. The further you go, the more it runs on your own delivery data, not our slides.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12 md:mt-16">
          Want the full catalogue of certifications, workshops, and consulting?{" "}
          <a href="#workshops" className="text-primary underline underline-offset-4 hover:text-primary-hover">
            See every offering below
          </a>
          .
        </p>
      </div>
    </section>
  );
}
