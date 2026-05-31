import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { summarizeSurvey } from "./summarizeSurvey";
import { SURVEY_QUESTIONS } from "../content/surveyContent";
import type { DashboardData, DashboardSurveyResponse } from "../../assessment/ports";

const firstOptionOf = (questionIndex: number): string =>
  SURVEY_QUESTIONS[questionIndex].options[0].id;

const allFirstOptions = (): Readonly<Record<string, string>> =>
  Object.fromEntries(
    SURVEY_QUESTIONS.map((question) => [question.id, question.options[0].id]),
  );

const getMockSurveyResponse = (
  overrides: Partial<DashboardSurveyResponse> = {},
): DashboardSurveyResponse => ({
  source: "user-survey",
  answers: allFirstOptions(),
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockData = (overrides: Partial<DashboardData> = {}): DashboardData => ({
  responses: [],
  leads: [],
  surveyResponses: [getMockSurveyResponse()],
  ...overrides,
});

const optionTally = (
  summary: ReturnType<typeof summarizeSurvey>,
  questionId: string,
  optionId: string,
): number => {
  const question = summary.questions.find((entry) => entry.id === questionId);
  const option = question?.options.find((entry) => entry.id === optionId);
  return option?.count ?? -1;
};

describe("summarizeSurvey", () => {
  it("counts total responses and tallies each chosen option per question", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            [SURVEY_QUESTIONS[1].id]: SURVEY_QUESTIONS[1].options[1].id,
          },
        }),
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            [SURVEY_QUESTIONS[1].id]: SURVEY_QUESTIONS[1].options[1].id,
          },
        }),
        getMockSurveyResponse({ answers: allFirstOptions() }),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(3);
    expect(
      optionTally(summary, SURVEY_QUESTIONS[1].id, SURVEY_QUESTIONS[1].options[1].id),
    ).toBe(2);
    expect(
      optionTally(summary, SURVEY_QUESTIONS[0].id, firstOptionOf(0)),
    ).toBe(3);
  });

  it("zero-fills every configured option for questions nobody answered that way", () => {
    const data = getMockData({ surveyResponses: [] });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(0);
    expect(summary.questions.map((question) => question.id)).toEqual(
      SURVEY_QUESTIONS.map((question) => question.id),
    );
    for (const question of summary.questions) {
      const configured = SURVEY_QUESTIONS.find(
        (entry) => entry.id === question.id,
      );
      expect(question.options.map((option) => option.id)).toEqual(
        configured?.options.map((option) => option.id),
      );
      for (const option of question.options) {
        expect(option.count).toBe(0);
      }
    }
  });

  it("ignores answers referencing unknown options and never reports a band", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse({
          answers: { ...allFirstOptions(), [SURVEY_QUESTIONS[0].id]: "ghost-option" },
        }),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(1);
    expect(optionTally(summary, SURVEY_QUESTIONS[0].id, firstOptionOf(0))).toBe(0);
    expect(summary).not.toHaveProperty("bandDistribution");
  });

  it("per-question option tallies never exceed the total response count", () => {
    const optionIdArb = fc.constantFrom(
      ...SURVEY_QUESTIONS.flatMap((question) =>
        question.options.map((option) => option.id),
      ),
    );
    const answersArb = fc.dictionary(
      fc.constantFrom(...SURVEY_QUESTIONS.map((question) => question.id)),
      optionIdArb,
    );
    fc.assert(
      fc.property(fc.array(answersArb), (answersList) => {
        const data = getMockData({
          surveyResponses: answersList.map((answers) =>
            getMockSurveyResponse({ answers }),
          ),
        });
        const summary = summarizeSurvey(data);
        const everyOptionWithinTotal = summary.questions.every((question) =>
          question.options.every(
            (option) => option.count <= summary.totalResponses,
          ),
        );
        return (
          summary.totalResponses === answersList.length && everyOptionWithinTotal
        );
      }),
    );
  });
});
