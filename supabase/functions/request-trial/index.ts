import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { readMailgunConfig, sendViaMailgun } from "../../_shared/mailgun.ts";
import {
  TEAM_NOTIFICATION_RECIPIENT,
  notifyTeamDegradeOpen,
} from "../../_shared/surveyNotificationEmail.ts";

// 30-day Self-Service trial requests from the Lighthouse page.
//
// Deliberately its own function rather than a variant of submit-survey: that
// one couples a trial to survey answers, and a pricing-page visitor has no
// answers to give. Fulfilment stays manual - the request lands in the leads
// table and shows up in the admin dashboard's "Trial requests" card, where a
// human sends the license and marks it as sent.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TRIAL_LEAD_SOURCE = "lighthouse-trial";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TrialRequest {
  readonly email: string;
  readonly organization: string;
}

const parsePayload = (body: unknown): TrialRequest | null => {
  if (typeof body !== "object" || body === null) return null;
  const candidate = body as Record<string, unknown>;

  const email = candidate.email;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return null;
  }

  // Organization is required, same as the survey's trial opt-in: a trial
  // license is issued to an organization, and it is the one thing needed to
  // qualify the request.
  const organization = candidate.organization;
  if (typeof organization !== "string" || organization.trim().length === 0) {
    return null;
  }

  return {
    email: email.trim(),
    organization: organization.trim(),
  };
};

const notifyTeam = (request: TrialRequest): Promise<void> =>
  notifyTeamDegradeOpen(async () => {
    const config = readMailgunConfig((key) => Deno.env.get(key));
    if (!config) return;
    const lines = [
      "New 30-day Self-Service trial request from the Lighthouse page.",
      "",
      `Email: ${request.email}`,
      `Organization: ${request.organization}`,
      "",
      "Send the license and mark it as sent in the admin dashboard:",
      "https://letpeople.work/admin/dashboard",
    ];
    await sendViaMailgun(config, {
      to: TEAM_NOTIFICATION_RECIPIENT,
      subject: "Lighthouse trial request",
      text: lines.join("\n"),
      html: `<pre>${lines.join("\n")}</pre>`,
    });
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request = parsePayload(await req.json());
    if (!request) {
      return new Response(JSON.stringify({ error: "Invalid trial request" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.from("leads").insert({
      source: TRIAL_LEAD_SOURCE,
      email: request.email,
      organization: request.organization,
      score: null,
      band: null,
      wants_trial: true,
    });
    if (error) throw new Error(error.message);

    await notifyTeam(request);

    return new Response(JSON.stringify({ recorded: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in request-trial:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
