import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/plausible", () => ({ trackEvent, trackDownload: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

import Budget from "./Budget";
import { prices } from "@/lib/pricing";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/budget"]}>
      <Routes>
        <Route path="/budget" element={<Budget />} />
        <Route path="/lighthouse" element={<p>the Lighthouse page</p>} />
      </Routes>
    </MemoryRouter>,
  );

const at = (date: Date) => vi.setSystemTime(date);

describe("the year-end budget page", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at(new Date(2026, 10, 20, 10, 0));
    trackEvent.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens with the escape room and the Self-Service price from the price list", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Budget left, and nobody wants another escape room?",
    );
    expect(document.body).toHaveTextContent(
      `${prices.selfService} gets all your teams a year of Lighthouse.`,
    );
  });

  it("is honest about the offer: same price in January, 365 days from purchase, no price for the escape room", () => {
    renderPage();
    const text = document.body.textContent!;
    expect(text).toContain("The price is the same in January");
    expect(text).toContain("Lighthouse will cost the same after that");
    expect(within(screen.getByTestId("budget-lighthouse")).getByText("365 days from the day you buy")).toBeInTheDocument();
    expect(text).not.toMatch(/starts? (on )?1 January|discount|% off|offer ends|only until/i);
    expect(screen.getByTestId("budget-room")).not.toHaveTextContent(/CHF|\d{3}/);
  });

  it("says the Community edition is free, so the budget is not needed for a small setup", () => {
    renderPage();
    expect(document.body).toHaveTextContent(
      "if three teams and one portfolio are enough for you, the Community edition is free",
    );
  });

  it("puts the free trial first while there is time to try it", () => {
    renderPage();
    const hero = screen.getByRole("heading", { level: 1 }).parentElement!;
    const actions = within(hero).getAllByText(/Try it free for 30 days|Buy Self-Service/);
    expect(actions.map((el) => el.textContent)).toEqual(["Try it free for 30 days", "Buy Self-Service"]);
    expect(screen.getByTestId("budget-hint")).toHaveTextContent("we don't ask for a card");
  });

  it("puts the purchase first from 6 December and points to the ten-minute demo", () => {
    at(new Date(2026, 11, 8, 10, 0));
    renderPage();
    const hero = screen.getByRole("heading", { level: 1 }).parentElement!;
    const actions = within(hero).getAllByText(/Try it free for 30 days|Buy Self-Service/);
    expect(actions.map((el) => el.textContent)).toEqual(["Buy Self-Service", "Try it free for 30 days"]);
    expect(screen.getByRole("link", { name: "Watch him do it" })).toHaveAttribute(
      "href",
      "/lighthouse#first-forecast",
    );
  });

  it("sends buyers to the license form and opens the trial request in place", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("link", { name: /Buy Self-Service/ })).toHaveAttribute(
      "href",
      "/lighthouse#lighthouse-license",
    );
    await user.click(screen.getByRole("button", { name: "Try it free for 30 days" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith("Budget campaign", { action: "trial-open" });
  });

  it("answers the budget holder's questions and offers an email draft to forward", () => {
    renderPage();
    for (const question of ["What is it?", "What does it cost?", "Where does it run?", "How do we buy it?"]) {
      expect(screen.getByRole("heading", { level: 3, name: question })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "licensing@letpeople.work" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:licensing@letpeople.work"),
    );
    const forward = screen.getByRole("link", { name: /Send this page to whoever holds the budget/ });
    const href = forward.getAttribute("href")!;
    expect(href.startsWith("mailto:?subject=")).toBe(true);
    const body = decodeURIComponent(href.split("&body=")[1]);
    expect(body).toContain("https://letpeople.work/budget/");
    expect(body).toContain(prices.selfService);
    // Our own mail-click tracking would log an empty address for it.
    expect(forward).toHaveAttribute("data-skip-autotrack");
  });

  it("stays out of search results", () => {
    renderPage();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  });

  it("sends visitors to the Lighthouse page once the year is over", () => {
    at(new Date(2027, 0, 3, 10, 0));
    renderPage();
    expect(screen.getByText("the Lighthouse page")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});
