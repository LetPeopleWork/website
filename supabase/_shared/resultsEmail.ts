import type { BandName } from "./bands.ts";

export interface EmailCta {
  readonly label: string;
  readonly href: string;
}

export interface EmailLink {
  readonly label: string;
  readonly href: string;
}

export interface BandEmailCopy {
  readonly kitName: string;
  readonly tagline: string;
  readonly measureRead: string;
  readonly forecastRead: string;
  readonly ctas: readonly EmailCta[];
  readonly kitLinks: readonly EmailLink[];
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

const SUBJECT = "Your Delivery Predictability results";
const GREETING = "Hi there,";
const REPLY_OFFER =
  "Just reply to this email and we'll point you to the right next step.";
const LOGO_URL =
  "https://raw.githubusercontent.com/LetPeopleWork/website/refs/heads/main/src/assets/logo.png";

const COMMUNITY_HREF = "https://letpeople.work/lighthouse";
const PREMIUM_HREF = "https://letpeople.work/lighthouse#lighthouse-premium";
const TRIAL_HREF = "https://letpeople.work/lighthouse#lighthouse-trial";

const PREMIUM_CTA: EmailCta = {
  label: "Explore Lighthouse Premium",
  href: PREMIUM_HREF,
};

// Mirrors trialCta in assessmentContent.ts (parity test enforces it).
const TRIAL_CTA: EmailCta = {
  label: "Try Self-Service free for 30 days",
  href: TRIAL_HREF,
};

// Same for every band: setup help is free for every edition.
const HELP_LINKS: readonly EmailLink[] = [
  {
    label:
      "Lighthouse setup & onboarding is free for every edition: write to contact@letpeople.work",
    href: "mailto:contact@letpeople.work?subject=Lighthouse%20onboarding",
  },
];

export const BAND_EMAIL_COPY: Readonly<Record<BandName, BandEmailCopy>> = {
  "Flying blind": {
    kitName: "Starter Kit",
    tagline: "Start measuring flow and run your first forecast.",
    measureRead:
      "You're not measuring flow yet, so you can't see how work moves. Add your team in Lighthouse and start watching your flow metrics. Within a day of connecting your data, you'll see things about your flow you've never seen before.",
    forecastRead:
      "Forecasting is gut feel today. Run a forecast for your next iteration and see how it performs. The goal right now is to experiment, not to overhaul how you work.",
    ctas: [
      { label: "Start with Lighthouse (free)", href: COMMUNITY_HREF },
    ],
    kitLinks: [
      {
        label: "Connect your work tracking system",
        href: "https://docs.lighthouse.letpeople.work/concepts/worktrackingsystems/worktrackingsystems.html",
      },
      {
        label: "Create a team and open the Metrics Dashboard",
        href: "https://docs.lighthouse.letpeople.work/metrics/dashboard.html",
      },
      {
        label: "How Lighthouse forecasts",
        href: "https://blog.letpeople.work/p/how-lighthouse-forecasts",
      },
      {
        label: "LetPeopleWork on YouTube",
        href: "https://www.youtube.com/@LetPeopleWork",
      },
    ],
  },
  Drifting: {
    kitName: "Steering Kit",
    tagline: "Swap guesses for real data and start steering.",
    measureRead:
      "You're tracking output like Velocity or Story Points, not the flow metrics that show how predictably work moves. Start watching Throughput and Cycle Time, and set improvement goals like a Service Level Expectation (SLE) or WIP limits.",
    forecastRead:
      "You forecast by adding up estimates, betting on what you thought would happen rather than what actually does, and a single date leaves no room to manage risk. Compare your estimates against what really happened (Cycle Time), and backtest a Monte Carlo forecast to see how it would have performed.",
    ctas: [
      { label: "Start with Lighthouse (free)", href: COMMUNITY_HREF },
    ],
    kitLinks: [
      {
        label: "The hidden cost of noise in your predictions",
        href: "https://blog.letpeople.work/p/the-hidden-cost-of-noise-in-your",
      },
      {
        label: "Dear stakeholder: a range instead of a date",
        href: "https://blog.letpeople.work/p/dear-stakeholder-heres-why-im-giving",
      },
      {
        label: "How Lighthouse forecasts: run one, then backtest",
        href: "https://docs.lighthouse.letpeople.work/concepts/howlighthouseforecasts.html",
      },
      {
        label: "Metrics and widgets (Cycle Time, Throughput)",
        href: "https://docs.lighthouse.letpeople.work/metrics/widgets.html",
      },
    ],
  },
  "Flow-aware": {
    kitName: "Level-Up Kit",
    tagline: "Start acting to get more predictable.",
    measureRead:
      "You're already watching flow metrics. Now sharpen predictability: act on leading indicators like Work Item Age, use your Service Level Expectation to drive improvements, and analyse how stable your delivery is with Process Behaviour Charts.",
    forecastRead:
      "Your forecasting works at team level. Now extend it to the portfolio, and keep checking the trend of your deliveries over time rather than a single date.",
    ctas: [
      {
        label: "Use Lighthouse to operationalize forecasting (free)",
        href: COMMUNITY_HREF,
      },
      PREMIUM_CTA,
      TRIAL_CTA,
    ],
    kitLinks: [
      {
        label: "A diner breakfast on Flow, Kanban and SLEs",
        href: "https://blog.letpeople.work/p/what-breakfast-at-a-diner-taught",
      },
      {
        label: "How Lighthouse changed the way I work",
        href: "https://blog.letpeople.work/p/how-lighthouse-changed-the-way-i",
      },
      {
        label: "Portfolios: forecast across teams",
        href: "https://docs.lighthouse.letpeople.work/portfolios/portfolios.html",
      },
    ],
  },
  Predictable: {
    kitName: "Mastery Kit",
    tagline: "Fine-tune the details and scale across your portfolio.",
    measureRead:
      "Flow metrics are second nature. Now fine-tune: study your workflow to find bottlenecks, set more ambitious Service Level Expectations and bring your percentiles closer together, and use Process Behaviour Charts to keep improving.",
    forecastRead:
      "You forecast probabilistically and steer by it. Sharpen it further by right-sizing your features and accounting for feature WIP, then scale forecasting across teams and your portfolio.",
    ctas: [
      PREMIUM_CTA,
      {
        label: "Use Lighthouse to scale your forecasting (free)",
        href: COMMUNITY_HREF,
      },
      TRIAL_CTA,
    ],
    kitLinks: [
      {
        label: "Low WIP, small features, high freedom",
        href: "https://blog.letpeople.work/p/low-wip-small-features-high-freedom",
      },
      {
        label: "Lighthouse advanced features",
        href: "https://blog.letpeople.work/p/lighthouse-advanced-features",
      },
      {
        label: "Scale and edit your portfolios",
        href: "https://docs.lighthouse.letpeople.work/portfolios/edit.html",
      },
      {
        label: "AI and automation",
        href: "https://docs.lighthouse.letpeople.work/aiintegration.html",
      },
    ],
  },
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const linkHtml = (link: EmailLink): string =>
  `<li style="margin-bottom: 8px;"><a href="${link.href}" style="color: #007bff;">${escapeHtml(link.label)}</a></li>`;

const linkText = (link: EmailLink): string => `- ${link.label}: ${link.href}`;

const sectionHtml = (heading: string, links: readonly EmailLink[]): string =>
  `<h3 style="color: #495057;">${escapeHtml(heading)}</h3>
      <ul>
        ${links.map(linkHtml).join("\n        ")}
      </ul>`;

const sectionText = (heading: string, links: readonly EmailLink[]): string =>
  `${heading}
${links.map(linkText).join("\n")}`;

const renderHtml = (
  band: BandName,
  score: number,
  copy: BandEmailCopy,
): string => `<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50;">Your Delivery Predictability results</h2>

      <p>${GREETING}</p>

      <p>Here's where you stand on flow and forecasting. Keep this for yourself, or forward it to your team.</p>

      <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #495057;">Your result: ${score} / 100 &middot; ${escapeHtml(band)}</h3>
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

      ${sectionHtml(`Your ${copy.kitName}`, copy.kitLinks)}

      ${sectionHtml("Need a hand getting started?", HELP_LINKS)}

      <h3 style="color: #495057;">Your next step</h3>
      <ul>
        ${copy.ctas.map(linkHtml).join("\n        ")}
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
                <div style="color: #34495e; font-size: 13px;">${REPLY_TO_ADDRESS}</div>
                <div style="color: #34495e; font-size: 13px;">https://letpeople.work</div>
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
): string => `Your Delivery Predictability results

${GREETING}

Here's where you stand on flow and forecasting. Keep this for yourself, or forward it to your team.

Your result: ${score} / 100 · ${band}
${copy.tagline}

How you measure flow:
${copy.measureRead}

How you forecast:
${copy.forecastRead}

${sectionText(`Your ${copy.kitName}:`, copy.kitLinks)}

${sectionText("Need a hand getting started?", HELP_LINKS)}

Your next step:
${copy.ctas.map(linkText).join("\n")}

${REPLY_OFFER}

--
LetPeopleWork
${REPLY_TO_ADDRESS}
https://letpeople.work`;

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
