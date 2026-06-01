import { z } from "zod";
import {
  DISCOVERY_CHANNEL_OPTIONS,
  PRIMARY_USE_OPTIONS,
  RECOMMEND_OPTIONS,
  ROLE_OPTIONS,
  TEAM_COUNT_OPTIONS,
} from "../core/answers";

const optionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const choiceQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  kind: z.literal("choice"),
  multiple: z.boolean(),
  options: z.array(optionSchema).min(2),
});

const textQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  kind: z.literal("text"),
  maxLength: z.number().int().positive(),
});

const questionSchema = z.discriminatedUnion("kind", [
  choiceQuestionSchema,
  textQuestionSchema,
]);

const contentSchema = z.object({
  questions: z.array(questionSchema).length(6),
});

export type SurveyOption = z.infer<typeof optionSchema>;
export type SurveyQuestion = z.infer<typeof questionSchema>;
export type SurveyChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type SurveyContent = z.infer<typeof contentSchema>;

export const isChoiceQuestion = (
  question: SurveyQuestion,
): question is SurveyChoiceQuestion => question.kind === "choice";

const rawContent = {
  questions: [
    {
      id: "recommend",
      prompt: "How likely are you to recommend Lighthouse to a colleague?",
      kind: "choice",
      multiple: false,
      options: [
        { id: RECOMMEND_OPTIONS[0], label: "Very likely" },
        { id: RECOMMEND_OPTIONS[1], label: "Likely" },
        { id: RECOMMEND_OPTIONS[2], label: "Neutral" },
        { id: RECOMMEND_OPTIONS[3], label: "Unlikely" },
      ],
    },
    {
      id: "primary-use",
      prompt: "What do you use Lighthouse for? (select all that apply)",
      kind: "choice",
      multiple: true,
      options: [
        { id: PRIMARY_USE_OPTIONS[0], label: "Forecasting" },
        { id: PRIMARY_USE_OPTIONS[1], label: "Flow Metrics" },
        { id: PRIMARY_USE_OPTIONS[2], label: "Portfolio Overview" },
        { id: PRIMARY_USE_OPTIONS[3], label: "Stakeholder Reporting" },
        { id: PRIMARY_USE_OPTIONS[4], label: "Still Exploring" },
      ],
    },
    {
      id: "improvement",
      prompt:
        "What is one thing that would make Lighthouse even better that is missing today?",
      kind: "text",
      maxLength: 500,
    },
    {
      id: "team-count",
      prompt: "How many teams are using Lighthouse in your organisation?",
      kind: "choice",
      multiple: false,
      options: [
        { id: TEAM_COUNT_OPTIONS[0], label: "Just mine (1)" },
        { id: TEAM_COUNT_OPTIONS[1], label: "2-5" },
        { id: TEAM_COUNT_OPTIONS[2], label: "6-10" },
        { id: TEAM_COUNT_OPTIONS[3], label: "More than 10" },
      ],
    },
    {
      id: "role",
      prompt: "What's your role?",
      kind: "choice",
      multiple: false,
      options: [
        { id: ROLE_OPTIONS[0], label: "Scrum Master / Agile Coach" },
        { id: ROLE_OPTIONS[1], label: "Engineering Manager / Delivery Lead" },
        { id: ROLE_OPTIONS[2], label: "Product Manager / Product Owner" },
        { id: ROLE_OPTIONS[3], label: "Engineering / Developer" },
        { id: ROLE_OPTIONS[4], label: "Consultant / Trainer" },
        { id: ROLE_OPTIONS[5], label: "Leadership / Director+" },
        { id: ROLE_OPTIONS[6], label: "Other" },
      ],
    },
    {
      id: "discovery-channel",
      prompt: "How did you hear about Lighthouse?",
      kind: "choice",
      multiple: false,
      options: [
        { id: DISCOVERY_CHANNEL_OPTIONS[0], label: "LinkedIn" },
        { id: DISCOVERY_CHANNEL_OPTIONS[1], label: "Conference / Meetup" },
        { id: DISCOVERY_CHANNEL_OPTIONS[2], label: "Colleague / Word of mouth" },
        { id: DISCOVERY_CHANNEL_OPTIONS[3], label: "Google / Search" },
        { id: DISCOVERY_CHANNEL_OPTIONS[4], label: "GitHub" },
        { id: DISCOVERY_CHANNEL_OPTIONS[5], label: "YouTube / Podcast" },
        { id: DISCOVERY_CHANNEL_OPTIONS[6], label: "Blog / Article" },
        { id: DISCOVERY_CHANNEL_OPTIONS[7], label: "Other" },
      ],
    },
  ],
} as const;

export const surveyContent: SurveyContent = contentSchema.parse(rawContent);

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] =
  surveyContent.questions;

export const SURVEY_CHOICE_QUESTIONS: readonly SurveyChoiceQuestion[] =
  surveyContent.questions.filter(isChoiceQuestion);
