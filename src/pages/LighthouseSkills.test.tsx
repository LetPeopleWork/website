import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Lighthouse from "./Lighthouse";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
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

describe("Lighthouse agent skills", () => {
  it("offers every skill the clients release carries for download", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/lighthouse"]}>
          <Lighthouse />
        </MemoryRouter>
      </HelmetProvider>,
    );

    for (const zip of [
      "lighthouse-skill.zip",
      "lighthouse-refinement-skill.zip",
      "lighthouse-daily-flow-review-skill.zip",
    ]) {
      expect(screen.getByRole("link", { name: `Download ${zip}` })).toHaveAttribute(
        "href",
        `https://github.com/LetPeopleWork/lighthouse-clients/releases/latest/download/${zip}`,
      );
    }
    expect(screen.getByText(/Get a Team ready for its next Refinement/)).toBeInTheDocument();
    expect(screen.getByText("Daily Flow Review")).toBeInTheDocument();
    expect(screen.queryByText("Coming soon")).toBeNull();
  });
});
