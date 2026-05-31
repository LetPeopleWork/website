import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SurveySubmission } from "../../assessment/ports";
import {
  SURVEY_QUESTIONS,
  type SurveyQuestion as SurveyQuestionModel,
} from "../content/surveyContent";
import { SurveyIntro } from "./SurveyIntro";
import { SurveyQuestion } from "./SurveyQuestion";

export type SurveySelections = Readonly<Record<string, string>>;

interface SurveyFormProps {
  submission: SurveySubmission;
  questions?: readonly SurveyQuestionModel[] | null;
}

type SubmitState = "editing" | "submitting" | "submitted" | "error";

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

export const SurveyForm = ({
  submission,
  questions = SURVEY_QUESTIONS,
}: SurveyFormProps) => {
  const [selections, setSelections] = useState<SurveySelections>({});
  const [state, setState] = useState<SubmitState>("editing");

  if (!questions || questions.length === 0) {
    return <Unavailable />;
  }

  if (state === "submitted") {
    return <ThankYou />;
  }

  const select = (questionId: string, optionId: string) =>
    setSelections((current) => ({ ...current, [questionId]: optionId }));

  const submit = async (): Promise<void> => {
    if (state === "submitting") {
      return;
    }
    setState("submitting");
    try {
      await submission.submit(selections);
      setState("submitted");
    } catch {
      setState("error");
    }
  };

  const onSubmitClick = () => {
    submit().catch(() => undefined);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <SurveyIntro />
      <CardContent className="space-y-8">
        {questions.map((question) => (
          <SurveyQuestion
            key={question.id}
            question={question}
            selected={selections[question.id] ?? null}
            onSelect={(optionId) => select(question.id, optionId)}
          />
        ))}
        {state === "error" ? (
          <p role="alert" className="text-destructive">
            {ERROR_MESSAGE}
          </p>
        ) : null}
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={state === "submitting"}
          onClick={onSubmitClick}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
