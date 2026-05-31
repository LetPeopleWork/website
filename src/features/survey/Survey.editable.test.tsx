import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SurveyForm } from "./components/SurveyForm";
import { summarizeSurvey } from "./core/summarizeSurvey";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type { SurveyQuestion } from "./content/surveyContent";
import type {
  DashboardData,
  DashboardSurveyResponse,
} from "../assessment/ports";

const SURVEY_ROUTE = "/survey";

const noopSubmission = { submit: () => Promise.resolve() };

const editedQuestions: readonly SurveyQuestion[] = [
  {
    id: "favourite-cadence",
    prompt: "Which planning cadence fits your team best?",
    options: [
      { id: "weekly", label: "Weekly" },
      { id: "fortnightly", label: "Fortnightly" },
    ],
  },
];

const renderSurveyAtRoute = (questions: readonly SurveyQuestion[]) =>
  render(
    <MemoryRouter initialEntries={[SURVEY_ROUTE]}>
      <Routes>
        <Route
          path={SURVEY_ROUTE}
          element={
            <SurveyForm submission={noopSubmission} questions={questions} />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

const allFirstOptions = (): Readonly<Record<string, string>> =>
  Object.fromEntries(
    SURVEY_QUESTIONS.map((question) => [question.id, question.options[0].id]),
  );

const historicalAnswers = (): Readonly<Record<string, string>> => ({
  "retired-question": "retired-option",
  [SURVEY_QUESTIONS[0].id]: "decommissioned-choice",
});

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
  surveyResponses: [],
  ...overrides,
});

describe("Questions are editable without a link change", () => {
  it("renders edited question content at the unchanged /survey route", async () => {
    const user = userEvent.setup();
    renderSurveyAtRoute(editedQuestions);

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByText(editedQuestions[0].prompt)).toBeInTheDocument();
    expect(screen.getByText("Fortnightly")).toBeInTheDocument();
    expect(
      screen.queryByText(SURVEY_QUESTIONS[0].prompt),
    ).not.toBeInTheDocument();
  });

  it("renders the content module questions at the same route when none are overridden", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[SURVEY_ROUTE]}>
        <Routes>
          <Route
            path={SURVEY_ROUTE}
            element={<SurveyForm submission={noopSubmission} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByText(SURVEY_QUESTIONS[0].prompt)).toBeInTheDocument();
    expect(
      screen.queryByText(editedQuestions[0].prompt),
    ).not.toBeInTheDocument();
  });
});

describe("Old and new survey responses both stay readable on the dashboard", () => {
  it("tallies current responses and surfaces historical answers without dropping rows", () => {
    const data = getMockData({
      surveyResponses: [
        getMockSurveyResponse(),
        getMockSurveyResponse({ answers: historicalAnswers() }),
      ],
    });

    const summary = summarizeSurvey(data);

    expect(summary.totalResponses).toBe(2);

    const firstQuestion = summary.questions.find(
      (question) => question.id === SURVEY_QUESTIONS[0].id,
    );
    const firstConfiguredOption = firstQuestion?.options.find(
      (option) => option.id === SURVEY_QUESTIONS[0].options[0].id,
    );
    expect(firstConfiguredOption?.count).toBe(1);

    const historicalTotal = summary.historical.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );
    expect(historicalTotal).toBe(2);
    expect(
      summary.historical.some((entry) => entry.id === "decommissioned-choice"),
    ).toBe(true);
    expect(
      summary.historical.some((entry) => entry.id === "retired-option"),
    ).toBe(true);
  });
});
