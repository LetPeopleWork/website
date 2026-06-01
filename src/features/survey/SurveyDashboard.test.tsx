import { describe, it, expect } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { AdminDashboard } from "../assessment/components/AdminDashboard";
import { summarizeDashboard } from "../assessment/core/dashboardSummary";
import { summarizeSurvey } from "./core/summarizeSurvey";
import { SURVEY_CHOICE_QUESTIONS } from "./content/surveyContent";
import type {
  DashboardData,
  DashboardRepository,
  DashboardSurveyResponse,
  SurveyAnswers,
} from "../assessment/ports";

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

const inMemoryRepository = (data: DashboardData): DashboardRepository => ({
  load: () => Promise.resolve(data),
});

const renderSurveyView = async (repository: DashboardRepository) => {
  const data = await repository.load("user-survey");
  const summary = summarizeSurvey(data);
  render(
    <AdminDashboard
      summary={summarizeDashboard(data, "user-survey")}
      surveySummary={summary}
      onSignOut={() => undefined}
    />,
  );
  return summary;
};

describe("Maintainer survey view on the internal dashboard (US-05, slice-01)", () => {
  it("visualizes each choice question as a chart with no per-question text tally table, all anonymous", async () => {
    const repository = inMemoryRepository({
      responses: [],
      leads: [],
      surveyResponses: [
        getMockSurveyResponse(),
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            [SURVEY_CHOICE_QUESTIONS[0].id]:
              SURVEY_CHOICE_QUESTIONS[0].options[1].id,
          },
        }),
      ],
    });

    await renderSurveyView(repository);

    const surveyView = await screen.findByTestId("dashboard-survey");
    expect(
      within(surveyView).getByText(/2 anonymous responses collected/i),
    ).toBeInTheDocument();

    const charts = within(surveyView).getByTestId("dashboard-survey-charts");
    expect(
      within(charts).getByText(SURVEY_CHOICE_QUESTIONS[0].prompt),
    ).toBeInTheDocument();
    expect(
      within(charts).getAllByTestId("survey-question-chart"),
    ).toHaveLength(SURVEY_CHOICE_QUESTIONS.length);
    expect(within(surveyView).queryByRole("table")).not.toBeInTheDocument();
    expect(within(surveyView).queryByText(/@/)).not.toBeInTheDocument();
  });

  it("shows an empty survey view when an unauthenticated read returns no data", async () => {
    const repository = inMemoryRepository({
      responses: [],
      leads: [],
      surveyResponses: [],
    });

    await renderSurveyView(repository);

    const surveyView = await screen.findByTestId("dashboard-survey");
    await waitFor(() =>
      expect(
        within(surveyView).getByText(/0 anonymous responses collected/i),
      ).toBeInTheDocument(),
    );
    expect(within(surveyView).queryByText(/@/)).not.toBeInTheDocument();
  });
});
