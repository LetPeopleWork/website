import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SurveyForm } from "./components/SurveyForm";
import { SURVEY_QUESTIONS } from "./content/surveyContent";
import type { SurveySubmission } from "../assessment/ports";

const noopSubmission: SurveySubmission = {
  submit: () => Promise.resolve(),
};

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/survey"
          element={<SurveyForm submission={noopSubmission} />}
        />
      </Routes>
    </MemoryRouter>,
  );

const startSurvey = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /start/i }));
};

describe("Survey page steps one question per screen with no login", () => {
  it("shows only the first question after starting, never all at once", async () => {
    const user = userEvent.setup();
    renderAt("/survey");
    await startSurvey(user);

    expect(screen.getByText(SURVEY_QUESTIONS[0].prompt)).toBeInTheDocument();
    expect(
      screen.queryByText(SURVEY_QUESTIONS[1].prompt),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 of 4")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in|sign in/i }),
    ).not.toBeInTheDocument();
  });

  it("advances to the next question only after an answer is chosen", async () => {
    const user = userEvent.setup();
    renderAt("/survey");
    await startSurvey(user);

    const next = screen.getByRole("button", { name: /^next$/i });
    expect(next).toBeDisabled();

    await user.click(
      screen.getByText(SURVEY_QUESTIONS[0].options[0].label),
    );
    expect(screen.getByRole("button", { name: /^next$/i })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(screen.getByText(SURVEY_QUESTIONS[1].prompt)).toBeInTheDocument();
    expect(screen.getByText("2 of 4")).toBeInTheDocument();
  });

  it("renders the identical entry screen whether opened directly or via a shared link", () => {
    const { container: direct } = renderAt("/survey");
    const { container: shared } = renderAt("/survey?ref=chat-channel");

    expect(direct.textContent).toBe(shared.textContent);
  });

  it("shows a temporarily-unavailable message instead of a blank page when content fails to load", () => {
    render(
      <MemoryRouter initialEntries={["/survey"]}>
        <Routes>
          <Route
            path="/survey"
            element={
              <SurveyForm submission={noopSubmission} questions={null} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/survey temporarily unavailable/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });
});
