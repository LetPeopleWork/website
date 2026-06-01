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

const rowFor = (email: string): HTMLElement => {
  const trialView = screen.getByTestId("dashboard-survey-trials");
  return within(trialView).getByText(email).closest("tr") as HTMLElement;
};

describe("Sent trial requests stay listed with a sent checkmark", () => {
  it("shows a sent indicator and no button for an already fulfilled request", () => {
    renderDashboard(
      [
        getMockTrialRequest({
          id: "done-1",
          email: "alreadysent@example.com",
          fulfilledAt: "2026-05-03T00:00:00.000Z",
        }),
      ],
      vi.fn().mockResolvedValue(undefined),
    );

    const row = rowFor("alreadysent@example.com");
    expect(within(row).getByLabelText("Sent")).toBeInTheDocument();
    expect(
      within(row).queryByRole("button", { name: /mark as sent/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the mark-as-sent button for an unfulfilled request", () => {
    renderDashboard(
      [getMockTrialRequest({ id: "active-1", email: "active@example.com" })],
      vi.fn().mockResolvedValue(undefined),
    );

    const row = rowFor("active@example.com");
    expect(
      within(row).getByRole("button", { name: /mark as sent/i }),
    ).toBeInTheDocument();
  });

  it("flips the clicked row to a sent indicator while keeping it listed", async () => {
    const onMarkTrialFulfilled = vi.fn().mockResolvedValue(undefined);
    renderDashboard(
      [getMockTrialRequest({ id: "active-1", email: "active@example.com" })],
      onMarkTrialFulfilled,
    );

    await userEvent.click(
      within(rowFor("active@example.com")).getByRole("button", {
        name: /mark as sent/i,
      }),
    );

    expect(onMarkTrialFulfilled).toHaveBeenCalledWith("active-1");
    await waitFor(() => {
      const row = rowFor("active@example.com");
      expect(within(row).getByLabelText("Sent")).toBeInTheDocument();
      expect(
        within(row).queryByRole("button", { name: /mark as sent/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("keeps the row unfulfilled with an error when the update fails", async () => {
    const onMarkTrialFulfilled = vi
      .fn()
      .mockRejectedValue(new Error("update failed"));
    renderDashboard(
      [getMockTrialRequest({ id: "active-1", email: "active@example.com" })],
      onMarkTrialFulfilled,
    );

    const trialView = screen.getByTestId("dashboard-survey-trials");
    await userEvent.click(
      within(rowFor("active@example.com")).getByRole("button", {
        name: /mark as sent/i,
      }),
    );

    expect(await within(trialView).findByRole("alert")).toBeInTheDocument();
    const row = rowFor("active@example.com");
    expect(
      within(row).getByRole("button", { name: /mark as sent/i }),
    ).toBeInTheDocument();
  });
});
