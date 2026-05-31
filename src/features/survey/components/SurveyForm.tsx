import { useEffect, useId, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionStepCard } from "@/components/quiz/QuestionStepCard";
import {
  TrialRequestFailedError,
  type SurveySubmission,
  type SurveyTrialOptIn,
} from "../../assessment/ports";
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

const TRIAL_ERROR_MESSAGE =
  "Your answers were saved, but the trial request didn't go through. Please try the trial opt-in again.";

const THANK_YOU_MESSAGE =
  "Thank you — your answers have been recorded. A human will follow up on any trial request.";

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

const exchangeSchema = z
  .object({
    wantsTrial: z.boolean(),
    email: z.string(),
  })
  .refine((values) => !values.wantsTrial || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email), {
    path: ["email"],
    message: "Enter a valid email to request your free premium trial.",
  });

type ExchangeValues = z.infer<typeof exchangeSchema>;

interface ExchangeProps {
  errorMessage: string | null;
  onSubmit: (trial: SurveyTrialOptIn | undefined) => void;
  onBack: () => void;
}

const trialFrom = (values: ExchangeValues): SurveyTrialOptIn | undefined =>
  values.wantsTrial ? { wantsTrial: true, email: values.email } : undefined;

const Exchange = ({ errorMessage, onSubmit, onBack }: ExchangeProps) => {
  const emailId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExchangeValues>({
    resolver: zodResolver(exchangeSchema),
    mode: "onSubmit",
    defaultValues: { wantsTrial: false, email: "" },
  });
  const submit = handleSubmit((values) => onSubmit(trialFrom(values)));

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent className="space-y-4 py-8">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Label className="flex items-center gap-2">
            <input type="checkbox" {...register("wantsTrial")} />
            I'd like a free premium trial
          </Label>
          <div className="space-y-2">
            <Label htmlFor={emailId}>Email for your free premium trial</Label>
            <Input
              id={emailId}
              type="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const trial = useRef<SurveyTrialOptIn | undefined>(undefined);
  const inFlight = useRef(false);

  useEffect(() => {
    if (state.phase !== "submitting" || inFlight.current || !questions) {
      return;
    }
    inFlight.current = true;
    submission
      .submit(selectionsFrom(questions, state.answers), trial.current)
      .then(() => dispatch({ type: "submitted" }))
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof TrialRequestFailedError
            ? TRIAL_ERROR_MESSAGE
            : ERROR_MESSAGE,
        );
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

  if (state.phase === "exchange" || state.phase === "submitting") {
    const onExchangeSubmit = (optIn: SurveyTrialOptIn | undefined) => {
      setErrorMessage(null);
      trial.current = optIn;
      dispatch({ type: "submit" });
    };
    return (
      <Exchange
        errorMessage={errorMessage}
        onSubmit={onExchangeSubmit}
        onBack={() => dispatch({ type: "back" })}
      />
    );
  }

  const question = questions[state.currentIndex];
  const isLast = state.currentIndex === questions.length - 1;
  const selected = state.answers[state.currentIndex] ?? null;

  const onNext = () => {
    setErrorMessage(null);
    dispatch({ type: isLast ? "submit" : "next" });
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
        nextLabel="Next"
        onSelect={(value) => dispatch({ type: "answer", value })}
        onBack={() => dispatch({ type: "back" })}
        onNext={onNext}
      />
    </div>
  );
};
