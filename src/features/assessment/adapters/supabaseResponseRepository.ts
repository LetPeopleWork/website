import { supabase } from "@/integrations/supabase/client";
import type { CapturedResponse, ResponseRepository } from "../ports";

const RESPONSES_TABLE = "responses";

const toRow = (response: CapturedResponse) => ({
  source: response.source,
  kind: response.kind,
  // The port's tuple is readonly; the generated Json type wants a plain array.
  answers: [...response.answers],
  raw_sum: response.rawSum,
  score: response.score,
  band: response.band,
});

export const createSupabaseResponseRepository = (
  client = supabase,
): ResponseRepository => ({
  async save(response) {
    const { error } = await client
      .from(RESPONSES_TABLE)
      .insert(toRow(response));
    if (error) {
      throw new Error(error.message);
    }
  },
});
