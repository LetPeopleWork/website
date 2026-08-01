import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EngagementPath from "./EngagementPath";
import ExpertiseAndServices from "./ExpertiseAndServices";

describe("engagement path", () => {
  it("quotes the pilot at CHF 3,000", () => {
    render(<EngagementPath />);

    expect(screen.getByText("CHF 3,000")).toBeInTheDocument();
  });

  it("leaves the Transform tier at CHF 10,000", () => {
    render(<EngagementPath />);

    expect(screen.getByText("CHF 10,000")).toBeInTheDocument();
  });
});

describe("services catalogue", () => {
  it("quotes the Flow Clarity Assessment at CHF 4,500, still bundling the licence", () => {
    render(<ExpertiseAndServices />);

    expect(
      screen.getByText("CHF 4,500 · Includes Lighthouse Premium License"),
    ).toBeInTheDocument();
  });

  it("leaves the Flow Health Check untouched", () => {
    render(<ExpertiseAndServices />);

    expect(
      screen.getByText("From CHF 200/team · CHF 500/portfolio"),
    ).toBeInTheDocument();
  });
});
