import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/plausible";
import { createEdgeFunctionTrialRequest } from "../adapters/edgeFunctionTrialRequest";
import type { TrialRequestSubmission } from "../ports";

interface TrialRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where on the page the dialog was opened from. Analytics only. */
  source: string;
  /** Injectable for tests; defaults to the real edge function. */
  submission?: TrialRequestSubmission;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Phase = "form" | "sending" | "done";

const TrialRequestDialog = ({
  open,
  onOpenChange,
  source,
  submission,
}: TrialRequestDialogProps) => {
  const submit = useMemo(
    () => submission ?? createEdgeFunctionTrialRequest(),
    [submission],
  );

  const [phase, setPhase] = useState<Phase>("form");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Leave the fields as they were: reopening after an accidental close
      // should not punish anyone. Only a completed request resets.
      if (phase === "done") {
        setPhase("form");
        setEmail("");
        setOrganization("");
      }
      setError(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email so we know where to send the license.");
      return;
    }
    if (organization.trim().length === 0) {
      setError("Tell us which organization the license is for.");
      return;
    }
    setError(null);
    setPhase("sending");
    try {
      await submit.submit({
        email: email.trim(),
        organization: organization.trim(),
      });
      // Counts and origin only - the email address never goes to analytics.
      trackEvent("Trial requested", { source });
      setPhase("done");
    } catch {
      setPhase("form");
      setError(
        "That didn't go through. Try again, or just email licensing@letpeople.work and we'll sort it out.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="trial-dialog">
        {phase === "done" ? (
          <div data-testid="trial-done">
            <DialogHeader>
              <DialogTitle>Your license is on its way</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-relaxed">
                A human sends these, not a robot, so give it up to a day. The
                license runs for 30 days and simply expires - nothing to
                cancel, nothing to uninstall.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Button onClick={() => handleOpenChange(false)}>Close</Button>
            </div>
          </div>
        ) : (
          // noValidate: the custom error names the license, not "the field";
          // the browser bubble would preempt it.
          <form onSubmit={handleSubmit} noValidate data-testid="trial-form">
            <DialogHeader>
              <DialogTitle>Try Premium free for 30 days</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-relaxed">
                No signup, no credit card, nothing to cancel. Tell us where to
                send it and we&apos;ll email you a 30-day license so you can
                experiment with the full product. It expires on its own.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trial-email">Where should we send the license?</Label>
                <Input
                  id="trial-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trial-organization">Which organization is it for?</Label>
                <Input
                  id="trial-organization"
                  type="text"
                  autoComplete="organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={phase === "sending"}>
                  {phase === "sending" ? "Sending..." : "Send me the license"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  We use your email to send the license, nothing else.
                </p>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrialRequestDialog;
