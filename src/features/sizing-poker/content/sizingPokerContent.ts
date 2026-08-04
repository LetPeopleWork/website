import { z } from "zod";

// Copy lives here, validated at module load, so a typo in a label fails the build
// rather than shipping.
//
// Deliberate constraint from Benji's review (2026-08-04): no jargon before the
// wrap-up. The audience for this page has never met "SLE", "cycle time" or
// "85th percentile". Those words appear exactly once, at the end, as the answer
// to a question the visitor now has a reason to ask. Anything that reads like a
// definition before then is what made the first version go unread.

const answerSchema = z.object({
  verdict: z.enum(["fits", "conditional", "too-big"]),
  key: z.string().length(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const nextStepSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  href: z.string().min(1),
  linkLabel: z.string().min(1),
});

const contentSchema = z.object({
  intro: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    lede: z.string().min(1).max(220),
    cta: z.string().min(1),
    aside: z.string().min(1),
  }),
  config: z.object({
    heading: z.string().min(1),
    targetLabel: z.string().min(1),
    targetUnit: z.string().min(1),
    targetHelp: z.string().min(1).max(160),
    itemsLabel: z.string().min(1),
    itemsHelp: z.string().min(1).max(160),
    cta: z.string().min(1),
    sampleCta: z.string().min(1),
  }),
  run: z.object({
    facilitatorCue: z.string().min(1),
    questionTemplate: z.string().includes("{days}"),
    hint: z.string().min(1),
    abandon: z.string().min(1),
  }),
  wrapUp: z.object({
    fastHeading: z.string().min(1),
    slowHeading: z.string().min(1),
    readyHeading: z.string().min(1),
    readyGuidance: z.string().min(1),
    maybeHeading: z.string().min(1),
    maybeGuidance: z.string().min(1),
    tooBigHeading: z.string().min(1),
    tooBigGuidance: z.string().min(1),
    nextStepsHeading: z.string().min(1),
    nextSteps: z.array(nextStepSchema).min(2),
  }),
  answers: z.array(answerSchema).length(3),
  sampleItems: z.array(z.string().min(1)).min(5),
});

const raw = {
  intro: {
    eyebrow: "Sizing, without estimating",
    heading: "Does it fit?",
    // Two sentences. The first version put six here and went unread.
    lede: "One question per work item, three possible answers, no story points. Try it on your own backlog and see how far you get before the coffee goes cold.",
    cta: "Try it out",
    aside: "Free, no signup. Nothing leaves your browser.",
  },

  config: {
    heading: "Two things before you start",
    // Never "Service Level Expectation" here. That word is earned in the wrap-up.
    targetLabel: "How fast should your items be done?",
    targetUnit: "days or less",
    targetHelp: "A rough number is fine. You will get a better one at the end.",
    itemsLabel: "Which items do you want to size today?",
    itemsHelp: "One per line. Paste straight from your backlog.",
    cta: "Start sizing",
    sampleCta: "Use an example backlog",
  },

  run: {
    facilitatorCue: "Look at this with your team, and get their vote.",
    questionTemplate: "Doable in {days} days or less?",
    hint: "First instinct. You will sort out the details at the end.",
    abandon: "Start over",
  },

  wrapUp: {
    fastHeading: "That was faster than estimating.",
    slowHeading: "That took longer than it should.",

    readyHeading: "Ready to go",
    readyGuidance: "Nothing in the way. These can be pulled as they are.",

    maybeHeading: "Maybe",
    maybeGuidance:
      "For each of these, work out what would need to be true to make it a yes. Usually it is a person, a decision, or another team.",

    tooBigHeading: "Needs work",
    tooBigGuidance:
      "Too big to finish in the time you set. Consider your options before anyone starts them: slice them smaller, or pair on them.",

    nextStepsHeading: "Two questions this round probably raised",
    nextSteps: [
      {
        question: "How do you work out what that number should be?",
        answer:
          "You measure it rather than pick it. The time your items actually take, from start to finish, is your cycle time, and the number most teams commit to is the one they hit 85% of the time. That is a Service Level Expectation, and it comes out of the data you already have in Jira, Azure DevOps, or Linear.",
        href: "/lighthouse",
        linkLabel: "See how Lighthouse works it out",
      },
      {
        question: "How do you use this in your dailies?",
        answer:
          "Sizing tells you what to start. Work Item Age tells you what is quietly going wrong with what you already started: how long each in-progress item has been running, against that same number. It turns the daily from a status round into a short conversation about the two items that need help.",
        href: "/lighthouse",
        linkLabel: "See Work Item Age in Lighthouse",
      },
    ],
  },

  answers: [
    {
      verdict: "fits" as const,
      key: "1",
      title: "Yes",
      subtitle: "We would finish it in time.",
    },
    {
      verdict: "conditional" as const,
      key: "2",
      title: "Maybe",
      subtitle: "Only if something gets arranged first.",
    },
    {
      verdict: "too-big" as const,
      key: "3",
      title: "No",
      subtitle: "Too big as it stands.",
    },
  ],

  sampleItems: [
    "Add SSO login via Azure AD",
    "Fix timezone bug in the export scheduler",
    "Migrate the reporting database to the new cluster",
    "Add CSV export to the metrics table",
    "Rework the onboarding email sequence",
    "Support custom date ranges in forecasts",
    "Add rate limiting to the public API",
    "Replace the deprecated charting library",
  ],
};

export const sizingPokerContent = contentSchema.parse(raw);

export type SizingPokerAnswer = (typeof sizingPokerContent)["answers"][number];

export const questionFor = (targetDays: number): string =>
  sizingPokerContent.run.questionTemplate.replace("{days}", String(targetDays));
