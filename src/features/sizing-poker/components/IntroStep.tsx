import { Button } from "@/components/ui/button";
import { sizingPokerContent } from "../content/sizingPokerContent";

interface IntroStepProps {
  onBegin: () => void;
  onBeginGuided: () => void;
}

const c = sizingPokerContent.intro;
const g = sizingPokerContent.guided;

// Short on purpose. The first version opened with a paragraph of explanation and
// the first reviewer clicked straight past it without reading a word, which is
// the correct behaviour and the reason this screen exists at all.
const IntroStep = ({ onBegin, onBeginGuided }: IntroStepProps) => (
  <div data-testid="sizing-intro" className="py-8">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
      {c.eyebrow}
    </p>
    <h1 className="mb-4 text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl">
      {c.heading}
    </h1>
    <p className="mb-8 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
      {c.lede}
    </p>

    {/* Two buttons, no captions (G9): the split is whose items - yours, or
        our example - not beginner versus expert. Nobody has to admit anything
        to choose. */}
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onBegin} size="lg" className="px-8">
        {c.cta}
      </Button>
      <Button onClick={onBeginGuided} size="lg" variant="outline" className="px-8">
        {g.entryCta}
      </Button>
    </div>

    <p className="mt-5 text-sm text-muted-foreground">{c.aside}</p>
  </div>
);

export default IntroStep;
