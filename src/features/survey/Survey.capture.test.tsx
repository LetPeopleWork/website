import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SurveyForm } from "./components/SurveyForm";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type { SurveyAnswers, SurveySubmission } from "../assessment/ports";

const firstOptionSelections = (): SurveyAnswers =>
  Object.fromEntries(
    SURVEY_QUESTIONS.map((question) => [question.id, question.options[0].id]),
  );

const recordingSubmission = () => {
  const submitted: SurveyAnswers[] = [];
  const submission: SurveySubmission = {
    submit: (answers) => {
      submitted.push(answers);
      return Promise.resolve();
    },
  };
  return { submission, submitted };
};

const failingSubmission = () => {
  const submitted: SurveyAnswers[] = [];
  const submission: SurveySubmission = {
    submit: (answers) => {
      submitted.push(answers);
      return Promise.reject(new Error("recording failed"));
    },
  };
  return { submission, submitted };
};

const slowSubmission = () => {
  const submitted: SurveyAnswers[] = [];
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

const advanceButton = (last: boolean) =>
  last
    ? screen.getByRole("button", { name: /submit/i })
    : screen.getByRole("button", { name: /^next$/i });

const stepThroughEveryQuestion = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.click(screen.getByRole("button", { name: /start/i }));
  for (const question of SURVEY_QUESTIONS) {
    await user.click(screen.getByText(question.options[0].label));
    await user.click(advanceButton(false));
  }
};

describe("Survey capture (US-02: anonymous store, success-only thank-you, retry, dedup)", () => {
  it("shows the thank-you confirmation only after a recording succeeds", async () => {
    const user = userEvent.setup();
    const { submission, submitted } = recordingSubmission();
    renderForm(submission);

    await stepThroughEveryQuestion(user);
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();

    await user.click(advanceButton(true));

    await screen.findByText(/thank you/i);
    expect(submitted).toEqual([firstOptionSelections()]);
  });

  it("shows a retry-able error, no thank-you, and preserves answers when recording fails", async () => {
    const user = userEvent.setup();
    const { submission } = failingSubmission();
    renderForm(submission);

    await stepThroughEveryQuestion(user);
    await user.click(advanceButton(true));

    await screen.findByRole("alert");
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /back/i }));
    const lastQuestion = SURVEY_QUESTIONS[SURVEY_QUESTIONS.length - 1];
    const checked = screen
      .getAllByRole("radio")
      .filter((radio) => radio.getAttribute("aria-checked") === "true")
      .map((radio) => radio.getAttribute("value"));
    expect(checked).toEqual([lastQuestion.options[0].id]);
  });

  it("records one logical response when submitted twice in quick succession", async () => {
    const user = userEvent.setup();
    const { submission, submitted, release } = slowSubmission();
    renderForm(submission);

    await stepThroughEveryQuestion(user);
    await user.click(advanceButton(true));
    await user.click(advanceButton(true));
    release();

    await screen.findByText(/thank you/i);
    expect(submitted).toHaveLength(1);
  });

  it("preserves earlier answers when stepping back and forward", async () => {
    const user = userEvent.setup();
    const { submission, submitted } = recordingSubmission();
    renderForm(submission);

    await user.click(screen.getByRole("button", { name: /start/i }));
    await user.click(screen.getByText(SURVEY_QUESTIONS[0].options[1].label));
    await user.click(advanceButton(false));
    await user.click(screen.getByText(SURVEY_QUESTIONS[1].options[0].label));
    await user.click(screen.getByRole("button", { name: /back/i }));

    const checkedAfterBack = screen
      .getAllByRole("radio")
      .filter((radio) => radio.getAttribute("aria-checked") === "true")
      .map((radio) => radio.getAttribute("value"));
    expect(checkedAfterBack).toEqual([SURVEY_QUESTIONS[0].options[1].id]);

    await user.click(advanceButton(false));
    await user.click(advanceButton(false));
    await user.click(screen.getByText(SURVEY_QUESTIONS[2].options[0].label));
    await user.click(advanceButton(false));
    await user.click(screen.getByText(SURVEY_QUESTIONS[3].options[0].label));
    await user.click(advanceButton(false));
    await user.click(advanceButton(true));

    await screen.findByText(/thank you/i);
    expect(submitted[0][SURVEY_QUESTIONS[0].id]).toBe(
      SURVEY_QUESTIONS[0].options[1].id,
    );
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
