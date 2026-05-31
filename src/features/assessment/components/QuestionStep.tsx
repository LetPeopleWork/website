import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from "../content/assessmentContent";
import { QUESTION_COUNT } from "../core/scoring";

interface QuestionStepProps {
  question: Question;
  questionNumber: number;
  selected: number | null;
  progressLabel: string;
  onSelect: (value: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const QuestionStep = ({
  question,
  questionNumber,
  selected,
  progressLabel,
  onSelect,
  onBack,
  onNext,
}: QuestionStepProps) => {
  const isLast = questionNumber === QUESTION_COUNT;
  const percent = (questionNumber / QUESTION_COUNT) * 100;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{progressLabel}</span>
        </div>
        <Progress value={percent} aria-label={progressLabel} />
        <CardTitle className="text-xl sm:text-2xl">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          className="gap-3"
          value={selected === null ? "" : String(selected)}
          onValueChange={(value) => onSelect(Number(value))}
        >
          {question.options.map((option) => {
            const optionId = `${question.id}-${option.value}`;
            return (
              <div
                key={option.value}
                className="flex items-start gap-3 rounded-md border p-3"
              >
                <RadioGroupItem
                  value={String(option.value)}
                  id={optionId}
                  className="mt-1"
                />
                <Label
                  htmlFor={optionId}
                  className="cursor-pointer text-base font-normal leading-relaxed"
                >
                  {option.label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={selected === null}>
            {isLast ? "See my result" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
