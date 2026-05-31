import { describe, it, expect } from "vitest";
import { readMailgunConfig, type MailgunConfig } from "@shared/mailgun";

const fullEnv: Readonly<Record<string, string>> = {
  MAILGUN_API_KEY: "key-secret",
  MAILGUN_DOMAIN: "lighthouse.letpeople.work",
  MAILGUN_API_BASE: "https://api.eu.mailgun.net",
  MAILGUN_FROM: "LetPeopleWork <no-reply@lighthouse.letpeople.work>",
};

const lookup = (
  source: Readonly<Record<string, string>>,
): ((key: string) => string | undefined) => {
  return (key) => source[key];
};

describe("readMailgunConfig only yields config when every secret is present", () => {
  it("reads all four secrets into a config", () => {
    const config = readMailgunConfig(lookup(fullEnv));

    expect(config).toEqual<MailgunConfig>({
      apiKey: "key-secret",
      domain: "lighthouse.letpeople.work",
      apiBase: "https://api.eu.mailgun.net",
      from: "LetPeopleWork <no-reply@lighthouse.letpeople.work>",
    });
  });

  it.each(Object.keys(fullEnv))(
    "returns null (degrade-open) when %s is missing",
    (missingKey) => {
      const partial = Object.fromEntries(
        Object.entries(fullEnv).filter(([key]) => key !== missingKey),
      );

      expect(readMailgunConfig(lookup(partial))).toBeNull();
    },
  );
});
