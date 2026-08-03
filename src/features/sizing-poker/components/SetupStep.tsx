import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sizingPokerContent } from "../content/sizingPokerContent";
import { MAX_ITEMS, parseItems } from "../core/roundMachine";

interface SetupStepProps {
  sleValue: string;
  itemsValue: string;
  onSleChange: (value: string) => void;
  onItemsChange: (value: string) => void;
  onStart: () => void;
}

const c = sizingPokerContent;

const SetupStep = ({
  sleValue,
  itemsValue,
  onSleChange,
  onItemsChange,
  onStart,
}: SetupStepProps) => {
  const count = parseItems(itemsValue).length;

  return (
    <div data-testid="sizing-setup">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {c.eyebrow}
      </p>
      <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {c.heading}
      </h1>
      <p className="mb-7 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
        {c.lede}
      </p>

      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sizing-sle" className="text-sm font-semibold">
            {c.sleLabel}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="sizing-sle"
              type="number"
              min={1}
              max={365}
              inputMode="numeric"
              value={sleValue}
              onChange={(event) => onSleChange(event.target.value)}
              aria-describedby="sizing-sle-help"
              className="max-w-[110px] font-semibold tabular-nums"
            />
            <span className="text-sm text-muted-foreground">{c.sleUnit}</span>
          </div>
          <p id="sizing-sle-help" className="text-sm leading-relaxed text-muted-foreground">
            {c.sleHelp}
          </p>
        </div>

        <hr className="border-border" />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sizing-items" className="text-sm font-semibold">
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
          />
          <p id="sizing-items-help" className="text-sm text-muted-foreground">
            {c.itemsHelp}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onStart} disabled={count === 0} size="lg">
            {c.startCta}
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="sizing-item-count">
            {count === 0
              ? "Add at least one item"
              : `${count} item${count === 1 ? "" : "s"} ready`}
            {count === MAX_ITEMS ? ` (capped at ${MAX_ITEMS})` : ""}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">{c.privacyNote}</p>
    </div>
  );
};

export default SetupStep;
