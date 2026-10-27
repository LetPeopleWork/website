import { Play } from "lucide-react";

// The one picture that sells Lighthouse: a real team forecast, cropped from
// the product so the dates and the 72.68% can be read at hero size. The full
// screenshot showed the whole app at a third of its size, and nobody could
// read the answer in it.
//
// Lighthouse marks the four percentiles with icons only. The labels spell
// them out (green tick 95%, outline tick 85%, clock 70%, warning 50%, as in
// the Lighthouse UI and docs). They sit over the image from the small-tablet
// width up, sized with the image (container query units); on phones, where
// the rows are too close together, the caption carries the same key.
const ROWS = [
  { label: "95% likely", top: "61%" },
  { label: "85% likely", top: "65.8%" },
  { label: "70% likely", top: "70.6%" },
  { label: "50% likely", top: "75.4%" },
];

interface ForecastShotProps {
  /** Shows a "Watch the film" button in the corner, away from the numbers. */
  onPlayFilm?: () => void;
  filmSeconds?: number;
  className?: string;
}

const ForecastShot = ({ onPlayFilm, filmSeconds, className = "" }: ForecastShotProps) => (
  <figure className={`relative mx-auto w-full max-w-[920px] text-left ${className}`} data-testid="forecast-shot">
    <div className="relative @container">
      <img
        src="/lighthouse-forecast-panel.png"
        alt="Lighthouse team forecast for a demo team: 10 work items are 95% likely done by 16 October, 85% by 13 October, 70% by 10 October and 50% by 8 October. The likelihood to close all 10 by 11 October is 72.68%."
        width={920}
        height={500}
        loading="eager"
        fetchPriority="high"
        className="block h-auto w-full rounded-2xl border border-border bg-card shadow-medium"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        {ROWS.map((row) => (
          <span
            key={row.label}
            style={{ top: row.top, left: "16.5%" }}
            className="absolute -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-[0.9cqw] py-[0.15cqw] text-[1.35cqw] font-semibold text-primary ring-1 ring-primary/15"
          >
            {row.label}
          </span>
        ))}
      </div>
      {onPlayFilm && (
        <button
          type="button"
          onClick={onPlayFilm}
          className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/90 px-3 py-1.5 text-xs font-semibold text-background shadow-medium ring-1 ring-white/20 backdrop-blur-xs transition-transform hover:scale-105 hover:bg-foreground sm:right-4 sm:top-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          aria-label="Play the film: Lighthouse in 75 seconds"
          data-testid="hero-film-play"
        >
          <Play className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
          Watch the film{filmSeconds ? ` · ${filmSeconds} s` : ""}
        </button>
      )}
    </div>
    <figcaption className="mt-3 text-center text-sm text-muted-foreground">
      A forecast in Lighthouse, for a demo team.
      <span className="sm:hidden"> Green tick 95% likely, outline tick 85%, clock 70%, warning 50%.</span>
    </figcaption>
  </figure>
);

export default ForecastShot;
