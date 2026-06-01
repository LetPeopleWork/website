import { supabase } from "@/integrations/supabase/client";
import type { LeadCapture, LeadSubmission } from "../ports";

const CAPTURE_LEAD_FUNCTION = "capture-lead";

export const createEdgeFunctionLeadCapture = (
  client = supabase,
): LeadCapture => ({
  async capture(lead: LeadSubmission) {
    const { error } = await client.functions.invoke(CAPTURE_LEAD_FUNCTION, {
      body: {
        source: lead.source,
        email: lead.email,
        score: lead.score,
        band: lead.band,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  },
});
