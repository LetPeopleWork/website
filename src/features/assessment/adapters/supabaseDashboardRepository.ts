import { supabase } from "@/integrations/supabase/client";
import type {
  DashboardData,
  DashboardLead,
  DashboardRepository,
  DashboardResponse,
  ResponseSource,
} from "../ports";
import type { BandName } from "../core/scoring";

const RESPONSES_TABLE = "responses";
const LEADS_TABLE = "leads";

interface ResponseRow {
  source: string;
  band: string;
  score: number;
  created_at: string;
}

interface LeadRow {
  source: string;
  email: string;
  band: string;
  score: number;
  created_at: string;
}

const toResponse = (row: ResponseRow): DashboardResponse => ({
  source: row.source as ResponseSource,
  band: row.band as BandName,
  score: row.score,
  createdAt: row.created_at,
});

const toLead = (row: LeadRow): DashboardLead => ({
  source: row.source as ResponseSource,
  email: row.email,
  band: row.band as BandName,
  score: row.score,
  createdAt: row.created_at,
});

export const createSupabaseDashboardRepository = (
  client = supabase,
): DashboardRepository => ({
  async load(source: ResponseSource): Promise<DashboardData> {
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
    };
  },
});
