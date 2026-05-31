import { describe, it, expect } from "vitest";
import { BAND_EMAIL_COPY } from "@shared/resultsEmail";
import { BANDS } from "../content/assessmentContent";
import type { BandName } from "./scoring";

describe("results-email band copy mirrors the canonical assessmentContent", () => {
  it.each(BANDS.map((band) => band.name as BandName))(
    "keeps the %s mirror byte-identical to assessmentContent",
    (band) => {
      const canonical = BANDS.find((entry) => entry.name === band);
      const mirror = BAND_EMAIL_COPY[band];

      expect(mirror.tagline).toBe(canonical?.tagline);
      expect(mirror.measureRead).toBe(canonical?.measureRead);
      expect(mirror.forecastRead).toBe(canonical?.forecastRead);
      expect(mirror.nextRung).toBe(canonical?.nextRung);
      expect(mirror.ctas).toEqual(
        canonical?.ctas.map((cta) => ({ label: cta.label, href: cta.href })),
      );
    },
  );
});
