import { z } from "zod";

export const TEAM_COUNT_OPTIONS = [
  "just-mine",
  "two-to-five",
  "six-to-ten",
  "more-than-ten",
] as const;

export const ROLE_OPTIONS = [
  "scrum-master-agile-coach",
  "engineering-manager-delivery-lead",
  "product-manager-owner",
  "engineering-developer",
  "leadership-director",
  "other",
] as const;

export const DISCOVERY_CHANNEL_OPTIONS = [
  "linkedin",
  "conference-meetup",
  "colleague-word-of-mouth",
  "google-search",
  "github",
  "other",
] as const;

export const ASSESSMENT_INTEREST_OPTIONS = ["yes", "maybe", "no"] as const;

export const surveyAnswersSchema = z.object({
  teamCount: z.enum(TEAM_COUNT_OPTIONS),
  role: z.enum(ROLE_OPTIONS),
  discoveryChannel: z.enum(DISCOVERY_CHANNEL_OPTIONS),
  assessmentInterest: z.enum(ASSESSMENT_INTEREST_OPTIONS),
});

export type SurveyAnswers = z.infer<typeof surveyAnswersSchema>;

const DEFAULT_SURVEY_ANSWERS: SurveyAnswers = {
  teamCount: "just-mine",
  role: "scrum-master-agile-coach",
  discoveryChannel: "linkedin",
  assessmentInterest: "yes",
};

export const getMockSurveyAnswers = (
  overrides: Partial<SurveyAnswers> = {},
): SurveyAnswers =>
  surveyAnswersSchema.parse({ ...DEFAULT_SURVEY_ANSWERS, ...overrides });
