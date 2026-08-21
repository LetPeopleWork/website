import { useEffect, useMemo, useReducer, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IntroStep from "@/features/sizing-poker/components/IntroStep";
import ConfigStep from "@/features/sizing-poker/components/ConfigStep";
import RunStep from "@/features/sizing-poker/components/RunStep";
import WrapUpView from "@/features/sizing-poker/components/WrapUpView";
import GuidedEnding from "@/features/sizing-poker/components/GuidedEnding";
import { sizingPokerContent } from "@/features/sizing-poker/content/sizingPokerContent";
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

// PROTOTYPE B - the wizard-overlay walkthrough, for comparison against the
// shipped coach-panel style on /sizing-poker. Link-only, noindex, and no
// analytics: nothing from this page may touch the real evidence (G2).
//
// The wizard: the page dims, the one control that matters stays lit inside a
// spotlight cutout, and the coach speaks from a card anchored to it. A wrong
// answer shakes the card and swaps its text for the redirect (G19 still
// binds). Advance stays on-action (G6): the card never has a Next button
// during votes - the click itself drives the wizard.

const TOTAL_STEPS = 4; // config + three items

const STEP_TIPS = [
  "This is the one decision a round needs: the time window every item is judged against. 10 days is a good default — keep it and press Start sizing.",
  "Read the title and react — first instinct. Most everyday items feel like this one: small, contained, all yours.",
  "One thing to notice here: whose time does this need? Not everything a team sizes is theirs alone.",
  "Last one. Just react — and if it feels like a lot, say so.",
];

interface SpotlightProps {
  /** CSS selector of the element to cut out of the dim layer. */
  anchor: string;
  text: string;
  doHint: string;
  step: number;
  /** Bump to replay the shake (a redirect landed). */
  nudgeKey: number;
  /** Dock the card bottom-centre (run step) instead of anchoring it - an
      anchored card would cover the item title, the one thing to react to. */
  dock?: boolean;
  onExit: () => void;
}

const Spotlight = ({ anchor, text, doHint, step, nudgeKey, dock = false, onExit }: SpotlightProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Polled, not observed: the anchor is re-created on every step change and a
  // ResizeObserver would need re-wiring each time. 150ms is imperceptible and
  // this page is a prototype.
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(anchor);
      const r = el ? el.getBoundingClientRect() : null;
      // Docked card: keep the anchor fully above it. Instant, not smooth -
      // the 150ms polling would restart a smooth scroll before it moves.
      if (dock && r !== null) {
        const overlap = r.bottom - (window.innerHeight - 250);
        if (overlap > 8) {
          window.scrollBy(0, overlap);
          setRect(el ? el.getBoundingClientRect() : null);
          return;
        }
      }
      setRect(r);
    };
    measure();
    const id = window.setInterval(measure, 150);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
    };
  }, [anchor, dock]);

  if (rect === null) {
    return null;
  }

  const pad = 8;
  const below = rect.bottom + 230 < window.innerHeight;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40" data-testid="wizard-backdrop">
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
      <div
        key={nudgeKey}
        className={`fixed z-50 w-[min(340px,calc(100vw-32px))] rounded-2xl border border-border bg-card p-5 shadow-soft ${nudgeKey > 0 ? "animate-wizard-nudge" : ""}`}
        style={
          dock
            ? { left: "50%", transform: "translateX(-50%)", bottom: 16 }
            : {
                left: Math.max(16, Math.min(rect.left, window.innerWidth - 360)),
                ...(below
                  ? { top: rect.bottom + 16 }
                  : { bottom: window.innerHeight - rect.top + 16 }),
              }
        }
        data-testid="wizard-tip"
        role="status"
      >
        <button
          type="button"
          onClick={onExit}
          className="absolute right-4 top-3 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {sizingPokerContent.guided.exitLabel}
        </button>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-coach">
          {sizingPokerContent.guided.modeLabel}
        </p>
        <p className="text-sm leading-relaxed text-foreground">{text}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`h-[7px] rounded-full transition-all ${i === step ? "w-[18px] bg-primary" : "w-[7px] bg-border"}`}
              />
            ))}
          </div>
          <span className="text-[13px] font-semibold text-coach">{doHint}</span>
        </div>
      </div>
    </>
  );
};

interface SizingPoker2Props {
  now?: () => number;
}

const SizingPoker2 = ({ now = Date.now }: SizingPoker2Props) => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  const [targetValue, setTargetValue] = useState(String(DEFAULT_TARGET_DAYS));
  const [itemsValue, setItemsValue] = useState("");
  const [nudgeKey, setNudgeKey] = useState(0);

  const stats = useMemo(() => statsFor(state), [state]);
  const g = sizingPokerContent.guided;
  const guided = state.mode === "guided";

  const handleStart = () => {
    const items = guided ? g.items.map((entry) => entry.title) : parseItems(itemsValue);
    if (items.length === 0) {
      return;
    }
    dispatch({
      type: "start",
      items,
      targetDays: normaliseTarget(targetValue),
      at: now(),
      guidedTargets: guided ? g.items.map((entry) => entry.target) : undefined,
    });
  };

  // The shake is counted at the click, not derived in an effect: a second
  // wrong answer on the same item must replay it even though redirectPending
  // stays true throughout.
  const handleVote = (verdict: Verdict) => {
    if (guided && state.phase === "running") {
      const target = g.items[state.currentIndex]?.target;
      setNudgeKey(target !== undefined && verdict !== target ? nudgeKey + 1 : 0);
    }
    dispatch({ type: "vote", verdict, at: now() });
  };

  const exit = () => dispatch({ type: "exitGuided", at: now() });
  const item = currentItem(state);

  const tipText = state.redirectPending
    ? (g.items[state.currentIndex]?.redirect ?? "")
    : STEP_TIPS[state.phase === "config" ? 0 : state.currentIndex + 1];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Sizing Poker (Prototype B) - Wizard walkthrough"
        description="Internal prototype: the Sizing Poker walkthrough in a spotlight-wizard style."
        noIndex
      />
      <Navigation />
      <main className={`flex-1 px-4 pt-28 ${guided && state.phase === "running" ? "pb-56" : "pb-16"}`}>
        <div className="mx-auto w-full max-w-2xl">
          {state.phase === "intro" && (
            <IntroStep
              onBegin={() => dispatch({ type: "begin" })}
              onBeginGuided={() => dispatch({ type: "beginGuided" })}
            />
          )}

          {state.phase === "config" && !guided && (
            <ConfigStep
              targetValue={targetValue}
              itemsValue={itemsValue}
              onTargetChange={setTargetValue}
              onItemsChange={setItemsValue}
              onUseSample={() => setItemsValue(sizingPokerContent.sampleItems.join("\n"))}
              onStart={handleStart}
            />
          )}

          {/* Guided config, wizard style: the plain form with nothing inline -
              all coaching lives in the anchored card. */}
          {state.phase === "config" && guided && (
            <div data-testid="sizing-config">
              <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {g.configHeading}
              </h1>
              <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div data-testid="wizard-days-anchor">
                  <Label htmlFor="sizing-target" className="text-base font-semibold">
                    {sizingPokerContent.config.targetLabel}
                  </Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      id="sizing-target"
                      type="number"
                      min={1}
                      max={365}
                      inputMode="numeric"
                      value={targetValue}
                      onChange={(event) => setTargetValue(event.target.value)}
                      className="max-w-[110px] font-semibold tabular-nums"
                    />
                    <span className="text-muted-foreground">
                      {sizingPokerContent.config.targetUnit}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">&#10003;</span>{" "}
                  {g.configConfirmation}
                </p>
                <div>
                  <Button onClick={handleStart} size="lg">
                    {sizingPokerContent.config.cta}
                  </Button>
                </div>
              </div>
              <Spotlight
                anchor='[data-testid="wizard-days-anchor"]'
                text={STEP_TIPS[0]}
                doHint={"→ Click Start sizing"}
                step={0}
                nudgeKey={0}
                onExit={exit}
              />
            </div>
          )}

          {state.phase === "running" && item !== null && state.startedAt !== null && (
            <>
              <RunStep
                item={item}
                index={state.currentIndex}
                total={state.items.length}
                targetDays={state.targetDays}
                startedAt={state.startedAt}
                onVote={handleVote}
                onAbandon={() => dispatch({ type: "finish", at: now() })}
                guided={
                  guided
                    ? {
                        // Deliberately no notes and no inline redirect: the
                        // wizard card carries every coach line in this variant.
                        lessonPending: state.lessonPending,
                        onDismissLesson: () => dispatch({ type: "dismissLesson", at: now() }),
                        onExit: exit,
                      }
                    : undefined
                }
                now={now}
              />
              {guided && !state.lessonPending && (
                <Spotlight
                  anchor='[data-testid="sizing-answers"]'
                  dock
                  text={tipText}
                  doHint={"→ React with one click"}
                  step={state.currentIndex + 1}
                  nudgeKey={nudgeKey}
                  onExit={exit}
                />
              )}
            </>
          )}

          {state.phase === "done" && state.startedGuided && (
            <GuidedEnding
              stats={stats}
              onOwnItems={() => dispatch({ type: "restart" })}
              onExit={() => dispatch({ type: "restart" })}
            />
          )}

          {state.phase === "done" && !state.startedGuided && (
            <WrapUpView
              stats={stats}
              targetDays={state.targetDays}
              onRestart={() => dispatch({ type: "restart" })}
              onNextStepClick={() => {}}
            />
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SizingPoker2;
