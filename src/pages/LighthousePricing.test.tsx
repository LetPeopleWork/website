import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Lighthouse from "./Lighthouse";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

function renderPricingPage() {
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

beforeEach(() => {
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
  vi.unstubAllGlobals();
});

describe("Lighthouse pricing", () => {
  it("quotes CHF 2,000 for the Self-Service licence", () => {
    renderPricingPage();

    expect(within(selfServiceCard()).getByText("CHF 2,000")).toBeInTheDocument();
  });

  it("carries no transitional price notice", () => {
    renderPricingPage();

    expect(screen.queryByText(/Until August 2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/from August 2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/CHF 999/)).not.toBeInTheDocument();
  });

  // The structured data once carried its own price literal and drifted from
  // the visible card. It is now built from pricing.json at deploy time; the
  // binding is tested in src/seo-schema.test.ts.
  it("quotes CHF 10,000 for the Enterprise licence", () => {
    renderPricingPage();

    expect(screen.getAllByText("CHF 10,000").length).toBeGreaterThan(0);
  });
});
