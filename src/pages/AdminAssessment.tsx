import { useEffect, useMemo, useState } from "react";
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
} from "@/features/assessment/ports";

interface AdminAssessmentProps {
  authGateway?: AuthGateway;
  dashboardRepository?: DashboardRepository;
}

const DASHBOARD_SOURCE = "readiness-assessment" as const;

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
    return () => {
      active = false;
    };
  }, [session, repository]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <SEO
        title="Assessment results"
        description="Internal forecasting readiness assessment results."
      />
      {session && summary ? (
        <AdminDashboard summary={summary} onSignOut={() => void auth.signOut()} />
      ) : session ? null : (
        <AdminLoginForm onSignIn={auth.signIn} />
      )}
    </main>
  );
};

export default AdminAssessment;
