import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BAND_NAMES, type DashboardSummary } from "../core/dashboardSummary";
import type {
  DashboardSurveyResponse,
  DashboardSurveyTrialRequest,
} from "../ports";
import {
  summarizeSurvey,
  type SurveySummary,
} from "@/features/survey/core/summarizeSurvey";
import { SurveyCharts } from "@/features/survey/components/SurveyCharts";
import {
  filterByDateRange,
  type DateRange,
} from "@/features/survey/core/filterByDateRange";

interface AdminDashboardProps {
  summary: DashboardSummary;
  surveySummary?: SurveySummary;
  surveyResponses?: readonly DashboardSurveyResponse[];
  surveyTrialRequests?: readonly DashboardSurveyTrialRequest[];
  now?: string;
  onSignOut: () => void;
}

const DEFAULT_RANGE: DateRange = "30d";

const RANGE_OPTIONS: readonly { value: DateRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All time" },
];

const SurveyRangeFilter = ({
  range,
  onChange,
}: {
  range: DateRange;
  onChange: (range: DateRange) => void;
}) => (
  <ToggleGroup
    type="single"
    value={range}
    data-testid="survey-range-filter"
    onValueChange={(next) => {
      if (next) {
        onChange(next as DateRange);
      }
    }}
  >
    {RANGE_OPTIONS.map((option) => (
      <ToggleGroupItem
        key={option.value}
        value={option.value}
        aria-label={option.label}
      >
        {option.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

const SurveyView = ({
  surveySummary,
  filter,
}: {
  surveySummary: SurveySummary;
  filter?: React.ReactNode;
}) => (
  <Card data-testid="dashboard-survey">
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <CardTitle className="text-xl">Survey responses</CardTitle>
      {filter}
    </CardHeader>
    <CardContent className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {surveySummary.totalResponses} anonymous responses collected
      </p>
      <SurveyCharts questions={surveySummary.questions} />
    </CardContent>
  </Card>
);

const SurveyTrialRequestsView = ({
  trialRequests,
}: {
  trialRequests: readonly DashboardSurveyTrialRequest[];
}) => (
  <Card data-testid="dashboard-survey-trials">
    <CardHeader>
      <CardTitle className="text-xl">Trial requests</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4 text-sm text-muted-foreground">
        Members who volunteered their email for a premium trial. Action each
        trial by hand.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trialRequests.map((request) => (
            <TableRow key={`${request.email}-${request.createdAt}`}>
              <TableCell>{request.email}</TableCell>
              <TableCell>{formatDate(request.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const AdminDashboard = ({
  summary,
  surveySummary,
  surveyResponses,
  surveyTrialRequests,
  now,
  onSignOut,
}: AdminDashboardProps) => {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const filtersEnabled = surveyResponses !== undefined;
  const referenceNow = useMemo(() => now ?? new Date().toISOString(), [now]);

  const scopedSummary = useMemo<SurveySummary | undefined>(() => {
    if (!surveyResponses) {
      return surveySummary;
    }
    const scoped = filterByDateRange(surveyResponses, range, referenceNow);
    return summarizeSurvey({
      responses: [],
      leads: [],
      surveyResponses: scoped,
    });
  }, [surveyResponses, surveySummary, range, referenceNow]);

  const scopedTrialRequests = useMemo<
    readonly DashboardSurveyTrialRequest[] | undefined
  >(() => {
    if (!surveyTrialRequests) {
      return surveyTrialRequests;
    }
    if (!filtersEnabled) {
      return surveyTrialRequests;
    }
    return filterByDateRange(surveyTrialRequests, range, referenceNow);
  }, [surveyTrialRequests, filtersEnabled, range, referenceNow]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <Button variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>

      {scopedSummary ? (
        <SurveyView
          surveySummary={scopedSummary}
          filter={
            filtersEnabled ? (
              <SurveyRangeFilter range={range} onChange={setRange} />
            ) : undefined
          }
        />
      ) : null}

      {scopedTrialRequests ? (
        <SurveyTrialRequestsView trialRequests={scopedTrialRequests} />
      ) : null}

    <div data-testid="dashboard-totals" className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Total responses
          </CardTitle>
        </CardHeader>
        <CardContent className="text-4xl font-bold">
          {summary.totalResponses}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Emails captured
          </CardTitle>
        </CardHeader>
        <CardContent className="text-4xl font-bold">
          {summary.emailsCaptured}
        </CardContent>
      </Card>
    </div>

    <Card data-testid="dashboard-bands">
      <CardHeader>
        <CardTitle className="text-xl">Band distribution</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-4">
        {BAND_NAMES.map((band) => (
          <div key={band} className="space-y-1">
            <p className="text-sm text-muted-foreground">{band}</p>
            <p className="text-2xl font-semibold">
              {summary.bandDistribution[band]}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>

    <Card data-testid="dashboard-leads">
      <CardHeader>
        <CardTitle className="text-xl">Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.leads.map((lead) => (
              <TableRow key={`${lead.email}-${lead.createdAt}`}>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.score}</TableCell>
                <TableCell>{lead.band}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
};
