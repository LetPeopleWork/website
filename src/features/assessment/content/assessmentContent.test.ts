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
  "Output-focused",
  "Flow-aware",
  "Probabilistic",
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

  it("exposes a non-empty credibility anchor", () => {
    expect(assessmentContent.credibilityAnchor.trim().length).toBeGreaterThan(0);
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
      expect(content.nextRung.trim().length).toBeGreaterThan(0);
      expect(content.ctas.length).toBeGreaterThan(0);
    }
  });

  it("#21 the free Lighthouse Community next step is present in every band", () => {
    for (const band of ALL_BANDS) {
      const community = bandContent(band).ctas.filter((cta) => cta.isCommunity);
      expect(community).toHaveLength(1);
      expect(community[0].label.toLowerCase()).toContain("community");
    }
  });

  it("#20 low and top bands offer their documented secondary next step", () => {
    expect(
      bandContent("Flying blind").ctas.some((cta) =>
        cta.label.toLowerCase().includes("consulting"),
      ),
    ).toBe(true);
    expect(
      bandContent("Probabilistic").ctas.some(
        (cta) =>
          cta.label.toLowerCase().includes("paid") ||
          cta.label.toLowerCase().includes("portfolio"),
      ),
    ).toBe(true);
  });
});
