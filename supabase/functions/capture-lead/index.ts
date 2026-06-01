import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { bandMatchesScore, bandOfScore } from "../../_shared/bands.ts";
import {
  REPLY_TO_ADDRESS,
  renderResultsEmail,
} from "../../_shared/resultsEmail.ts";
import { readMailgunConfig, sendViaMailgun } from "../../_shared/mailgun.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const KNOWN_SOURCES = ["readiness-assessment"];

interface LeadPayload {
  source: string;
  email: string;
  score: number;
  band: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePayload = (body: unknown): LeadPayload | null => {
  if (typeof body !== "object" || body === null) return null;
  const candidate = body as Record<string, unknown>;
  const source = candidate.source;
  const email = candidate.email;
  const score = candidate.score;
  const band = candidate.band;
  if (typeof source !== "string" || !KNOWN_SOURCES.includes(source)) return null;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) return null;
  if (typeof score !== "number" || !Number.isInteger(score)) return null;
  if (typeof band !== "string" || band.length === 0) return null;
  return {
    source,
    email,
    score,
    band,
  };
};

const refuse = (reason: string) =>
  new Response(JSON.stringify({ error: reason }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 400,
  });

const sendResultsEmail = async (payload: LeadPayload): Promise<void> => {
  try {
    const config = readMailgunConfig((key) => Deno.env.get(key));
    if (!config) return;
    const band = bandOfScore(payload.score);
    if (!band) return;
    const email = renderResultsEmail(band, { score: payload.score });
    await sendViaMailgun(config, {
      to: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: REPLY_TO_ADDRESS,
    });
  } catch (error) {
    console.error("Results email send failed (lead still captured):", error);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = parsePayload(await req.json());
    if (!payload) return refuse("Invalid lead payload");

    if (!bandMatchesScore(payload.score, payload.band)) {
      return refuse("Score and band do not match");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.from("leads").insert({
      source: payload.source,
      email: payload.email,
      score: payload.score,
      band: payload.band,
      wants_trial: false,
    });
    if (error) throw new Error(error.message);

    await sendResultsEmail(payload);

    return new Response(JSON.stringify({ recorded: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in capture-lead:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
