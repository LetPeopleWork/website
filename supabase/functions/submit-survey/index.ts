import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { readMailgunConfig, sendViaMailgun } from "../../_shared/mailgun.ts";
import {
  TEAM_NOTIFICATION_RECIPIENT,
  notifyTeamDegradeOpen,
  renderSurveyNotificationEmail,
} from "../../_shared/surveyNotificationEmail.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SURVEY_SOURCE = "user-survey";

interface SurveyPayload {
  source: string;
  answers: Record<string, string>;
}

const isStringMap = (value: unknown): value is Record<string, string> => {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value).every((entry) => typeof entry === "string");
};

const carriesScoreOrBand = (candidate: Record<string, unknown>): boolean =>
  "score" in candidate || "band" in candidate || "raw_sum" in candidate;

const parsePayload = (body: unknown): SurveyPayload | null => {
  if (typeof body !== "object" || body === null) return null;
  const candidate = body as Record<string, unknown>;
  if (candidate.source !== SURVEY_SOURCE) return null;
  if (carriesScoreOrBand(candidate)) return null;
  if (!isStringMap(candidate.answers)) return null;
  return { source: SURVEY_SOURCE, answers: candidate.answers };
};

const refuse = (reason: string) =>
  new Response(JSON.stringify({ error: reason }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 400,
  });

const notifyTeam = (payload: SurveyPayload): Promise<void> =>
  notifyTeamDegradeOpen(async () => {
    const config = readMailgunConfig((key) => Deno.env.get(key));
    if (!config) return;
    const email = renderSurveyNotificationEmail({ answers: payload.answers });
    await sendViaMailgun(config, {
      to: TEAM_NOTIFICATION_RECIPIENT,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = parsePayload(await req.json());
    if (!payload) return refuse("Invalid survey payload");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.from("responses").insert({
      source: payload.source,
      kind: null,
      answers: payload.answers,
      raw_sum: null,
      score: null,
      band: null,
    });
    if (error) throw new Error(error.message);

    await notifyTeam(payload);

    return new Response(JSON.stringify({ recorded: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in submit-survey:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
