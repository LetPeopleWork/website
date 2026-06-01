import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { IntroStep } from "@/features/assessment/components/IntroStep";
import { QuestionStep } from "@/features/assessment/components/QuestionStep";
import { ResultView } from "@/features/assessment/components/ResultView";
import { QUESTIONS } from "@/features/assessment/content/assessmentContent";
import {
  canProduceResult,
  initialState,
  progressLabel,
  reduce,
  type QuizAction,
  type QuizState,
} from "@/features/assessment/core/quizMachine";
import { score, type Answers } from "@/features/assessment/core/scoring";
import { runDegradeOpen } from "@/features/assessment/core/degradeOpen";
import {
  createSessionStoragePersistence,
  type AnswersPersistence,
} from "@/features/assessment/adapters/sessionStoragePersistence";
import { createSupabaseResponseRepository } from "@/features/assessment/adapters/supabaseResponseRepository";
import { createEdgeFunctionLeadCapture } from "@/features/assessment/adapters/edgeFunctionLeadCapture";
import type { LeadCapture, ResponseRepository } from "@/features/assessment/ports";

interface AssessmentProps {
  persistence?: AnswersPersistence;
  responseRepository?: ResponseRepository;
  leadCapture?: LeadCapture;
}

const CAPTURE_FAILED_NOTICE =
  "We couldn't save your result just now — your breakdown is still here.";

const LEAD_FAILED_NOTICE =
  "We couldn't record your email just now — your breakdown is unlocked anyway.";

const Assessment = ({
  persistence,
  responseRepository,
  leadCapture,
}: AssessmentProps) => {
  const store = useMemo(
    () => persistence ?? createSessionStoragePersistence(),
    [persistence],
  );
  const repository = useMemo(
    () => responseRepository ?? createSupabaseResponseRepository(),
    [responseRepository],
  );
  const leads = useMemo(
    () => leadCapture ?? createEdgeFunctionLeadCapture(),
    [leadCapture],
  );
  const captured = useRef(false);
  const [unlocked, setUnlocked] = useState(false);

  const [restored] = useState(() => {
    const draft = store.load();
    if (!draft) {
      return { state: initialState(), fromDraft: false };
    }
    return {
      state: { ...initialState(draft), phase: "question" as const },
      fromDraft: true,
    };
  });

  const [state, setState] = useState<QuizState>(restored.state);
  const [showRestoredNotice, setShowRestoredNotice] = useState(
    restored.fromDraft,
  );

  useEffect(() => {
    if (state.phase === "question") {
      store.save(state.answers);
    }
  }, [state.answers, state.phase, store]);

  useEffect(() => {
    if (state.phase !== "teaser" || !canProduceResult(state) || captured.current) {
      return;
    }
    captured.current = true;
    const result = score(state.answers as number[]);
    void runDegradeOpen(
      () =>
        repository.save({
          source: "readiness-assessment",
          kind: null,
          answers: state.answers as unknown as Answers,
          rawSum: result.rawSum,
          score: result.score,
          band: result.band,
        }),
      { onFailure: () => toast(CAPTURE_FAILED_NOTICE) },
    );
  }, [state, repository]);

  const dispatch = (action: QuizAction) => {
    if (action.type === "restart") {
      store.clear();
      setShowRestoredNotice(false);
      captured.current = false;
      setUnlocked(false);
    }
    setState((current) => reduce(current, action));
  };

  const unlock = (email: string) => {
    setUnlocked(true);
    const result = score(state.answers as number[]);
    void runDegradeOpen(
      () =>
        leads.capture({
          source: "readiness-assessment",
          email,
          score: result.score,
          band: result.band,
        }),
      { onFailure: () => toast(LEAD_FAILED_NOTICE) },
    );
  };

  const currentAnswer = state.answers[state.currentIndex] ?? null;

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <SEO
        title="Forecasting Readiness Assessment"
        description="An honest, framework-backed read on your delivery maturity across what you measure and how you forecast."
      />
      {state.phase === "intro" && (
        <IntroStep onStart={() => dispatch({ type: "start" })} />
      )}

      {state.phase === "question" && (
        <div className="space-y-4">
          {showRestoredNotice && (
            <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
              We restored your answers from this session.
            </p>
          )}
          <QuestionStep
            key={QUESTIONS[state.currentIndex].id}
            question={QUESTIONS[state.currentIndex]}
            questionNumber={state.currentIndex + 1}
            selected={currentAnswer}
            progressLabel={progressLabel(state)}
            onSelect={(value) => dispatch({ type: "answer", value })}
            onBack={() => dispatch({ type: "back" })}
            onNext={() =>
              dispatch(
                state.currentIndex >= QUESTIONS.length - 1
                  ? { type: "submit" }
                  : { type: "next" },
              )
            }
          />
        </div>
      )}

      {state.phase === "teaser" && canProduceResult(state) && (
        <ResultView
          result={score(state.answers as number[])}
          unlocked={unlocked}
          onUnlock={unlock}
          onRestart={() => dispatch({ type: "restart" })}
        />
      )}
    </main>
  );
};

export default Assessment;
