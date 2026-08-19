import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrialRequestDialog from "./components/TrialRequestDialog";
import type { TrialRequest } from "./ports";

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/plausible", () => ({ trackEvent, default: {} }));

const renderDialog = (submit: (request: TrialRequest) => Promise<void>) => {
  const submission = { submit: vi.fn(submit) };
  render(
    <TrialRequestDialog
      open
      onOpenChange={() => {}}
      source="pricing-card"
      submission={submission}
    />,
  );
  return submission;
};

beforeEach(() => {
  trackEvent.mockClear();
});

describe("the trial request dialog", () => {
  it("carries the promised messaging: no signup, no credit card, expires on its own", () => {
    renderDialog(async () => {});
    const dialog = screen.getByTestId("trial-dialog");
    expect(dialog).toHaveTextContent(/no signup, no credit card, nothing to cancel/i);
    expect(dialog).toHaveTextContent(/expires on its own/i);
    expect(dialog).toHaveTextContent(/we use your email to send the license, nothing else/i);
  });

  it("refuses a bad email with a message about the license, not about a form", async () => {
    const user = userEvent.setup();
    const submission = renderDialog(async () => {});

    await user.type(screen.getByLabelText(/where should we send the license/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send me the license/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i);
    expect(submission.submit).not.toHaveBeenCalled();
  });

  it("submits email and optional organization, then confirms a human sends it", async () => {
    const user = userEvent.setup();
    const submission = renderDialog(async () => {});

    await user.type(screen.getByLabelText(/where should we send the license/i), "po@company.com");
    await user.type(screen.getByLabelText(/organization/i), "ACME");
    await user.click(screen.getByRole("button", { name: /send me the license/i }));

    expect(submission.submit).toHaveBeenCalledWith({
      email: "po@company.com",
      organization: "ACME",
    });
    expect(await screen.findByTestId("trial-done")).toHaveTextContent(/a human sends these/i);
    expect(screen.getByTestId("trial-done")).toHaveTextContent(/nothing to cancel/i);
  });

  it("treats organization as genuinely optional", async () => {
    const user = userEvent.setup();
    const submission = renderDialog(async () => {});

    await user.type(screen.getByLabelText(/where should we send the license/i), "po@company.com");
    await user.click(screen.getByRole("button", { name: /send me the license/i }));

    expect(submission.submit).toHaveBeenCalledWith({
      email: "po@company.com",
      organization: undefined,
    });
  });

  it("never puts the email address into analytics", async () => {
    const user = userEvent.setup();
    renderDialog(async () => {});

    await user.type(screen.getByLabelText(/where should we send the license/i), "secret@corp.com");
    await user.click(screen.getByRole("button", { name: /send me the license/i }));
    await screen.findByTestId("trial-done");

    expect(trackEvent).toHaveBeenCalledWith("Trial requested", { source: "pricing-card" });
    expect(JSON.stringify(trackEvent.mock.calls)).not.toContain("secret@corp.com");
  });

  it("offers the licensing address as a fallback when the request fails", async () => {
    const user = userEvent.setup();
    renderDialog(async () => {
      throw new Error("edge function down");
    });

    await user.type(screen.getByLabelText(/where should we send the license/i), "po@company.com");
    await user.click(screen.getByRole("button", { name: /send me the license/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/licensing@letpeople\.work/i);
    // No success event for a failed request.
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
