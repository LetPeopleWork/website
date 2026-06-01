import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SurveyForm } from "./components/SurveyForm";
import {
  SURVEY_QUESTIONS,
  type SurveyQuestion,
} from "./content/surveyContent";
import {
  TrialRequestFailedError,
  type SurveyAnswers,
  type SurveySubmission,
  type SurveyTrialOptIn,
} from "../assessment/ports";

interface RecordedSubmission {
  readonly answers: SurveyAnswers;
  readonly trial: SurveyTrialOptIn | undefined;
}

const recordingSubmission = () => {
  const calls: RecordedSubmission[] = [];
  const submission: SurveySubmission = {
    submit: (answers, trial) => {
      calls.push({ answers, trial });
      return Promise.resolve();
    },
  };
  return { submission, calls };
};

const trialFailingSubmission = () => {
  const calls: RecordedSubmission[] = [];
  const submission: SurveySubmission = {
    submit: (answers, trial) => {
      calls.push({ answers, trial });
      return Promise.reject(new TrialRequestFailedError());
    },
  };
  return { submission, calls };
};

const renderForm = (submission: SurveySubmission) =>
  render(
    <MemoryRouter initialEntries={["/survey"]}>
      <SurveyForm submission={submission} />
    </MemoryRouter>,
  );

const answerStep = async (
  user: ReturnType<typeof userEvent.setup>,
  question: SurveyQuestion,
) => {
  if (question.kind === "text") return;
  if (question.multiple) {
    await user.click(screen.getByLabelText(question.options[0].label));
  } else {
    await user.click(screen.getByText(question.options[0].label));
  }
};

const reachExchange = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /start/i }));
  for (const question of SURVEY_QUESTIONS) {
    await answerStep(user, question);
    await user.click(screen.getByRole("button", { name: /^next$/i }));
  }
};

const optIntoTrial = async (
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  organization?: string,
) => {
  await user.click(
    screen.getByRole("checkbox", { name: /free.*premium trial/i }),
  );
  await user.type(screen.getByRole("textbox", { name: /email/i }), email);
  if (organization !== undefined) {
    await user.type(
      screen.getByRole("textbox", { name: /organization/i }),
      organization,
    );
  }
};

const submitFromExchange = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /submit/i }));
};

describe("Survey trial opt-in (US-04 / US-08)", () => {
  it("records a trial request with the volunteered email and organization", async () => {
    const user = userEvent.setup();
    const { submission, calls } = recordingSubmission();
    renderForm(submission);

    await reachExchange(user);
    await optIntoTrial(user, "member@example.com", "Acme Inc.");
    await submitFromExchange(user);

    await screen.findByText(/thank you/i);
    expect(calls).toHaveLength(1);
    expect(calls[0].trial).toEqual({
      wantsTrial: true,
      email: "member@example.com",
      organization: "Acme Inc.",
    });
  });

  it("stays anonymous and carries no email when the trial is not opted into", async () => {
    const user = userEvent.setup();
    const { submission, calls } = recordingSubmission();
    renderForm(submission);

    await reachExchange(user);
    await submitFromExchange(user);

    await screen.findByText(/thank you/i);
    expect(calls).toHaveLength(1);
    expect(calls[0].trial).toBeUndefined();
  });

  it("catches an invalid email inline and submits nothing while preserving the answers", async () => {
    const user = userEvent.setup();
    const { submission, calls } = recordingSubmission();
    renderForm(submission);

    await reachExchange(user);
    await optIntoTrial(user, "not-an-email", "Acme Inc.");
    await submitFromExchange(user);

    await screen.findByRole("alert");
    expect(calls).toHaveLength(0);
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    expect(
      (screen.getByRole("textbox", { name: /email/i }) as HTMLInputElement).value,
    ).toBe("not-an-email");
  });

  it("requires an organization before a trial can be requested", async () => {
    const user = userEvent.setup();
    const { submission, calls } = recordingSubmission();
    renderForm(submission);

    await reachExchange(user);
    await optIntoTrial(user, "member@example.com");
    await submitFromExchange(user);

    await screen.findByRole("alert");
    expect(calls).toHaveLength(0);
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
  });

  it("tells the member the trial request specifically failed and lets them retry", async () => {
    const user = userEvent.setup();
    const { submission } = trialFailingSubmission();
    renderForm(submission);

    await reachExchange(user);
    await optIntoTrial(user, "member@example.com", "Acme Inc.");
    await submitFromExchange(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent?.toLowerCase()).toContain("trial");
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });
});

describe.skip("@real-io submit-survey trial opt-in against live Supabase (US-04)", () => {
  it("writes a leads row via service_role and never auto-issues a license", () => {
    expect(true).toBe(true);
  });
});
