import { PATHS, type PathKey } from "./paths";

interface PathChipsProps {
  selected?: PathKey;
  onSelect: (key: PathKey | undefined) => void;
  /** Shown left of the chips. */
  label?: string;
  className?: string;
}

// The "What brings you here?" row. Buttons, not links: a choice changes what
// the page emphasises, it is not a navigation. aria-pressed tells screen
// readers which one is active; choosing the active one again clears it.
const PathChips = ({
  selected,
  onSelect,
  label = "What brings you here?",
  className = "",
}: PathChipsProps) => (
  <div className={className} data-testid="path-chips">
    <p className="text-sm font-medium text-foreground mb-3">{label}</p>
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={label}>
      {PATHS.map((path) => {
        const active = path.key === selected;
        return (
          <button
            key={path.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(active ? undefined : path.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {path.chip}
          </button>
        );
      })}
      {selected && (
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className="rounded-full px-3 py-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Show everything
        </button>
      )}
    </div>
  </div>
);

export default PathChips;
