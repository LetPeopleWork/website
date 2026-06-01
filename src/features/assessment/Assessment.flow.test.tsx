import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Assessment from "@/pages/Assessment";
import { createSessionStoragePersistence } from "@/features/assessment/adapters/sessionStoragePersistence";

const renderAssessment = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/assessment"]}>
        <Assessment />
      </MemoryRouter>
    </HelmetProvider>,
  );

const startAndAnswer = async (
  user: ReturnType<typeof userEvent.setup>,
  count: number,
) => {
  await user.click(screen.getByRole("button", { name: /start the assessment/i }));
  for (let i = 0; i < count; i += 1) {
    const radios = screen.getAllByRole("radio");
    await user.click(radios[1]);
    if (i < count - 1) {
      await user.click(screen.getByRole("button", { name: /^next$/i }));
    }
  }
};

describe("Assessment flow integration (#3 back, #4 resume, #5 restart, #19 teaser)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("#4 a mid-assessment refresh restores prior answers and resumes in progress", async () => {
    const user = userEvent.setup();
    renderAssessment();
    await startAndAnswer(user, 4);

    const persisted = createSessionStoragePersistence().load();
    expect(persisted?.filter((answer) => answer !== null)).toHaveLength(4);

    renderAssessment();
    expect(
      await screen.findByText(/restored your answers/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/of 6/i).length).toBeGreaterThan(0);
  });

  it("#3 going back to an earlier question keeps the selected answer", async () => {
    const user = userEvent.setup();
    renderAssessment();
    await startAndAnswer(user, 3);
    await user.click(screen.getByRole("button", { name: /back/i }));

    const checkedOnReturn = screen
      .getAllByRole("radio")
      .filter((radio) => radio.getAttribute("aria-checked") === "true");
    expect(checkedOnReturn).toHaveLength(1);
  });

  it("#7 every answer choice is reachable on a 375px-wide phone screen", async () => {
    const user = userEvent.setup();
    Object.defineProperty(globalThis, "innerWidth", {
      configurable: true,
      value: 375,
    });
    renderAssessment();
    await user.click(
      screen.getByRole("button", { name: /start the assessment/i }),
    );

    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(4);
    await user.click(options[3]);
    expect(options[3].getAttribute("aria-checked")).toBe("true");
    expect(
      (screen.getByRole("button", { name: /^next$/i }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });

  it("#5 returning with no draft starts gently at the intro", async () => {
    renderAssessment();
    expect(
      screen.getByRole("button", { name: /start the assessment/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/restored your answers/i)).not.toBeInTheDocument();
  });

  it("#19 the teaser shows score and band with the breakdown gated below", async () => {
    const user = userEvent.setup();
    renderAssessment();
    await user.click(
      screen.getByRole("button", { name: /start the assessment/i }),
    );
    for (let i = 0; i < 6; i += 1) {
      await user.click(screen.getAllByRole("radio")[1]);
      await user.click(
        screen.getByRole("button", { name: /next|see my result/i }),
      );
    }

    const result = await screen.findByTestId("assessment-result");
    expect(within(result).getByText(/\/ 100/)).toBeInTheDocument();
    expect(within(result).getByText(/Drifting/)).toBeInTheDocument();
    expect(screen.queryByTestId("assessment-breakdown")).not.toBeInTheDocument();
  });
});
