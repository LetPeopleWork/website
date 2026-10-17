import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import FilmFacade from "@/features/film/components/FilmFacade";
import { VIDEOS, type VideoKey } from "@/features/film/videos";
import { trackEvent } from "@/lib/plausible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import type { QuestionTab } from "@/features/paths/paths";

type Question = {
  key: QuestionTab;
  question: string;
  answer: string;
  image: { src: string; alt: string; width: number; height: number };
  docs?: { href: string; label: string };
  /** A short video that answers the question; the screenshot becomes its poster. */
  video?: VideoKey;
  /** A link elsewhere on the site, counted in Plausible under `event`. */
  related?: { to: string; label: string; event: string };
};

// One question per tab, one screenshot per question. This replaces the
// four-slide carousel and the 900-word "Deep Dive into Key Features": the
// screenshots carry the explanation, the full feature reference lives in the
// docs. Screenshots come from the Lighthouse docs on the CDN, so they follow
// the current UI without a website release.
const QUESTIONS: Question[] = [
  {
    key: "when",
    question: "When will it be done?",
    answer:
      "Ask about 10 items and you get dates with their odds. Ask about a date and you get how many items will probably make it. Not a crystal ball: it assumes your next weeks look roughly like your last ones.",
    image: {
      src: lighthouseAsset("features/teamdetail.png"),
      alt: "Team forecast: when 10 work items will be done, with four dates and their probabilities, and the likelihood of a target date",
      width: 1920,
      height: 1080,
    },
  },
  {
    key: "stuck",
    question: "What's stuck right now?",
    answer:
      "Work in progress, item age, blocked and stale items, each red, amber or green, so you know where to look first. Items about to miss your service level expectation (SLE) show up while you can still do something about them.",
    image: {
      src: lighthouseAsset("features/metrics/metricsoverview.png"),
      alt: "Team metrics overview: work in progress, blocked and stale items, item age and throughput with red, amber and green signals",
      width: 1920,
      height: 1080,
    },
  },
  {
    key: "release",
    question: "Which features make the release?",
    answer:
      "One bar per feature, from the day work is forecast to start to the day it's forecast to finish, with dependencies drawn as lines. Features that won't even start before your target date get marked. That's usually the uncomfortable part.",
    image: {
      src: lighthouseAsset("features/deliveryTimeline.png"),
      alt: "Delivery timeline: one bar per feature from forecast start to finish, with dependency lines",
      width: 1832,
      height: 397,
    },
  },
  {
    key: "portfolio",
    question: "How is the portfolio doing?",
    answer:
      "The same flow metrics one level up, and a forecast for every feature. When three teams work on one feature, you get one forecast for all three. It's usually lower than any single team's odds, because all three have to make it.",
    image: {
      src: lighthouseAsset("features/portfoliodetail.png"),
      alt: "Portfolio view: features with progress, forecast dates per team, and dependencies",
      width: 1920,
      height: 1080,
    },
  },
  {
    key: "refine",
    question: "How much should we refine?",
    answer:
      "How many items will the team pull before the refinement after next? Lighthouse forecasts that, so you refine enough and leave the rest of the backlog alone. Then everyone answers one question per item: could we finish it within our SLE?",
    image: {
      src: lighthouseAsset("features/refinement.png"),
      alt: "Refinement tab: how many work items the next refinement needs, with sizing votes per item",
      width: 1920,
      height: 1080,
    },
    video: "refinement",
    // Sizing Poker is the free, no-install version of the same question, and
    // the place to try it before connecting a tracker (weekly, 16 Oct 2026).
    related: {
      to: "/sizing-poker",
      label: "How does it work? Try the question in Sizing Poker",
      event: "Sizing Poker link clicked",
    },
  },
  {
    key: "change",
    question: "Did the change work?",
    answer:
      "Months after you limited WIP or started coaching a team, someone asks whether it helped. The Reports tab on every team and portfolio answers that. The first report type, Then & Now, freezes a window from before the change, even one that ended long ago, and sets it beside a window that moves with today: cycle time, throughput, WIP and work item age, and a summary of what changed. More report types are coming.",
    image: {
      src: lighthouseAsset("features/report_thenandnow.png"),
      alt: "Then & Now report: cycle time, throughput and WIP for a window before a change next to the last 30 days, with what improved and what got worse",
      width: 1920,
      height: 1080,
    },
    docs: {
      href: "https://docs.lighthouse.letpeople.work/reports/reports.html",
      label: "How reports work",
    },
  },
];

interface LighthouseQuestionsProps {
  value: QuestionTab;
  onValueChange: (value: QuestionTab) => void;
}

const LighthouseQuestions = ({ value, onValueChange }: LighthouseQuestionsProps) => (
  <section id="lighthouse-overview" className="py-20 md:py-24 bg-background scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
          What it answers
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
          Which question do you get asked?
        </h2>
      </div>

      <Tabs value={value} onValueChange={(next) => onValueChange(next as QuestionTab)}>
        <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0 mb-8">
          {QUESTIONS.map((q) => (
            <TabsTrigger
              key={q.key}
              value={q.key}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {q.question}
            </TabsTrigger>
          ))}
        </TabsList>

        {QUESTIONS.map((q) => (
          <TabsContent key={q.key} value={q.key} className="mt-0">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">{q.question}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{q.answer}</p>
                {q.docs && (
                  <a
                    href={q.docs.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {q.docs.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {q.related && (
                  <Link
                    to={q.related.to}
                    onClick={() => trackEvent(q.related!.event, { source: `question-${q.key}` })}
                    className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    data-testid={`question-related-${q.key}`}
                  >
                    {q.related.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <div className="lg:col-span-3">
                {q.video ? (
                  <FilmFacade
                    source={`question-${q.key}`}
                    video={{ ...VIDEOS[q.video], posterUrl: q.image.src }}
                    posterSize={{ width: q.image.width, height: q.image.height }}
                    className="shadow-soft"
                  />
                ) : (
                  <img
                    src={q.image.src}
                    alt={q.image.alt}
                    width={q.image.width}
                    height={q.image.height}
                    loading="lazy"
                    className="w-full h-auto rounded-xl border border-border shadow-soft bg-card"
                  />
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-center text-sm text-muted-foreground mt-10">
        Every feature in detail, with setup steps:{" "}
        <a
          href="https://docs.lighthouse.letpeople.work"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
        >
          Lighthouse documentation
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </p>
    </div>
  </section>
);

export default LighthouseQuestions;
