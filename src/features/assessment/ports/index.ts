import type { Answers, BandName } from "../core/scoring";

export type ResponseSource =
  | "readiness-assessment"
  | "user-survey"
  | "user-survey-trial";

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

export type SurveyAnswers = Readonly<Record<string, string>>;

export interface SurveyTrialOptIn {
  readonly wantsTrial: true;
  readonly email: string;
}

export class TrialRequestFailedError extends Error {
  constructor() {
    super("Trial request did not go through");
    this.name = "TrialRequestFailedError";
  }
}

export interface SurveySubmission {
  submit(answers: SurveyAnswers, trial?: SurveyTrialOptIn): Promise<void>;
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

export interface DashboardResponse {
  readonly source: ResponseSource;
  readonly band: BandName;
  readonly score: number;
  readonly createdAt: string;
}

export interface DashboardLead {
  readonly source: ResponseSource;
  readonly email: string;
  readonly band: BandName;
  readonly score: number;
  readonly createdAt: string;
}

export interface DashboardSurveyResponse {
  readonly source: ResponseSource;
  readonly answers: SurveyAnswers;
  readonly createdAt: string;
}

export interface DashboardSurveyTrialRequest {
  readonly id: string;
  readonly source: ResponseSource;
  readonly email: string;
  readonly createdAt: string;
  readonly fulfilledAt: string | null;
}

export interface DashboardData {
  readonly responses: readonly DashboardResponse[];
  readonly leads: readonly DashboardLead[];
  readonly surveyResponses: readonly DashboardSurveyResponse[];
  readonly surveyTrialRequests?: readonly DashboardSurveyTrialRequest[];
}

export interface DashboardRepository {
  load(source: ResponseSource): Promise<DashboardData>;
  markTrialFulfilled(id: string): Promise<void>;
}

export interface AuthSession {
  readonly email: string;
}

export type SignInResult =
  | { readonly ok: true; readonly session: AuthSession }
  | { readonly ok: false; readonly error: string };

export interface AuthGateway {
  currentSession(): Promise<AuthSession | null>;
  signIn(email: string, password: string): Promise<SignInResult>;
  signOut(): Promise<void>;
  onChange(callback: (session: AuthSession | null) => void): () => void;
}
