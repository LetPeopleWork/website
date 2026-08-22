import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { sizingPokerContent } from "../content/sizingPokerContent";

interface GuidedHighlightProps {
  /** CSS selector of the element to cut out of the dim layer. */
  anchor: string;
  text: string;
  onNext: () => void;
}

// A walkthrough highlight step (G20): dim the page, cut the anchored element
// out of the dim layer, and put the instruction in a card docked at the
// bottom of the viewport - docked, not anchored, so it can never cover the
// element it points at. The backdrop ignores pointer events on purpose: the
// page underneath stays usable, the dimming only directs the eye.
const GuidedHighlight = ({ anchor, text, onNext }: GuidedHighlightProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Polled, not observed: the anchor is re-created on every step change and a
  // ResizeObserver would need re-wiring each time. 150ms is imperceptible.
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(anchor);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    measure();
    const id = window.setInterval(measure, 150);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
    };
  }, [anchor]);

  if (rect === null) {
    return null;
  }

  const pad = 8;
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40" data-testid="guided-highlight">
        <div
          className="absolute rounded-2xl outline outline-2 outline-offset-4 outline-primary transition-all duration-300"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + 2 * pad,
            height: rect.height + 2 * pad,
            boxShadow: "0 0 0 9999px hsl(215 30% 14% / 0.5)",
          }}
        />
      </div>
      <div className="fixed bottom-4 left-1/2 z-50 w-[min(380px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <p className="mb-4 text-[15px] leading-relaxed text-foreground">{text}</p>
        <Button onClick={onNext} data-testid="guided-highlight-next">
          {sizingPokerContent.guided.stepCta}
        </Button>
      </div>
    </>
  );
};

export default GuidedHighlight;
