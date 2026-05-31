import { describe, it, expect } from "vitest";
import {
  buildMailgunRequest,
  sendViaMailgun,
  readMailgunConfig,
  type MailgunConfig,
} from "@shared/mailgun";
import { renderResultsEmail } from "@shared/resultsEmail";
import { bandOfScore } from "../core/scoring";

const SKIP_REASON =
  "@real-io: un-skip with live Mailgun secrets (MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_API_BASE, MAILGUN_FROM) and a MAILGUN_TEST_RECIPIENT inbox; build-only CI has no Mailgun creds so this documents the live POST contract";

const liveConfig = (): MailgunConfig | null =>
  readMailgunConfig((key) => process.env[key]);

describe.skip(`Results email delivery against live Mailgun — ${SKIP_REASON}`, () => {
  it("POSTs the rendered results email to the region messages endpoint with Basic auth and form fields", () => {
    const config = liveConfig();
    if (!config) throw new Error("Mailgun secrets are not set");

    const score = 58;
    const email = renderResultsEmail(bandOfScore(score), { score });
    const request = buildMailgunRequest(config, {
      to: process.env.MAILGUN_TEST_RECIPIENT ?? "",
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: "hello@letpeople.work",
    });

    expect(request.url).toMatch(/\/v3\/.+\/messages$/);
    expect(request.headers.Authorization).toMatch(/^Basic /);
    expect(request.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    const form = new URLSearchParams(request.body);
    expect(form.get("from")).toBe(config.from);
    expect(form.get("subject")).toBe(email.subject);
  });

  it("actually delivers a Flow-aware results email to the test recipient", async () => {
    const config = liveConfig();
    if (!config) throw new Error("Mailgun secrets are not set");

    const score = 58;
    const email = renderResultsEmail(bandOfScore(score), { score });
    await expect(
      sendViaMailgun(config, {
        to: process.env.MAILGUN_TEST_RECIPIENT ?? "",
        subject: email.subject,
        text: email.text,
        html: email.html,
        replyTo: "hello@letpeople.work",
      }),
    ).resolves.toBeUndefined();
  });
});
