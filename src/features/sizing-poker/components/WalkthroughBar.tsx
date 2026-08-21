import { sizingPokerContent } from "../content/sizingPokerContent";

interface WalkthroughBarProps {
  finished?: boolean;
  onExit: () => void;
}

const g = sizingPokerContent.guided;

// G11: one slim element carrying mode identity and the escape. Deliberately no
// step counter - the round's own "Item 2 of 3" already tracks progress, and a
// second indicator would be noise.
const WalkthroughBar = ({ finished = false, onExit }: WalkthroughBarProps) => (
  <div
    className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-2.5"
    data-testid="walkthrough-bar"
  >
    <span className="flex items-center gap-2 text-sm font-bold text-primary">
      <i className="inline-block h-[7px] w-[7px] rounded-full bg-primary" aria-hidden="true" />
      {finished ? g.modeLabelFinished : g.modeLabel}
    </span>
    <button
      type="button"
      onClick={onExit}
      className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
    >
      {g.exitLabel}
    </button>
  </div>
);

export default WalkthroughBar;
