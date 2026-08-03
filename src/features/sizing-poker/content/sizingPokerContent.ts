import { z } from "zod";

// Copy lives here, validated at module load, so a typo in a label fails the build
// rather than shipping. Mirrors src/features/assessment/content/assessmentContent.ts.

const answerSchema = z.object({
  verdict: z.enum(["fits", "conditional", "too-big"]),
  key: z.string().length(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const contentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  lede: z.string().min(1),
  sleLabel: z.string().min(1),
  sleUnit: z.string().min(1),
  sleHelp: z.string().min(1),
  itemsLabel: z.string().min(1),
  itemsHelp: z.string().min(1),
  startCta: z.string().min(1),
  privacyNote: z.string().min(1),
  questionTemplate: z.string().includes("{sle}"),
  runHint: z.string().min(1),
  answers: z.array(answerSchema).length(3),
  sampleItems: z.array(z.string().min(1)).min(5),
});

const raw = {
  eyebrow: "Sizing, without estimating",
  heading: "Does it fit?",
  lede:
    "One question per item, three possible answers, no numbers to argue about. If your team knows how long its work actually takes, that is the only question worth asking before you start something.",

  sleLabel: "Your Service Level Expectation",
  sleUnit: "days, 85% of the time",
  sleHelp:
    "Don't know it? Use the 85th percentile of your cycle time over the last few months. No data yet? Start at 10 days and correct it once you have some.",

  itemsLabel: "The items you'd bring to refinement",
  itemsHelp: "One per line. Paste straight from your tracker.",
  startCta: "Start the round",
  privacyNote: "Nothing is uploaded. Everything here happens in your browser.",

  questionTemplate: "Could this team finish it within {sle} days, once started?",
  runHint: "Press 1, 2 or 3. Don't deliberate — first instinct.",

  answers: [
    {
      verdict: "fits" as const,
      key: "1",
      title: "Yes",
      subtitle: "Nothing in the way. Pull it.",
    },
    {
      verdict: "conditional" as const,
      key: "2",
      title: "Yes, if…",
      subtitle: "Only with something arranged first.",
    },
    {
      verdict: "too-big" as const,
      key: "3",
      title: "No",
      subtitle: "Too big. It needs slicing.",
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

export const questionFor = (sleDays: number): string =>
  sizingPokerContent.questionTemplate.replace("{sle}", String(sleDays));
