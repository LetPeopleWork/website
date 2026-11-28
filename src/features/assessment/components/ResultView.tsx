import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bandContent } from "../content/assessmentContent";
import type { ScoreResult } from "../core/scoring";
import { EmailGate } from "./EmailGate";

interface ResultViewProps {
  result: ScoreResult;
  unlocked: boolean;
  onUnlock: (email: string) => void;
  onRestart: () => void;
}

export const ResultView = ({
  result,
  unlocked,
  onUnlock,
  onRestart,
}: ResultViewProps) => {
  const band = bandContent(result.band);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card data-testid="assessment-result">
        <CardHeader className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Your delivery predictability
          </p>
          <CardTitle className="text-5xl font-bold">
            {result.score} / 100
          </CardTitle>
          <p className="text-2xl font-semibold text-primary">{result.band}</p>
          <p className="text-base text-muted-foreground">{band.tagline}</p>
        </CardHeader>
      </Card>

      <div data-testid="assessment-breakdown" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What your score means</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            <p>{band.measureRead}</p>
            <p>{band.forecastRead}</p>
          </CardContent>
        </Card>

        <Card data-testid="assessment-next-steps">
          <CardHeader>
            <CardTitle className="text-xl">Your next step</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {band.ctas.map((cta, index) => (
              <Button
                key={cta.label}
                asChild
                variant={index === 0 ? "default" : "outline"}
              >
                <a href={cta.href} target="_blank" rel="noreferrer">
                  {cta.label}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {unlocked ? (
        <Card data-testid="assessment-kit-sent">
          <CardContent className="py-6 text-center text-base text-muted-foreground">
            Your {band.kitName} is on its way. Check your inbox for hand-picked
            resources matched to your result.
          </CardContent>
        </Card>
      ) : (
        <Card data-testid="assessment-gate">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">
              Want your {band.kitName} to go further?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Leave your email and we'll send hand-picked articles and Lighthouse
              how-tos that match where you are right now. No spam, just the kit.
            </p>
          </CardHeader>
          <CardContent>
            <EmailGate kitName={band.kitName} onUnlock={onUnlock} />
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button variant="ghost" onClick={onRestart}>
          Retake the assessment
        </Button>
      </div>
    </div>
  );
};
