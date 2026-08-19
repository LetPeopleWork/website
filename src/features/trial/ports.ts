// A 30-day Self-Service trial request from the Lighthouse page.
//
// Deliberately minimal: the whole pitch is "no signup", so the request is one
// required email and nothing else the visitor has to think about. Fulfilment
// is manual - a human sends the license from the admin dashboard's Trial
// requests card and marks it as sent.

export interface TrialRequest {
  readonly email: string;
  readonly organization?: string;
}

export interface TrialRequestSubmission {
  submit(request: TrialRequest): Promise<void>;
}
