export interface MailgunConfig {
  readonly apiKey: string;
  readonly domain: string;
  readonly apiBase: string;
  readonly from: string;
}

export interface MailgunMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
  readonly replyTo?: string;
}

export interface MailgunRequest {
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
}

export const buildMailgunRequest = (
  config: MailgunConfig,
  message: MailgunMessage,
): MailgunRequest => {
  const form = new URLSearchParams({
    from: config.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
  if (message.replyTo) {
    form.set("h:Reply-To", message.replyTo);
  }
  return {
    url: `${config.apiBase}/v3/${config.domain}/messages`,
    headers: {
      Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  };
};

export const sendViaMailgun = async (
  config: MailgunConfig,
  message: MailgunMessage,
): Promise<void> => {
  const request = buildMailgunRequest(config, message);
  const response = await fetch(request.url, {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });
  if (!response.ok) {
    throw new Error(
      `Mailgun send failed with status ${response.status}`,
    );
  }
};

export const readMailgunConfig = (
  env: (key: string) => string | undefined,
): MailgunConfig | null => {
  const apiKey = env("MAILGUN_API_KEY");
  const domain = env("MAILGUN_DOMAIN");
  const apiBase = env("MAILGUN_API_BASE");
  const from = env("MAILGUN_FROM");
  if (!apiKey || !domain || !apiBase || !from) {
    return null;
  }
  return { apiKey, domain, apiBase, from };
};
