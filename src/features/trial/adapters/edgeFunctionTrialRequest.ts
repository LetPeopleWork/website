import { supabase } from "@/integrations/supabase/client";
import type { TrialRequest, TrialRequestSubmission } from "../ports";

const REQUEST_TRIAL_FUNCTION = "request-trial";

export const createEdgeFunctionTrialRequest = (
  client = supabase,
): TrialRequestSubmission => ({
  async submit(request: TrialRequest) {
    const { error } = await client.functions.invoke(REQUEST_TRIAL_FUNCTION, {
      body: {
        email: request.email,
        organization: request.organization ?? null,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  },
});
