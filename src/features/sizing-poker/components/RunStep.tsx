import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { sizingPokerContent, questionFor } from "../content/sizingPokerContent";
import type { Verdict } from "../core/roundMachine";
import { formatDuration } from "../core/roundStats";
import WalkthroughBar from "./WalkthroughBar";

interface RunStepProps {
  item: string;
  index: number;
  total: number;
  targetDays: number;
  startedAt: number;
  onVote: (verdict: Verdict) => void;
  onAbandon: () => void;
  /** Walkthrough mode (G12/G3). Absent = a normal round, untouched. */
  guided?: {
    /** Nudge shown above the item, before answering. Item 2 only (G17). */
    noteBefore?: string;
    /** Quiet aside below the answers. Item 1 only (G16). */
    noteAfter?: string;
    /** First-"No" lesson currently replacing the answers (G3). */
    lessonPending: boolean;
    onDismissLesson: () => void;
    onExit: () => void;
  };
  /** Injectable for tests so the ticking clock does not need real timers. */
  now?: () => number;
}

const g = sizingPokerContent.guided;

const c = sizingPokerContent;

// Deliberately no text input anywhere in this view (AC-1.2), and exactly one
// item on screen (AC-1.3): with nothing to compare against, there is nothing to
// calibrate, and the answer stays an instinct rather than a negotiation.
//
// What to DO about a Maybe or a No is deliberately not explained here. That
// guidance sits on the wrap-up, next to the lists it applies to, so the vote
// itself stays a reflex. See feature-delta.md D11.
const VERDICT_STYLES: Record<Verdict, string> = {
  fits: "hover:border-verdict-fits hover:bg-verdict-fits-wash hover:text-verdict-fits",
  conditional:
    "hover:border-verdict-conditional hover:bg-verdict-conditional-wash hover:text-verdict-conditional",
  "too-big":
    "hover:border-verdict-toobig hover:bg-verdict-toobig-wash hover:text-verdict-toobig",
};

const RunStep = ({
  item,
  index,
  total,
  targetDays,
  startedAt,
  onVote,
  onAbandon,
  guided,
  now = Date.now,
}: RunStepProps) => {
  const [elapsed, setElapsed] = useState(() => Math.max(0, now() - startedAt));

  useEffect(() => {
    const id = window.setInterval(() => setElapsed(Math.max(0, now() - startedAt)), 250);
    return () => window.clearInterval(id);
  }, [startedAt, now]);

  const lessonPending = guided?.lessonPending ?? false;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (guided && event.key === "Escape") {
        event.preventDefault();
        guided.onExit();
        return;
      }
      // While the lesson is up the answers are hidden, so the keys are too -
      // Enter dismisses instead, and mashing 1/2/3 cannot skip the teaching.
      if (lessonPending) {
        if (event.key === "Enter") {
          event.preventDefault();
          guided?.onDismissLesson();
        }
        return;
      }
      const match = c.answers.find((answer) => answer.key === event.key);
      if (match) {
        event.preventDefault();
        onVote(match.verdict);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onVote, guided, lessonPending]);

  return (
    <div data-testid="sizing-run">
      {guided && <WalkthroughBar onExit={guided.onExit} />}

      <div className="mb-3 flex items-baseline justify-between text-sm tabular-nums text-muted-foreground">
        <span>
          Item <strong className="font-semibold text-foreground">{index + 1}</strong> of{" "}
          <strong className="font-semibold text-foreground">{total}</strong>
        </span>
        <span aria-label="Time elapsed" data-testid="sizing-clock">
          {formatDuration(elapsed)}
        </span>
      </div>

      <div
        className="mb-8 h-[3px] overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-smooth"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      {guided?.noteBefore && !lessonPending && (
        <p
          className="mb-5 rounded-xl border border-coach-rule border-l-[3px] border-l-coach bg-coach-wash px-4 py-3 text-sm leading-relaxed text-coach"
          data-testid="guided-note-before"
        >
          {guided.noteBefore}
        </p>
      )}

      {!guided && (
        <p className="mb-4 text-sm font-medium text-primary">{c.run.facilitatorCue}</p>
      )}

      <p
        className="mb-3 flex min-h-[2.4em] items-center text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl"
        data-testid="sizing-item"
      >
        {item}
      </p>
      <p className="mb-7 text-lg text-muted-foreground">{questionFor(targetDays)}</p>

      {lessonPending ? (
        <div
          className="rounded-2xl border border-coach-rule bg-coach-wash p-5"
          data-testid="guided-lesson"
        >
          <h3 className="mb-2 text-lg font-bold tracking-tight text-coach">
            {g.lessonHeading}
          </h3>
          <p className="mb-2 text-[15px] leading-relaxed text-coach">{g.lessonIntro}</p>
          <ul className="mb-5 list-disc pl-5 text-[15px] leading-relaxed text-coach">
            {g.lessonOptions.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <Button onClick={guided?.onDismissLesson} size="lg">
            {g.lessonCta}
          </Button>
        </div>
      ) : (
      <div className="grid gap-2.5">
        {c.answers.map((answer) => (
          <button
            key={answer.verdict}
            type="button"
            onClick={() => onVote(answer.verdict)}
            className={`grid grid-cols-[26px_1fr] items-center gap-3.5 rounded-xl border border-border bg-muted/40 px-4 py-4 text-left text-foreground transition-colors ${VERDICT_STYLES[answer.verdict]}`}
          >
            <kbd className="grid h-[26px] w-[26px] place-items-center rounded-md border border-border bg-card text-xs font-bold text-muted-foreground">
              {answer.key}
            </kbd>
            <span>
              <span className="block text-base font-semibold">{answer.title}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {answer.subtitle}
              </span>
            </span>
          </button>
        ))}
      </div>
      )}

      {guided?.noteAfter && !lessonPending && (
        <p
          className="mt-5 border-l-[3px] border-coach-rule py-0.5 pl-3 text-[13.5px] leading-relaxed text-coach"
          data-testid="guided-note-after"
        >
          {guided.noteAfter}
        </p>
      )}

      {!guided && (
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-muted-foreground">{c.run.hint}</p>
        {/* Stopping early is the ordinary way a session ends: you bring ten
            items and get through five. Those five are a result, so this leads to
            the wrap-up rather than discarding them. Only before the first answer
            is there nothing to show, and then it reads "Start over" instead.
            Deliberately still not a "back one item" control: revisiting an
            answer is the deliberation this screen is built to avoid. */}
        <button
          type="button"
          onClick={onAbandon}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {index === 0 ? c.run.abandon : c.run.finishEarly}
        </button>
      </div>
      )}
    </div>
  );
};

export default RunStep;
