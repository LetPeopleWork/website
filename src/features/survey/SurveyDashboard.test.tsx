import { describe, it, expect } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { AdminDashboard } from "../assessment/components/AdminDashboard";
import { summarizeDashboard } from "../assessment/core/dashboardSummary";
import { summarizeSurvey } from "./core/summarizeSurvey";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type {
  DashboardData,
  DashboardRepository,
  DashboardSurveyResponse,
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
  it("lists the responses with per-question tallies, all anonymous", async () => {
    const repository = inMemoryRepository({
      responses: [],
      leads: [],
      surveyResponses: [
        getMockSurveyResponse(),
        getMockSurveyResponse({
          answers: {
            ...allFirstOptions(),
            [SURVEY_QUESTIONS[0].id]: SURVEY_QUESTIONS[0].options[1].id,
          },
        }),
      ],
    });

    await renderSurveyView(repository);

    const surveyView = await screen.findByTestId("dashboard-survey");
    expect(
      within(surveyView).getByText(/2 anonymous responses collected/i),
    ).toBeInTheDocument();
    expect(
      within(surveyView).getByText(SURVEY_QUESTIONS[0].prompt),
    ).toBeInTheDocument();

    const firstOptionRow = within(surveyView)
      .getByText(SURVEY_QUESTIONS[0].options[0].label)
      .closest("tr");
    const secondOptionRow = within(surveyView)
      .getByText(SURVEY_QUESTIONS[0].options[1].label)
      .closest("tr");
    expect(firstOptionRow).not.toBeNull();
    expect(secondOptionRow).not.toBeNull();
    expect(within(firstOptionRow as HTMLElement).getByText("1")).toBeInTheDocument();
    expect(within(secondOptionRow as HTMLElement).getByText("1")).toBeInTheDocument();
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
