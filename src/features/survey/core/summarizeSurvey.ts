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

export interface SurveySummary {
  readonly totalResponses: number;
  readonly questions: readonly QuestionTally[];
}

const countOption = (
  responses: DashboardData["surveyResponses"],
  questionId: string,
  optionId: string,
): number =>
  responses.filter((response) => response.answers[questionId] === optionId)
    .length;

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
});
