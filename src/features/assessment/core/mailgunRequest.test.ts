import { describe, it, expect } from "vitest";
import {
  buildMailgunRequest,
  type MailgunConfig,
  type MailgunMessage,
} from "@shared/mailgun";

const getConfig = (overrides: Partial<MailgunConfig> = {}): MailgunConfig => ({
  apiKey: "key-secret",
  domain: "lighthouse.letpeople.work",
  apiBase: "https://api.eu.mailgun.net",
  from: "LetPeopleWork <no-reply@lighthouse.letpeople.work>",
  ...overrides,
});

const getMessage = (
  overrides: Partial<MailgunMessage> = {},
): MailgunMessage => ({
  to: "visitor@example.com",
  subject: "Your Delivery Predictability results",
  text: "plain body",
  html: "<p>html body</p>",
  replyTo: "hello@letpeople.work",
  ...overrides,
});

describe("buildMailgunRequest assembles the Mailgun HTTP API call", () => {
  it("targets the region messages endpoint with Basic auth and urlencoded fields", () => {
    const request = buildMailgunRequest(getConfig(), getMessage());

    expect(request.url).toBe(
      "https://api.eu.mailgun.net/v3/lighthouse.letpeople.work/messages",
    );
    expect(request.headers.Authorization).toBe(
      `Basic ${btoa("api:key-secret")}`,
    );
    expect(request.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );

    const form = new URLSearchParams(request.body);
    expect(form.get("from")).toBe(
      "LetPeopleWork <no-reply@lighthouse.letpeople.work>",
    );
    expect(form.get("to")).toBe("visitor@example.com");
    expect(form.get("subject")).toBe(
      "Your Delivery Predictability results",
    );
    expect(form.get("text")).toBe("plain body");
    expect(form.get("html")).toBe("<p>html body</p>");
    expect(form.get("h:Reply-To")).toBe("hello@letpeople.work");
  });

  it("omits the optional Reply-To field when no reply address is given", () => {
    const request = buildMailgunRequest(
      getConfig(),
      getMessage({ replyTo: undefined }),
    );

    const form = new URLSearchParams(request.body);
    expect(form.has("h:Reply-To")).toBe(false);
  });
});
