import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Lighthouse from "./Lighthouse";
import { PRICE_CUTOVER_INSTANT } from "@/lib/pricing";

// ADO #5563 — AC-1.1 to AC-1.4. The pricing section gates on the clock, so the future is only
// observable by faking it. This is the evidence that lets the change deploy a day early.
const CUTOVER = new Date(PRICE_CUTOVER_INSTANT);
const ONE_MINUTE_BEFORE = new Date(CUTOVER.getTime() - 60_000);

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

function renderPricingPageAt(instant: Date) {
  vi.setSystemTime(instant);

  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/lighthouse"]}>
        <Lighthouse />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

/** The Self-Service tier card, found via its own heading rather than a brittle DOM path. */
function selfServiceCard(): HTMLElement {
  const label = screen.getAllByText("Self-Service")[0];
  const card = label.closest("div.flex-col");
  if (!card) throw new Error("Self-Service tier card not found");
  return card as HTMLElement;
}

/**
 * The Self-Service Offer price as declared in a page's source.
 *
 * Read from source rather than from the rendered DOM on purpose: react-helmet-async 2.x mounts its tags
 * through a deferred callback that neither jsdom nor a static server render flushes, so the ld+json
 * block is unobservable from a test. The binding in the source is the thing that has to be right, and
 * it is exactly what regressed before this change — both pages had a hardcoded "2000" while the visible
 * card said CHF 999.
 */
function declaredOfferPriceBinding(page: "Lighthouse" | "Index"): string[] {
  const source = readFileSync(join(__dirname, `${page}.tsx`), "utf8");

  return Array.from(source.matchAll(/"?price"?:\s*([^,\n]+),/g)).map(([, value]) =>
    value.trim(),
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
  );
  // The page carries a carousel and scroll-reveal sections. Embla and useScrollReveal reach for three
  // browser APIs jsdom does not implement; none of them affect what price is rendered.
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Lighthouse pricing across the cutover", () => {
  it("AC-1.1 quotes CHF 999 one minute before the cutover", () => {
    renderPricingPageAt(ONE_MINUTE_BEFORE);

    expect(within(selfServiceCard()).getByText("CHF 999")).toBeInTheDocument();
  });

  it("AC-1.2 quotes CHF 2,000 at the instant itself, not one tick later", () => {
    renderPricingPageAt(CUTOVER);

    expect(within(selfServiceCard()).getByText("CHF 2,000")).toBeInTheDocument();
    expect(within(selfServiceCard()).queryByText("CHF 999")).not.toBeInTheDocument();
  });

  it("AC-1.3 drops every transitional notice once the cutover has passed", () => {
    renderPricingPageAt(CUTOVER);

    expect(screen.queryByText(/Until August 2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/from August 2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/lock CHF 999/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/From August 2026, this license is CHF 2,000/),
    ).not.toBeInTheDocument();
  });

  it("AC-1.3 still shows the pre-launch notice before the cutover", () => {
    renderPricingPageAt(ONE_MINUTE_BEFORE);

    expect(screen.getByText(/Until August 2026/)).toBeInTheDocument();
  });

  // Before this change the structured data said "2000" while the visible card said CHF 999 — search
  // engines and AI assistants were quoting a price the page contradicted.
  it.each(["Lighthouse", "Index"] as const)(
    "AC-1.4 binds %s's JSON-LD Self-Service offer to the pricing module, not a literal",
    (page) => {
      const bindings = declaredOfferPriceBinding(page);

      expect(bindings.some((b) => b.endsWith("selfServiceAmount"))).toBe(true);
      expect(bindings.filter((b) => b === '"999"' || b === '"2000"')).toEqual([]);
    },
  );
});
