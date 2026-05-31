import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { QuestionTally } from "../core/summarizeSurvey";

const CHART_CONFIG: ChartConfig = {
  count: { label: "Responses", color: "hsl(var(--primary))" },
};

const QuestionChart = ({ question }: { question: QuestionTally }) => {
  const data = question.options.map((option) => ({
    label: option.label,
    count: option.count,
  }));

  return (
    <div data-testid="survey-question-chart" className="space-y-2">
      <p className="font-semibold">{question.prompt}</p>
      <ChartContainer config={CHART_CONFIG} className="h-48 w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export const SurveyCharts = ({
  questions,
}: {
  questions: readonly QuestionTally[];
}) => (
  <div data-testid="dashboard-survey-charts" className="space-y-6">
    {questions.map((question) => (
      <QuestionChart key={question.id} question={question} />
    ))}
  </div>
);
