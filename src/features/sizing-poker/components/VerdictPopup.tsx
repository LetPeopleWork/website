import { Button } from "@/components/ui/button";
import { fillTemplate, sizingPokerContent } from "../content/sizingPokerContent";
import type { Verdict } from "../core/roundMachine";

interface VerdictPopupProps {
  verdict: Verdict;
  /** The item the click was about - it decides which example the text names. */
  item: string;
  targetDays: number;
  onDismiss: () => void;
}

const g = sizingPokerContent.guided;

const HEADINGS: Record<Verdict, string> = {
  fits: "Yes",
  conditional: "Maybe",
  "too-big": "No",
};

const ACCENTS: Record<Verdict, string> = {
  fits: "border-l-verdict-fits",
  conditional: "border-l-verdict-conditional",
  "too-big": "border-l-verdict-toobig",
};

const bodyFor = (verdict: Verdict, item: string, targetDays: number): string => {
  switch (verdict) {
    case "fits":
      return g.popupYes;
    case "conditional":
      return fillTemplate(g.popupMaybe, {
        days: targetDays,
        example: g.maybeExamples[item] ?? g.maybeFallback,
      });
    case "too-big":
      return fillTemplate(g.popupNo, {
        example: g.noExamples[item] ?? g.noFallback,
      });
  }
};

// The per-answer popup of the walkthrough (G20): every click gets one, with a
// discussion prompt whose example fits the item on screen. The vote is
// dispatched on dismiss, so the item under discussion stays visible behind
// the dim layer for as long as the team talks about it.
const VerdictPopup = ({ verdict, item, targetDays, onDismiss }: VerdictPopupProps) => (
  <div
    className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 px-4"
    data-testid="verdict-popup"
  >
    <div
      className={`w-full max-w-md rounded-2xl border border-border border-l-[4px] bg-card p-6 shadow-soft ${ACCENTS[verdict]}`}
      role="dialog"
      aria-modal="true"
    >
      <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
        {HEADINGS[verdict]}
      </h2>
      <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
        {bodyFor(verdict, item, targetDays)}
      </p>
      <Button onClick={onDismiss} size="lg" data-testid="verdict-popup-dismiss">
        {g.popupCta}
      </Button>
    </div>
  </div>
);

export default VerdictPopup;
