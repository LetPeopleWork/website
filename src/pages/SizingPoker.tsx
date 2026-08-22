import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/plausible";
import IntroStep from "@/features/sizing-poker/components/IntroStep";
import ConfigStep from "@/features/sizing-poker/components/ConfigStep";
import RunStep from "@/features/sizing-poker/components/RunStep";
import GuidedHighlight from "@/features/sizing-poker/components/GuidedHighlight";
import VerdictPopup from "@/features/sizing-poker/components/VerdictPopup";
import WalkthroughBar from "@/features/sizing-poker/components/WalkthroughBar";
import WrapUpView from "@/features/sizing-poker/components/WrapUpView";
import GuidedEnding from "@/features/sizing-poker/components/GuidedEnding";
import { fillTemplate, sizingPokerContent } from "@/features/sizing-poker/content/sizingPokerContent";
import {
  DEFAULT_TARGET_DAYS,
  currentItem,
  initialState,
  normaliseTarget,
  parseItems,
  reduce,
  type Verdict,
} from "@/features/sizing-poker/core/roundMachine";
import { statsFor, trackingProps } from "@/features/sizing-poker/core/roundStats";

interface SizingPokerProps {
  /** Injectable so tests can drive the clock without faking timers. */
  now?: () => number;
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sizing Poker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://letpeople.work/sizing-poker",
  description:
    "Size a backlog by asking one question per item instead of estimating it: could we finish this within the time we set? Three answers, no story points. Runs entirely in the browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  publisher: { "@type": "Organization", name: "LetPeopleWork GmbH" },
};

const SizingPoker = ({ now = Date.now }: SizingPokerProps) => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  const [targetValue, setTargetValue] = useState(String(DEFAULT_TARGET_DAYS));
  const [itemsValue, setItemsValue] = useState("");
  // Walkthrough tour state (G20). The highlight steps run once per phase; the
  // verdict popup holds the clicked answer until it is dismissed, and only
  // then dispatches the vote - the item under discussion stays on screen.
  const [configStep, setConfigStep] = useState(0);
  const [itemStep, setItemStep] = useState(0);
  const [popupVerdict, setPopupVerdict] = useState<Verdict | null>(null);
  const reported = useRef(false);

  const stats = useMemo(() => statsFor(state), [state]);

  // Counts and buckets only. Item titles never leave the browser (AC-1.6).
  // Every event carries the mode, and a guided round additionally emits its
  // own completion event - a walkthrough pace is fabricated by someone reading
  // coach notes and must stay separable from the real evidence (G2).
  useEffect(() => {
    if (state.phase === "done" && !reported.current) {
      reported.current = true;
      const mode = state.startedGuided ? "guided" : "normal";
      trackEvent("Sizing round completed", { ...trackingProps(stats), mode });
      if (state.startedGuided) {
        trackEvent("Walkthrough completed");
      }
    }
  }, [state.phase, state.startedGuided, stats]);

  const handleStart = () => {
    const items = parseItems(itemsValue);
    if (items.length === 0) {
      return;
    }
    reported.current = false;
    trackEvent("Sizing round started", { items: items.length, mode: state.mode });
    setItemStep(0);
    dispatch({
      type: "start",
      items,
      targetDays: normaliseTarget(targetValue),
      at: now(),
    });
  };

  // The walkthrough runs on the real config form, prefilled with the example
  // backlog (G20) - the screen the popups explain is the one a team will use.
  const handleBeginGuided = () => {
    trackEvent("Walkthrough started");
    setItemsValue(sizingPokerContent.sampleItems.join("\n"));
    setConfigStep(0);
    setItemStep(0);
    setPopupVerdict(null);
    dispatch({ type: "beginGuided" });
  };

  const handleExitGuided = () => {
    // Exiting from the config also clears the prefill: the visitor asked for
    // the normal page, and the normal page starts empty.
    if (state.phase === "config") {
      setItemsValue("");
    }
    setPopupVerdict(null);
    dispatch({ type: "exitGuided", at: now() });
  };

  const handleVote = (verdict: Verdict) => {
    // Guided (G20): the click opens the answer's popup first; the vote lands
    // when it is dismissed. A second key press while it is open does nothing.
    if (state.mode === "guided") {
      if (popupVerdict !== null) {
        return;
      }
      setItemStep(2);
      setPopupVerdict(verdict);
      return;
    }
    dispatch({ type: "vote", verdict, at: now() });
  };

  const item = currentItem(state);

  const dismissPopup = () => {
    if (popupVerdict !== null) {
      dispatch({ type: "vote", verdict: popupVerdict, at: now() });
      setPopupVerdict(null);
    }
  };

  // Enter closes the open verdict popup, matching the lesson-style keyboard
  // path of the earlier walkthrough.
  useEffect(() => {
    if (popupVerdict === null) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        dismissPopup();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupVerdict]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Sizing Poker - Size your backlog without estimating it"
        description="Size a backlog by asking one question per item: could we finish this within the time we set? Three answers, no story points. Free, no signup, runs entirely in your browser."
        keywords="sizing poker, right sizing, no estimates, planning poker alternative, story points alternative, backlog refinement, flow metrics, service level expectation"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Sizing Poker", url: "/sizing-poker" },
        ]}
        // Unlisted while the mechanism is dogfooded: live and reachable by link,
        // but out of search and AI crawlers. Kept in step with the `noindex`
        // flag for this route in scripts/prerender-meta.mjs.
        noIndex
      />
      <Navigation />
      <main className="flex-1 px-4 pb-16 pt-28">
        <div className="mx-auto w-full max-w-2xl">
          {state.phase === "intro" && (
            <IntroStep
              onBegin={() => dispatch({ type: "begin" })}
              onBeginGuided={handleBeginGuided}
            />
          )}

          {state.phase === "config" && (
            <>
              {state.mode === "guided" && <WalkthroughBar onExit={handleExitGuided} />}
              <ConfigStep
                targetValue={targetValue}
                itemsValue={itemsValue}
                onTargetChange={setTargetValue}
                onItemsChange={setItemsValue}
                onUseSample={() => setItemsValue(sizingPokerContent.sampleItems.join("\n"))}
                onStart={handleStart}
              />
              {state.mode === "guided" && configStep < 2 && (
                <GuidedHighlight
                  anchor={configStep === 0 ? "#sizing-target" : "#sizing-items"}
                  text={sizingPokerContent.guided.configSteps[configStep]}
                  onNext={() => setConfigStep((step) => step + 1)}
                />
              )}
            </>
          )}

          {state.phase === "running" && item !== null && state.startedAt !== null && (
            <RunStep
              item={item}
              index={state.currentIndex}
              total={state.items.length}
              targetDays={state.targetDays}
              startedAt={state.startedAt}
              onVote={handleVote}
              onAbandon={() => dispatch({ type: "finish", at: now() })}
              guided={state.mode === "guided" ? { onExit: handleExitGuided } : undefined}
              now={now}
            />
          )}

          {state.phase === "running" &&
            state.mode === "guided" &&
            state.currentIndex === 0 &&
            itemStep < 2 &&
            popupVerdict === null && (
              <GuidedHighlight
                anchor={
                  itemStep === 0
                    ? '[data-testid="sizing-item"]'
                    : '[data-testid="sizing-answers"]'
                }
                text={fillTemplate(sizingPokerContent.guided.itemSteps[itemStep], {
                  days: state.targetDays,
                })}
                onNext={() => setItemStep((step) => step + 1)}
              />
            )}

          {state.phase === "running" && popupVerdict !== null && item !== null && (
            <VerdictPopup
              verdict={popupVerdict}
              item={item}
              targetDays={state.targetDays}
              onDismiss={dismissPopup}
            />
          )}

          {/* A round that BEGAN guided ends here even if the coaching was
              exited: its pace was made while reading notes, and the page's
              headline number must never first appear as a fabricated one (G10). */}
          {state.phase === "done" && state.startedGuided && (
            <GuidedEnding
              stats={stats}
              onOwnItems={() => {
                setItemsValue("");
                dispatch({ type: "restart" });
              }}
              onExit={() => {
                setItemsValue("");
                dispatch({ type: "restart" });
              }}
            />
          )}

          {state.phase === "done" && !state.startedGuided && (
            <WrapUpView
              stats={stats}
              targetDays={state.targetDays}
              onRestart={() => dispatch({ type: "restart" })}
              onNextStepClick={(question) =>
                trackEvent("Sizing next step clicked", { question })
              }
            />
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SizingPoker;
