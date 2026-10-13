import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import type { QuestionTab } from "@/features/paths/paths";

type Question = {
  key: QuestionTab;
  question: string;
  answer: string;
  image: { src: string; alt: string; width: number; height: number };
};

// One question per tab, one screenshot per question. This replaces the
// four-slide carousel and the 900-word "Deep Dive into Key Features": the
// screenshots carry the explanation, the full feature reference lives in the
// docs. Screenshots come from the Lighthouse docs on the CDN, so they follow
// the current UI without a website release.
export const QUESTIONS: Question[] = [
  {
    key: "when",
    question: "When will it be done?",
    answer:
      "Pick the items and get dates with their odds. Or pick a date and see how many items will likely be done by then. Both come from your team's throughput, so nobody has to estimate.",
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
      "Work in progress, item age, blocked and stale items, each with a red, amber or green signal. Items at risk of missing your service level expectation (SLE) are listed while there is still time.",
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
      "One bar per feature, from forecast start to forecast finish, with dependencies drawn between them. Features that will not even start before the target date are marked.",
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
      "Feature forecasts across all the teams working on them, and the same flow metrics one level up. A feature worked by several teams gets one forecast that combines all of them.",
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
      "Lighthouse forecasts how many items the team will pull before the next refinement. The team then sizes each one with a single question: could we finish it within our SLE?",
    image: {
      src: lighthouseAsset("features/refinement.png"),
      alt: "Refinement tab: how many work items the next refinement needs, with sizing votes per item",
      width: 1920,
      height: 1080,
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
          Pick a question, see the screen that answers it
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
              </div>
              <div className="lg:col-span-3">
                <img
                  src={q.image.src}
                  alt={q.image.alt}
                  width={q.image.width}
                  height={q.image.height}
                  loading="lazy"
                  className="w-full h-auto rounded-xl border border-border shadow-soft bg-card"
                />
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
