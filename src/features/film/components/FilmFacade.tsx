import { useState } from "react";
import { Play } from "lucide-react";
import { trackEvent } from "@/lib/plausible";
import { LIGHTHOUSE_FILM, filmEmbedUrl } from "../lighthouseFilm";

interface FilmFacadeProps {
  /** Where on the site it was played; analytics only. */
  source: string;
  className?: string;
}

// Click-to-play poster that swaps itself for the YouTube iframe in place.
// Until the click, this is one same-origin image and a button: no third-party
// script, no cookie, no layout shift (the aspect ratio is fixed).
const FilmFacade = ({ source, className = "" }: FilmFacadeProps) => {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    trackEvent("Film played", { source });
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
          src={filmEmbedUrl()}
          title={LIGHTHOUSE_FILM.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Play: ${LIGHTHOUSE_FILM.title}`}
        >
          <img
            src="/forecasts-project.png"
            alt=""
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
            loading="lazy"
            width="1843"
            height="1090"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center gap-3 rounded-full bg-white/95 px-6 py-3 text-base font-semibold text-foreground shadow-medium transition-transform group-hover:scale-105">
              <Play className="h-5 w-5 fill-current" />
              Watch the film · {LIGHTHOUSE_FILM.durationSeconds} s
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default FilmFacade;
