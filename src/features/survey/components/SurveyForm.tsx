import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SURVEY_QUESTIONS,
  type SurveyQuestion as SurveyQuestionModel,
} from "../content/surveyContent";
import { SurveyIntro } from "./SurveyIntro";
import { SurveyQuestion } from "./SurveyQuestion";

export type SurveySelections = Readonly<Record<string, string>>;

interface SurveyFormProps {
  onSubmit: (selections: SurveySelections) => void;
  questions?: readonly SurveyQuestionModel[] | null;
}

const UNAVAILABLE_MESSAGE =
  "Survey temporarily unavailable. Please try again in a little while.";

const Unavailable = () => (
  <Card className="mx-auto w-full max-w-2xl">
    <CardContent className="py-10 text-center text-muted-foreground">
      {UNAVAILABLE_MESSAGE}
    </CardContent>
  </Card>
);

export const SurveyForm = ({
  onSubmit,
  questions = SURVEY_QUESTIONS,
}: SurveyFormProps) => {
  const [selections, setSelections] = useState<SurveySelections>({});

  if (!questions || questions.length === 0) {
    return <Unavailable />;
  }

  const select = (questionId: string, optionId: string) =>
    setSelections((current) => ({ ...current, [questionId]: optionId }));

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
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => onSubmit(selections)}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
