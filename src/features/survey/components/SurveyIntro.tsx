import { CardHeader, CardTitle } from "@/components/ui/card";

export const SurveyIntro = () => (
  <CardHeader className="space-y-3">
    <CardTitle className="text-2xl sm:text-3xl">
      Help shape Lighthouse
    </CardTitle>
    <p className="text-base text-muted-foreground">
      Lighthouse can tell us which parts of it get opened, but only on instances
      where somebody turned that on, and only ever which parts — never whether
      they actually helped. This short survey is the only way we learn that. It's
      completely anonymous and takes about two minutes. At the end you can opt in
      to a free one-month Premium trial as a thank-you. The only step where we'd
      ask for your email and organization.
    </p>
  </CardHeader>
);
