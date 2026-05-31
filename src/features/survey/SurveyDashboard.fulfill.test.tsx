import { describe, it, expect, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDashboard } from "../assessment/components/AdminDashboard";
import { summarizeDashboard } from "../assessment/core/dashboardSummary";
import type {
  DashboardData,
  DashboardSurveyTrialRequest,
} from "../assessment/ports";

const getMockTrialRequest = (
  overrides: Partial<DashboardSurveyTrialRequest> = {},
): DashboardSurveyTrialRequest => ({
  id: "11111111-1111-1111-1111-111111111111",
  source: "user-survey-trial",
  email: "volunteer@example.com",
  createdAt: "2026-05-02T00:00:00.000Z",
  fulfilledAt: null,
  ...overrides,
});

const renderDashboard = (
  trialRequests: readonly DashboardSurveyTrialRequest[],
  onMarkTrialFulfilled: (id: string) => Promise<void>,
) => {
  const data: DashboardData = {
    responses: [],
    leads: [],
    surveyResponses: [],
    surveyTrialRequests: trialRequests,
  };
  render(
    <AdminDashboard
      summary={summarizeDashboard(data, "user-survey")}
      surveyTrialRequests={trialRequests}
      onMarkTrialFulfilled={onMarkTrialFulfilled}
      onSignOut={() => undefined}
    />,
  );
};

describe("Maintainer marks a trial request as sent and it clears from the active list", () => {
  it("shows only unfulfilled trial requests in the active list", () => {
    renderDashboard(
      [
        getMockTrialRequest({ id: "active-1", email: "active@example.com" }),
        getMockTrialRequest({
          id: "done-1",
          email: "alreadysent@example.com",
          fulfilledAt: "2026-05-03T00:00:00.000Z",
        }),
      ],
      vi.fn().mockResolvedValue(undefined),
    );

    const trialView = screen.getByTestId("dashboard-survey-trials");
    expect(
      within(trialView).getByText("active@example.com"),
    ).toBeInTheDocument();
    expect(
      within(trialView).queryByText("alreadysent@example.com"),
    ).not.toBeInTheDocument();
  });

  it("calls the callback with the request id and removes the row on success", async () => {
    const onMarkTrialFulfilled = vi.fn().mockResolvedValue(undefined);
    renderDashboard(
      [getMockTrialRequest({ id: "active-1", email: "active@example.com" })],
      onMarkTrialFulfilled,
    );

    const trialView = screen.getByTestId("dashboard-survey-trials");
    await userEvent.click(
      within(trialView).getByRole("button", { name: /mark as sent/i }),
    );

    expect(onMarkTrialFulfilled).toHaveBeenCalledWith("active-1");
    await waitFor(() => {
      expect(
        within(trialView).queryByText("active@example.com"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows a non-blocking error and keeps the row when the update fails", async () => {
    const onMarkTrialFulfilled = vi
      .fn()
      .mockRejectedValue(new Error("update failed"));
    renderDashboard(
      [getMockTrialRequest({ id: "active-1", email: "active@example.com" })],
      onMarkTrialFulfilled,
    );

    const trialView = screen.getByTestId("dashboard-survey-trials");
    await userEvent.click(
      within(trialView).getByRole("button", { name: /mark as sent/i }),
    );

    expect(await within(trialView).findByRole("alert")).toBeInTheDocument();
    expect(
      within(trialView).getByText("active@example.com"),
    ).toBeInTheDocument();
  });
});
