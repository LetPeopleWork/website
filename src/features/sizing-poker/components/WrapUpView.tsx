import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilmLightbox from "@/features/film/components/FilmLightbox";
import { VIDEOS, trackVideoPlay } from "@/features/film/videos";
import { sizingPokerContent } from "../content/sizingPokerContent";
import type { RoundStats } from "../core/roundStats";
import { formatDuration, splitWidths, summaryText } from "../core/roundStats";

interface WrapUpViewProps {
  stats: RoundStats;
  targetDays: number;
  onRestart: () => void;
  onNextStepClick: (question: string) => void;
}

const c = sizingPokerContent.wrapUp;

const ItemList = ({
  heading,
  guidance,
  items,
  accent,
  testId,
}: {
  heading: string;
  guidance: string;
  items: readonly string[];
  accent: string;
  testId: string;
}) => {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className={`border-l-[3px] ${accent} py-0.5 pl-4`} data-testid={testId}>
      <h3 className="mb-1 text-[15px] font-bold text-foreground">
        {heading}{" "}
        <span className="font-semibold text-muted-foreground tabular-nums">
          ({items.length})
        </span>
      </h3>
      <p className="mb-2 text-[15px] leading-relaxed text-muted-foreground">{guidance}</p>
      <ul className="list-disc pl-5 text-[15px] leading-relaxed text-foreground/80">
        {items.map((item, i) => (
          <li key={`${item}-${i}`} className="mb-0.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const WrapUpView = ({
  stats,
  targetDays,
  onRestart,
  onNextStepClick,
}: WrapUpViewProps) => {
  const width = splitWidths(stats);
  const [copied, setCopied] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const refinementVideo = VIDEOS.refinement;

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText(stats, targetDays));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div data-testid="sizing-result">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {stats.endedEarly ? "Stopped early" : "Round complete"}
      </p>
      <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {stats.endedEarly ? c.partialHeading : stats.wasFast ? c.fastHeading : c.slowHeading}
      </h1>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="py-1 text-center">
          <div
            className="text-6xl font-bold leading-none tracking-tighter text-primary tabular-nums md:text-7xl/none"
            data-testid="sizing-seconds-per-item"
          >
            {stats.secondsPerItem.toFixed(1)}
          </div>
          <div className="mt-2 text-[15px] text-muted-foreground">seconds per item</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {stats.endedEarly
              ? `${stats.total} of ${stats.planned} items sized in ${formatDuration(stats.elapsedMs)}`
              : `${stats.total} item${stats.total === 1 ? "" : "s"} in ${formatDuration(stats.elapsedMs)} total`}
          </div>
        </div>

        <div>
          <div className="mb-3 flex h-10 overflow-hidden rounded-lg border border-border">
            {stats.fits > 0 && (
              <span
                className="grid place-items-center bg-verdict-fits text-xs font-bold text-primary-foreground"
                style={{ width: `${width.fits}%` }}
              >
                {stats.fits}
              </span>
            )}
            {stats.conditional > 0 && (
              <span
                className="grid place-items-center bg-verdict-conditional text-xs font-bold text-primary-foreground"
                style={{ width: `${width.conditional}%` }}
              >
                {stats.conditional}
              </span>
            )}
            {stats.tooBig > 0 && (
              <span
                className="grid place-items-center bg-verdict-toobig text-xs font-bold text-primary-foreground"
                style={{ width: `${width.tooBig}%` }}
              >
                {stats.tooBig}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5" data-testid="sizing-findings">
          <ItemList
            heading={c.readyHeading}
            guidance={c.readyGuidance}
            items={stats.readyItems}
            accent="border-verdict-fits"
            testId="sizing-list-ready"
          />
          <ItemList
            heading={c.maybeHeading}
            guidance={c.maybeGuidance}
            items={stats.maybeItems}
            accent="border-verdict-conditional"
            testId="sizing-list-maybe"
          />
          <ItemList
            heading={c.tooBigHeading}
            guidance={c.tooBigGuidance}
            items={stats.tooBigItems}
            accent="border-verdict-toobig"
            testId="sizing-list-toobig"
          />
          <ItemList
            heading={c.unsizedHeading}
            guidance={c.unsizedGuidance}
            items={stats.unsizedItems}
            accent="border-border"
            testId="sizing-list-unsized"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <Button onClick={copySummary} variant="outline">
            {copied ? "Copied" : "Copy the lists"}
          </Button>
          <Button onClick={onRestart} variant="ghost">
            Run another round
          </Button>
        </div>
      </div>

      <section className="mt-10" data-testid="sizing-next-steps">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          {c.nextStepsHeading}
        </h2>
        <div className="flex flex-col gap-5">
          {c.nextSteps.map((step) => (
            <div
              key={step.question}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <h3 className="mb-2 text-base font-bold text-foreground">{step.question}</h3>
              <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
                {step.answer}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={step.href}
                  onClick={() => onNextStepClick(step.question)}
                  className="text-[15px] font-medium text-primary underline underline-offset-4"
                >
                  {step.linkLabel}
                </a>
                {step.video && (
                  <button
                    type="button"
                    onClick={() => {
                      trackVideoPlay(refinementVideo, "sizing-wrap-up");
                      setVideoOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary underline underline-offset-4"
                    data-testid="sizing-refinement-video"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Watch it in {refinementVideo.durationSeconds} seconds
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <FilmLightbox open={videoOpen} onOpenChange={setVideoOpen} video={refinementVideo} />
    </div>
  );
};

export default WrapUpView;
