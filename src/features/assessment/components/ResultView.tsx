import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assessmentContent,
  bandContent,
} from "../content/assessmentContent";
import type { ScoreResult } from "../core/scoring";

interface ResultViewProps {
  result: ScoreResult;
  onRestart: () => void;
}

export const ResultView = ({ result, onRestart }: ResultViewProps) => {
  const band = bandContent(result.band);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card data-testid="assessment-result">
        <CardHeader className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Your forecasting readiness
          </p>
          <CardTitle className="text-5xl font-bold">
            {result.score} / 100
          </CardTitle>
          <p className="text-2xl font-semibold text-primary">{result.band}</p>
          <p className="text-base text-muted-foreground">{band.tagline}</p>
        </CardHeader>
        <CardContent>
          <p className="text-center text-xs text-muted-foreground">
            {assessmentContent.credibilityAnchor}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">What your score means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-muted-foreground">
          <p>{band.measureRead}</p>
          <p>{band.forecastRead}</p>
          <p className="font-medium text-foreground">{band.nextRung}</p>
        </CardContent>
      </Card>

      <Card data-testid="assessment-next-steps">
        <CardHeader>
          <CardTitle className="text-xl">Your next step</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {band.ctas.map((cta) => (
            <Button
              key={cta.label}
              asChild
              variant={cta.isCommunity ? "default" : "outline"}
            >
              <a href={cta.href} target="_blank" rel="noreferrer">
                {cta.label}
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={onRestart}>
          Retake the assessment
        </Button>
      </div>
    </div>
  );
};
