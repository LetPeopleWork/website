import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Assessment from "@/pages/Assessment";
import type { LeadCapture, LeadSubmission } from "@/features/assessment/ports";

const noopRepository = { save: () => Promise.resolve() };

const renderGate = (leadCapture: LeadCapture) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/assessment"]}>
        <Assessment responseRepository={noopRepository} leadCapture={leadCapture} />
      </MemoryRouter>
    </HelmetProvider>,
  );

const reachTeaser = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(
    screen.getByRole("button", { name: /start the assessment/i }),
  );
  for (let i = 0; i < 6; i += 1) {
    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByRole("button", { name: /next|see my result/i }));
  }
  await screen.findByTestId("assessment-result");
};

const submitEmail = async (
  user: ReturnType<typeof userEvent.setup>,
  value: string,
) => {
  await user.type(screen.getByLabelText(/email/i), value);
  await user.click(screen.getByRole("button", { name: /send me/i }));
};

describe("Assessment results teaser + starter-kit email (#14/#15, #16, #17, #18)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("#14/#15 shows the score, band and breakdown immediately and invites an email for the starter kit", async () => {
    const user = userEvent.setup();
    renderGate({ capture: vi.fn().mockResolvedValue(undefined) });
    await reachTeaser(user);

    const teaser = screen.getByTestId("assessment-result");
    expect(within(teaser).getByText(/\/ 100/)).toBeInTheDocument();
    expect(within(teaser).getByText(/Drifting/)).toBeInTheDocument();
    expect(screen.getByTestId("assessment-breakdown")).toBeInTheDocument();
    expect(screen.getByTestId("assessment-gate")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("#16 a valid email records the lead and confirms the starter kit is on its way", async () => {
    const user = userEvent.setup();
    const captured: LeadSubmission[] = [];
    renderGate({
      capture: (lead) => {
        captured.push(lead);
        return Promise.resolve();
      },
    });
    await reachTeaser(user);
    await submitEmail(user, "maria.santos@acme.example");

    expect(await screen.findByTestId("assessment-kit-sent")).toBeInTheDocument();
    expect(screen.queryByTestId("assessment-gate")).not.toBeInTheDocument();
    expect(captured).toHaveLength(1);
    expect(captured[0]).toMatchObject({
      source: "readiness-assessment",
      email: "maria.santos@acme.example",
      score: 33,
      band: "Drifting",
    });
  });

  it("#17 an invalid email shows an inline error and records nothing", async () => {
    const user = userEvent.setup();
    const capture = vi.fn().mockResolvedValue(undefined);
    renderGate({ capture });
    await reachTeaser(user);
    await submitEmail(user, "tomas@");

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(screen.queryByTestId("assessment-kit-sent")).not.toBeInTheDocument();
    expect(screen.getByTestId("assessment-gate")).toBeInTheDocument();
    expect(capture).not.toHaveBeenCalled();
  });

  it("#18 a capture failure still confirms, retries once, and shows a non-blocking notice", async () => {
    const user = userEvent.setup();
    const capture = vi
      .fn<LeadCapture["capture"]>()
      .mockRejectedValueOnce(new Error("edge down"))
      .mockRejectedValueOnce(new Error("edge down"));
    renderGate({ capture });
    await reachTeaser(user);
    await submitEmail(user, "priya@acme.example");

    expect(await screen.findByTestId("assessment-kit-sent")).toBeInTheDocument();
    await waitFor(() => expect(capture).toHaveBeenCalledTimes(2));
  });
});
