import { z } from "zod";
import {
  ASSESSMENT_INTEREST_OPTIONS,
  DISCOVERY_CHANNEL_OPTIONS,
  ROLE_OPTIONS,
  TEAM_COUNT_OPTIONS,
} from "../core/answers";

const optionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const questionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(optionSchema).min(2),
});

const contentSchema = z.object({
  questions: z.array(questionSchema).length(4),
});

export type SurveyOption = z.infer<typeof optionSchema>;
export type SurveyQuestion = z.infer<typeof questionSchema>;
export type SurveyContent = z.infer<typeof contentSchema>;

const rawContent = {
  questions: [
    {
      id: "team-count",
      prompt: "How many teams are using Lighthouse in your organisation?",
      options: [
        { id: TEAM_COUNT_OPTIONS[0], label: "Just mine (1)" },
        { id: TEAM_COUNT_OPTIONS[1], label: "2–5" },
        { id: TEAM_COUNT_OPTIONS[2], label: "6–10" },
        { id: TEAM_COUNT_OPTIONS[3], label: "More than 10" },
      ],
    },
    {
      id: "role",
      prompt: "What's your role?",
      options: [
        { id: ROLE_OPTIONS[0], label: "Scrum Master / Agile Coach" },
        { id: ROLE_OPTIONS[1], label: "Engineering Manager / Delivery Lead" },
        { id: ROLE_OPTIONS[2], label: "Product Manager / Product Owner" },
        { id: ROLE_OPTIONS[3], label: "Engineering / Developer" },
        { id: ROLE_OPTIONS[4], label: "Leadership / Director+" },
        { id: ROLE_OPTIONS[5], label: "Other" },
      ],
    },
    {
      id: "discovery-channel",
      prompt: "How did you hear about Lighthouse?",
      options: [
        { id: DISCOVERY_CHANNEL_OPTIONS[0], label: "LinkedIn" },
        { id: DISCOVERY_CHANNEL_OPTIONS[1], label: "Conference / Meetup" },
        { id: DISCOVERY_CHANNEL_OPTIONS[2], label: "Colleague / Word of mouth" },
        { id: DISCOVERY_CHANNEL_OPTIONS[3], label: "Google / Search" },
        { id: DISCOVERY_CHANNEL_OPTIONS[4], label: "GitHub" },
        { id: DISCOVERY_CHANNEL_OPTIONS[5], label: "Other" },
      ],
    },
    {
      id: "assessment-interest",
      prompt:
        "Would you be interested in a service like this? (re: the free Flow Assessment)",
      options: [
        { id: ASSESSMENT_INTEREST_OPTIONS[0], label: "Yes" },
        { id: ASSESSMENT_INTEREST_OPTIONS[1], label: "Maybe" },
        { id: ASSESSMENT_INTEREST_OPTIONS[2], label: "No" },
      ],
    },
  ],
} as const;

export const surveyContent: SurveyContent = contentSchema.parse(rawContent);

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] =
  surveyContent.questions;
