import type { DashboardData } from "../../assessment/ports";
import { SURVEY_QUESTIONS } from "../content/surveyContent";

export interface OptionTally {
  readonly id: string;
  readonly label: string;
  readonly count: number;
}

export interface QuestionTally {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly OptionTally[];
}

export interface HistoricalTally {
  readonly id: string;
  readonly count: number;
}

export interface SurveySummary {
  readonly totalResponses: number;
  readonly questions: readonly QuestionTally[];
  readonly historical: readonly HistoricalTally[];
}

const countOption = (
  responses: DashboardData["surveyResponses"],
  questionId: string,
  optionId: string,
): number =>
  responses.filter((response) => response.answers[questionId] === optionId)
    .length;

const configuredOptionIds = new Set(
  SURVEY_QUESTIONS.flatMap((question) =>
    question.options.map((option) => option.id),
  ),
);

const historicalOptionIds = (
  responses: DashboardData["surveyResponses"],
): readonly string[] =>
  responses.flatMap((response) =>
    Object.values(response.answers).filter(
      (optionId) => !configuredOptionIds.has(optionId),
    ),
  );

const tallyHistorical = (
  responses: DashboardData["surveyResponses"],
): readonly HistoricalTally[] => {
  const counts = historicalOptionIds(responses).reduce(
    (accumulator, optionId) =>
      accumulator.set(optionId, (accumulator.get(optionId) ?? 0) + 1),
    new Map<string, number>(),
  );
  return [...counts].map(([id, count]) => ({ id, count }));
};

export const summarizeSurvey = (data: DashboardData): SurveySummary => ({
  totalResponses: data.surveyResponses.length,
  questions: SURVEY_QUESTIONS.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      count: countOption(data.surveyResponses, question.id, option.id),
    })),
  })),
  historical: tallyHistorical(data.surveyResponses),
});
