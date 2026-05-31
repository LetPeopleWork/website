import type { BandName } from "./bands.ts";

export interface EmailCta {
  readonly label: string;
  readonly href: string;
}

export interface BandEmailCopy {
  readonly tagline: string;
  readonly measureRead: string;
  readonly forecastRead: string;
  readonly nextRung: string;
  readonly ctas: readonly EmailCta[];
}

export interface ResultsEmail {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export interface RenderResultsEmailOptions {
  readonly score: number;
}

export const REPLY_TO_ADDRESS = "contact@letpeople.work";

const SUBJECT = "Your Flow & Forecasting Readiness results";
const GREETING = "Hi there,";
const REPLY_OFFER =
  "Just reply to this email and we'll point you to the right next step.";
const LOGO_URL =
  "https://raw.githubusercontent.com/LetPeopleWork/website/refs/heads/main/src/assets/logo.png";

export const BAND_EMAIL_COPY: Readonly<Record<BandName, BandEmailCopy>> = {
  "Flying blind": {
    tagline: "Dates are gut-feel.",
    measureRead:
      "You're not yet measuring flow — there's no cycle time, throughput or WIP signal to lean on, so the team can't see how work actually moves.",
    forecastRead:
      "And there's no probabilistic forecasting — commitments are gut-feel dates with no honest read on whether you'll hit them.",
    nextRung:
      "The next rung is simply to start measuring flow and run one honest forecast instead of guessing.",
    ctas: [
      {
        label: "Start with Lighthouse Community (free)",
        href: "https://letpeople.work/lighthouse",
      },
      {
        label: "Book a consulting call",
        href: "https://letpeople.work/#stay-connected",
      },
    ],
  },
  "Output-focused": {
    tagline: "Counting output, not measuring flow.",
    measureRead:
      "You're counting output — points or items closed — rather than measuring flow, so you can see how much got done but not how predictably it flows.",
    forecastRead:
      "And you forecast with estimates rather than probabilities, so a single date hides the real range of outcomes.",
    nextRung:
      "The next rung is to shift from output to flow metrics and run your first probabilistic forecast.",
    ctas: [
      {
        label: "Start with Lighthouse Community (free)",
        href: "https://letpeople.work/lighthouse",
      },
      {
        label: "Get light coaching",
        href: "https://letpeople.work/#stay-connected",
      },
    ],
  },
  "Flow-aware": {
    tagline: "Watching flow, starting to forecast.",
    measureRead:
      "You're watching real flow metrics — cycle time, throughput and WIP are on your radar and informing conversations.",
    forecastRead:
      "And you're starting to forecast beyond single-date estimates — the instinct for probability is there, it just isn't operationalised yet.",
    nextRung:
      "The next rung is to operationalise forecasting so every commitment carries an explicit, defensible probability.",
    ctas: [
      {
        label: "Use Community to operationalize forecasting (free)",
        href: "https://letpeople.work/lighthouse",
      },
    ],
  },
  Probabilistic: {
    tagline: "Forecasting by percentiles and steering by them.",
    measureRead:
      "You measure flow as a matter of course — cycle time, throughput, WIP and flow health are live inputs to how you work.",
    forecastRead:
      "And you forecast probabilistically and steer by it — Monte Carlo / percentile forecasts drive your commitments and re-planning.",
    nextRung:
      "The next rung is to scale this across teams and portfolios and keep validating your forecasts against reality.",
    ctas: [
      {
        label: "Explore Lighthouse paid / portfolio tiers",
        href: "https://letpeople.work/lighthouse#lighthouse-premium",
      },
      {
        label: "Use Community to validate your forecasts (free)",
        href: "https://letpeople.work/lighthouse",
      },
    ],
  },
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const ctaHtml = (cta: EmailCta): string =>
  `<li style="margin-bottom: 8px;"><a href="${cta.href}" style="color: #007bff;">${escapeHtml(cta.label)}</a></li>`;

const ctaText = (cta: EmailCta): string => `- ${cta.label}: ${cta.href}`;

const renderHtml = (
  band: BandName,
  score: number,
  copy: BandEmailCopy,
): string => `<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50;">Your Flow &amp; Forecasting Readiness results</h2>

      <p>${GREETING}</p>

      <p>Here's where your team stands on flow &amp; forecasting — keep this for yourself or forward it to your team.</p>

      <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #495057;">Your result: ${score} / 100 — ${escapeHtml(band)}</h3>
        <p style="margin-bottom: 0;">${escapeHtml(copy.tagline)}</p>
      </div>

      <div style="background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0c5460;">How you measure flow</h4>
        <p style="margin-bottom: 0;">${escapeHtml(copy.measureRead)}</p>
      </div>

      <div style="background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0c5460;">How you forecast</h4>
        <p style="margin-bottom: 0;">${escapeHtml(copy.forecastRead)}</p>
      </div>

      <h3 style="color: #495057;">Your next rung</h3>
      <p>${escapeHtml(copy.nextRung)}</p>

      <ul>
        ${copy.ctas.map(ctaHtml).join("\n        ")}
      </ul>

      <p style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 10px; margin: 20px 0;">
        ${REPLY_OFFER}
      </p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
        <table style="width: 100%; font-family: Arial, sans-serif;">
          <tr>
            <td style="width: 80px; vertical-align: top; padding-right: 15px;">
              <img src="${LOGO_URL}" alt="LetPeopleWork" style="width: 70px; height: auto;" />
            </td>
            <td style="vertical-align: top;">
              <div style="color: #2c3e50; font-weight: bold; font-size: 16px;">LetPeopleWork</div>
              <div style="margin-top: 8px;">
                <div style="color: #34495e; font-size: 13px;">📧 ${REPLY_TO_ADDRESS}</div>
                <div style="color: #34495e; font-size: 13px;">🌐 https://letpeople.work</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>`;

const renderText = (
  band: BandName,
  score: number,
  copy: BandEmailCopy,
): string => `Your Flow & Forecasting Readiness results

${GREETING}

Here's where your team stands on flow & forecasting — keep this for yourself or forward it to your team.

Your result: ${score} / 100 — ${band}
${copy.tagline}

How you measure flow:
${copy.measureRead}

How you forecast:
${copy.forecastRead}

Your next rung:
${copy.nextRung}

${copy.ctas.map(ctaText).join("\n")}

${REPLY_OFFER}

--
LetPeopleWork
📧 ${REPLY_TO_ADDRESS}
🌐 https://letpeople.work`;

export const renderResultsEmail = (
  band: BandName,
  options: RenderResultsEmailOptions,
): ResultsEmail => {
  const copy = BAND_EMAIL_COPY[band];
  return {
    subject: SUBJECT,
    html: renderHtml(band, options.score, copy),
    text: renderText(band, options.score, copy),
  };
};
