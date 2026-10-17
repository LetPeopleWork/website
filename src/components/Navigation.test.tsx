import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navigation from "./Navigation";
import SimpleFooter from "./SimpleFooter";

// Sizing Poker left the top menu (weekly, 16 Oct 2026) but stays one click
// away in the footer, and the page itself stays live.
describe("site navigation", () => {
  it("keeps Sizing Poker out of the top menu", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("link", { name: "Sizing Poker" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Sizing Poker" })).toBeNull();
  });

  it("still links Sizing Poker from the footer", () => {
    render(
      <MemoryRouter>
        <SimpleFooter />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Sizing Poker" })).toHaveAttribute("href", "/sizing-poker");
  });

  it("groups the footer into product, guides and company, with the social links as icons", () => {
    render(
      <MemoryRouter>
        <SimpleFooter />
      </MemoryRouter>,
    );
    const nav = screen.getByRole("navigation", { name: "Footer" });
    for (const group of ["Product", "Guides", "Company"]) {
      expect(within(nav).getByText(group)).toBeInTheDocument();
    }
    expect(within(nav).getAllByRole("link")).toHaveLength(9);
    expect(screen.queryByRole("link", { name: "Connect" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Home" })).toBeNull();
    const social = screen.getByRole("list", { name: "Follow LetPeopleWork" });
    expect(within(social).getAllByRole("link").map((a) => a.getAttribute("aria-label"))).toEqual([
      "Slack community",
      "LinkedIn",
      "Newsletter on Substack",
      "YouTube",
      "Meetup",
      "GitHub",
    ]);
  });
});
