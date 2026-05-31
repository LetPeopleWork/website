import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionStepCard } from "@/components/quiz/QuestionStepCard";
import type { SurveySubmission } from "../../assessment/ports";
import {
  SURVEY_QUESTIONS,
  type SurveyQuestion as SurveyQuestionModel,
} from "../content/surveyContent";
import {
  initialSurveyState,
  reduceSurvey,
  surveyProgressLabel,
} from "../core/surveyMachine";
import { SurveyIntro } from "./SurveyIntro";

export type SurveySelections = Readonly<Record<string, string>>;

interface SurveyFormProps {
  submission: SurveySubmission;
  questions?: readonly SurveyQuestionModel[] | null;
}

const UNAVAILABLE_MESSAGE =
  "Survey temporarily unavailable. Please try again in a little while.";

const ERROR_MESSAGE =
  "We couldn't record your answers. Please try submitting again.";

const THANK_YOU_MESSAGE = "Thank you — your answers have been recorded.";

const Unavailable = () => (
  <Card className="mx-auto w-full max-w-2xl">
    <CardContent className="py-10 text-center text-muted-foreground">
      {UNAVAILABLE_MESSAGE}
    </CardContent>
  </Card>
);

const ThankYou = () => (
  <Card className="mx-auto w-full max-w-2xl">
    <CardContent className="py-10 text-center text-lg">
      {THANK_YOU_MESSAGE}
    </CardContent>
  </Card>
);

const Intro = ({ onStart }: { onStart: () => void }) => (
  <Card className="mx-auto w-full max-w-2xl">
    <SurveyIntro />
    <CardContent>
      <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>
        Start
      </Button>
    </CardContent>
  </Card>
);

const selectionsFrom = (
  questions: readonly SurveyQuestionModel[],
  answers: readonly (string | null)[],
): SurveySelections =>
  Object.fromEntries(
    questions.flatMap((question, index) => {
      const value = answers[index];
      return value === null || value === undefined
        ? []
        : [[question.id, value] as const];
    }),
  );

export const SurveyForm = ({
  submission,
  questions = SURVEY_QUESTIONS,
}: SurveyFormProps) => {
  const [state, dispatch] = useReducer(reduceSurvey, undefined, initialSurveyState);
  const [showError, setShowError] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    if (state.phase !== "submitting" || inFlight.current || !questions) {
      return;
    }
    inFlight.current = true;
    submission
      .submit(selectionsFrom(questions, state.answers))
      .then(() => dispatch({ type: "submitted" }))
      .catch(() => {
        setShowError(true);
        dispatch({ type: "retry" });
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, [state.phase, state.answers, questions, submission]);

  if (!questions || questions.length === 0) {
    return <Unavailable />;
  }

  if (state.phase === "done") {
    return <ThankYou />;
  }

  if (state.phase === "intro") {
    return <Intro onStart={() => dispatch({ type: "start" })} />;
  }

  const question = questions[state.currentIndex];
  const isLast = state.currentIndex === questions.length - 1;
  const selected = state.answers[state.currentIndex] ?? null;

  const onNext = () => {
    setShowError(false);
    dispatch(isLast ? { type: "submit" } : { type: "next" });
  };

  return (
    <div className="space-y-4">
      <QuestionStepCard
        key={question.id}
        prompt={question.prompt}
        idPrefix={question.id}
        options={question.options.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        questionNumber={state.currentIndex + 1}
        totalQuestions={questions.length}
        selected={selected}
        progressLabel={surveyProgressLabel(state)}
        nextLabel={isLast ? "Submit" : "Next"}
        onSelect={(value) => dispatch({ type: "answer", value })}
        onBack={() => dispatch({ type: "back" })}
        onNext={onNext}
      />
      {showError ? (
        <p role="alert" className="mx-auto max-w-2xl text-center text-destructive">
          {ERROR_MESSAGE}
        </p>
      ) : null}
    </div>
  );
};
