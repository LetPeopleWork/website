import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import WrapUpView from "@/features/sizing-poker/components/WrapUpView";
import { sizingPokerContent, questionFor } from "@/features/sizing-poker/content/sizingPokerContent";
import {
  DEFAULT_TARGET_DAYS,
  currentItem,
  initialState,
  reduce,
  type Verdict,
} from "@/features/sizing-poker/core/roundMachine";
import { statsFor } from "@/features/sizing-poker/core/roundStats";

// PROTOTYPE D - Benji's model (Slack thread, 21.8.2026). Link-only, noindex,
// no analytics.
//
// The differences to the other walkthrough variants:
// - ALL sample items are in the round, not a curated three.
// - No target answers and no redirects. Every answer is simply taken.
// - On the first item, two highlight popups run once: read the title and
//   discuss it, then choose an answer.
// - Every click opens the popup for that answer. Yes is a short one, Maybe
//   and No hold the discussion prompt. The vote lands when the popup closes,
//   so the item under discussion stays on screen.
//
// The popup texts are Benji's own words from the Slack thread (21.8.2026).
// Everything a visitor reads lives in POPUPS, INTRO_STEPS and PAGE_TEXT, so
// there is exactly one place to rewrite.

const PAGE_TEXT = {
  title: "Sizing Poker (Prototype D) - Popup guidance",
  contextLine: "An example round with a 10 day window.",
  popupCta: "Next item",
  introCta: "Next",
};

// The two highlight popups on the first item.
const INTRO_STEPS = [
  {
    anchor: "sizing-item",
    text: "Read the title and discuss if you understand it.",
  },
  {
    anchor: "popup-answers",
    text: "Choose whether it's doable within 10 days or less.",
  },
];

// One popup per answer, on every click.
const POPUPS: Record<Verdict, { heading: string; body: string }> = {
  fits: {
    heading: "Yes",
    body: "Great, move on to the next item.",
  },
  conditional: {
    heading: "Maybe",
    body: "Discuss what must be true in order that it can be done in 10 days. Can we achieve that? For example pairing, or commitment from the marketing department.",
  },
  "too-big": {
    heading: "No",
    body: "Discuss how we can address this. For example splitting the item into smaller parts.",
  },
};

const POPUP_ACCENTS: Record<Verdict, string> = {
  fits: "border-l-verdict-fits",
  conditional: "border-l-verdict-conditional",
  "too-big": "border-l-verdict-toobig",
};

// The two first-item highlight popups: dim everything except the anchored
// element, and put the instruction in a card docked at the bottom so it never
// covers what it points at.
const IntroHighlight = ({
  anchor,
  text,
  cta,
  onNext,
}: {
  anchor: string;
  text: string;
  cta: string;
  onNext: () => void;
}) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(`[data-testid="${anchor}"]`);
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
      <div className="pointer-events-none fixed inset-0 z-40" data-testid="intro-highlight">
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
        <Button onClick={onNext} data-testid="intro-next">
          {cta}
        </Button>
      </div>
    </>
  );
};

interface SizingPoker4Props {
  now?: () => number;
}

const SizingPoker4 = ({ now = Date.now }: SizingPoker4Props) => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  // The verdict whose popup is open. The vote is dispatched on dismiss, so
  // the popup talks about the item still on screen.
  const [pending, setPending] = useState<Verdict | null>(null);
  // 0 and 1 are the highlight steps on the first item; 2 means free play.
  const [introStep, setIntroStep] = useState(0);
  const booted = useRef(false);

  // Straight into the round, with the full example backlog.
  useEffect(() => {
    if (booted.current) {
      return;
    }
    booted.current = true;
    dispatch({ type: "begin" });
    dispatch({
      type: "start",
      items: sizingPokerContent.sampleItems,
      targetDays: DEFAULT_TARGET_DAYS,
      at: now(),
    });
  }, [now]);

  const stats = useMemo(() => statsFor(state), [state]);
  const item = currentItem(state);

  const vote = (verdict: Verdict) => {
    setPending(verdict);
  };

  const dismissPopup = () => {
    if (pending !== null) {
      dispatch({ type: "vote", verdict: pending, at: now() });
      setPending(null);
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (state.phase !== "running") {
        return;
      }
      if (introStep < INTRO_STEPS.length) {
        if (event.key === "Enter") {
          event.preventDefault();
          setIntroStep((step) => step + 1);
        }
        return;
      }
      if (pending !== null) {
        if (event.key === "Enter") {
          event.preventDefault();
          dismissPopup();
        }
        return;
      }
      const match = sizingPokerContent.answers.find((answer) => answer.key === event.key);
      if (match) {
        vote(match.verdict);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, pending, introStep]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title={PAGE_TEXT.title}
        description="Internal prototype: the full example backlog, with a popup after each first answer."
        noIndex
      />
      <Navigation />
      <main className="flex-1 px-4 pb-16 pt-28">
        <div className="mx-auto w-full max-w-2xl">
          {state.phase === "running" && item !== null && (
            <div data-testid="popup-run">
              <p className="mb-6 text-sm text-muted-foreground">{PAGE_TEXT.contextLine}</p>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-3 flex items-baseline justify-between text-sm tabular-nums text-muted-foreground">
                  <span>
                    Item{" "}
                    <strong className="font-semibold text-foreground">
                      {state.currentIndex + 1}
                    </strong>{" "}
                    of{" "}
                    <strong className="font-semibold text-foreground">
                      {state.items.length}
                    </strong>
                  </span>
                </div>
                <div className="mb-6 h-[3px] overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-[width] duration-300"
                    style={{ width: `${(state.currentIndex / state.items.length) * 100}%` }}
                  />
                </div>
                <p
                  className="mb-2 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground"
                  data-testid="sizing-item"
                >
                  {item}
                </p>
                <p className="mb-6 text-lg text-muted-foreground">
                  {questionFor(state.targetDays)}
                </p>
                <div className="grid gap-2.5" data-testid="popup-answers">
                  {sizingPokerContent.answers.map((answer) => (
                    <button
                      key={answer.verdict}
                      type="button"
                      onClick={() => vote(answer.verdict)}
                      className="grid grid-cols-[26px_1fr] items-center gap-3.5 rounded-xl border border-border bg-muted/40 px-4 py-4 text-left text-foreground transition-colors hover:border-primary"
                    >
                      <kbd className="grid h-[26px] w-[26px] place-items-center rounded-md border border-border bg-card text-xs font-bold text-muted-foreground">
                        {answer.key}
                      </kbd>
                      <span>
                        <span className="block text-base font-semibold">{answer.title}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {answer.subtitle}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {state.phase === "done" && (
            <WrapUpView
              stats={stats}
              targetDays={state.targetDays}
              onRestart={() => window.location.reload()}
              onNextStepClick={() => {}}
            />
          )}
        </div>
      </main>

      {state.phase === "running" && introStep < INTRO_STEPS.length && (
        <IntroHighlight
          anchor={INTRO_STEPS[introStep].anchor}
          text={INTRO_STEPS[introStep].text}
          cta={PAGE_TEXT.introCta}
          onNext={() => setIntroStep((step) => step + 1)}
        />
      )}

      {pending !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 px-4"
          data-testid="verdict-popup"
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-border border-l-[4px] bg-card p-6 shadow-soft ${POPUP_ACCENTS[pending]}`}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
              {POPUPS[pending].heading}
            </h2>
            <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
              {POPUPS[pending].body}
            </p>
            <Button onClick={dismissPopup} size="lg" data-testid="popup-dismiss">
              {PAGE_TEXT.popupCta}
            </Button>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
};

export default SizingPoker4;
