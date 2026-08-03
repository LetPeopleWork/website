import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/plausible";
import SetupStep from "@/features/sizing-poker/components/SetupStep";
import RunStep from "@/features/sizing-poker/components/RunStep";
import ResultView from "@/features/sizing-poker/components/ResultView";
import { sizingPokerContent } from "@/features/sizing-poker/content/sizingPokerContent";
import {
  DEFAULT_SLE_DAYS,
  currentItem,
  initialState,
  normaliseSle,
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
    "Size a backlog against your team's Service Level Expectation instead of estimating it. One question per item, three answers, no story points. Runs entirely in the browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  publisher: { "@type": "Organization", name: "LetPeopleWork GmbH" },
};

const SizingPoker = ({ now = Date.now }: SizingPokerProps) => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  const [sleValue, setSleValue] = useState(String(DEFAULT_SLE_DAYS));
  const [itemsValue, setItemsValue] = useState(() =>
    sizingPokerContent.sampleItems.join("\n"),
  );
  const reported = useRef(false);

  const stats = useMemo(() => statsFor(state), [state]);

  // Counts and buckets only. Item titles never leave the browser (AC-1.6).
  useEffect(() => {
    if (state.phase === "done" && !reported.current) {
      reported.current = true;
      trackEvent("Sizing round completed", trackingProps(stats));
    }
  }, [state.phase, stats]);

  const handleStart = () => {
    const items = parseItems(itemsValue);
    if (items.length === 0) {
      return;
    }
    reported.current = false;
    trackEvent("Sizing round started", { items: items.length });
    dispatch({
      type: "start",
      items,
      sleDays: normaliseSle(sleValue),
      at: now(),
    });
  };

  const handleVote = (verdict: Verdict) => {
    dispatch({ type: "vote", verdict, at: now() });
  };

  const item = currentItem(state);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Sizing Poker - Size your backlog against your SLE"
        description="Size a backlog without estimating it. One question per item, three answers, anchored to your team's Service Level Expectation. Free, no signup, runs entirely in your browser."
        keywords="sizing poker, right sizing, no estimates, service level expectation, SLE, planning poker alternative, story points alternative, flow metrics, refinement"
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
          {state.phase === "setup" && (
            <SetupStep
              sleValue={sleValue}
              itemsValue={itemsValue}
              onSleChange={setSleValue}
              onItemsChange={setItemsValue}
              onStart={handleStart}
            />
          )}

          {state.phase === "running" && item !== null && state.startedAt !== null && (
            <RunStep
              item={item}
              index={state.currentIndex}
              total={state.items.length}
              sleDays={state.sleDays}
              startedAt={state.startedAt}
              onVote={handleVote}
              now={now}
            />
          )}

          {state.phase === "done" && (
            <ResultView
              stats={stats}
              sleDays={state.sleDays}
              onRestart={() => dispatch({ type: "restart" })}
            />
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SizingPoker;
