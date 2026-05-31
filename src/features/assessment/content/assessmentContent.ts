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
  nextRung: z.string().min(1),
  ctas: z.array(ctaSchema).min(1),
});

const contentSchema = z.object({
  credibilityAnchor: z.string().min(1),
  questions: z.array(questionSchema).length(6),
  bands: z.array(bandSchema).length(4),
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type BandCopy = z.infer<typeof bandSchema>;

const COMMUNITY_CTA: Cta = {
  label: "Start with Lighthouse Community (free)",
  href: "https://letpeople.work/lighthouse",
  isCommunity: true,
};

const rawContent = {
  credibilityAnchor:
    "Based on Kanban flow metrics and probabilistic forecasting principles (Vacanti / ProKanban).",
  questions: [
    {
      id: "forecasting-method",
      prompt: "How do you forecast when work will be done?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We commit to gut-feel dates with no real basis." },
        { value: 1, label: "We add up estimates and pick a single deadline." },
        {
          value: 2,
          label: "We sometimes sanity-check estimates against past delivery.",
        },
        {
          value: 3,
          label:
            "We forecast probabilistically (Monte Carlo / percentiles) and quote a range.",
        },
      ],
    },
    {
      id: "metrics-reviewed",
      prompt: "Which delivery metrics does your team actually review?",
      pillar: "measure",
      options: [
        { value: 0, label: "None — we don't track delivery metrics." },
        {
          value: 1,
          label: "Output counts — story points or items closed per sprint.",
        },
        {
          value: 2,
          label: "Some flow metrics — cycle time or throughput, now and then.",
        },
        {
          value: 3,
          label:
            "Flow metrics regularly — cycle time, throughput, WIP and flow health.",
        },
      ],
    },
    {
      id: "wip-management",
      prompt: "How does your team manage work in progress (WIP)?",
      pillar: "measure",
      options: [
        { value: 0, label: "We start whatever comes in; WIP is unbounded." },
        {
          value: 1,
          label: "We notice when we're overloaded but rarely act on it.",
        },
        {
          value: 2,
          label: "We try to limit WIP informally and finish before starting.",
        },
        {
          value: 3,
          label:
            "We hold explicit WIP limits and use them to keep flow healthy.",
        },
      ],
    },
    {
      id: "date-likelihood",
      prompt:
        "If you commit to a date, how well do you know the likelihood of hitting it?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We don't — we just hope and find out late." },
        {
          value: 1,
          label: "We have a vague confidence level but nothing to back it.",
        },
        {
          value: 2,
          label: "We can reason about risk from how similar work has gone.",
        },
        {
          value: 3,
          label:
            "We state an explicit probability (e.g. 85% by this date) and track it.",
        },
      ],
    },
    {
      id: "data-activation",
      prompt: "Where does your delivery data live, and is it used to decide?",
      pillar: "measure",
      options: [
        { value: 0, label: "It's scattered or non-existent; we decide blind." },
        {
          value: 1,
          label: "It's in the tool, but we rarely look at it for decisions.",
        },
        {
          value: 2,
          label: "We pull reports occasionally to inform a conversation.",
        },
        {
          value: 3,
          label:
            "Live flow data actively steers our planning and expectations.",
        },
      ],
    },
    {
      id: "deadline-at-risk",
      prompt: "What happens when a deadline starts to look at risk?",
      pillar: "forecast",
      options: [
        { value: 0, label: "We find out when it's already missed." },
        { value: 1, label: "We react late with overtime or scope-cutting." },
        {
          value: 2,
          label: "We usually spot the risk early from progress signals.",
        },
        {
          value: 3,
          label:
            "Our forecast flags the risk early and we re-steer deliberately.",
        },
      ],
    },
  ],
  bands: [
    {
      name: "Flying blind",
      min: 0,
      max: 25,
      tagline: "Dates are gut-feel.",
      measureRead:
        "You're not yet measuring flow — there's no cycle time, throughput or WIP signal to lean on, so the team can't see how work actually moves.",
      forecastRead:
        "And there's no probabilistic forecasting — commitments are gut-feel dates with no honest read on whether you'll hit them.",
      nextRung:
        "The next rung is simply to start measuring flow and run one honest forecast instead of guessing.",
      ctas: [
        COMMUNITY_CTA,
        {
          label: "Book a consulting call",
          href: "https://letpeople.work/#stay-connected",
          isCommunity: false,
        },
      ],
    },
    {
      name: "Output-focused",
      min: 26,
      max: 50,
      tagline: "Counting output, not measuring flow.",
      measureRead:
        "You're counting output — points or items closed — rather than measuring flow, so you can see how much got done but not how predictably it flows.",
      forecastRead:
        "And you forecast with estimates rather than probabilities, so a single date hides the real range of outcomes.",
      nextRung:
        "The next rung is to shift from output to flow metrics and run your first probabilistic forecast.",
      ctas: [
        COMMUNITY_CTA,
        {
          label: "Get light coaching",
          href: "https://letpeople.work/#stay-connected",
          isCommunity: false,
        },
      ],
    },
    {
      name: "Flow-aware",
      min: 51,
      max: 75,
      tagline: "Watching flow, starting to forecast.",
      measureRead:
        "You're watching real flow metrics — cycle time, throughput and WIP are on your radar and informing conversations.",
      forecastRead:
        "And you're starting to forecast beyond single-date estimates — the instinct for probability is there, it just isn't operationalised yet.",
      nextRung:
        "The next rung is to operationalise forecasting so every commitment carries an explicit, defensible probability.",
      ctas: [
        {
          ...COMMUNITY_CTA,
          label: "Use Community to operationalize forecasting (free)",
        },
      ],
    },
    {
      name: "Probabilistic",
      min: 76,
      max: 100,
      tagline: "Forecasting by percentiles and steering by them.",
      measureRead:
        "You measure flow as a matter of course — cycle time, throughput, WIP and flow health are live inputs to how you work.",
      forecastRead:
        "And you forecast probabilistically and steer by it — Monte Carlo / percentile forecasts drive your commitments and re-planning.",
      nextRung:
        "The next rung is to scale this across teams and portfolios and keep validating your forecasts against reality.",
      ctas: [
        {
          label: "Explore Lighthouse paid / portfolio tiers",
          href: "https://letpeople.work/lighthouse#lighthouse-premium",
          isCommunity: false,
        },
        {
          ...COMMUNITY_CTA,
          label: "Use Community to validate your forecasts (free)",
        },
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
