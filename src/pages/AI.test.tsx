import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/plausible", () => ({ trackEvent, trackDownload: vi.fn() }));

import AI from "./AI";

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/ai"]}>
        <AI />
      </MemoryRouter>
    </HelmetProvider>,
  );

// The rules from the obAIa research (October 2026): what obAIa is, how it is
// offered, and what the page must not claim.
describe("the AI page", () => {
  beforeEach(() => {
    class NoopObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal("IntersectionObserver", NoopObserver);
  });

  it("leads with obAIa as something we set up in the visitor's own environment", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "We run our company with AI. We can help you set it up in yours.",
    );
    const setup = document.getElementById("setup")!;
    expect(setup).toHaveTextContent(/inside your environment/);
    expect(within(setup).getByRole("link", { name: /Ask about an obAIa setup/ })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:contact@letpeople.work"),
    );
  });

  it("is honest about where obAIa runs and who decides", () => {
    renderPage();
    const text = document.body.textContent!;
    expect(text).toContain("So far obAIa runs at LetPeopleWork only");
    expect(text).toContain("The agents prepare, people decide");
    expect(text).not.toMatch(/go-to-market/i);
    expect(text).not.toMatch(/download obAIa|buy obAIa|obAIa template/i);
  });

  it("names the three lenses we actually use", () => {
    renderPage();
    expect(document.getElementById("obaia")).toHaveTextContent(/Marketing, social and commercial agents/);
  });

  it("lists all three open-source plugins, LetPeopleAlign included", () => {
    renderPage();
    const plugins = document.getElementById("plugins")!;
    for (const name of ["LetPeopleWorkShop", "LetPeopleGrow", "LetPeopleAlign"]) {
      expect(within(plugins).getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("puts Lighthouse's AI integration in the same room, with a link to set it up", () => {
    renderPage();
    const lighthouse = document.getElementById("lighthouse")!;
    expect(within(lighthouse).getByRole("link", { name: /How to connect Lighthouse/ })).toHaveAttribute(
      "href",
      "/lighthouse#lighthouse-ai",
    );
    expect(lighthouse).toHaveTextContent("An example, with made-up teams.");
  });
});
