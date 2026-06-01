import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { SurveyQuestion } from "../content/surveyContent";
import type { SurveyAnswer } from "../core/surveyMachine";

interface SurveyStepCardProps {
  question: SurveyQuestion;
  value: SurveyAnswer;
  questionNumber: number;
  totalQuestions: number;
  progressLabel: string;
  canAdvance: boolean;
  nextLabel: string;
  onAnswer: (value: string | readonly string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const asArray = (value: SurveyAnswer): readonly string[] =>
  Array.isArray(value) ? value : [];

const toggle = (current: readonly string[], optionId: string): string[] =>
  current.includes(optionId)
    ? current.filter((id) => id !== optionId)
    : [...current, optionId];

export const SurveyStepCard = ({
  question,
  value,
  questionNumber,
  totalQuestions,
  progressLabel,
  canAdvance,
  nextLabel,
  onAnswer,
  onBack,
  onNext,
}: SurveyStepCardProps) => {
  const percent = (questionNumber / totalQuestions) * 100;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <span className="text-sm text-muted-foreground">{progressLabel}</span>
        <Progress value={percent} aria-label={progressLabel} />
        <CardTitle className="text-xl sm:text-2xl">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {question.kind === "text" ? (
          <Textarea
            aria-label={question.prompt}
            maxLength={question.maxLength}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="Your answer (optional)"
            className="min-h-32"
          />
        ) : question.multiple ? (
          <div className="space-y-3">
            {question.options.map((option) => {
              const optionId = `${question.id}-${option.id}`;
              const selected = asArray(value);
              return (
                <div
                  key={option.id}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <Checkbox
                    id={optionId}
                    className="mt-1"
                    checked={selected.includes(option.id)}
                    onCheckedChange={() =>
                      onAnswer(toggle(selected, option.id))
                    }
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
          </div>
        ) : (
          <RadioGroup
            className="gap-3"
            value={typeof value === "string" ? value : ""}
            onValueChange={(next) => onAnswer(next)}
          >
            {question.options.map((option) => {
              const optionId = `${question.id}-${option.id}`;
              return (
                <div
                  key={option.id}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <RadioGroupItem
                    value={option.id}
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
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!canAdvance}>
            {nextLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
