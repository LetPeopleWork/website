import type {
  DashboardData,
  DashboardLead,
  ResponseSource,
} from "../ports";
import type { BandName } from "./scoring";

export const BAND_NAMES: readonly BandName[] = [
  "Flying blind",
  "Output-focused",
  "Flow-aware",
  "Probabilistic",
];

export type BandDistribution = Record<BandName, number>;

export interface LeadRow {
  readonly email: string;
  readonly score: number;
  readonly band: BandName;
  readonly createdAt: string;
}

export interface DashboardSummary {
  readonly totalResponses: number;
  readonly emailsCaptured: number;
  readonly bandDistribution: BandDistribution;
  readonly leads: readonly LeadRow[];
}

const emptyDistribution = (): BandDistribution =>
  BAND_NAMES.reduce(
    (distribution, band) => ({ ...distribution, [band]: 0 }),
    {} as BandDistribution,
  );

const toLeadRow = (lead: DashboardLead): LeadRow => ({
  email: lead.email,
  score: lead.score,
  band: lead.band,
  createdAt: lead.createdAt,
});

export const summarizeDashboard = (
  data: DashboardData,
  source: ResponseSource,
): DashboardSummary => {
  const responses = data.responses.filter(
    (response) => response.source === source,
  );
  const unscored = responses.find((response) => !BAND_NAMES.includes(response.band));
  if (unscored) {
    throw new Error(
      "summarizeDashboard cannot tally a band-less response; use summarizeSurvey",
    );
  }
  const leads = data.leads.filter((lead) => lead.source === source);

  const bandDistribution = responses.reduce(
    (distribution, response) => ({
      ...distribution,
      [response.band]: distribution[response.band] + 1,
    }),
    emptyDistribution(),
  );

  return {
    totalResponses: responses.length,
    emailsCaptured: leads.length,
    bandDistribution,
    leads: leads.map(toLeadRow),
  };
};
