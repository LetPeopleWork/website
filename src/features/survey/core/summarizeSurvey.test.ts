import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { summarizeSurvey } from "./summarizeSurvey";
import { SURVEY_CHOICE_QUESTIONS } from "../content/surveyContent";
import type {
  DashboardData,
  DashboardSurveyResponse,
  SurveyAnswers,
} from "../../assessment/ports";

const RECOMMEND = SURVEY_CHOICE_QUESTIONS[0];
const PRIMARY_USE = SURVEY_CHOICE_QUESTIONS[1];

const allFirstOptions = (): SurveyAnswers =>
  Object.fromEntries(
    SURVEY_CHOICE_QUESTIONS.map((question) => [
      question.id,
      question.multiple ? [question.options[0].id] : question.options[0].id,
    ]),
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
  return question?.options.find((entry) => entry.id === optionId)?.count ?? -1;
};

describe("summarizeSurvey", () => {
  it("counts total responses and tallies each chosen option per question", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse({
          answers: { ...allFirstOptions(), [RECOMMEND.id]: RECOMMEND.options[1].id },
        }),
        getMockSurveyResponse({
          answers: { ...allFirstOptions(), [RECOMMEND.id]: RECOMMEND.options[1].id },
        }),
        getMockSurveyResponse(),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(3);
    expect(optionTally(summary, RECOMMEND.id, RECOMMEND.options[1].id)).toBe(2);
    expect(optionTally(summary, RECOMMEND.id, RECOMMEND.options[0].id)).toBe(1);
  });

  it("counts every selected option of a multiselect answer", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            [PRIMARY_USE.id]: [
              PRIMARY_USE.options[0].id,
              PRIMARY_USE.options[1].id,
            ],
          },
        }),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(optionTally(summary, PRIMARY_USE.id, PRIMARY_USE.options[0].id)).toBe(1);
    expect(optionTally(summary, PRIMARY_USE.id, PRIMARY_USE.options[1].id)).toBe(1);
  });

  it("zero-fills every configured option for questions nobody answered that way", () => {
    const summary = summarizeSurvey(getMockData({ surveyResponses: [] }));

    expect(summary.totalResponses).toBe(0);
    expect(summary.questions.map((question) => question.id)).toEqual(
      SURVEY_CHOICE_QUESTIONS.map((question) => question.id),
    );
    for (const question of summary.questions) {
      const configured = SURVEY_CHOICE_QUESTIONS.find(
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
          answers: { ...allFirstOptions(), [RECOMMEND.id]: "ghost-option" },
        }),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(1);
    expect(optionTally(summary, RECOMMEND.id, RECOMMEND.options[0].id)).toBe(0);
    expect(summary).not.toHaveProperty("bandDistribution");
  });

  it("collects free-text answers separately from the tallied charts", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            improvement: "More integrations please",
          },
        }),
        getMockSurveyResponse(),
      ],
    });

    const summary = summarizeSurvey(data);

    const improvement = summary.freeText.find((entry) => entry.id === "improvement");
    expect(improvement?.responses).toEqual(["More integrations please"]);
    expect(summary.questions.some((question) => question.id === "improvement")).toBe(
      false,
    );
  });

  it("per-question option tallies never exceed the total response count", () => {
    const optionIdArb = fc.constantFrom(
      ...SURVEY_CHOICE_QUESTIONS.flatMap((question) =>
        question.options.map((option) => option.id),
      ),
    );
    const answersArb = fc.dictionary(
      fc.constantFrom(...SURVEY_CHOICE_QUESTIONS.map((question) => question.id)),
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
