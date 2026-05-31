import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ANSWER_LABELS,
  TEAM_NOTIFICATION_RECIPIENT,
  notifyTeamDegradeOpen,
  renderSurveyNotificationEmail,
} from "@shared/surveyNotificationEmail";
import { SURVEY_QUESTIONS } from "../content/surveyContent";

const sampleAnswers = (): Record<string, string> => ({
  "team-count": "two-to-five",
  role: "engineering-manager-delivery-lead",
  "discovery-channel": "github",
  "assessment-interest": "maybe",
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("renderSurveyNotificationEmail builds a team alert from the answers", () => {
  it("addresses the team inbox and summarises every answered question with its human label", () => {
    const email = renderSurveyNotificationEmail({ answers: sampleAnswers() });

    expect(TEAM_NOTIFICATION_RECIPIENT).toBe("survey.answer@letpeople.work");
    expect(email.subject).toContain("survey");

    for (const body of [email.text, email.html]) {
      expect(body).toContain("2–5");
      expect(body).toContain("Engineering Manager / Delivery Lead");
      expect(body).toContain("GitHub");
      expect(body).toContain("Maybe");
    }
  });

  it("states no trial requested and carries no email address for a no-opt-in submission", () => {
    const email = renderSurveyNotificationEmail({ answers: sampleAnswers() });

    for (const body of [email.text, email.html]) {
      expect(body.toLowerCase()).toContain("no trial requested");
      expect(body).not.toMatch(/@(?!letpeople\.work)/);
    }
  });
});

describe("survey answer labels mirror the canonical surveyContent", () => {
  it.each(SURVEY_QUESTIONS)(
    "keeps every option label for %s byte-identical to surveyContent",
    (question) => {
      for (const option of question.options) {
        expect(ANSWER_LABELS[option.id]).toBe(option.label);
      }
    },
  );
});

describe("notifyTeamDegradeOpen never throws when the send fails", () => {
  it("swallows and logs a send failure so the submission still succeeds", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      notifyTeamDegradeOpen(() => {
        throw new Error("Mailgun unavailable");
      }),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("notification"),
      expect.any(Error),
    );
  });

  it("invokes the send exactly once on the happy path without logging an error", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const send = vi.fn().mockResolvedValue(undefined);

    await notifyTeamDegradeOpen(send);

    expect(send).toHaveBeenCalledOnce();
    expect(consoleError).not.toHaveBeenCalled();
  });
});
