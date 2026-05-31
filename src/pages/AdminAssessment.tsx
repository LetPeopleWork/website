import { useCallback, useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { AdminDashboard } from "@/features/assessment/components/AdminDashboard";
import { AdminLoginForm } from "@/features/assessment/components/AdminLoginForm";
import {
  summarizeDashboard,
  type DashboardSummary,
} from "@/features/assessment/core/dashboardSummary";
import { createSupabaseAuthGateway } from "@/features/assessment/adapters/supabaseAuthGateway";
import { createSupabaseDashboardRepository } from "@/features/assessment/adapters/supabaseDashboardRepository";
import type {
  AuthGateway,
  AuthSession,
  DashboardRepository,
  DashboardSurveyResponse,
  DashboardSurveyTrialRequest,
} from "@/features/assessment/ports";

interface AdminAssessmentProps {
  authGateway?: AuthGateway;
  dashboardRepository?: DashboardRepository;
}

const DASHBOARD_SOURCE = "readiness-assessment" as const;
const SURVEY_SOURCE = "user-survey" as const;

const AdminAssessment = ({
  authGateway,
  dashboardRepository,
}: AdminAssessmentProps) => {
  const auth = useMemo(
    () => authGateway ?? createSupabaseAuthGateway(),
    [authGateway],
  );
  const repository = useMemo(
    () => dashboardRepository ?? createSupabaseDashboardRepository(),
    [dashboardRepository],
  );

  const [session, setSession] = useState<AuthSession | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<
    readonly DashboardSurveyResponse[]
  >([]);
  const [surveyTrialRequests, setSurveyTrialRequests] = useState<
    readonly DashboardSurveyTrialRequest[]
  >([]);
  const now = useMemo(() => new Date().toISOString(), []);

  const reloadSurvey = useCallback(async () => {
    const data = await repository.load(SURVEY_SOURCE);
    setSurveyResponses(data.surveyResponses);
    setSurveyTrialRequests(data.surveyTrialRequests ?? []);
  }, [repository]);

  const handleMarkTrialFulfilled = useCallback(
    async (id: string) => {
      await repository.markTrialFulfilled(id);
      await reloadSurvey();
    },
    [repository, reloadSurvey],
  );

  useEffect(() => {
    let active = true;
    void auth.currentSession().then((current) => {
      if (active) {
        setSession(current);
      }
    });
    const unsubscribe = auth.onChange((next) => {
      if (active) {
        setSession(next);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (!session) {
      return;
    }
    let active = true;
    void repository.load(DASHBOARD_SOURCE).then((data) => {
      if (active) {
        setSummary(summarizeDashboard(data, DASHBOARD_SOURCE));
      }
    });
    void repository.load(SURVEY_SOURCE).then((data) => {
      if (active) {
        setSurveyResponses(data.surveyResponses);
        setSurveyTrialRequests(data.surveyTrialRequests ?? []);
      }
    });
    return () => {
      active = false;
    };
  }, [session, repository]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <SEO
        title="Admin dashboard"
        description="Internal admin dashboard for forecasting readiness assessment and survey results."
      />
      {session && summary ? (
        <AdminDashboard
          summary={summary}
          surveyResponses={surveyResponses}
          surveyTrialRequests={surveyTrialRequests}
          now={now}
          onSignOut={() => void auth.signOut()}
          onMarkTrialFulfilled={handleMarkTrialFulfilled}
        />
      ) : session ? null : (
        <AdminLoginForm onSignIn={auth.signIn} />
      )}
    </main>
  );
};

export default AdminAssessment;
