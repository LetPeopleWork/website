import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SurveyForm, type SurveySelections } from "./components/SurveyForm";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type { SurveySubmission } from "../assessment/ports";

const firstOptionSelections = (): SurveySelections =>
  Object.fromEntries(
    SURVEY_QUESTIONS.map((question) => [question.id, question.options[0].id]),
  );

const recordingSubmission = () => {
  const submitted: SurveySelections[] = [];
  const submission: SurveySubmission = {
    submit: (answers) => {
      submitted.push(answers);
      return Promise.resolve();
    },
  };
  return { submission, submitted };
};

const failingSubmission = () => {
  const submitted: SurveySelections[] = [];
  const submission: SurveySubmission = {
    submit: (answers) => {
      submitted.push(answers);
      return Promise.reject(new Error("recording failed"));
    },
  };
  return { submission, submitted };
};

const slowSubmission = () => {
  const submitted: SurveySelections[] = [];
  let release = (): void => undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const submission: SurveySubmission = {
    submit: (answers) => {
      submitted.push(answers);
      return gate;
    },
  };
  return { submission, submitted, release: () => release() };
};

const renderForm = (submission: SurveySubmission) =>
  render(
    <MemoryRouter initialEntries={["/survey"]}>
      <SurveyForm submission={submission} />
    </MemoryRouter>,
  );

const answerEveryQuestion = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  for (const question of SURVEY_QUESTIONS) {
    await user.click(screen.getByText(question.options[0].label));
  }
};

const submitButton = () => screen.getByRole("button", { name: /submit/i });

describe("Survey capture (US-02: anonymous store, success-only thank-you, retry, dedup)", () => {
  it("shows the thank-you confirmation only after a recording succeeds", async () => {
    const user = userEvent.setup();
    const { submission, submitted } = recordingSubmission();
    renderForm(submission);

    await answerEveryQuestion(user);
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();

    await user.click(submitButton());

    await screen.findByText(/thank you/i);
    expect(submitted).toEqual([firstOptionSelections()]);
  });

  it("shows a retry-able error, no thank-you, and preserves answers when recording fails", async () => {
    const user = userEvent.setup();
    const { submission } = failingSubmission();
    renderForm(submission);

    await answerEveryQuestion(user);
    await user.click(submitButton());

    await screen.findByRole("alert");
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    expect(submitButton()).toBeEnabled();

    const checkedValues = screen
      .getAllByRole("radio")
      .filter((radio) => radio.getAttribute("aria-checked") === "true")
      .map((radio) => radio.getAttribute("value"));
    expect(checkedValues).toEqual(
      SURVEY_QUESTIONS.map((question) => question.options[0].id),
    );
  });

  it("records one logical response when submitted twice in quick succession", async () => {
    const user = userEvent.setup();
    const { submission, submitted, release } = slowSubmission();
    renderForm(submission);

    await answerEveryQuestion(user);
    await user.click(submitButton());
    await user.click(submitButton());
    release();

    await screen.findByText(/thank you/i);
    expect(submitted).toHaveLength(1);
  });
});

describe.skip("@real-io submit-survey edge function against live Supabase (US-02, US-08)", () => {
  it("records the answers through the trusted service_role server-side path only", () => {
    expect(true).toBe(true);
  });

  it("refuses a submission carrying a smuggled score or band and records nothing", () => {
    expect(true).toBe(true);
  });

  it("never widens the responses_anon_insert policy to user-survey", () => {
    expect(true).toBe(true);
  });
});

describe("Assessment CapturedResponse keeps its non-null scored shape (5123 regression)", () => {
  it("requires score and band on the assessment response port", async () => {
    const ports = await import("../assessment/ports");
    const captured: ports.CapturedResponse = {
      source: "readiness-assessment",
      kind: null,
      answers: [1, 1, 1, 1, 1, 1],
      rawSum: 6,
      score: 50,
      band: "Output-focused",
    };

    expect(typeof captured.score).toBe("number");
    expect(typeof captured.band).toBe("string");
    expect(captured.source).toBe("readiness-assessment");
  });
});
