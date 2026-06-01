import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AdminAssessment from "@/pages/AdminAssessment";
import type {
  AuthGateway,
  AuthSession,
  DashboardData,
  DashboardLead,
  DashboardRepository,
  DashboardResponse,
  DashboardSurveyResponse,
  DashboardSurveyTrialRequest,
  SignInResult,
} from "@/features/assessment/ports";
import { getMockSurveyAnswers } from "@/features/survey/core/answers";

const getMockResponse = (
  overrides: Partial<DashboardResponse> = {},
): DashboardResponse => ({
  source: "readiness-assessment",
  band: "Flow-aware",
  score: 60,
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockLead = (overrides: Partial<DashboardLead> = {}): DashboardLead => ({
  source: "readiness-assessment",
  email: "lead@example.com",
  band: "Flow-aware",
  score: 60,
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockData = (overrides: Partial<DashboardData> = {}): DashboardData => ({
  responses: [getMockResponse()],
  leads: [getMockLead()],
  ...overrides,
});

interface FakeAuthOptions {
  initialSession?: AuthSession | null;
  signInResult?: SignInResult;
}

const getFakeAuthGateway = (options: FakeAuthOptions = {}): AuthGateway => {
  let session = options.initialSession ?? null;
  let listener: ((next: AuthSession | null) => void) | null = null;
  return {
    async currentSession() {
      return session;
    },
    async signIn(email) {
      const result =
        options.signInResult ??
        ({ ok: true, session: { email } } as SignInResult);
      if (result.ok) {
        session = result.session;
        listener?.(session);
      }
      return result;
    },
    async signOut() {
      session = null;
      listener?.(null);
    },
    onChange(callback) {
      listener = callback;
      return () => {
        listener = null;
      };
    },
  };
};

const getMockSurveyResponse = (
  overrides: Partial<DashboardSurveyResponse> = {},
): DashboardSurveyResponse => ({
  source: "user-survey",
  answers: getMockSurveyAnswers(),
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockTrialRequest = (
  overrides: Partial<DashboardSurveyTrialRequest> = {},
): DashboardSurveyTrialRequest => ({
  id: "11111111-1111-1111-1111-111111111111",
  source: "user-survey-trial",
  email: "trial@example.com",
  createdAt: "2026-05-01T00:00:00.000Z",
  fulfilledAt: null,
  ...overrides,
});

const getFakeDashboardRepository = (
  data: DashboardData,
): DashboardRepository => ({
  async load(source) {
    return {
      responses: data.responses.filter((r) => r.source === source),
      leads: data.leads.filter((l) => l.source === source),
      surveyResponses: (data.surveyResponses ?? []).filter(
        () => source === "user-survey",
      ),
      surveyTrialRequests: (data.surveyTrialRequests ?? []).filter(
        () => source === "user-survey",
      ),
    };
  },
  markTrialFulfilled: () => Promise.resolve(),
});

const renderDashboard = (
  authGateway: AuthGateway,
  dashboardRepository: DashboardRepository,
) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/admin/assessment"]}>
        <AdminAssessment
          authGateway={authGateway}
          dashboardRepository={dashboardRepository}
        />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Admin assessment dashboard", () => {
  it("summarizes captured results for a signed-in team member", async () => {
    const data = getMockData({
      responses: [
        getMockResponse({ band: "Flying blind" }),
        getMockResponse({ band: "Predictable" }),
        getMockResponse({ band: "Predictable" }),
      ],
      leads: [
        getMockLead({ email: "ada@example.com", band: "Predictable", score: 90 }),
      ],
    });
    const authGateway = getFakeAuthGateway({
      initialSession: { email: "benjamin@letpeople.work" },
    });

    renderDashboard(authGateway, getFakeDashboardRepository(data));

    const totals = await screen.findByTestId("dashboard-totals");
    expect(within(totals).getByText(/3/)).toBeInTheDocument();
    expect(within(totals).getByText(/1/)).toBeInTheDocument();

    const distribution = screen.getByTestId("dashboard-bands");
    expect(within(distribution).getByText(/Predictable/)).toBeInTheDocument();

    const leadsTable = screen.getByTestId("dashboard-leads");
    expect(within(leadsTable).getByText("ada@example.com")).toBeInTheDocument();
  });

  it("surfaces the survey view alongside the assessment for a signed-in member", async () => {
    const recent = new Date().toISOString();
    const data: DashboardData = {
      responses: [getMockResponse({ band: "Predictable" })],
      leads: [getMockLead({ email: "assessment-lead@example.com" })],
      surveyResponses: [
        getMockSurveyResponse({
          createdAt: recent,
          answers: getMockSurveyAnswers({ role: "other" }),
        }),
        getMockSurveyResponse({ createdAt: recent }),
      ],
      surveyTrialRequests: [
        getMockTrialRequest({ email: "wants-trial@example.com", createdAt: recent }),
      ],
    };
    const authGateway = getFakeAuthGateway({
      initialSession: { email: "benjamin@letpeople.work" },
    });

    renderDashboard(authGateway, getFakeDashboardRepository(data));

    const surveyView = await screen.findByTestId("dashboard-survey");
    expect(
      within(surveyView).getByText(/anonymous responses collected/i),
    ).toHaveTextContent("2 anonymous responses collected");
    expect(
      within(surveyView).getByTestId("dashboard-survey-charts"),
    ).toBeInTheDocument();
    expect(within(surveyView).queryByRole("table")).not.toBeInTheDocument();

    const trials = screen.getByTestId("dashboard-survey-trials");
    expect(
      within(trials).getByText("wants-trial@example.com"),
    ).toBeInTheDocument();

    const leadsTable = screen.getByTestId("dashboard-leads");
    expect(
      within(leadsTable).getByText("assessment-lead@example.com"),
    ).toBeInTheDocument();
  });

  it("counts and lists only readiness-assessment responses", async () => {
    const data: DashboardData = {
      responses: [
        getMockResponse({ source: "readiness-assessment" }),
        getMockResponse({ source: "other-survey" as never }),
      ],
      leads: [
        getMockLead({ source: "readiness-assessment", email: "keep@example.com" }),
        getMockLead({ source: "other-survey" as never, email: "drop@example.com" }),
      ],
    };
    const authGateway = getFakeAuthGateway({
      initialSession: { email: "benjamin@letpeople.work" },
    });

    renderDashboard(authGateway, getFakeDashboardRepository(data));

    const totals = await screen.findByTestId("dashboard-totals");
    expect(within(totals).getAllByText("1")).toHaveLength(2);

    const leadsTable = screen.getByTestId("dashboard-leads");
    expect(within(leadsTable).getByText("keep@example.com")).toBeInTheDocument();
    expect(
      within(leadsTable).queryByText("drop@example.com"),
    ).not.toBeInTheDocument();
  });

  it("denies a visitor who is not signed in and shows no lead information", async () => {
    const data = getMockData({
      leads: [getMockLead({ email: "secret@example.com" })],
    });
    const authGateway = getFakeAuthGateway({ initialSession: null });

    renderDashboard(authGateway, getFakeDashboardRepository(data));

    expect(
      await screen.findByLabelText(/email/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByText("secret@example.com")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-leads")).not.toBeInTheDocument();
  });

  it("signs a member in through the login form and then reveals the dashboard", async () => {
    const user = userEvent.setup();
    const data = getMockData({
      leads: [getMockLead({ email: "after-login@example.com" })],
    });
    const authGateway = getFakeAuthGateway({ initialSession: null });

    renderDashboard(authGateway, getFakeDashboardRepository(data));

    await user.type(
      await screen.findByLabelText(/email/i),
      "benjamin@letpeople.work",
    );
    await user.type(screen.getByLabelText(/password/i), "correct-horse");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const leadsTable = await screen.findByTestId("dashboard-leads");
    expect(
      within(leadsTable).getByText("after-login@example.com"),
    ).toBeInTheDocument();
  });

  it("shows an error when sign-in fails and keeps data hidden", async () => {
    const user = userEvent.setup();
    const authGateway = getFakeAuthGateway({
      initialSession: null,
      signInResult: { ok: false, error: "Invalid login credentials" },
    });

    renderDashboard(authGateway, getFakeDashboardRepository(getMockData()));

    await user.type(await screen.findByLabelText(/email/i), "nope@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid login credentials/i,
    );
    expect(screen.queryByTestId("dashboard-leads")).not.toBeInTheDocument();
  });

  it("signs a member out and returns to the login form", async () => {
    const user = userEvent.setup();
    const authGateway = getFakeAuthGateway({
      initialSession: { email: "benjamin@letpeople.work" },
    });

    renderDashboard(authGateway, getFakeDashboardRepository(getMockData()));

    await user.click(await screen.findByRole("button", { name: /sign out/i }));

    expect(await screen.findByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-leads")).not.toBeInTheDocument();
  });
});
