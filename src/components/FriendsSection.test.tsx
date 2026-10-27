import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FriendsSection from "./FriendsSection";
import { friends } from "@/content/friends";

describe("friends of LetPeopleWork", () => {
  it("has a logo for every friend in friends.json", () => {
    for (const f of friends) {
      expect(f.image, f.name).toBeTruthy();
    }
  });

  it("shows each friend with logo, location, description and an external link", () => {
    render(<FriendsSection />);
    const grid = screen.getByTestId("friends-grid");
    expect(within(grid).getAllByRole("article")).toHaveLength(friends.length);
    for (const f of friends) {
      expect(within(grid).getByAltText(f.alt)).toBeInTheDocument();
      expect(within(grid).getByText(f.location)).toBeInTheDocument();
      const link = within(grid).getByRole("link", { name: f.link.label });
      expect(link).toHaveAttribute("href", f.link.href);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
