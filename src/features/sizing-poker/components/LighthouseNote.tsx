import { trackEvent } from "@/lib/plausible";
import { sizingPokerContent } from "../content/sizingPokerContent";

const c = sizingPokerContent.intro.lighthouseNote;

// Under the intro, set apart and small: the round comes first, and the intro
// itself stays under 50 words (the first reviewer skipped a longer one).
// It says that the same question now lives in Lighthouse, on the team's real
// work items (weekly, 16 Oct 2026). A plain link, not a router link, so the
// scroll to the Refinement tab runs when the Lighthouse page loads.
const LighthouseNote = () => (
  <p
    className="mt-8 max-w-[58ch] border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground"
    data-testid="sizing-lighthouse-note"
  >
    {c.text}{" "}
    <a
      href={c.href}
      onClick={() => trackEvent("Refinement link clicked", { source: "sizing-intro" })}
      className="font-medium text-primary underline underline-offset-4"
    >
      {c.linkLabel}
    </a>
  </p>
);

export default LighthouseNote;
