import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { summarizeDashboard, BAND_NAMES } from "./dashboardSummary";
import type { DashboardData, DashboardResponse, DashboardLead } from "../ports";
import type { BandName } from "./scoring";

const getMockResponse = (
  overrides: Partial<DashboardResponse> = {},
): DashboardResponse => ({
  source: "readiness-assessment",
  band: "Flow-aware",
  score: 60,
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockLead = (
  overrides: Partial<DashboardLead> = {},
): DashboardLead => ({
  source: "readiness-assessment",
  email: "lead@example.com",
  band: "Flow-aware",
  score: 60,
  createdAt: "2026-05-01T00:00:00.000Z",
  ...overrides,
});

const getMockData = (overrides: Partial<DashboardData> = {}): DashboardData => ({
  responses: [getMockResponse()],
  leads: [getMockLead()],
  ...overrides,
});

describe("summarizeDashboard", () => {
  it("counts total responses, captured emails, and lists the leads for the chosen source", () => {
    const data = getMockData({
      responses: [
        getMockResponse({ band: "Flying blind", score: 10 }),
        getMockResponse({ band: "Predictable", score: 90 }),
        getMockResponse({ band: "Flow-aware", score: 60 }),
      ],
      leads: [
        getMockLead({ email: "a@example.com", band: "Predictable", score: 90 }),
        getMockLead({ email: "b@example.com", band: "Flow-aware", score: 60 }),
      ],
    });

    const summary = summarizeDashboard(data, "readiness-assessment");

    expect(summary.totalResponses).toBe(3);
    expect(summary.emailsCaptured).toBe(2);
    expect(summary.leads.map((lead) => lead.email)).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("zero-fills the distribution across all four bands", () => {
    const data = getMockData({
      responses: [
        getMockResponse({ band: "Flying blind" }),
        getMockResponse({ band: "Flying blind" }),
        getMockResponse({ band: "Predictable" }),
      ],
      leads: [],
    });

    const summary = summarizeDashboard(data, "readiness-assessment");

    expect(summary.bandDistribution).toEqual({
      "Flying blind": 2,
      "Drifting": 0,
      "Flow-aware": 0,
      Predictable: 1,
    });
    expect(Object.keys(summary.bandDistribution)).toHaveLength(4);
  });

  it("counts and lists only the responses and leads of the requested source", () => {
    const data: DashboardData = {
      responses: [
        getMockResponse({ source: "readiness-assessment" }),
        getMockResponse({ source: "other-survey" as never }),
      ],
      leads: [
        getMockLead({ source: "readiness-assessment", email: "keep@example.com" }),
        getMockLead({ source: "other-survey" as never, email: "drop@example.com" }),
      ],
    };

    const summary = summarizeDashboard(data, "readiness-assessment");

    expect(summary.totalResponses).toBe(1);
    expect(summary.emailsCaptured).toBe(1);
    expect(summary.leads.map((lead) => lead.email)).toEqual(["keep@example.com"]);
  });

  it("distribution sums to the number of matching responses for any band mix", () => {
    const bandArb = fc.constantFrom<BandName>(...BAND_NAMES);
    fc.assert(
      fc.property(fc.array(bandArb), (bands) => {
        const data = getMockData({
          responses: bands.map((band) => getMockResponse({ band })),
          leads: [],
        });
        const summary = summarizeDashboard(data, "readiness-assessment");
        const summed = BAND_NAMES.reduce(
          (total, band) => total + summary.bandDistribution[band],
          0,
        );
        return summed === summary.totalResponses;
      }),
    );
  });
});
