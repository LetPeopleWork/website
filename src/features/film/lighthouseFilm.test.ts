import { describe, expect, it } from "vitest";
import { LIGHTHOUSE_FILM, filmEmbedUrl, filmSchema } from "./lighthouseFilm";

describe("the Lighthouse film", () => {
  it("embeds privacy-enhanced and only autoplays after the facade click", () => {
    expect(filmEmbedUrl()).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
    expect(filmEmbedUrl()).toContain("autoplay=1");
  });

  it("describes itself to Google with a same-origin poster and an ISO duration", () => {
    const schema = filmSchema();
    expect(schema["@type"]).toBe("VideoObject");
    expect(schema.thumbnailUrl[0]).toBe(LIGHTHOUSE_FILM.posterUrl);
    expect(schema.duration).toBe("PT1M15S");
    expect(schema.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
