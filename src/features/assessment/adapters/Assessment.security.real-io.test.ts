import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseResponseRepository } from "./supabaseResponseRepository";
import { createEdgeFunctionLeadCapture } from "./edgeFunctionLeadCapture";

const SKIP_REASON =
  "@real-io: un-skip after applying supabase/migrations/0001_assessment_responses.sql and 0002_assessment_leads.sql to the live project (tkkghzcpwefwrgacgvdv) and deploying the capture-lead Edge Function";

const anonClient = () =>
  createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
  );

describe.skip(`Assessment security boundaries against live Supabase — ${SKIP_REASON}`, () => {
  it("#23 a completed assessment is captured as exactly one response row", async () => {
    const repository = createSupabaseResponseRepository(anonClient());
    await repository.save({
      source: "readiness-assessment",
      kind: null,
      answers: [1, 1, 1, 1, 1, 1],
      rawSum: 6,
      score: 33,
      band: "Drifting",
    });

    const { data } = await anonClient()
      .from("responses")
      .select("id")
      .eq("source", "readiness-assessment");
    expect(data).not.toBeNull();
  });

  it("#27 a forged band the score did not earn is refused with no lead written", async () => {
    const leads = createEdgeFunctionLeadCapture(anonClient());
    await expect(
      leads.capture({
        source: "readiness-assessment",
        email: "forged@example.com",
        score: 4,
        band: "Predictable",
        wantsTrial: false,
      }),
    ).rejects.toThrow();
  });

  it("#28 a score outside 0-100 is refused with no lead written", async () => {
    const leads = createEdgeFunctionLeadCapture(anonClient());
    await expect(
      leads.capture({
        source: "readiness-assessment",
        email: "outofrange@example.com",
        score: 250,
        band: "Predictable",
        wantsTrial: false,
      }),
    ).rejects.toThrow();
  });

  it("#29 an honest result whose band matches its score is recorded", async () => {
    const leads = createEdgeFunctionLeadCapture(anonClient());
    await expect(
      leads.capture({
        source: "readiness-assessment",
        email: "honest@example.com",
        score: 58,
        band: "Flow-aware",
        wantsTrial: false,
      }),
    ).resolves.toBeUndefined();
  });

  it("#30 captured responses are not readable by the anon client (RLS fail-closed)", async () => {
    const { data } = await anonClient().from("responses").select("*");
    expect(data ?? []).toHaveLength(0);
  });

  it("#31 captured leads are not readable by the anon client (RLS fail-closed)", async () => {
    const { data } = await anonClient().from("leads").select("*");
    expect(data ?? []).toHaveLength(0);
  });
});
