import { Button } from "@/components/ui/button";
import type { RoundStats } from "../core/roundStats";
import { formatDuration, splitWidths } from "../core/roundStats";

interface ResultViewProps {
  stats: RoundStats;
  sleDays: number;
  onRestart: () => void;
}

const LEGEND = [
  { key: "fits", label: "Fits", dot: "bg-verdict-fits" },
  { key: "conditional", label: "Fits, with a condition", dot: "bg-verdict-conditional" },
  { key: "toobig", label: "Too big", dot: "bg-verdict-toobig" },
] as const;

const Finding = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-l-[3px] border-primary py-0.5 pl-4">
    <h3 className="mb-1.5 text-[15px] font-bold text-foreground">{title}</h3>
    <div className="text-[15px] leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

const ResultView = ({ stats, sleDays, onRestart }: ResultViewProps) => {
  const width = splitWidths(stats);

  return (
    <div data-testid="sizing-result">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        Round complete
      </p>
      <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {stats.wasFast ? "That was faster than estimating." : "That took longer than it should."}
      </h1>

      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="py-1 text-center">
          <div
            className="text-6xl font-bold leading-none tracking-tighter text-primary tabular-nums md:text-7xl"
            data-testid="sizing-seconds-per-item"
          >
            {stats.secondsPerItem.toFixed(1)}
          </div>
          <div className="mt-2 text-[15px] text-muted-foreground">seconds per item</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {stats.total} item{stats.total === 1 ? "" : "s"} in{" "}
            {formatDuration(stats.elapsedMs)} total
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h2 className="mb-2.5 text-[15px] font-bold text-foreground">How the round split</h2>
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
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {LEGEND.map((entry) => (
              <span key={entry.key} className="flex items-center gap-1.5">
                <i className={`inline-block h-2.5 w-2.5 rounded-sm ${entry.dot}`} />
                {entry.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5" data-testid="sizing-findings">
          {stats.tooBig > 0 && (
            <Finding
              title={
                stats.tooBig === 1
                  ? "Slice this one before anyone starts it"
                  : `Slice these ${stats.tooBig} before anyone starts them`
              }
            >
              <p>
                {stats.tooBig === 1
                  ? `It is bigger than what your system finishes in ${sleDays} days. Started as-is, it ages.`
                  : `Each one is bigger than what your system finishes in ${sleDays} days. Started as-is, they age.`}
              </p>
              <ul className="mt-2 list-disc pl-5">
                {stats.tooBigItems.map((item, i) => (
                  <li key={`${item}-${i}`} className="mb-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </Finding>
          )}

          {stats.conditional > 0 && (
            <Finding
              title={`${stats.conditional} item${stats.conditional === 1 ? "" : "s"} depend${stats.conditional === 1 ? "s" : ""} on something being arranged`}
            >
              <p>
                That is not an estimation problem — it is a system one, and it is the part
                worth talking about.
              </p>
            </Finding>
          )}

          {stats.fits === stats.total && stats.total > 0 && (
            <Finding title="Everything fits">
              <p>
                No conversation needed. That is a healthy backlog — pull the top item and go.
              </p>
            </Finding>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={onRestart} size="lg">
          Run another round
        </Button>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Don't know your real SLE?{" "}
        <a href="/lighthouse" className="text-primary underline underline-offset-4">
          Lighthouse
        </a>{" "}
        computes it from the tracker you already use. If the same items keep coming back
        too big, the{" "}
        <a href="/#workshops" className="text-primary underline underline-offset-4">
          SLE &amp; Right Sizing and Epic Right Sizing &amp; Slicing workshops
        </a>{" "}
        are built for exactly that.
      </p>
    </div>
  );
};

export default ResultView;
