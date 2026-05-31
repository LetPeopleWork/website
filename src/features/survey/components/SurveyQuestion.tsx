import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { SurveyQuestion as SurveyQuestionModel } from "../content/surveyContent";

interface SurveyQuestionProps {
  question: SurveyQuestionModel;
  selected: string | null;
  onSelect: (optionId: string) => void;
}

export const SurveyQuestion = ({
  question,
  selected,
  onSelect,
}: SurveyQuestionProps) => (
  <fieldset className="space-y-4">
    <legend className="text-lg font-medium">{question.prompt}</legend>
    <RadioGroup
      className="gap-3"
      value={selected ?? ""}
      onValueChange={onSelect}
    >
      {question.options.map((option) => {
        const optionId = `${question.id}-${option.id}`;
        return (
          <div
            key={option.id}
            className="flex items-start gap-3 rounded-md border p-3"
          >
            <RadioGroupItem value={option.id} id={optionId} className="mt-1" />
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
  </fieldset>
);
