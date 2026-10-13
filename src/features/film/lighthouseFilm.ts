import filmData from "@/content/lighthouse-film.json";

// The Lighthouse film (75 s, October 2026). Hosted on YouTube: adaptive
// streaming, no 28 MB download on mobile, and a VideoObject Google can index.
// Loaded only on click (facade pattern): no YouTube script, cookie or request
// reaches the visitor before they press play.
//
// Set YOUTUBE_ID once the upload is public. While it is empty every film
// affordance on the site stays hidden, so this can ship ahead of the upload.
// The values live in src/content/lighthouse-film.json so the build can put
// the same film into the static structured data (scripts/seo-schema.mjs).
// uploadDate is ISO 8601 (the YouTube publish date); posterUrl is the
// same-origin hero shot, so the facade matches the page.
export const LIGHTHOUSE_FILM = filmData;

export const isFilmAvailable = (): boolean => LIGHTHOUSE_FILM.youtubeId.length > 0;

/** Privacy-enhanced embed; autoplay is only honoured after a user gesture, which the facade guarantees. */
export const filmEmbedUrl = (): string =>
  `https://www.youtube-nocookie.com/embed/${LIGHTHOUSE_FILM.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export const filmWatchUrl = (): string =>
  `https://www.youtube.com/watch?v=${LIGHTHOUSE_FILM.youtubeId}`;
