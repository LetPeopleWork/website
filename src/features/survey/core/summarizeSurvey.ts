import type { DashboardData } from "../../assessment/ports";
import { SURVEY_QUESTIONS, isChoiceQuestion } from "../content/surveyContent";

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

export interface FreeTextResponses {
  readonly id: string;
  readonly prompt: string;
  readonly responses: readonly string[];
}

export interface HistoricalTally {
  readonly id: string;
  readonly count: number;
}

export interface SurveySummary {
  readonly totalResponses: number;
  readonly questions: readonly QuestionTally[];
  readonly freeText: readonly FreeTextResponses[];
  readonly historical: readonly HistoricalTally[];
}

const choiceQuestions = SURVEY_QUESTIONS.filter(isChoiceQuestion);
const textQuestions = SURVEY_QUESTIONS.filter(
  (question) => question.kind === "text",
);
const textQuestionIds = new Set(textQuestions.map((question) => question.id));

const configuredOptionIds = new Set(
  choiceQuestions.flatMap((question) =>
    question.options.map((option) => option.id),
  ),
);

const answerHas = (
  value: string | readonly string[] | undefined,
  optionId: string,
): boolean =>
  Array.isArray(value) ? value.includes(optionId) : value === optionId;

const countOption = (
  responses: DashboardData["surveyResponses"],
  questionId: string,
  optionId: string,
): number =>
  responses.filter((response) =>
    answerHas(response.answers[questionId], optionId),
  ).length;

const optionIdsFromChoiceAnswers = (
  responses: DashboardData["surveyResponses"],
): readonly string[] =>
  responses.flatMap((response) =>
    Object.entries(response.answers)
      .filter(([questionId]) => !textQuestionIds.has(questionId))
      .flatMap(([, value]) => (Array.isArray(value) ? [...value] : [value]))
      .filter(
        (optionId): optionId is string =>
          typeof optionId === "string" && optionId.length > 0,
      ),
  );

const tallyHistorical = (
  responses: DashboardData["surveyResponses"],
): readonly HistoricalTally[] => {
  const counts = optionIdsFromChoiceAnswers(responses)
    .filter((optionId) => !configuredOptionIds.has(optionId))
    .reduce(
      (accumulator, optionId) =>
        accumulator.set(optionId, (accumulator.get(optionId) ?? 0) + 1),
      new Map<string, number>(),
    );
  return [...counts].map(([id, count]) => ({ id, count }));
};

const tallyFreeText = (
  responses: DashboardData["surveyResponses"],
): readonly FreeTextResponses[] =>
  textQuestions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    responses: responses
      .map((response) => response.answers[question.id])
      .filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      ),
  }));

export const summarizeSurvey = (data: DashboardData): SurveySummary => ({
  totalResponses: data.surveyResponses.length,
  questions: choiceQuestions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      count: countOption(data.surveyResponses, question.id, option.id),
    })),
  })),
  freeText: tallyFreeText(data.surveyResponses),
  historical: tallyHistorical(data.surveyResponses),
});
