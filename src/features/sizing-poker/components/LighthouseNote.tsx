import { useState } from "react";
import { Play } from "lucide-react";
import FilmLightbox from "@/features/film/components/FilmLightbox";
import { VIDEOS, trackVideoPlay } from "@/features/film/videos";
import { trackEvent } from "@/lib/plausible";
import { sizingPokerContent } from "../content/sizingPokerContent";

const c = sizingPokerContent.intro.lighthouseNote;
const video = VIDEOS.refinement;

// Under the intro, set apart and small: the round comes first, and the intro
// itself stays under 50 words (the first reviewer skipped a longer one).
// It says that the same question now lives in Lighthouse, on the team's real
// work items (weekly, 16 Oct 2026), and offers the one-minute Refinement video
// to every visitor, not only to the ones who finish a round. A plain link, not
// a router link, so the scroll to the Refinement tab runs when the Lighthouse
// page loads.
const LighthouseNote = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <div
      className="mt-8 max-w-[58ch] border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground"
      data-testid="sizing-lighthouse-note"
    >
      <p>
        {c.text}{" "}
        <a
          href={c.href}
          onClick={() => trackEvent("Refinement link clicked", { source: "sizing-intro" })}
          className="font-medium text-primary underline underline-offset-4"
        >
          {c.linkLabel}
        </a>
      </p>
      <button
        type="button"
        onClick={() => {
          trackVideoPlay(video, "sizing-intro");
          setVideoOpen(true);
        }}
        className="mt-2 inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4"
        data-testid="sizing-intro-refinement-video"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        Watch it in {video.durationSeconds} seconds
      </button>
      <FilmLightbox open={videoOpen} onOpenChange={setVideoOpen} video={video} />
    </div>
  );
};

export default LighthouseNote;
