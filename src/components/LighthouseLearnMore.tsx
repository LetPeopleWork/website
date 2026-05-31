import { CalendarDays, PlayCircle, MessageSquare, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Action = {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
};

// TODO(peter): swap the "Watch a walkthrough" link for the canonical Lighthouse
// recording / YouTube channel once you've picked the one you want to feature.
const ACTIONS: Action[] = [
  {
    icon: CalendarDays,
    title: "Book a demo",
    description:
      "Want a guided tour with your own questions answered?\nWe'll walk you through Lighthouse on a quick call.",
    cta: "Request a demo",
    href: "mailto:contact@letpeople.work?subject=Book%20a%20Lighthouse%20demo",
  },
  {
    icon: PlayCircle,
    title: "Watch a walkthrough",
    description:
      "Prefer to see it first?\nWatch a recorded session and see Lighthouse work on real delivery data.",
    cta: "Watch the recording",
    href: "https://www.youtube.com/watch?v=-yemS7Us_lQ",
    external: true,
  },
  {
    icon: MessageSquare,
    title: "Join the community",
    description:
      "Drop into our Slack to ask questions, share what you find, and join our office hours.",
    cta: "Join on Slack",
    href: "https://join.slack.com/t/let-people-work/shared_invite/zt-38df4z4sy-iqJEo6S8kmIgIfsgsV0J1A",
    external: true,
  },
];

function ActionCard({ action, index }: { action: Action; index: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const Icon = action.icon;

  return (
    <a
      ref={ref}
      href={action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
      style={{ transitionDelay: revealed ? `${index * 90}ms` : "0ms" }}
      className={`group flex flex-col rounded-3xl border border-border bg-white p-8 no-underline transition-all duration-700 ease-out hover:border-primary/20 hover:shadow-soft hover:-translate-y-0.5 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
        {action.title}
      </h3>
      <p className="text-base text-muted-foreground leading-relaxed mb-6 flex-1 whitespace-pre-line">
        {action.description}
      </p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {action.cta}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export default function LighthouseLearnMore() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="lighthouse-learn" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-14 md:mb-16 transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5 block">
            See it for yourself
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.05]">
            Three easy ways in.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mt-5">
            Download it and play, see it in action, or just talk to us first.
            <br />
            Whatever suits you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ACTIONS.map((action, i) => (
            <ActionCard key={action.title} action={action} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
