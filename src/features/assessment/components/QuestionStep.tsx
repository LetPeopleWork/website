import { QuestionStepCard } from "@/components/quiz/QuestionStepCard";
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

  return (
    <QuestionStepCard
      prompt={question.prompt}
      idPrefix={question.id}
      options={question.options.map((option) => ({
        value: String(option.value),
        label: option.label,
      }))}
      questionNumber={questionNumber}
      totalQuestions={QUESTION_COUNT}
      selected={selected === null ? null : String(selected)}
      progressLabel={progressLabel}
      nextLabel={isLast ? "See my result" : "Next"}
      onSelect={(value) => onSelect(Number(value))}
      onBack={onBack}
      onNext={onNext}
    />
  );
};
