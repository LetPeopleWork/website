import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Guard: no unit test may talk to the production Supabase project. The page
// components fall back to real adapters when no fake is injected, and that
// filled the admin dashboard with "visitor@example.com" test rows on every
// CI run. The call is blocked, and because the pages swallow capture errors
// (degrade-open), the guard also fails the test afterwards so it is noticed.
const PRODUCTION_SUPABASE_HOST = "tkkghzcpwefwrgacgvdv.supabase.co";
const blockedCalls: string[] = [];
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (url.includes(PRODUCTION_SUPABASE_HOST)) {
    blockedCalls.push(url);
    return Promise.reject(
      new Error(`Blocked test call to production Supabase: ${url}`),
    );
  }
  return realFetch(input, init);
};

afterEach(() => {
  if (blockedCalls.length === 0) return;
  const calls = blockedCalls.splice(0);
  throw new Error(
    `Test called production Supabase (${calls.join(", ")}). Inject a fake adapter.`,
  );
});
