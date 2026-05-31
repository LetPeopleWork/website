import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AdminDashboard } from "../assessment/components/AdminDashboard";
import { summarizeDashboard } from "../assessment/core/dashboardSummary";
import { summarizeSurvey } from "./core/summarizeSurvey";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type {
  DashboardData,
  DashboardRepository,
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
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockTrialRequest = (
  overrides: Partial<DashboardSurveyTrialRequest> = {},
): DashboardSurveyTrialRequest => ({
  source: "user-survey-trial",
  email: "volunteer@example.com",
  createdAt: "2026-05-02T00:00:00.000Z",
  ...overrides,
});

const inMemoryRepository = (data: DashboardData): DashboardRepository => ({
  load: () => Promise.resolve(data),
});

const renderSurveyView = async (repository: DashboardRepository) => {
  const data = await repository.load("user-survey");
  render(
    <AdminDashboard
      summary={summarizeDashboard(data, "user-survey")}
      surveySummary={summarizeSurvey(data)}
      surveyTrialRequests={data.surveyTrialRequests}
      onSignOut={() => undefined}
    />,
  );
};

describe("Maintainer trial-requests view on the internal dashboard (US-05, slice-03)", () => {
  it("lists trial requests with their volunteered emails in a section separate from the anonymous tallies", async () => {
    const repository = inMemoryRepository({
      responses: [],
      leads: [],
      surveyResponses: [getMockSurveyResponse(), getMockSurveyResponse()],
      surveyTrialRequests: [
        getMockTrialRequest({ email: "first@example.com" }),
        getMockTrialRequest({ email: "second@example.com" }),
      ],
    });

    await renderSurveyView(repository);

    const trialView = await screen.findByTestId("dashboard-survey-trials");
    expect(within(trialView).getByText("first@example.com")).toBeInTheDocument();
    expect(within(trialView).getByText("second@example.com")).toBeInTheDocument();

    const tallyView = screen.getByTestId("dashboard-survey");
    expect(within(tallyView).queryByText(/@/)).not.toBeInTheDocument();
    expect(tallyView.contains(trialView)).toBe(false);
  });

  it("shows no emails when there are no trial requests", async () => {
    const repository = inMemoryRepository({
      responses: [],
      leads: [],
      surveyResponses: [getMockSurveyResponse()],
      surveyTrialRequests: [],
    });

    await renderSurveyView(repository);

    const trialView = await screen.findByTestId("dashboard-survey-trials");
    expect(within(trialView).queryByText(/@/)).not.toBeInTheDocument();
  });
});
