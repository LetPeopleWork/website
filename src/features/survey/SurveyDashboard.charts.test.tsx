import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { AdminDashboard } from "../assessment/components/AdminDashboard";
import { summarizeDashboard } from "../assessment/core/dashboardSummary";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type {
  DashboardData,
  DashboardSurveyResponse,
  DashboardSurveyTrialRequest,
} from "../assessment/ports";

const allFirstOptions = (): Readonly<Record<string, string>> =>
  Object.fromEntries(
    SURVEY_QUESTIONS.map((question) => [question.id, question.options[0].id]),
  );

const getMockSurveyResponse = (
  overrides: Partial<DashboardSurveyResponse> = {},
): DashboardSurveyResponse => ({
  source: "user-survey",
  answers: allFirstOptions(),
  createdAt: "2026-05-30T12:00:00.000Z",
  ...overrides,
});

const getMockTrialRequest = (
  overrides: Partial<DashboardSurveyTrialRequest> = {},
): DashboardSurveyTrialRequest => ({
  source: "user-survey-trial",
  email: "volunteer@example.com",
  createdAt: "2026-05-30T12:00:00.000Z",
  ...overrides,
});

const renderDashboard = (data: DashboardData, now: string) => {
  render(
    <AdminDashboard
      summary={summarizeDashboard(data, "user-survey")}
      surveyResponses={data.surveyResponses}
      surveyTrialRequests={data.surveyTrialRequests}
      now={now}
      onSignOut={() => undefined}
    />,
  );
};

const NOW = "2026-05-31T12:00:00.000Z";

describe("Maintainer filters the survey view by date range and sees answer visualizations", () => {
  it("renders a per-question answer chart for every survey question", () => {
    const data: DashboardData = {
      responses: [],
      leads: [],
      surveyResponses: [getMockSurveyResponse(), getMockSurveyResponse()],
      surveyTrialRequests: [],
    };

    renderDashboard(data, NOW);

    const survey = screen.getByTestId("dashboard-survey");
    const charts = within(survey).getByTestId("dashboard-survey-charts");
    for (const question of SURVEY_QUESTIONS) {
      expect(
        within(charts).getByText(question.prompt),
      ).toBeInTheDocument();
    }
    expect(within(charts).getAllByTestId("survey-question-chart")).toHaveLength(
      SURVEY_QUESTIONS.length,
    );
    expect(within(survey).queryByRole("table")).not.toBeInTheDocument();
  });

  it("offers a date-range control and defaults to the last 30 days", () => {
    const data: DashboardData = {
      responses: [],
      leads: [],
      surveyResponses: [getMockSurveyResponse()],
      surveyTrialRequests: [],
    };

    renderDashboard(data, NOW);

    const control = screen.getByTestId("survey-range-filter");
    const active = within(control).getByRole("radio", { checked: true });
    expect(active).toHaveTextContent(/30 days/i);
  });

  it("rescopes the response count and trial requests when a shorter range is selected", () => {
    const data: DashboardData = {
      responses: [],
      leads: [],
      surveyResponses: [
        getMockSurveyResponse({ createdAt: "2026-05-30T12:00:00.000Z" }),
        getMockSurveyResponse({ createdAt: "2026-05-01T12:00:00.000Z" }),
      ],
      surveyTrialRequests: [
        getMockTrialRequest({
          email: "recent@example.com",
          createdAt: "2026-05-30T12:00:00.000Z",
        }),
        getMockTrialRequest({
          email: "old@example.com",
          createdAt: "2026-05-01T12:00:00.000Z",
        }),
      ],
    };

    renderDashboard(data, NOW);

    const survey = screen.getByTestId("dashboard-survey");
    expect(
      within(survey).getByText(/2 anonymous responses collected/i),
    ).toBeInTheDocument();
    expect(screen.getByText("old@example.com")).toBeInTheDocument();

    const control = screen.getByTestId("survey-range-filter");
    fireEvent.click(within(control).getByRole("radio", { name: /7 days/i }));

    expect(
      within(survey).getByText(/1 anonymous responses collected/i),
    ).toBeInTheDocument();
    expect(screen.getByText("recent@example.com")).toBeInTheDocument();
    expect(screen.queryByText("old@example.com")).not.toBeInTheDocument();
  });

  it("shows everything under 'All time' regardless of age", () => {
    const data: DashboardData = {
      responses: [],
      leads: [],
      surveyResponses: [
        getMockSurveyResponse({ createdAt: "2020-01-01T12:00:00.000Z" }),
        getMockSurveyResponse({ createdAt: "2026-05-30T12:00:00.000Z" }),
      ],
      surveyTrialRequests: [
        getMockTrialRequest({
          email: "ancient@example.com",
          createdAt: "2020-01-01T12:00:00.000Z",
        }),
      ],
    };

    renderDashboard(data, NOW);

    const control = screen.getByTestId("survey-range-filter");
    fireEvent.click(within(control).getByRole("radio", { name: /all time/i }));

    const survey = screen.getByTestId("dashboard-survey");
    expect(
      within(survey).getByText(/2 anonymous responses collected/i),
    ).toBeInTheDocument();
    expect(screen.getByText("ancient@example.com")).toBeInTheDocument();
  });
});
