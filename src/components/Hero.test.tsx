import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/plausible", () => ({ trackEvent, trackDownload: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: vi.fn() } } }));

import Hero from "./Hero";

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe("homepage hero", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
    trackEvent.mockClear();
  });

  it("opens on the visitor's question with the complete default page and no chip chosen", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("When will it be done?");
    expect(screen.getByTestId("hero-subhead")).toHaveTextContent(/Jira, Azure DevOps, Linear or ServiceNow/);
    for (const chip of screen.getAllByRole("button", { pressed: false })) {
      expect(chip).toHaveAttribute("aria-pressed", "false");
    }
    expect(screen.queryByTestId("hero-path-link")).toBeNull();
  });

  it("swaps subhead and screenshot for the chosen situation and links to its answer", async () => {
    renderHero();
    await userEvent.click(screen.getByRole("button", { name: "I need to check hosting and security" }));

    expect(screen.getByTestId("hero-subhead")).toHaveTextContent(/Jira Cloud and Data Center/);
    expect(screen.getByTestId("hero-path-link")).toHaveAttribute("href", "/lighthouse?for=security#where-it-runs");
    expect(window.location.search).toBe("?for=security");
    expect(trackEvent).toHaveBeenCalledWith("Path chosen", { path: "security", source: "home-hero" });
  });

  it("goes back to the default when the chosen chip is pressed again", async () => {
    renderHero();
    const chip = screen.getByRole("button", { name: "I look after several teams" });
    await userEvent.click(chip);
    expect(screen.getByTestId("hero-product-shot").getAttribute("src")).toContain("portfoliodetail.png");
    await userEvent.click(chip);
    expect(screen.getByTestId("hero-product-shot")).toHaveAttribute("src", "/lighthouse-forecast.png");
    expect(window.location.search).toBe("");
  });

  it("arrives pre-sorted from a ?for= link", () => {
    window.history.replaceState(null, "", "/?for=team");
    renderHero();
    expect(screen.getByRole("button", { name: "I'm on the team doing the work" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("hero-subhead")).toHaveTextContent(/Keep your burndown/);
    expect(trackEvent).not.toHaveBeenCalledWith("Path chosen", expect.anything());
  });
});
