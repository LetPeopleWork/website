import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sizingPokerContent } from "../content/sizingPokerContent";
import WalkthroughBar from "./WalkthroughBar";
import { MAX_ITEMS, parseItems } from "../core/roundMachine";

interface ConfigStepProps {
  targetValue: string;
  itemsValue: string;
  onTargetChange: (value: string) => void;
  onItemsChange: (value: string) => void;
  onUseSample: () => void;
  onStart: () => void;
  /** Walkthrough mode (G15): one focused control, everything else collapsed. */
  guided?: boolean;
  onExitGuided?: () => void;
}

const c = sizingPokerContent.config;
const g = sizingPokerContent.guided;

const ConfigStep = ({
  targetValue,
  itemsValue,
  onTargetChange,
  onItemsChange,
  onUseSample,
  onStart,
  guided = false,
  onExitGuided,
}: ConfigStepProps) => {
  const count = parseItems(itemsValue).length;

  // G15: in the walkthrough the config shows exactly one focused control. The
  // example backlog is confirmed in a single line, never rendered as a form -
  // showing the whole form at once was the "crowded" first version.
  if (guided) {
    return (
      <div data-testid="sizing-config">
        <WalkthroughBar onExit={onExitGuided ?? (() => {})} />

        <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {g.configHeading}
        </h1>

        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p
            className="rounded-xl border border-coach-rule border-l-[3px] border-l-coach bg-coach-wash px-4 py-3 text-sm leading-relaxed text-coach"
            data-testid="guided-coach"
          >
            {g.configCoach}
          </p>

          <div className="-m-3 rounded-xl bg-coach-wash p-3 ring-2 ring-coach" data-testid="guided-ring">
            <Label htmlFor="sizing-target" className="text-base font-semibold">
              {c.targetLabel}
            </Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                id="sizing-target"
                type="number"
                min={1}
                max={365}
                inputMode="numeric"
                value={targetValue}
                onChange={(event) => onTargetChange(event.target.value)}
                className="max-w-[110px] font-semibold tabular-nums"
              />
              <span className="text-muted-foreground">{c.targetUnit}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground" data-testid="guided-confirmation">
            <span className="font-semibold text-primary">&#10003;</span>{" "}
            {g.configConfirmation}
          </p>

          <div>
            <Button onClick={onStart} size="lg">
              {c.cta}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="sizing-config">
      <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {c.heading}
      </h1>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sizing-target" className="text-base font-semibold">
            {c.targetLabel}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="sizing-target"
              type="number"
              min={1}
              max={365}
              inputMode="numeric"
              value={targetValue}
              onChange={(event) => onTargetChange(event.target.value)}
              aria-describedby="sizing-target-help"
              className="max-w-[110px] font-semibold tabular-nums"
            />
            <span className="text-muted-foreground">{c.targetUnit}</span>
          </div>
          <p id="sizing-target-help" className="text-sm text-muted-foreground">
            {c.targetHelp}
          </p>
        </div>

        <hr className="border-border" />

        <div className="flex flex-col gap-2">
          <Label htmlFor="sizing-items" className="text-base font-semibold">
            {c.itemsLabel}
          </Label>
          <Textarea
            id="sizing-items"
            spellCheck={false}
            rows={7}
            value={itemsValue}
            onChange={(event) => onItemsChange(event.target.value)}
            aria-describedby="sizing-items-help"
            className="min-h-[150px] leading-relaxed"
            placeholder={"Add SSO login via Azure AD\nFix timezone bug in the export scheduler\n..."}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p id="sizing-items-help" className="text-sm text-muted-foreground">
              {c.itemsHelp}
            </p>
            <button
              type="button"
              onClick={onUseSample}
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              {c.sampleCta}
            </button>
          </div>
        </div>

        {/* The page runs as a shared-screen session, so the one thing it cannot
            enforce is that people answer independently. Said here, before the
            round, rather than during it: a countdown per item would fix the same
            problem but cost a second or two on every item, and the seconds per
            item figure is the whole claim. See feature-delta.md D14. */}
        <p
          className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
          data-testid="sizing-facilitation-hint"
        >
          {c.facilitationHint}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onStart} disabled={count === 0} size="lg">
            {c.cta}
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="sizing-item-count">
            {count === 0
              ? "Add at least one item"
              : `${count} item${count === 1 ? "" : "s"} ready`}
            {count === MAX_ITEMS ? ` (capped at ${MAX_ITEMS})` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfigStep;
