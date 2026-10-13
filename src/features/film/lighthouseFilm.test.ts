import { describe, expect, it } from "vitest";
import { LIGHTHOUSE_FILM, filmEmbedUrl } from "./lighthouseFilm";

describe("the Lighthouse film", () => {
  it("embeds privacy-enhanced and only autoplays after the facade click", () => {
    expect(filmEmbedUrl()).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
    expect(filmEmbedUrl()).toContain("autoplay=1");
  });

  // The VideoObject itself is built at deploy time (scripts/seo-schema.mjs,
  // tested in src/seo-schema.test.ts) from the same JSON file.
  it("has a same-origin poster and an ISO upload date for the structured data", () => {
    expect(LIGHTHOUSE_FILM.posterUrl).toMatch(/^https:\/\/letpeople\.work\//);
    expect(LIGHTHOUSE_FILM.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(LIGHTHOUSE_FILM.durationSeconds).toBeGreaterThan(0);
  });
});
