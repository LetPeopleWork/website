// The Lighthouse film (75 s, October 2026). Hosted on YouTube: adaptive
// streaming, no 28 MB download on mobile, and a VideoObject Google can index.
// Loaded only on click (facade pattern): no YouTube script, cookie or request
// reaches the visitor before they press play.
//
// Set YOUTUBE_ID once the upload is public. While it is empty every film
// affordance on the site stays hidden, so this can ship ahead of the upload.
export const LIGHTHOUSE_FILM = {
  youtubeId: "kS5B1acUIyA",
  title: "Lighthouse in 75 seconds",
  description:
    "When will it be done? Lighthouse connects to Jira, Azure DevOps, Linear or ServiceNow and turns your delivery history into Monte Carlo forecasts and flow metrics. Self-hosted, with the source public.",
  durationSeconds: 75,
  /** ISO 8601, for the VideoObject schema. Set to the YouTube publish date. */
  uploadDate: "2026-10-07",
  /** Same-origin poster: the hero product shot, so the facade matches the page. */
  posterUrl: "https://letpeople.work/lighthouse-forecast.png",
} as const;

export const isFilmAvailable = (): boolean => LIGHTHOUSE_FILM.youtubeId.length > 0;

/** Privacy-enhanced embed; autoplay is only honoured after a user gesture, which the facade guarantees. */
export const filmEmbedUrl = (): string =>
  `https://www.youtube-nocookie.com/embed/${LIGHTHOUSE_FILM.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export const filmWatchUrl = (): string =>
  `https://www.youtube.com/watch?v=${LIGHTHOUSE_FILM.youtubeId}`;

/** schema.org VideoObject, nested under the SoftwareApplication as `video`. */
export const filmSchema = () => ({
  "@type": "VideoObject",
  name: LIGHTHOUSE_FILM.title,
  description: LIGHTHOUSE_FILM.description,
  thumbnailUrl: [
    LIGHTHOUSE_FILM.posterUrl,
    `https://i.ytimg.com/vi/${LIGHTHOUSE_FILM.youtubeId}/maxresdefault.jpg`,
  ],
  uploadDate: LIGHTHOUSE_FILM.uploadDate,
  duration: `PT${Math.floor(LIGHTHOUSE_FILM.durationSeconds / 60)}M${LIGHTHOUSE_FILM.durationSeconds % 60}S`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${LIGHTHOUSE_FILM.youtubeId}`,
  contentUrl: filmWatchUrl(),
  publisher: { "@type": "Organization", name: "LetPeopleWork GmbH" },
});
