import { CardHeader, CardTitle } from "@/components/ui/card";

export const SurveyIntro = () => (
  <CardHeader>
    <CardTitle className="text-2xl sm:text-3xl">
      Help shape Lighthouse
    </CardTitle>
    <p className="text-base text-muted-foreground">
      A few quick questions about how you use Lighthouse. No login, no account,
      and we never ask for your name.
    </p>
  </CardHeader>
);
