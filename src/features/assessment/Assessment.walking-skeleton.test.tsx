import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Assessment from "@/pages/Assessment";

const renderAssessment = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/assessment"]}>
        <Assessment />
      </MemoryRouter>
    </HelmetProvider>,
  );

const answerCurrentQuestion = async (user: ReturnType<typeof userEvent.setup>) => {
  const options = screen.getAllByRole("radio");
  await user.click(options[options.length - 1]);
};

describe("Assessment walking skeleton (#1)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("#1 visitor completes the assessment and sees a score, a band, and a next step", async () => {
    const user = userEvent.setup();
    renderAssessment();

    await user.click(screen.getByRole("button", { name: /start/i }));

    for (let i = 0; i < 6; i += 1) {
      await answerCurrentQuestion(user);
      await user.click(screen.getByRole("button", { name: /next|see (my )?result/i }));
    }

    expect(await screen.findByText(/100/)).toBeInTheDocument();
    const result = screen.getByTestId("assessment-result");
    expect(within(result).getByText(/Predictable/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "visitor@example.com");
    await user.click(screen.getByRole("button", { name: /starter kit/i }));

    const nextSteps = await screen.findByTestId("assessment-next-steps");
    expect(
      within(nextSteps).getByRole("link", { name: /lighthouse/i }),
    ).toBeInTheDocument();
  });
});
