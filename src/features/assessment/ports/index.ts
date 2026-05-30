import type { Answers, BandName } from "../core/scoring";

export type ResponseSource = "readiness-assessment";

export interface CapturedResponse {
  readonly source: ResponseSource;
  readonly kind: string | null;
  readonly answers: Answers;
  readonly rawSum: number;
  readonly score: number;
  readonly band: BandName;
}

export interface ResponseRepository {
  save(response: CapturedResponse): Promise<void>;
}

export interface LeadSubmission {
  readonly source: ResponseSource;
  readonly email: string;
  readonly score: number;
  readonly band: BandName;
  readonly wantsTrial: boolean;
}

export interface LeadCapture {
  capture(lead: LeadSubmission): Promise<void>;
}
