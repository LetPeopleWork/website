export interface SurveyNotificationEmail {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export interface RenderSurveyNotificationEmailOptions {
  readonly answers: Record<string, string>;
  readonly trialEmail?: string | null;
}

export const TEAM_NOTIFICATION_RECIPIENT = "survey.answer@letpeople.work";

const SUBJECT = "New Lighthouse survey response";
const NO_TRIAL_LINE = "No trial requested.";

const trialLine = (trialEmail: string | null | undefined): string =>
  trialEmail ? `Trial requested — ${trialEmail}` : NO_TRIAL_LINE;

export const QUESTION_LABELS: Readonly<Record<string, string>> = {
  "team-count": "How many teams are using Lighthouse in your organisation?",
  role: "What's your role?",
  "discovery-channel": "How did you hear about Lighthouse?",
  "assessment-interest": "Would you be interested in a service like this?",
};

export const ANSWER_LABELS: Readonly<Record<string, string>> = {
  "just-mine": "Just mine (1)",
  "two-to-five": "2–5",
  "six-to-ten": "6–10",
  "more-than-ten": "More than 10",
  "scrum-master-agile-coach": "Scrum Master / Agile Coach",
  "engineering-manager-delivery-lead": "Engineering Manager / Delivery Lead",
  "product-manager-owner": "Product Manager / Product Owner",
  "engineering-developer": "Engineering / Developer",
  "leadership-director": "Leadership / Director+",
  other: "Other",
  linkedin: "LinkedIn",
  "conference-meetup": "Conference / Meetup",
  "colleague-word-of-mouth": "Colleague / Word of mouth",
  "google-search": "Google / Search",
  github: "GitHub",
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const labelForQuestion = (questionId: string): string =>
  QUESTION_LABELS[questionId] ?? questionId;

const labelForAnswer = (optionId: string): string =>
  ANSWER_LABELS[optionId] ?? optionId;

interface SummaryRow {
  readonly question: string;
  readonly answer: string;
}

const summaryRows = (answers: Record<string, string>): readonly SummaryRow[] =>
  Object.entries(answers).map(([questionId, optionId]) => ({
    question: labelForQuestion(questionId),
    answer: labelForAnswer(optionId),
  }));

const rowText = (row: SummaryRow): string => `- ${row.question}: ${row.answer}`;

const rowHtml = (row: SummaryRow): string =>
  `<li><strong>${escapeHtml(row.question)}</strong>: ${escapeHtml(row.answer)}</li>`;

const renderText = (rows: readonly SummaryRow[], trial: string): string => `${SUBJECT}

A visitor submitted the Lighthouse user survey.

${rows.map(rowText).join("\n")}

${trial}`;

const renderHtml = (rows: readonly SummaryRow[], trial: string): string => `<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>${SUBJECT}</h2>
    <p>A visitor submitted the Lighthouse user survey.</p>
    <ul>
      ${rows.map(rowHtml).join("\n      ")}
    </ul>
    <p>${escapeHtml(trial)}</p>
  </body>
</html>`;

export const renderSurveyNotificationEmail = (
  options: RenderSurveyNotificationEmailOptions,
): SurveyNotificationEmail => {
  const rows = summaryRows(options.answers);
  const trial = trialLine(options.trialEmail);
  return {
    subject: SUBJECT,
    html: renderHtml(rows, trial),
    text: renderText(rows, trial),
  };
};

export const notifyTeamDegradeOpen = async (
  send: () => void | Promise<void>,
): Promise<void> => {
  try {
    await send();
  } catch (error) {
    console.error("Survey team notification send failed (response still recorded):", error);
  }
};
