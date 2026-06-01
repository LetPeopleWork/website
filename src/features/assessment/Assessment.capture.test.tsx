import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Assessment from "@/pages/Assessment";
import type {
  CapturedResponse,
  ResponseRepository,
} from "@/features/assessment/ports";

const recordingRepository = () => {
  const saved: CapturedResponse[] = [];
  const repository: ResponseRepository = {
    save: (response) => {
      saved.push(response);
      return Promise.resolve();
    },
  };
  return { repository, saved };
};

const completeAssessment = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.click(
    screen.getByRole("button", { name: /start the assessment/i }),
  );
  for (let i = 0; i < 6; i += 1) {
    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByRole("button", { name: /next|see my result/i }));
  }
  await screen.findByTestId("assessment-result");
};

const renderWith = (repository: ResponseRepository) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/assessment"]}>
        <Assessment responseRepository={repository} />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Assessment capture (#22 captured completion, #23 single row, degrade-open)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("#22/#23 captures exactly one readiness-assessment response carrying answers, raw sum, score and band", async () => {
    const user = userEvent.setup();
    const { repository, saved } = recordingRepository();
    renderWith(repository);

    await completeAssessment(user);

    expect(saved).toHaveLength(1);
    const [response] = saved;
    expect(response.source).toBe("readiness-assessment");
    expect(response.answers).toEqual([1, 1, 1, 1, 1, 1]);
    expect(response.rawSum).toBe(6);
    expect(response.score).toBe(33);
    expect(response.band).toBe("Drifting");
  });

  it("#22 a completion with no email is still captured (the row needs no lead)", async () => {
    const user = userEvent.setup();
    const { repository, saved } = recordingRepository();
    renderWith(repository);

    await completeAssessment(user);

    expect(saved).toHaveLength(1);
  });

  it("a repository write failure never blocks the visitor's result (degrade open)", async () => {
    const user = userEvent.setup();
    const failing: ResponseRepository = {
      save: () => Promise.reject(new Error("supabase unreachable")),
    };
    renderWith(failing);

    await completeAssessment(user);

    expect(screen.getByTestId("assessment-result")).toBeInTheDocument();
  });

  it("captures the completion only once even though the teaser re-renders", async () => {
    const user = userEvent.setup();
    const save = vi.fn().mockResolvedValue(undefined);
    renderWith({ save });

    await completeAssessment(user);

    expect(save).toHaveBeenCalledTimes(1);
  });
});
