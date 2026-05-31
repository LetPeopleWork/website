import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface QuestionStepOption {
  readonly value: string;
  readonly label: string;
}

interface QuestionStepCardProps {
  prompt: string;
  options: readonly QuestionStepOption[];
  idPrefix: string;
  questionNumber: number;
  totalQuestions: number;
  selected: string | null;
  progressLabel: string;
  nextLabel?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const QuestionStepCard = ({
  prompt,
  options,
  idPrefix,
  questionNumber,
  totalQuestions,
  selected,
  progressLabel,
  nextLabel = "Next",
  onSelect,
  onBack,
  onNext,
}: QuestionStepCardProps) => {
  const percent = (questionNumber / totalQuestions) * 100;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{progressLabel}</span>
        </div>
        <Progress value={percent} aria-label={progressLabel} />
        <CardTitle className="text-xl sm:text-2xl">{prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          className="gap-3"
          value={selected ?? ""}
          onValueChange={onSelect}
        >
          {options.map((option) => {
            const optionId = `${idPrefix}-${option.value}`;
            return (
              <div
                key={option.value}
                className="flex items-start gap-3 rounded-md border p-3"
              >
                <RadioGroupItem
                  value={option.value}
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
            {nextLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
