import filmData from "@/content/lighthouse-film.json";
import videoData from "@/content/videos.json";
import { trackEvent } from "@/lib/plausible";

// The short videos the site shows at the place they answer something: the
// film in the hero, Refinement on the Refinement tab and on Sizing Poker, the
// install on the "hosting and security" chip. All of them live on YouTube
// and load only on click (see FilmFacade and FilmLightbox).
//
// Short ones only (about two minutes at most): someone who just picked a
// situation wants the answer, not a recording of a talk. The long Lighthouse
// Live sessions stay on the YouTube channel. The values live in
// src/content/*.json so the build can describe them in the structured data.
export type VideoKey = "film" | "refinement" | "install";

export type Video = {
  key: VideoKey;
  youtubeId: string;
  title: string;
  description: string;
  durationSeconds: number;
  /** ISO 8601 date the video was published on YouTube. */
  uploadDate: string;
  /** Poster shown before the click: never a YouTube thumbnail, so nothing loads from YouTube until then. */
  posterUrl: string;
};

export const VIDEOS: Record<VideoKey, Video> = {
  film: { key: "film", ...filmData },
  refinement: { key: "refinement", ...videoData.refinement },
  install: { key: "install", ...videoData.install },
};

/** Privacy-enhanced embed; autoplay is only honoured after a user gesture, which the facade guarantees. */
export const videoEmbedUrl = (video: Video): string =>
  `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export const videoWatchUrl = (video: Video): string => `https://www.youtube.com/watch?v=${video.youtubeId}`;

/**
 * The film keeps its own "Film played" event, so that goal stays comparable
 * with the weeks before; every other video is a "Video play" with its key.
 */
export const trackVideoPlay = (video: Video, source: string) =>
  video.key === "film"
    ? trackEvent("Film played", { source })
    : trackEvent("Video play", { video: video.key, source });
