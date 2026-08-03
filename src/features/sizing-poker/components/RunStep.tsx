import { useEffect, useState } from "react";
import { sizingPokerContent, questionFor } from "../content/sizingPokerContent";
import type { Verdict } from "../core/roundMachine";
import { formatDuration } from "../core/roundStats";

interface RunStepProps {
  item: string;
  index: number;
  total: number;
  sleDays: number;
  startedAt: number;
  onVote: (verdict: Verdict) => void;
  /** Injectable for tests so the ticking clock does not need real timers. */
  now?: () => number;
}

const c = sizingPokerContent;

// Deliberately no text input anywhere in this view (AC-1.2), and exactly one
// item on screen (AC-1.3): with nothing to compare against, there is nothing to
// calibrate, and the answer stays an instinct rather than a negotiation.
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
  sleDays,
  startedAt,
  onVote,
  now = Date.now,
}: RunStepProps) => {
  const [elapsed, setElapsed] = useState(() => Math.max(0, now() - startedAt));

  useEffect(() => {
    const id = window.setInterval(() => setElapsed(Math.max(0, now() - startedAt)), 250);
    return () => window.clearInterval(id);
  }, [startedAt, now]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const match = c.answers.find((answer) => answer.key === event.key);
      if (match) {
        event.preventDefault();
        onVote(match.verdict);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onVote]);

  return (
    <div data-testid="sizing-run">
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

      <p
        className="mb-2 flex min-h-[2.4em] items-center text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl"
        data-testid="sizing-item"
      >
        {item}
      </p>
      <p className="mb-7 text-sm text-muted-foreground">{questionFor(sleDays)}</p>

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

      <p className="mt-6 text-sm text-muted-foreground">{c.runHint}</p>
    </div>
  );
};

export default RunStep;
