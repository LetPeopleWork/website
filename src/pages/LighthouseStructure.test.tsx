import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Lighthouse from "./Lighthouse";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/lighthouse"]}>
        <Lighthouse />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("/lighthouse as an evaluation page", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState(null, "", "/");
  });

  it("says in the hero what it is, where it runs, what it connects to and what it costs", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Know how likely your date is before you promise it");
    const hero = h1.closest("section")!;
    expect(hero).toHaveTextContent(/inside your network/);
    expect(hero).toHaveTextContent(/Jira Cloud and Data Center, Azure DevOps, Linear and ServiceNow/);
    expect(hero).toHaveTextContent(/free for up to 3 teams and 1 portfolio/i);
    expect(within(hero).getByRole("link", { name: "See pricing" })).toHaveAttribute("href", "#lighthouse-premium");
  });

  it("answers the private-Jira question and the 'tracker will build it' question", () => {
    renderPage();
    const where = document.getElementById("where-it-runs")!;
    expect(where).toHaveTextContent(/Jira Server or Data Center/);
    expect(where).toHaveTextContent(/personal access token/);
    expect(where).toHaveTextContent(/Why not wait for your tracker to add this\?/);
    expect(screen.getByText(/Won't Jira or Azure DevOps just build this in\?/)).toBeInTheDocument();
  });

  it("keeps the full comparison table in the page, collapsed by default", () => {
    renderPage();
    const details = document.getElementById("feature-comparison") as HTMLDetailsElement;
    expect(details.tagName).toBe("DETAILS");
    expect(details.open).toBe(false);
    expect(within(details).getByRole("table", { hidden: true })).toBeInTheDocument();
  });

  it("no longer claims the editions differ only in access", () => {
    renderPage();
    expect(screen.queryByText(/Same product\. Different access\./)).toBeNull();
    expect(screen.queryByText(/not features/)).toBeNull();
    expect(screen.queryByText(/leading choice/)).toBeNull();
  });

  it("opens the question tab that matches a situation chosen on the homepage", () => {
    window.history.replaceState(null, "", "/lighthouse?for=team");
    renderPage();
    expect(screen.getByRole("tab", { name: "What's stuck right now?" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { name: "I'm on the team doing the work" })).toHaveAttribute("aria-pressed", "true");
  });

  it("jumps to the answering section and tab when a chip is chosen on the page", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "I look after several teams" }));
    expect(screen.getByRole("tab", { name: "Which features make the release?" })).toHaveAttribute("aria-selected", "true");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(window.location.search).toBe("?for=portfolio");
  });
});
