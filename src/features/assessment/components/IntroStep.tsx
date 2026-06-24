import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IntroStepProps {
  onStart: () => void;
}

export const IntroStep = ({ onStart }: IntroStepProps) => (
  <Card className="mx-auto w-full max-w-2xl">
    <CardHeader>
      <CardTitle className="text-2xl sm:text-3xl">
        Delivery Predictability Assessment
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <p className="text-base text-muted-foreground">
        An honest, ~5-minute read on how mature your delivery really is, across
        both what you measure and how you forecast. Six questions surface the one
        or two gaps quietly costing you predictability, with one clear score and a
        concrete next step. No email required to see your result.
      </p>
      <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>
        Start the assessment
      </Button>
    </CardContent>
  </Card>
);
