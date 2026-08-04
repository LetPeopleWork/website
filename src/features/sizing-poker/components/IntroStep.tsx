import { Button } from "@/components/ui/button";
import { sizingPokerContent } from "../content/sizingPokerContent";

interface IntroStepProps {
  onBegin: () => void;
}

const c = sizingPokerContent.intro;

// Short on purpose. The first version opened with a paragraph of explanation and
// the first reviewer clicked straight past it without reading a word, which is
// the correct behaviour and the reason this screen exists at all.
const IntroStep = ({ onBegin }: IntroStepProps) => (
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

    <Button onClick={onBegin} size="lg" className="px-8">
      {c.cta}
    </Button>

    <p className="mt-5 text-sm text-muted-foreground">{c.aside}</p>
  </div>
);

export default IntroStep;
