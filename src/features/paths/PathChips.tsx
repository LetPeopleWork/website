import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { PATHS, type PathKey } from "./paths";

interface PathChipsProps {
  selected?: PathKey;
  onSelect: (key: PathKey | undefined) => void;
  /** Shown above the chips. */
  label?: string;
  className?: string;
}

// The "What brings you here?" row. Buttons, not links: a choice changes what
// the page emphasises, it is not a navigation. aria-pressed tells screen
// readers which one is active; pressing the active one again clears it, and
// the x inside it says so.
//
// On phones the chips sit in one row that scrolls sideways, so they never
// push the buttons below the first screen.
const PathChips = ({
  selected,
  onSelect,
  label = "What brings you here?",
  className = "",
}: PathChipsProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // On a phone the row scrolls sideways; keep the chosen chip in view, for
  // example when a ?for= link preselects the last one. Only the row scrolls,
  // never the page.
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }, [selected]);

  return (
  <div className={className} data-testid="path-chips">
    <p className="text-sm font-medium text-foreground mb-3">{label}</p>
    <div
      ref={rowRef}
      className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label={label}
    >
      {PATHS.map((path) => {
        const active = path.key === selected;
        return (
          <button
            key={path.key}
            type="button"
            aria-pressed={active}
            title={active ? "Show the default again" : undefined}
            onClick={() => onSelect(active ? undefined : path.key)}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {path.chip}
            {active && <X className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  </div>
  );
};

export default PathChips;
