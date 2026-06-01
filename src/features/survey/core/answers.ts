import { z } from "zod";

export const RECOMMEND_OPTIONS = [
  "very-likely",
  "likely",
  "neutral",
  "unlikely",
] as const;

export const PRIMARY_USE_OPTIONS = [
  "forecasting",
  "flow-metrics",
  "portfolio-overview",
  "stakeholder-reporting",
  "still-exploring",
] as const;

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
  "consultant-trainer",
  "leadership-director",
  "other",
] as const;

export const DISCOVERY_CHANNEL_OPTIONS = [
  "linkedin",
  "conference-meetup",
  "colleague-word-of-mouth",
  "google-search",
  "github",
  "youtube-podcast",
  "blog-article",
  "other",
] as const;

const IMPROVEMENT_MAX_LENGTH = 500;

export const surveyAnswersSchema = z.object({
  recommend: z.enum(RECOMMEND_OPTIONS),
  primaryUse: z.array(z.enum(PRIMARY_USE_OPTIONS)).min(1),
  improvement: z.string().max(IMPROVEMENT_MAX_LENGTH).optional(),
  teamCount: z.enum(TEAM_COUNT_OPTIONS),
  role: z.enum(ROLE_OPTIONS),
  discoveryChannel: z.enum(DISCOVERY_CHANNEL_OPTIONS),
});

export type SurveyAnswers = z.infer<typeof surveyAnswersSchema>;

const DEFAULT_SURVEY_ANSWERS: SurveyAnswers = {
  recommend: "very-likely",
  primaryUse: ["forecasting"],
  teamCount: "just-mine",
  role: "scrum-master-agile-coach",
  discoveryChannel: "linkedin",
};

export const getMockSurveyAnswers = (
  overrides: Partial<SurveyAnswers> = {},
): SurveyAnswers =>
  surveyAnswersSchema.parse({ ...DEFAULT_SURVEY_ANSWERS, ...overrides });
