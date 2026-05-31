import type { Answers, BandName } from "../core/scoring";

export type ResponseSource = "readiness-assessment" | "user-survey";

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

export interface SurveySubmission {
  submit(answers: SurveyAnswers): Promise<void>;
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

export interface DashboardData {
  readonly responses: readonly DashboardResponse[];
  readonly leads: readonly DashboardLead[];
  readonly surveyResponses: readonly DashboardSurveyResponse[];
}

export interface DashboardRepository {
  load(source: ResponseSource): Promise<DashboardData>;
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
