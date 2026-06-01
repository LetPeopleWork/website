import { supabase } from "@/integrations/supabase/client";
import type {
  DashboardData,
  DashboardLead,
  DashboardRepository,
  DashboardResponse,
  DashboardSurveyResponse,
  DashboardSurveyTrialRequest,
  ResponseSource,
  SurveyAnswers,
} from "../ports";
import type { BandName } from "../core/scoring";

const RESPONSES_TABLE = "responses";
const LEADS_TABLE = "leads";

const SURVEY_SOURCE: ResponseSource = "user-survey";
const SURVEY_TRIAL_SOURCE: ResponseSource = "user-survey-trial";

interface ResponseRow {
  source: string;
  band: string;
  score: number;
  created_at: string;
}

interface SurveyResponseRow {
  source: string;
  answers: SurveyAnswers;
  created_at: string;
}

interface LeadRow {
  source: string;
  email: string;
  band: string;
  score: number;
  created_at: string;
}

interface TrialLeadRow {
  id: string;
  source: string;
  email: string;
  organization: string | null;
  created_at: string;
  fulfilled_at: string | null;
}

const toResponse = (row: ResponseRow): DashboardResponse => ({
  source: row.source as ResponseSource,
  band: row.band as BandName,
  score: row.score,
  createdAt: row.created_at,
});

const toSurveyResponse = (row: SurveyResponseRow): DashboardSurveyResponse => ({
  source: row.source as ResponseSource,
  answers: row.answers ?? {},
  createdAt: row.created_at,
});

const toLead = (row: LeadRow): DashboardLead => ({
  source: row.source as ResponseSource,
  email: row.email,
  band: row.band as BandName,
  score: row.score,
  createdAt: row.created_at,
});

const toTrialRequest = (row: TrialLeadRow): DashboardSurveyTrialRequest => ({
  id: row.id,
  source: row.source as ResponseSource,
  email: row.email,
  organization: row.organization ?? null,
  createdAt: row.created_at,
  fulfilledAt: row.fulfilled_at ?? null,
});

export const createSupabaseDashboardRepository = (
  client = supabase,
): DashboardRepository => ({
  async load(source: ResponseSource): Promise<DashboardData> {
    if (source === SURVEY_SOURCE) {
      const surveyQuery = await client
        .from(RESPONSES_TABLE)
        .select("source,answers,created_at")
        .eq("source", source);
      if (surveyQuery.error) {
        throw new Error(surveyQuery.error.message);
      }
      const trialQuery = await client
        .from(LEADS_TABLE)
        .select("id,source,email,organization,created_at,fulfilled_at")
        .eq("source", SURVEY_TRIAL_SOURCE);
      if (trialQuery.error) {
        throw new Error(trialQuery.error.message);
      }
      return {
        responses: [],
        leads: [],
        surveyResponses: (surveyQuery.data ?? []).map((row) =>
          toSurveyResponse(row as SurveyResponseRow),
        ),
        surveyTrialRequests: (trialQuery.data ?? []).map((row) =>
          toTrialRequest(row as TrialLeadRow),
        ),
      };
    }

    const responsesQuery = await client
      .from(RESPONSES_TABLE)
      .select("source,band,score,created_at")
      .eq("source", source);
    if (responsesQuery.error) {
      throw new Error(responsesQuery.error.message);
    }

    const leadsQuery = await client
      .from(LEADS_TABLE)
      .select("source,email,band,score,created_at")
      .eq("source", source);
    if (leadsQuery.error) {
      throw new Error(leadsQuery.error.message);
    }

    return {
      responses: (responsesQuery.data ?? []).map((row) =>
        toResponse(row as ResponseRow),
      ),
      leads: (leadsQuery.data ?? []).map((row) => toLead(row as LeadRow)),
      surveyResponses: [],
    };
  },

  async markTrialFulfilled(id: string): Promise<void> {
    const { error } = await client
      .from(LEADS_TABLE)
      .update({ fulfilled_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  },
});
