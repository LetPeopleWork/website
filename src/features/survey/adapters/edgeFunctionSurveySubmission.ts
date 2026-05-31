import { supabase } from "@/integrations/supabase/client";
import type { SurveyAnswers, SurveySubmission } from "../../assessment/ports";

const SUBMIT_SURVEY_FUNCTION = "submit-survey";

const SURVEY_SOURCE = "user-survey";

export const createEdgeFunctionSurveySubmission = (
  client = supabase,
): SurveySubmission => ({
  async submit(answers: SurveyAnswers) {
    const { error } = await client.functions.invoke(SUBMIT_SURVEY_FUNCTION, {
      body: {
        source: SURVEY_SOURCE,
        answers,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  },
});
