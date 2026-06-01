import { z } from "zod";
import type { BandName } from "../core/scoring";

const answerOptionSchema = z.object({
  value: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  label: z.string().min(1),
});

const questionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  pillar: z.union([z.literal("measure"), z.literal("forecast")]),
  options: z.array(answerOptionSchema).length(4),
});

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  isCommunity: z.boolean(),
});

const bandSchema = z.object({
  name: z.string().min(1),
  min: z.number().int().min(0).max(100),
  max: z.number().int().min(0).max(100),
  tagline: z.string().min(1),
  measureRead: z.string().min(1),
  forecastRead: z.string().min(1),
  ctas: z.array(ctaSchema).min(1),
});

const contentSchema = z.object({
  questions: z.array(questionSchema).length(6),
  bands: z.array(bandSchema).length(4),
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type BandCopy = z.infer<typeof bandSchema>;

const COMMUNITY_HREF = "https://letpeople.work/lighthouse";
const WORKSHOPS_HREF = "https://letpeople.work/#workshops";

const communityCta = (label: string): Cta => ({
  label,
  href: COMMUNITY_HREF,
  isCommunity: true,
});

const workshopCta: Cta = {
  label: "Book a workshop",
  href: WORKSHOPS_HREF,
  isCommunity: false,
};

const rawContent = {
  questions: [
    {
      id: "forecasting-method",
      prompt: "How do you decide when work will be done?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We rely on gut feeling or an expert's best guess." },
        { value: 1, label: "We add up estimates." },
        { value: 2, label: "We use past delivery data to forecast." },
        {
          value: 3,
          label: "We use probabilistic forecasting and continuously re-check it.",
        },
      ],
    },
    {
      id: "metrics-reviewed",
      prompt: "Which delivery metrics do you review?",
      pillar: "measure",
      options: [
        { value: 0, label: "We don't track or review metrics." },
        { value: 1, label: "Velocity, Story Points, Planned vs. Actual." },
        { value: 2, label: "Throughput and Cycle Time." },
        {
          value: 3,
          label: "Work Item Age and WIP (on top of Throughput and Cycle Time).",
        },
      ],
    },
    {
      id: "wip-management",
      prompt: "How do you manage Work In Progress (WIP)?",
      pillar: "measure",
      options: [
        { value: 0, label: "We don't actively review or act on WIP." },
        { value: 1, label: "We set WIP limits but struggle to act on them." },
        { value: 2, label: "We actively keep WIP from getting too high." },
        {
          value: 3,
          label:
            "We control WIP so we're neither overloaded nor starved for work.",
        },
      ],
    },
    {
      id: "date-likelihood",
      prompt: "When you commit to a date, how reliably do you hit it?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We regularly miss, and usually find out late." },
        { value: 1, label: "We sometimes hit it, often after a late scramble." },
        {
          value: 2,
          label: "We're usually accurate, but can't say how likely up front.",
        },
        {
          value: 3,
          label: "We commit to a likelihood and land within it as expected.",
        },
      ],
    },
    {
      id: "data-activation",
      prompt: "How do you use delivery data to make decisions?",
      pillar: "measure",
      options: [
        {
          value: 0,
          label: "We don't, because we have no data or can't find it.",
        },
        { value: 1, label: "We have the data, but rarely base decisions on it." },
        {
          value: 2,
          label: "We pull reports now and then to inform a discussion.",
        },
        {
          value: 3,
          label: "Live flow data actively steers our planning and expectations.",
        },
      ],
    },
    {
      id: "deadline-at-risk",
      prompt: "What happens when a target date starts to look at risk?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We only notice once it's too late to act." },
        { value: 1, label: "We react late with overtime or scope-cutting." },
        {
          value: 2,
          label:
            "We spot the risk early and discuss options with the team and stakeholders.",
        },
        {
          value: 3,
          label:
            "Our forecast continuously flags the risk, and we re-steer scope or expectations with data.",
        },
      ],
    },
  ],
  bands: [
    {
      name: "Flying blind",
      min: 0,
      max: 25,
      tagline: "Start measuring flow and run your first forecast.",
      measureRead:
        "You're not measuring flow yet, so you can't see how work moves. Add your team in Lighthouse and start watching your flow metrics. It's easy to get the data flowing and learn from it.",
      forecastRead:
        "Forecasting is gut feel today. Run a forecast for your next iteration and see how it performs. The goal right now is to experiment, not to overhaul how you work.",
      ctas: [communityCta("Start with Lighthouse Community (free)")],
    },
    {
      name: "Drifting",
      min: 26,
      max: 50,
      tagline: "Swap guesses for real data and start steering.",
      measureRead:
        "You're tracking output like Velocity or Story Points, not the flow metrics that show how predictably work moves. Start watching Throughput and Cycle Time, and set improvement goals like a Service Level Expectation (SLE) or WIP limits.",
      forecastRead:
        "You forecast by adding up estimates, betting on what you thought would happen rather than what actually does, and a single date leaves no room to manage risk. Compare your estimates against what really happened (Cycle Time), and backtest a Monte Carlo forecast to see how it would have performed.",
      ctas: [communityCta("Start with Lighthouse Community (free)")],
    },
    {
      name: "Flow-aware",
      min: 51,
      max: 75,
      tagline: "Start acting to get more predictable.",
      measureRead:
        "You're already watching flow metrics. Now sharpen predictability: act on leading indicators like Work Item Age, use your Service Level Expectation to drive improvements, and analyse how stable your delivery is with Process Behaviour Charts.",
      forecastRead:
        "Your forecasting works at team level. Now extend it to the portfolio, and keep checking the trend of your deliveries over time rather than a single date.",
      ctas: [
        communityCta("Use Community to operationalize forecasting (free)"),
        workshopCta,
      ],
    },
    {
      name: "Predictable",
      min: 76,
      max: 100,
      tagline: "Fine-tune the details and scale across your portfolio.",
      measureRead:
        "Flow metrics are second nature. Now fine-tune: study your workflow to find bottlenecks, set more ambitious Service Level Expectations and bring your percentiles closer together, and use Process Behaviour Charts to keep improving.",
      forecastRead:
        "You forecast probabilistically and steer by it. Sharpen it further by right-sizing your features and accounting for feature WIP, then scale forecasting across teams and your portfolio.",
      ctas: [
        communityCta("Use Community to scale your forecasting (free)"),
        workshopCta,
      ],
    },
  ],
} as const;

export const assessmentContent = contentSchema.parse(rawContent);

export const QUESTIONS: readonly Question[] = assessmentContent.questions;
export const BANDS: readonly BandCopy[] = assessmentContent.bands;

export const bandContent = (band: BandName): BandCopy => {
  const match = BANDS.find((entry) => entry.name === band);
  if (!match) {
    throw new Error(`No breakdown content authored for band "${band}"`);
  }
  return match;
};
