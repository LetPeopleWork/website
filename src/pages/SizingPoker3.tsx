import { useEffect, useMemo, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { sizingPokerContent, questionFor } from "@/features/sizing-poker/content/sizingPokerContent";
import {
  DEFAULT_TARGET_DAYS,
  currentItem,
  initialState,
  reduce,
  type Verdict,
} from "@/features/sizing-poker/core/roundMachine";
import { statsFor } from "@/features/sizing-poker/core/roundStats";
import GuidedEnding from "@/features/sizing-poker/components/GuidedEnding";

// PROTOTYPE C - instant immersion, for comparison against /sizing-poker and
// /sizing-poker-2. Link-only, noindex, no analytics (G2: nothing from a
// prototype may touch the real evidence).
//
// The borrowed patterns: Duolingo drops you into a lesson before any setup -
// so this page loads ALREADY inside a round, no intro, no config. Slack
// teaches messaging through a bot that messages you - so the coach here is a
// chat thread, and a wrong answer is answered with a reply, not a panel.
// Grammarly's demo doc / Notion's templates - the round comes pre-filled with
// the curated items, so the first thing you do is the product's core action.
// Canva's personalisation is INVERTED on purpose: your own goal (your own
// backlog) is asked for at the end, after the value landed, not before.

const g = sizingPokerContent.guided;
const c = sizingPokerContent;

const WELCOME: readonly string[] = [
  "Hi! You're already in a round — nothing to set up, nothing to sign up for. This team put 10 days aside.",
  "First item's below. Would it be done in 10 days or less? Just react.",
];

const ITEM_INTROS: readonly (string | null)[] = [
  null, // item 1 is carried by the welcome
  "Nice — that one's pulled. Next: whose time does this one need?",
  "Last one. If it feels like a lot, say so.",
];

const CoachBubble = ({ text, tone = "coach" }: { text: string; tone?: "coach" | "redirect" }) => (
  <div className="flex items-start gap-3" data-testid={tone === "redirect" ? "chat-redirect" : "chat-bubble"}>
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coach text-[11px] font-bold text-primary-foreground">
      LW
    </span>
    <p
      className={`max-w-[52ch] rounded-2xl rounded-tl-md border px-4 py-2.5 text-[14.5px] leading-relaxed ${
        tone === "redirect"
          ? "border-coach bg-coach-wash text-coach"
          : "border-coach-rule bg-coach-wash text-coach"
      }`}
    >
      {text}
    </p>
  </div>
);

interface SizingPoker3Props {
  now?: () => number;
}

const SizingPoker3 = ({ now = Date.now }: SizingPoker3Props) => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  const navigate = useNavigate();
  const booted = useRef(false);

  // Duolingo move: the round starts itself on mount.
  useEffect(() => {
    if (booted.current) {
      return;
    }
    booted.current = true;
    dispatch({ type: "beginGuided" });
    dispatch({
      type: "start",
      items: g.items.map((entry) => entry.title),
      targetDays: DEFAULT_TARGET_DAYS,
      at: now(),
      guidedTargets: g.items.map((entry) => entry.target),
    });
  }, [now]);

  const stats = useMemo(() => statsFor(state), [state]);
  const item = currentItem(state);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (state.phase !== "running") {
        return;
      }
      if (state.lessonPending) {
        if (event.key === "Enter") {
          dispatch({ type: "dismissLesson", at: now() });
        }
        return;
      }
      const match = c.answers.find((answer) => answer.key === event.key);
      if (match) {
        dispatch({ type: "vote", verdict: match.verdict, at: now() });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, state.lessonPending, now]);

  // The visible thread: derived from state rather than accumulated, so the
  // machine stays the single source of truth. Only the latest beats show -
  // a chat, not a log.
  const bubbles: { text: string; tone: "coach" | "redirect" }[] = [];
  if (state.phase === "running") {
    if (state.currentIndex === 0) {
      WELCOME.forEach((text) => bubbles.push({ text, tone: "coach" }));
    } else {
      const intro = ITEM_INTROS[state.currentIndex];
      if (intro !== null && intro !== undefined) {
        bubbles.push({ text: intro, tone: "coach" });
      }
    }
    if (state.redirectPending) {
      const redirect = g.items[state.currentIndex]?.redirect;
      if (redirect !== undefined) {
        bubbles.push({ text: redirect, tone: "redirect" });
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Sizing Poker (Prototype C) - Instant immersion"
        description="Internal prototype: Sizing Poker that starts inside a round, coached by a chat thread."
        noIndex
      />
      <Navigation />
      <main className="flex-1 px-4 pb-16 pt-28">
        <div className="mx-auto w-full max-w-2xl">
          {state.phase === "running" && item !== null && (
            <div data-testid="immersion-run">
              <div className="mb-6 flex flex-col gap-3">
                {bubbles.map((bubble, i) => (
                  <CoachBubble key={`${state.currentIndex}-${i}-${bubble.tone}`} {...bubble} />
                ))}
              </div>

              {state.lessonPending ? (
                <div
                  className="flex flex-col gap-3"
                  data-testid="immersion-lesson"
                >
                  <CoachBubble text={g.lessonHeading} />
                  <CoachBubble text={g.lessonIntro} />
                  {g.lessonOptions.map((option) => (
                    <CoachBubble key={option} text={option} />
                  ))}
                  <div className="pl-11">
                    <Button onClick={() => dispatch({ type: "dismissLesson", at: now() })} size="lg">
                      {g.lessonCta}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="mb-4 flex items-baseline justify-between text-sm tabular-nums text-muted-foreground">
                    <span>
                      Item{" "}
                      <strong className="font-semibold text-foreground">
                        {state.currentIndex + 1}
                      </strong>{" "}
                      of <strong className="font-semibold text-foreground">{state.items.length}</strong>
                    </span>
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
                  <div className="grid gap-2.5">
                    {c.answers.map((answer) => (
                      <button
                        key={answer.verdict}
                        type="button"
                        onClick={() => dispatch({ type: "vote", verdict: answer.verdict, at: now() })}
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
              )}
            </div>
          )}

          {state.phase === "done" && (
            <GuidedEnding
              stats={stats}
              // Canva's personalisation, inverted: your own goal comes AFTER
              // the value landed - the handover leads to the real page.
              onOwnItems={() => navigate("/sizing-poker")}
              onExit={() => navigate("/sizing-poker")}
            />
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SizingPoker3;
