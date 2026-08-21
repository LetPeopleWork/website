import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/plausible";
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
    // The walkthrough sizes three curated items - one specimen per answer
    // (G17) - never the visitor's own input.
    const items =
      state.mode === "guided"
        ? sizingPokerContent.guided.items.map((entry) => entry.title)
        : parseItems(itemsValue);
    if (items.length === 0) {
      return;
    }
    reported.current = false;
    trackEvent("Sizing round started", { items: items.length, mode: state.mode });
    dispatch({
      type: "start",
      items,
      targetDays: normaliseTarget(targetValue),
      at: now(),
    });
  };

  const handleBeginGuided = () => {
    trackEvent("Walkthrough started");
    dispatch({ type: "beginGuided" });
  };

  const guidedItemFor = (index: number) =>
    sizingPokerContent.guided.items[index];

  const handleVote = (verdict: Verdict) => {
    dispatch({ type: "vote", verdict, at: now() });
  };

  const item = currentItem(state);

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
            <ConfigStep
              targetValue={targetValue}
              itemsValue={itemsValue}
              onTargetChange={setTargetValue}
              onItemsChange={setItemsValue}
              onUseSample={() => setItemsValue(sizingPokerContent.sampleItems.join("\n"))}
              onStart={handleStart}
              guided={state.mode === "guided"}
              onExitGuided={() => dispatch({ type: "exitGuided", at: now() })}
            />
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
              guided={
                state.mode === "guided"
                  ? {
                      noteBefore: guidedItemFor(state.currentIndex)?.noteBefore,
                      noteAfter: guidedItemFor(state.currentIndex)?.noteAfter,
                      lessonPending: state.lessonPending,
                      onDismissLesson: () =>
                        dispatch({ type: "dismissLesson", at: now() }),
                      onExit: () => dispatch({ type: "exitGuided", at: now() }),
                    }
                  : undefined
              }
              now={now}
            />
          )}

          {/* A round that BEGAN guided ends here even if the coaching was
              exited: its pace was made while reading notes, and the page's
              headline number must never first appear as a fabricated one (G10). */}
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
