import { useEffect, useMemo, useReducer, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WrapUpView from "@/features/sizing-poker/components/WrapUpView";
import { sizingPokerContent, questionFor } from "@/features/sizing-poker/content/sizingPokerContent";
import ConfigStep from "@/features/sizing-poker/components/ConfigStep";
import {
  DEFAULT_TARGET_DAYS,
  currentItem,
  initialState,
  normaliseTarget,
  parseItems,
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
  contextLine: (days: number) => `An example round with a ${days} day window.`,
  popupCta: "Next item",
  introCta: "Next",
};

// The two highlight popups on the config screen.
const CONFIG_STEPS = [
  {
    anchor: "#sizing-target",
    text: () =>
      "First, set how quickly an item should normally be done where you work. A rough number is fine.",
  },
  {
    anchor: "#sizing-items",
    text: () =>
      "Your items go here, one per line, straight from your backlog. For this round we filled in an example backlog. Press Start sizing when you're ready.",
  },
];

// The two highlight popups on the first item.
const INTRO_STEPS = [
  {
    anchor: '[data-testid="sizing-item"]',
    text: () => "Read the title and discuss if you understand it.",
  },
  {
    anchor: '[data-testid="popup-answers"]',
    text: (days: number) => `Choose whether it's doable within ${days} days or less.`,
  },
];

// A maybe needs an example that fits the item, or the popup reads like a
// template. Keyed by item title; the fallback covers items added later.
const MAYBE_EXAMPLES: Record<string, string> = {
  "Add SSO login via Azure AD": "access to the Azure AD tenant, or test accounts from IT",
  "Fix timezone bug in the export scheduler": "reproduction data from support, or pairing with someone who knows the scheduler",
  "Migrate the reporting database to the new cluster": "a maintenance window agreed with operations",
  "Add CSV export to the metrics table": "pairing with someone who knows the metrics code",
  "Rework the onboarding email sequence": "commitment from the marketing department",
  "Support custom date ranges in forecasts": "a decision from the product owner on how far back ranges may go",
  "Add rate limiting to the public API": "agreement with the customers who use the API today",
  "Replace the deprecated charting library": "a decision which library to use instead",
};
const MAYBE_FALLBACK = "pairing, or help from another team";

// Same idea for a no: a splitting suggestion that fits the item on screen.
const NO_EXAMPLES: Record<string, string> = {
  "Add SSO login via Azure AD": "starting with login for one pilot group before rolling it out to everyone",
  "Fix timezone bug in the export scheduler": "fixing it first for the one report where it hurts most",
  "Migrate the reporting database to the new cluster": "moving a single report to the new cluster first",
  "Add CSV export to the metrics table": "exporting the current view first and adding filters later",
  "Rework the onboarding email sequence": "reworking the first email before the rest of the sequence",
  "Support custom date ranges in forecasts": "starting with a fixed set of ranges before free ones",
  "Add rate limiting to the public API": "starting with a limit on the one endpoint that gets hit hardest",
  "Replace the deprecated charting library": "replacing a single chart first to prove the new library",
};
const NO_FALLBACK = "splitting the item into smaller parts";

// One popup per answer, on every click.
const POPUPS: Record<Verdict, { heading: string; body: (days: number, item: string) => string }> = {
  fits: {
    heading: "Yes",
    body: () => "Great, move on to the next item.",
  },
  conditional: {
    heading: "Maybe",
    body: (days, item) =>
      `Discuss what must be true in order that it can be done in ${days} days. Can we achieve that? For example ${MAYBE_EXAMPLES[item] ?? MAYBE_FALLBACK}.`,
  },
  "too-big": {
    heading: "No",
    body: (_days, item) =>
      `Discuss how we can address this. For example splitting the item into smaller parts: ${NO_EXAMPLES[item] ?? NO_FALLBACK}.`,
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
  // Same again for the config screen.
  const [configStep, setConfigStep] = useState(0);
  const [daysValue, setDaysValue] = useState(String(DEFAULT_TARGET_DAYS));
  // Prefilled: the example backlog sits in the real form, so the screen the
  // popups explain is the one a team will actually use.
  const [itemsValue, setItemsValue] = useState(sizingPokerContent.sampleItems.join("\n"));

  const startRound = () => {
    const items = parseItems(itemsValue);
    if (items.length === 0) {
      return;
    }
    dispatch({ type: "begin" });
    dispatch({
      type: "start",
      items,
      targetDays: normaliseTarget(daysValue),
      at: now(),
    });
  };

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
          {(state.phase === "intro" || state.phase === "config") && (
            <div data-testid="popup-start">
              <ConfigStep
                targetValue={daysValue}
                itemsValue={itemsValue}
                onTargetChange={setDaysValue}
                onItemsChange={setItemsValue}
                onUseSample={() => setItemsValue(sizingPokerContent.sampleItems.join("\n"))}
                onStart={startRound}
              />
            </div>
          )}

          {state.phase === "running" && item !== null && (
            <div data-testid="popup-run">
              <p className="mb-6 text-sm text-muted-foreground">{PAGE_TEXT.contextLine(state.targetDays)}</p>

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

      {(state.phase === "intro" || state.phase === "config") &&
        configStep < CONFIG_STEPS.length && (
          <IntroHighlight
            anchor={CONFIG_STEPS[configStep].anchor}
            text={CONFIG_STEPS[configStep].text()}
            cta={PAGE_TEXT.introCta}
            onNext={() => setConfigStep((step) => step + 1)}
          />
        )}

      {state.phase === "running" && introStep < INTRO_STEPS.length && (
        <IntroHighlight
          anchor={INTRO_STEPS[introStep].anchor}
          text={INTRO_STEPS[introStep].text(state.targetDays)}
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
              {POPUPS[pending].body(state.targetDays, item ?? "")}
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
