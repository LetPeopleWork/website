import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/plausible", () => ({ trackEvent }));

import BudgetBar from "./BudgetBar";
import { prices } from "@/lib/pricing";

const renderBar = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BudgetBar />
    </MemoryRouter>,
  );

describe("the year-end budget bar", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 20, 10, 0));
    window.localStorage.clear();
    trackEvent.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--nav-top");
  });

  it("states the Self-Service price from the price list and links to the budget page", () => {
    renderBar();
    const link = screen.getByRole("link", { name: /Budget left this year\?/ });
    expect(link).toHaveTextContent(`${prices.selfService} gets every team a year of Lighthouse`);
    expect(link).toHaveAttribute("href", "/budget");
  });

  it("tells the navigation how far down to start, and takes that back when it goes", () => {
    const { unmount } = renderBar();
    expect(document.documentElement.style.getPropertyValue("--nav-top")).toMatch(/px$/);
    unmount();
    expect(document.documentElement.style.getPropertyValue("--nav-top")).toBe("");
  });

  it("is gone once the year is over", () => {
    vi.setSystemTime(new Date(2027, 0, 1, 0, 0));
    renderBar();
    expect(screen.queryByTestId("budget-bar")).not.toBeInTheDocument();
  });

  it.each(["/budget", "/survey", "/admin/dashboard"])("stays off %s", (path) => {
    renderBar(path);
    expect(screen.queryByTestId("budget-bar")).not.toBeInTheDocument();
  });

  it("can be hidden, and stays hidden on the next visit", async () => {
    const user = userEvent.setup();
    const first = renderBar();
    await user.click(screen.getByRole("button", { name: "Hide this note" }));
    expect(screen.queryByTestId("budget-bar")).not.toBeInTheDocument();
    first.unmount();

    renderBar("/lighthouse");
    expect(screen.queryByTestId("budget-bar")).not.toBeInTheDocument();
  });

  it("counts a click with the page it happened on", async () => {
    const user = userEvent.setup();
    renderBar("/lighthouse");
    await user.click(screen.getByRole("link", { name: /Budget left this year\?/ }));
    expect(trackEvent).toHaveBeenCalledWith("Budget campaign", {
      action: "bar-click",
      page: "/lighthouse",
    });
  });
});
