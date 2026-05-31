import { describe, it, expect } from "vitest";
import {
  buildMailgunRequest,
  sendViaMailgun,
  readMailgunConfig,
  type MailgunConfig,
} from "@shared/mailgun";
import {
  TEAM_NOTIFICATION_RECIPIENT,
  renderSurveyNotificationEmail,
} from "@shared/surveyNotificationEmail";

const SKIP_REASON =
  "@real-io: un-skip with live Mailgun secrets (MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_API_BASE, MAILGUN_FROM) and a provisioned survey.answer@letpeople.work inbox; build-only CI has no Mailgun creds so this documents the live team-notification POST contract";

const liveConfig = (): MailgunConfig | null =>
  readMailgunConfig((key) => process.env[key]);

const sampleAnswers = (): Record<string, string> => ({
  "team-count": "two-to-five",
  role: "engineering-manager-delivery-lead",
  "discovery-channel": "github",
  "assessment-interest": "maybe",
});

describe.skip(`Survey team notification against live Mailgun — ${SKIP_REASON}`, () => {
  it("POSTs the rendered team alert to the messages endpoint with Basic auth and form fields", () => {
    const config = liveConfig();
    if (!config) throw new Error("Mailgun secrets are not set");

    const email = renderSurveyNotificationEmail({ answers: sampleAnswers() });
    const request = buildMailgunRequest(config, {
      to: TEAM_NOTIFICATION_RECIPIENT,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    expect(request.url).toMatch(/\/v3\/.+\/messages$/);
    expect(request.headers.Authorization).toMatch(/^Basic /);
    expect(request.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    const form = new URLSearchParams(request.body);
    expect(form.get("to")).toBe(TEAM_NOTIFICATION_RECIPIENT);
    expect(form.get("subject")).toBe(email.subject);
  });

  it("actually delivers a survey team alert to the team inbox", async () => {
    const config = liveConfig();
    if (!config) throw new Error("Mailgun secrets are not set");

    const email = renderSurveyNotificationEmail({ answers: sampleAnswers() });
    await expect(
      sendViaMailgun(config, {
        to: TEAM_NOTIFICATION_RECIPIENT,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    ).resolves.toBeUndefined();
  });
});
