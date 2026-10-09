import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LighthouseWhatsNew from "./LighthouseWhatsNew";

const at = (iso: string) => () => Date.parse(`${iso}T12:00:00Z`);

const cardTitles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("Lighthouse What's New", () => {
  it("opens on the last 90 days, newest first, with each card's release date", () => {
    render(<LighthouseWhatsNew now={at("2026-10-09")} />);

    expect(screen.getByRole("button", { name: "Last 90 days" })).toHaveAttribute("aria-pressed", "true");
    expect(cardTitles()[0]).toBe("Refine enough, then stop");
    expect(cardTitles()).toContain("Percentiles over Time");
    expect(screen.getByText("Next release")).toBeTruthy();
    expect(screen.getByText("3 Oct 2026")).toBeTruthy();
    expect(screen.getByRole("link", { name: /v26\.10\.3\.6/ })).toHaveAttribute(
      "href",
      "https://github.com/LetPeopleWork/Lighthouse/releases/tag/v26.10.3.6",
    );
  });

  it("counts the releases inside the chosen range", async () => {
    render(<LighthouseWhatsNew now={at("2026-10-09")} />);
    const count = screen.getByTestId("whats-new-release-count");
    expect(count).toHaveTextContent("12 releases in the last 90 days.");

    await userEvent.click(screen.getByRole("button", { name: "Last 30 days" }));
    expect(count).toHaveTextContent("4 releases in the last 30 days.");

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(count).toHaveTextContent("21 releases since May 2026.");
  });

  it("narrows the cards to the last 30 days but keeps the unreleased one", async () => {
    render(<LighthouseWhatsNew now={at("2026-10-09")} />);
    await userEvent.click(screen.getByRole("button", { name: "Last 30 days" }));

    expect(cardTitles()).toContain("Refine enough, then stop");
    expect(cardTitles()).toContain("Forecast Reality Check");
    expect(cardTitles()).not.toContain("Dependencies, from your tracker");
  });

  it("keeps the unreleased card and an honest count when nothing shipped lately", async () => {
    render(<LighthouseWhatsNew now={at("2027-06-01")} />);
    await userEvent.click(screen.getByRole("button", { name: "Last 30 days" }));

    expect(screen.getByTestId("whats-new-release-count")).toHaveTextContent("0 releases in the last 30 days.");
    expect(cardTitles()).toEqual(["Refine enough, then stop"]);
  });
});
