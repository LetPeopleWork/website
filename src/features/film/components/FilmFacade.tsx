import { useState } from "react";
import { Play } from "lucide-react";
import { VIDEOS, trackVideoPlay, videoEmbedUrl, type Video } from "../videos";

interface FilmFacadeProps {
  /** Where on the site it was played; analytics only. */
  source: string;
  className?: string;
  /** Which video; the film unless given. */
  video?: Video;
  /** Poster size, so the box keeps its shape before and after the click. */
  posterSize?: { width: number; height: number };
}

// Click-to-play poster that swaps itself for the YouTube iframe in place.
// Until the click, this is one same-origin image and a button: no third-party
// script, no cookie, no layout shift (the aspect ratio is fixed).
const FilmFacade = ({
  source,
  className = "",
  video = VIDEOS.film,
  posterSize = { width: 1920, height: 1080 },
}: FilmFacadeProps) => {
  const [playing, setPlaying] = useState(false);
  const label = video.key === "film" ? "Watch the film" : "Watch the video";

  const play = () => {
    trackVideoPlay(video, source);
    setPlaying(true);
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-medium ${className}`}
      data-testid="film-facade"
    >
      {playing ? (
        <iframe
          className="h-full w-full"
          src={videoEmbedUrl(video)}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Play: ${video.title}`}
        >
          <img
            src={video.posterUrl}
            alt=""
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
            loading="lazy"
            width={posterSize.width}
            height={posterSize.height}
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center gap-3 rounded-full bg-foreground/90 px-6 py-3 text-base font-semibold text-background shadow-medium ring-1 ring-white/20 backdrop-blur-xs transition-transform group-hover:scale-105 group-hover:bg-foreground">
              <Play className="h-5 w-5 fill-current" />
              {label} · {video.durationSeconds} s
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default FilmFacade;
