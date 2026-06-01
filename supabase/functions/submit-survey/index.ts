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
const TRIAL_LEAD_SOURCE = "user-survey-trial";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TrialOptIn {
  readonly email: string;
  readonly organization: string;
}

type AnswerValue = string | readonly string[];

interface SurveyPayload {
  source: string;
  answers: Record<string, AnswerValue>;
  trial: TrialOptIn | null;
}

const isAnswerValue = (entry: unknown): entry is AnswerValue =>
  typeof entry === "string" ||
  (Array.isArray(entry) && entry.every((item) => typeof item === "string"));

const isAnswerMap = (value: unknown): value is Record<string, AnswerValue> => {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value).every(isAnswerValue);
};

const carriesScoreOrBand = (candidate: Record<string, unknown>): boolean =>
  "score" in candidate || "band" in candidate || "raw_sum" in candidate;

const parseTrial = (
  candidate: Record<string, unknown>,
): TrialOptIn | null | false => {
  if (candidate.wantsTrial !== true) return null;
  const email = candidate.email;
  const organization = candidate.organization;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) return false;
  if (typeof organization !== "string" || organization.trim().length === 0) {
    return false;
  }
  return { email, organization };
};

const parsePayload = (body: unknown): SurveyPayload | null => {
  if (typeof body !== "object" || body === null) return null;
  const candidate = body as Record<string, unknown>;
  if (candidate.source !== SURVEY_SOURCE) return null;
  if (carriesScoreOrBand(candidate)) return null;
  if (!isAnswerMap(candidate.answers)) return null;
  const trial = parseTrial(candidate);
  if (trial === false) return null;
  return { source: SURVEY_SOURCE, answers: candidate.answers, trial };
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
    const email = renderSurveyNotificationEmail({
      answers: payload.answers,
      trial: payload.trial,
    });
    await sendViaMailgun(config, {
      to: TEAM_NOTIFICATION_RECIPIENT,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  });

type SupabaseClient = ReturnType<typeof createClient>;

const insertTrialLead = async (
  supabase: SupabaseClient,
  trial: TrialOptIn,
): Promise<boolean> => {
  const { error } = await supabase.from("leads").insert({
    source: TRIAL_LEAD_SOURCE,
    email: trial.email,
    organization: trial.organization,
    score: null,
    band: null,
    wants_trial: true,
  });
  if (error) {
    console.error("Trial lead insert failed (response still recorded):", error);
    return false;
  }
  return true;
};

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

    const trialRecorded = payload.trial
      ? await insertTrialLead(supabase, payload.trial)
      : null;

    await notifyTeam(payload);

    return new Response(JSON.stringify({ recorded: true, trialRecorded }), {
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
