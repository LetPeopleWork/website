import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseDashboardRepository } from "./supabaseDashboardRepository";

const SKIP_REASON =
  "@real-io: un-skip with live Supabase creds (SUPABASE_URL, SUPABASE_ANON_KEY, plus TEAM_MEMBER_EMAIL/TEAM_MEMBER_PASSWORD for benjamin@letpeople.work or peter@letpeople.work) against project tkkghzcpwefwrgacgvdv";

const anonClient = () =>
  createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
  );

const signedInClient = async () => {
  const client = anonClient();
  await client.auth.signInWithPassword({
    email: process.env.TEAM_MEMBER_EMAIL ?? "",
    password: process.env.TEAM_MEMBER_PASSWORD ?? "",
  });
  return client;
};

describe.skip(`Admin dashboard security boundaries against live Supabase — ${SKIP_REASON}`, () => {
  it("an unauthenticated SELECT on responses returns nothing", async () => {
    const { data } = await anonClient().from("responses").select("*");
    expect(data ?? []).toHaveLength(0);
  });

  it("an unauthenticated SELECT on leads returns nothing", async () => {
    const { data } = await anonClient().from("leads").select("*");
    expect(data ?? []).toHaveLength(0);
  });

  it("a signed-in team member can read responses and leads", async () => {
    const repository = createSupabaseDashboardRepository(await signedInClient());
    const data = await repository.load("readiness-assessment");
    expect(Array.isArray(data.responses)).toBe(true);
    expect(Array.isArray(data.leads)).toBe(true);
  });
});
