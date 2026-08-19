// A 30-day Self-Service trial request from the Lighthouse page.
//
// Deliberately minimal: the whole pitch is "no signup", so the request is the
// email the license goes to and the organization it is for - the same two
// fields the survey's trial opt-in has always required. Fulfilment is manual -
// a human sends the license from the admin dashboard's Trial requests card and
// marks it as sent.

export interface TrialRequest {
  readonly email: string;
  readonly organization: string;
}

export interface TrialRequestSubmission {
  submit(request: TrialRequest): Promise<void>;
}
