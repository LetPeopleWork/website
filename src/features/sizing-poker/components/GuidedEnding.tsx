import { Button } from "@/components/ui/button";
import { sizingPokerContent } from "../content/sizingPokerContent";
import type { RoundStats } from "../core/roundStats";
import { splitWidths } from "../core/roundStats";
import WalkthroughBar from "./WalkthroughBar";

interface GuidedEndingProps {
  stats: RoundStats;
  onOwnItems: () => void;
  onExit: () => void;
}

const g = sizingPokerContent.guided;
const w = sizingPokerContent.wrapUp;

// The guided wrap-up (G10). Deliberately NOT the normal WrapUpView: a guided
// pace is fabricated by someone reading coach notes, and ending the walkthrough
// on the page's headline number would make a newcomer's first pace a false one.
// No seconds-per-item appears here; the space goes to the handover instead,
// which is the conversion KPI.
const List = ({
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
          <li key={`${item}-${i}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const GuidedEnding = ({ stats, onOwnItems, onExit }: GuidedEndingProps) => {
  const width = splitWidths(stats);

  return (
    <div data-testid="guided-ending">
      <WalkthroughBar finished onExit={onExit} />

      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {g.endingEyebrow}
      </p>
      <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {g.endingHeading}
      </h1>
      <p className="mb-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
        {g.endingLede}
      </p>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex h-10 overflow-hidden rounded-lg border border-border">
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

        <div className="flex flex-col gap-5">
          <List
            heading={w.readyHeading}
            guidance={w.readyGuidance}
            items={stats.readyItems}
            accent="border-verdict-fits"
            testId="guided-list-ready"
          />
          <List
            heading={w.maybeHeading}
            guidance={w.maybeGuidance}
            items={stats.maybeItems}
            accent="border-verdict-conditional"
            testId="guided-list-maybe"
          />
          <List
            heading={w.tooBigHeading}
            guidance={w.tooBigGuidance}
            items={stats.tooBigItems}
            accent="border-verdict-toobig"
            testId="guided-list-toobig"
          />
        </div>
      </div>

      <div
        className="mt-7 rounded-2xl border border-primary bg-accent p-6"
        data-testid="guided-handover"
      >
        <h3 className="mb-1.5 text-xl font-bold tracking-tight text-foreground">
          {g.handoverHeading}
        </h3>
        <p className="mb-5 max-w-[58ch] text-[15px] leading-relaxed text-foreground/75">
          {g.handoverBody}
        </p>
        <Button onClick={onOwnItems} size="lg">
          {g.handoverCta}
        </Button>
      </div>
    </div>
  );
};

export default GuidedEnding;
