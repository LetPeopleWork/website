import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EngagementPath from "./EngagementPath";
import ExpertiseAndServices from "./ExpertiseAndServices";
import { PRICE_CUTOVER_INSTANT } from "@/lib/pricing";

// ADO #5563 — the price surfaces gate themselves on the clock, so the only way to see the future is to
// fake it. These are the tests that let the change ship a day before it takes effect.
const CUTOVER = new Date(PRICE_CUTOVER_INSTANT);
const ONE_MINUTE_BEFORE = new Date(CUTOVER.getTime() - 60_000);

function at(instant: Date, render: () => void) {
  vi.setSystemTime(instant);
  render();
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("engagement path across the price cutover", () => {
  it("quotes the pilot at CHF 2,000 before the cutover", () => {
    at(ONE_MINUTE_BEFORE, () => render(<EngagementPath />));

    expect(screen.getByText("CHF 2,000")).toBeInTheDocument();
  });

  it("quotes the pilot at CHF 3,000 from the cutover instant", () => {
    at(CUTOVER, () => render(<EngagementPath />));

    expect(screen.getByText("CHF 3,000")).toBeInTheDocument();
    expect(screen.queryByText("CHF 2,000")).not.toBeInTheDocument();
  });

  it.each([
    ["before", ONE_MINUTE_BEFORE],
    ["at", CUTOVER],
  ])("leaves the Transform tier at CHF 10,000 %s the cutover", (_when, instant) => {
    at(instant, () => render(<EngagementPath />));

    expect(screen.getByText("CHF 10,000")).toBeInTheDocument();
  });
});

describe("services catalogue across the price cutover", () => {
  it("quotes the Flow Clarity Assessment at CHF 3,500 before the cutover", () => {
    at(ONE_MINUTE_BEFORE, () => render(<ExpertiseAndServices />));

    expect(
      screen.getByText("CHF 3,500 · Includes Lighthouse Premium License"),
    ).toBeInTheDocument();
  });

  it("quotes it at CHF 4,500 from the cutover instant, still bundling the licence", () => {
    at(CUTOVER, () => render(<ExpertiseAndServices />));

    expect(
      screen.getByText("CHF 4,500 · Includes Lighthouse Premium License"),
    ).toBeInTheDocument();
  });

  it("leaves the Flow Health Check untouched", () => {
    at(CUTOVER, () => render(<ExpertiseAndServices />));

    expect(
      screen.getByText("From CHF 200/team · CHF 500/portfolio"),
    ).toBeInTheDocument();
  });
});
