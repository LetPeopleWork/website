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
import { BAND_NAMES, type DashboardSummary } from "../core/dashboardSummary";
import type { SurveySummary } from "@/features/survey/core/summarizeSurvey";

interface AdminDashboardProps {
  summary: DashboardSummary;
  surveySummary?: SurveySummary;
  onSignOut: () => void;
}

const SurveyView = ({ surveySummary }: { surveySummary: SurveySummary }) => (
  <Card data-testid="dashboard-survey">
    <CardHeader>
      <CardTitle className="text-xl">Survey responses</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {surveySummary.totalResponses} anonymous responses collected
      </p>
      {surveySummary.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <p className="font-semibold">{question.prompt}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Answer</TableHead>
                <TableHead>Responses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {question.options.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.label}</TableCell>
                  <TableCell>{option.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
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
  onSignOut,
}: AdminDashboardProps) => (
  <div className="mx-auto w-full max-w-4xl space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Assessment results</h1>
      <Button variant="outline" onClick={onSignOut}>
        Sign out
      </Button>
    </div>

    {surveySummary ? <SurveyView surveySummary={surveySummary} /> : null}

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
