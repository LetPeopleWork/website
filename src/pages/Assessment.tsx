import { useEffect, useMemo, useState } from "react";
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
import { score } from "@/features/assessment/core/scoring";
import {
  createSessionStoragePersistence,
  type AnswersPersistence,
} from "@/features/assessment/adapters/sessionStoragePersistence";

interface AssessmentProps {
  persistence?: AnswersPersistence;
}

const Assessment = ({ persistence }: AssessmentProps) => {
  const store = useMemo(
    () => persistence ?? createSessionStoragePersistence(),
    [persistence],
  );

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

  const dispatch = (action: QuizAction) => {
    if (action.type === "restart") {
      store.clear();
      setShowRestoredNotice(false);
    }
    setState((current) => reduce(current, action));
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
          onRestart={() => dispatch({ type: "restart" })}
        />
      )}
    </main>
  );
};

export default Assessment;
