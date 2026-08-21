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
    facilitationHint: z.string().min(1).max(200),
  }),
  run: z.object({
    facilitatorCue: z.string().min(1),
    questionTemplate: z.string().includes("{days}"),
    hint: z.string().min(1),
    abandon: z.string().min(1),
    finishEarly: z.string().min(1),
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
    unsizedHeading: z.string().min(1),
    unsizedGuidance: z.string().min(1),
    partialHeading: z.string().min(1),
    nextStepsHeading: z.string().min(1),
    nextSteps: z.array(nextStepSchema).min(2),
  }),
  answers: z.array(answerSchema).length(3),
  sampleItems: z.array(z.string().min(1)).min(5),
  // The walkthrough (G8-G18). Length caps are G13: on a phone a three-line
  // coach note pushes the answers below the fold, so a slip fails the build.
  guided: z.object({
    entryCta: z.string().min(1).max(30),
    modeLabel: z.string().min(1).max(30),
    modeLabelFinished: z.string().min(1).max(40),
    exitLabel: z.string().min(1).max(15),
    configHeading: z.string().min(1),
    configCoach: z.string().min(1).max(220),
    configConfirmation: z.string().min(1).max(120),
    // Exactly three curated items, one specimen per answer (G17). A note
    // before the item is a nudge; a note after is an aside. Never both.
    // `target` is the answer this item exists to teach (G19): a different
    // answer is not recorded - `redirect` explains why and asks for another
    // look, so every walkthrough visits Yes, Maybe and No exactly once.
    items: z
      .array(
        z.object({
          title: z.string().min(1),
          target: z.enum(["fits", "conditional", "too-big"]),
          redirect: z.string().min(1).max(220),
          noteBefore: z.string().max(200).optional(),
          noteAfter: z.string().max(200).optional(),
        }),
      )
      .length(3),
    lessonHeading: z.string().min(1).max(60),
    lessonIntro: z.string().min(1).max(140),
    lessonOptions: z.array(z.string().min(1).max(100)).length(2),
    lessonCta: z.string().min(1).max(20),
    endingEyebrow: z.string().min(1).max(40),
    endingHeading: z.string().min(1).max(60),
    endingLede: z.string().min(1).max(140),
    handoverHeading: z.string().min(1).max(60),
    handoverBody: z.string().min(1).max(260),
    handoverCta: z.string().min(1).max(30),
  }),
});

const raw = {
  intro: {
    eyebrow: "Sizing, without estimating",
    heading: "Does it fit?",
    // Two sentences. The first version put six here and went unread.
    //
    // The second sentence exists because two of the first two external
    // reviewers arrived expecting a room to join and vote in (see D16). The
    // name promises poker, poker promises a card per person, and this is a
    // facilitator's tool. Saying who drives it, in the first thing anyone
    // reads, is cheaper than arguing with the expectation afterwards.
    lede: "One question per work item, three possible answers, no story points. You run it: on your own, or with your team round a shared screen.",
    cta: "Try it out",
    aside: "Free, no signup. Nothing leaves your browser.",
  },

  config: {
    heading: "Two things before you start",
    // Never "Service Level Expectation" here. That word is earned in the wrap-up.
    targetLabel: "How quickly should an item normally be done in your environment?",
    targetUnit: "days or less",
    targetHelp: "A rough number is fine. You will get a better one at the end.",
    itemsLabel: "Which items do you want to size today?",
    itemsHelp: "One per line. Paste straight from your backlog.",
    cta: "Start sizing",
    sampleCta: "Use an example backlog",
    // Removes anchoring without costing a second per item. See D14.
    facilitationHint:
      "Doing this with your team? Have everyone answer at the same time, hands up together, so the first person to speak does not decide it for the rest.",
  },

  run: {
    facilitatorCue: "Ask everyone to answer at once.",
    questionTemplate: "Doable in {days} days or less?",
    hint: "First instinct. You will sort out the details at the end.",
    abandon: "Start over",
    finishEarly: "Finish early",
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

    unsizedHeading: "Not sized yet",
    unsizedGuidance:
      "You ran out of time before these. They are where the next round starts.",

    // Used instead of the fast/slow line when a round stopped early: claiming a
    // pace on a partial round would be overreaching.
    partialHeading: "Here is how far you got.",

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

  guided: {
    entryCta: "Walk me through it",
    modeLabel: "Walkthrough",
    modeLabelFinished: "Walkthrough \u00b7 finished",
    exitLabel: "Exit",
    configHeading: "One thing before you start",
    configCoach:
      "One number first: how long does a typical item take once someone starts it? Not the longest, not the shortest \u2014 the one that wouldn't surprise anyone. No idea? Try 10.",
    configConfirmation:
      "Example backlog loaded \u2014 you'll size three of its items, one at a time.",
    // One specimen per answer, nudged but never commanded (G17). Both nudge
    // items are Benji's own examples from the 2026-08-21 thread.
    items: [
      {
        // The reflex. Small and contained; nearly everyone says yes, and that
        // is the lesson. The after-note is Benji's "what causes you to think?"
        // as a private noticing (G16).
        title: "Add CSV export to the metrics table",
        target: "fits" as const,
        redirect:
          "Fair instinct \u2014 but look again: it's small, contained, and all this team's. Most items should feel like this. Click Yes and see where a yes goes.",
        noteAfter:
          "Read the title and react \u2014 first instinct. If it's a no, notice what makes you think that. You'll use it in a moment.",
      },
      {
        // The dependency ("hier brauchen wir Marketing"). The only pre-answer
        // note: it points at who the item needs; the user draws the conclusion.
        title: "Rework the onboarding email sequence",
        target: "conditional" as const,
        redirect:
          "Almost \u2014 but this one needs marketing's time, not just yours. That's not a clean yes and not a real no. Click Maybe and see what it's for.",
        noteBefore:
          "This one's different. Look at who it needs \u2014 not just this team. When an item only works if someone outside is free, that's what Maybe is for.",
      },
      {
        // The no ("f\u00fchlt sich nach viel an"). Needs no nudge; the first
        // "No" triggers the one-time lesson (G3).
        title: "Migrate the reporting database to the new cluster",
        target: "too-big" as const,
        redirect:
          "Brave \u2014 but core work like this rarely fits in the time you set. Click No: the useful part of this method is what happens after a no.",
      },
    ],
    lessonHeading: "You said no. That's the useful answer.",
    lessonIntro:
      "A \u201cno\u201d isn't a verdict to write down \u2014 it's the start of a short conversation:",
    lessonOptions: [
      "Could it be split into something smaller that would fit?",
      "Does someone specific need to be free for it to work?",
    ],
    lessonCta: "Got it",
    endingEyebrow: "Walkthrough complete",
    endingHeading: "That's the whole method.",
    endingLede:
      "Three items, one question each \u2014 and each answer sends its item somewhere different.",
    handoverHeading: "Now do it with your own backlog.",
    handoverBody:
      "Same three answers, your items, about a minute. That run gives you a real number for how fast the question goes \u2014 this one doesn't, because you were reading me.",
    handoverCta: "Size my own items",
  },

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
