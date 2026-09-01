import { describe, it, expect } from "vitest";
import {
  assessmentContent,
  bandContent,
  QUESTIONS,
  BANDS,
} from "./assessmentContent";
import type { BandName } from "../core/scoring";

const ALL_BANDS: readonly BandName[] = [
  "Flying blind",
  "Drifting",
  "Flow-aware",
  "Predictable",
];

describe("assessment content (#20, #21 + load-time invariants)", () => {
  it("loads exactly six questions, each with a 0-3 ladder of four options", () => {
    expect(QUESTIONS).toHaveLength(6);
    for (const question of QUESTIONS) {
      expect(question.options).toHaveLength(4);
      expect(question.options.map((option) => option.value)).toEqual([
        0, 1, 2, 3,
      ]);
    }
  });

  it("covers all four bands with contiguous, exhaustive ranges over 0-100", () => {
    expect(BANDS).toHaveLength(4);
    const sorted = [...BANDS].sort((a, b) => a.min - b.min);
    expect(sorted[0].min).toBe(0);
    expect(sorted[sorted.length - 1].max).toBe(100);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].min).toBe(sorted[i - 1].max + 1);
    }
  });

  it("#20 every band's breakdown names both pillars and offers a band-specific next step", () => {
    for (const band of ALL_BANDS) {
      const content = bandContent(band);
      expect(content.measureRead.trim().length).toBeGreaterThan(0);
      expect(content.forecastRead.trim().length).toBeGreaterThan(0);
      expect(content.ctas.length).toBeGreaterThan(0);
    }
  });

  it("#21 the free Lighthouse next step is present in every band", () => {
    for (const band of ALL_BANDS) {
      const free = bandContent(band).ctas.filter((cta) => cta.isCommunity);
      expect(free).toHaveLength(1);
      const label = free[0].label.toLowerCase();
      expect(label).toContain("lighthouse");
      expect(label).toContain("free");
      expect(label).not.toContain("community");
    }
  });

  it("#20 the sweet-spot and top bands offer the 30-day trial as a further next step", () => {
    for (const band of ["Flow-aware", "Predictable"] as const) {
      expect(
        bandContent(band).ctas.some((cta) =>
          cta.label.toLowerCase().includes("30 days"),
        ),
      ).toBe(true);
    }
  });

  it("#20 the entry bands keep a single free-Lighthouse-only next step", () => {
    for (const band of ["Flying blind", "Drifting"] as const) {
      expect(bandContent(band).ctas).toHaveLength(1);
      expect(bandContent(band).ctas[0].isCommunity).toBe(true);
    }
  });

  it("the mature bands surface a Lighthouse Premium next step", () => {
    for (const band of ["Flow-aware", "Predictable"] as const) {
      const premium = bandContent(band).ctas.filter((cta) =>
        cta.href.includes("#lighthouse-premium"),
      );
      expect(premium).toHaveLength(1);
      expect(premium[0].label).toContain("Premium");
    }
  });

  it("the entry bands do not push Premium", () => {
    for (const band of ["Flying blind", "Drifting"] as const) {
      expect(
        bandContent(band).ctas.some((cta) =>
          cta.href.includes("#lighthouse-premium"),
        ),
      ).toBe(false);
    }
  });

  it("names a band-specific kit for every band", () => {
    const kitNames = ALL_BANDS.map((band) => bandContent(band).kitName);
    expect(kitNames).toEqual([
      "Starter Kit",
      "Steering Kit",
      "Level-Up Kit",
      "Mastery Kit",
    ]);
  });
});
