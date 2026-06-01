import { CardHeader, CardTitle } from "@/components/ui/card";

export const SurveyIntro = () => (
  <CardHeader className="space-y-3">
    <CardTitle className="text-2xl sm:text-3xl">
      Help shape Lighthouse
    </CardTitle>
    <p className="text-base text-muted-foreground">
      Lighthouse never tracks how you use it, by design. That privacy is the
      point, but it also means we're flying blind on what to improve next, unless
      you tell us. This short survey is how we learn what's working and what's
      missing. It's completely anonymous and takes about two minutes. At the end
      you can opt in to a free one-month Premium trial as a thank-you. The only
      step where we'd ask for your email and organization.
    </p>
  </CardHeader>
);
