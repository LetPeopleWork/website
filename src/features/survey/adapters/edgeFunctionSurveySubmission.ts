import { supabase } from "@/integrations/supabase/client";
import {
  TrialRequestFailedError,
  type SurveyAnswers,
  type SurveySubmission,
  type SurveyTrialOptIn,
} from "../../assessment/ports";

const SUBMIT_SURVEY_FUNCTION = "submit-survey";

const SURVEY_SOURCE = "user-survey";

interface SubmitSurveyResponse {
  readonly recorded?: boolean;
  readonly trialRecorded?: boolean;
}

const trialBody = (trial: SurveyTrialOptIn | undefined) =>
  trial
    ? {
        wantsTrial: true,
        email: trial.email,
        organization: trial.organization,
      }
    : {};

export const createEdgeFunctionSurveySubmission = (
  client = supabase,
): SurveySubmission => ({
  async submit(answers: SurveyAnswers, trial?: SurveyTrialOptIn) {
    const { data, error } = await client.functions.invoke<SubmitSurveyResponse>(
      SUBMIT_SURVEY_FUNCTION,
      {
        body: {
          source: SURVEY_SOURCE,
          answers,
          ...trialBody(trial),
        },
      },
    );
    if (error) {
      throw new Error(error.message);
    }
    if (trial && data?.trialRecorded === false) {
      throw new TrialRequestFailedError();
    }
  },
});
