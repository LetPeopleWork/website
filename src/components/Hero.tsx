import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { trackEvent } from "@/lib/plausible";
import FilmLightbox from "@/features/film/components/FilmLightbox";
import { LIGHTHOUSE_FILM, isFilmAvailable } from "@/features/film/lighthouseFilm";
import PathChips from "@/features/paths/PathChips";
import {
  findPath,
  lighthouseHref,
  pathFromSearch,
  writePathToUrl,
  type PathKey,
} from "@/features/paths/paths";

const DEFAULT_SUBHEAD =
  "Lighthouse answers from what your team has already finished in Jira, Azure DevOps, Linear or ServiceNow. You see the odds for any date while there is still time to act.";

const DEFAULT_IMAGE = {
  src: "/lighthouse-forecast.png",
  alt: "Lighthouse team forecast: when will 10 work items be done, four dates with their probabilities, and a 72% likelihood of making the target date",
  width: 1920,
  height: 1080,
};

// The first screen carries the message on its own: the visitor's question as
// the headline, one sentence of answer, two buttons, and the product. Most
// attention stays on the first two screens, so the screenshot sits here and
// not further down.
//
// The situation chips swap the subhead and the screenshot and add a link to
// the part of /lighthouse that answers that situation. With no choice, the
// page is exactly the default, which is also what search engines see.
const Hero = () => {
  const [trialOpen, setTrialOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  // A link like letpeople.work/?for=portfolio arrives pre-sorted.
  const [pathKey, setPathKey] = useState<PathKey | undefined>(
    () => pathFromSearch(window.location.search)?.key,
  );

  const path = findPath(pathKey);
  const image = path?.image ?? DEFAULT_IMAGE;

  const choosePath = (key: PathKey | undefined) => {
    setPathKey(key);
    writePathToUrl(key);
    if (key) trackEvent("Path chosen", { path: key, source: "home-hero" });
  };
  const openFilm = () => {
    trackEvent("Film played", { source: "hero" });
    setFilmOpen(true);
  };
  const openTrial = () => {
    trackEvent("Trial dialog opened", { source: "hero" });
    setTrialOpen(true);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-background pt-32 pb-0 md:pt-40">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-accent/60 via-background to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
            Lighthouse · flow metrics and delivery forecasts
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            When will it be done?
          </h1>

          <div className="max-w-2xl mx-auto mb-10 min-h-[5.5rem]" aria-live="polite">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="hero-subhead">
              {path?.subhead ?? DEFAULT_SUBHEAD}
            </p>
            {path && (
              <Link
                to={lighthouseHref(path)}
                className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-primary underline-offset-4 hover:underline"
                data-testid="hero-path-link"
              >
                {path.linkLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button asChild variant="hero" size="lg" className="group rounded-full px-8 py-6 text-base">
              <Link to="/lighthouse">
                Get Lighthouse free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base" onClick={openTrial}>
              Try Premium free for 30 days
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-10">
            Free for up to 3 teams. The Premium trial needs no signup and no credit card.
          </p>

          <PathChips selected={pathKey} onSelect={choosePath} className="mb-12" />
        </div>

        {/* The product, cropped at the bottom so the page reads on. With the
            film published, the shot doubles as its poster: one click, a
            lightbox, sound on. */}
        <div className="relative mx-auto max-w-5xl">
          {isFilmAvailable() && (
            <button
              type="button"
              onClick={openFilm}
              className="group absolute inset-x-0 top-0 z-10 flex h-[70%] items-center justify-center"
              aria-label={`Play: ${LIGHTHOUSE_FILM.title}`}
              data-testid="hero-film-play"
            >
              <span className="inline-flex items-center gap-3 rounded-full bg-foreground/90 px-6 py-3 text-base font-semibold text-background shadow-medium ring-1 ring-white/20 backdrop-blur-sm transition-transform group-hover:scale-105 group-hover:bg-foreground">
                <Play className="h-5 w-5 fill-current" />
                Watch the film · {LIGHTHOUSE_FILM.durationSeconds} s
              </span>
            </button>
          )}
          <div className="rounded-t-2xl border border-b-0 border-border bg-card shadow-medium overflow-hidden">
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="w-full h-auto block"
              width={image.width}
              height={image.height}
              loading="eager"
              fetchPriority="high"
              data-testid="hero-product-shot"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      <TrialRequestDialog open={trialOpen} onOpenChange={setTrialOpen} source="hero" />
      <FilmLightbox open={filmOpen} onOpenChange={setFilmOpen} />
    </section>
  );
};

export default Hero;
