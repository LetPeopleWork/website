import { describe, it, expect } from "vitest";
import { renderResultsEmail } from "@shared/resultsEmail";
import { BANDS, bandContent } from "../content/assessmentContent";
import type { BandName } from "./scoring";

const sampleScoreFor = (band: BandName): number => {
  const copy = bandContent(band);
  return Math.round((copy.min + copy.max) / 2);
};

const allBands = BANDS.map((entry) => entry.name as BandName);

describe("renderResultsEmail builds the branded results email from a band", () => {
  it.each(allBands)(
    "embeds the %s band's own copy, score, greeting and reply offer in both html and text",
    (band) => {
      const score = sampleScoreFor(band);
      const copy = bandContent(band);

      const email = renderResultsEmail(band, { score });

      for (const body of [email.html, email.text]) {
        expect(body).toContain(band);
        expect(body).toContain(copy.tagline);
        expect(body).toContain(copy.measureRead);
        expect(body).toContain(copy.forecastRead);
        expect(body).toContain(copy.nextRung);
        expect(body).toContain(String(score));
        expect(body).toContain("Hi there,");
        expect(body).toContain("reply to this email");
        for (const cta of copy.ctas) {
          expect(body).toContain(cta.href);
          expect(body).toContain(cta.label);
        }
      }

      expect(email.subject).toBe("Your Flow & Forecasting Readiness results");
    },
  );

  it.each(allBands)(
    "excludes every other band's distinguishing tagline when rendering %s",
    (band) => {
      const email = renderResultsEmail(band, { score: sampleScoreFor(band) });
      const otherTaglines = allBands
        .filter((other) => other !== band)
        .map((other) => bandContent(other).tagline);

      for (const foreignTagline of otherTaglines) {
        expect(email.html).not.toContain(foreignTagline);
        expect(email.text).not.toContain(foreignTagline);
      }
    },
  );
});
