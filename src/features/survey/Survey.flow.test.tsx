import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SurveyForm } from "./components/SurveyForm";
import { SURVEY_QUESTIONS } from "./content/surveyContent";

const noopSubmit = () => undefined;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/survey"
          element={<SurveyForm onSubmit={noopSubmit} />}
        />
      </Routes>
    </MemoryRouter>,
  );

describe("Survey page renders questions from config with no login", () => {
  it("shows every configured question prompt and a submit affordance", () => {
    renderAt("/survey");

    for (const question of SURVEY_QUESTIONS) {
      expect(screen.getByText(question.prompt)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: /submit/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in|sign in/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the identical page whether opened directly or via a shared link", () => {
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
            element={<SurveyForm onSubmit={noopSubmit} questions={null} />}
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
