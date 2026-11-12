import { useState, type ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, CalendarCheck, KeyRound, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import SEO from "@/components/SEO";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { BUDGET_LAST_DAY_LABEL, BUDGET_URL, budgetPhase } from "@/features/budget/season";
import { prices } from "@/lib/pricing";
import { trackEvent } from "@/lib/plausible";

// The year-end budget page (November and December 2026). Two readers: the
// person who wants Lighthouse, and the person who holds the budget and gets
// this page forwarded. So it is short, and the second half answers what a
// budget holder asks.
//
// Rules, keep them when editing:
// - No discount, no deadline of ours. The price is the same in January and
//   the page says so. The only deadline is the visitor's own budget.
// - The license runs 365 days from the purchase date (license terms on
//   /lighthouse). Never promise a start in January here.
// - Nothing about what an escape room costs: we don't know.
// - The page redirects to /lighthouse after the season (features/budget).
//   It is unlisted: noIndex here and in scripts/prerender-meta.mjs.

const BUY_URL = "/lighthouse#lighthouse-license";
const DEMO_URL = "/lighthouse#first-forecast";
const COMMUNITY_URL = "/lighthouse#downloads";
const LICENSING_MAIL = "licensing@letpeople.work";

const FORWARD_SUBJECT = `Budget left this year? A year of Lighthouse for ${prices.selfService}`;
const FORWARD_BODY = [
  "Hi,",
  "",
  `we still have budget left this year. Lighthouse costs ${prices.selfService} for 365 days, and one license covers all our teams.`,
  "It forecasts delivery dates from the work we have already finished in our tracker, and it runs on our own systems.",
  "",
  `The short version: ${BUDGET_URL}`,
  "",
  "Can we talk about it this week?",
].join("\n");
const FORWARD_URL = `mailto:?subject=${encodeURIComponent(FORWARD_SUBJECT)}&body=${encodeURIComponent(FORWARD_BODY)}`;

const ROWS = [
  { label: "Who gets it", room: "One team", lighthouse: "As many teams as you have" },
  { label: "How long it lasts", room: "About an hour", lighthouse: "365 days from the day you buy" },
  {
    label: "What you keep",
    room: "A group photo",
    lighthouse: "Delivery dates with a percentage next to them",
  },
];

const ANSWERS: { question: string; answer: ReactNode }[] = [
  {
    question: "What is it?",
    answer:
      "Lighthouse looks at what your teams have finished in Jira, Azure DevOps, Linear or ServiceNow and shows how likely each delivery date is. Nobody has to estimate in story points for it.",
  },
  {
    question: "What does it cost?",
    answer: `${prices.selfService} for 365 days. One license covers as many teams, portfolios and deliveries as your organization has.`,
  },
  {
    question: "Where does it run?",
    answer:
      "On your own systems, as a desktop app, a Docker container or on Kubernetes. Your work items stay on your systems.",
  },
  {
    question: "How do we buy it?",
    answer: (
      <>
        By card through Stripe, on this site. If you need an invoice or a PO number before the year
        ends, write to{" "}
        <a
          href={`mailto:${LICENSING_MAIL}?subject=${encodeURIComponent("Lighthouse Self-Service before year-end")}`}
          className="font-medium text-primary underline underline-offset-4"
        >
          {LICENSING_MAIL}
        </a>
        .
      </>
    ),
  },
];

const pill =
  "group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold no-underline transition-all duration-300 ease-out-expo";
const pillFirst = `${pill} bg-white text-primary shadow-medium hover:-translate-y-0.5 hover:shadow-glow`;
const pillSecond = `${pill} border border-white/30 text-primary-foreground hover:bg-white/10`;

const Budget = () => {
  const [phase] = useState(() => budgetPhase());
  const [trialOpen, setTrialOpen] = useState(false);

  if (phase === "over") return <Navigate to="/lighthouse" replace />;

  const buyFirst = phase === "buy";

  const trial = (
    <button
      type="button"
      key="trial"
      onClick={() => {
        trackEvent("Budget campaign", { action: "trial-open" });
        setTrialOpen(true);
      }}
      className={buyFirst ? pillSecond : pillFirst}
    >
      Try it free for 30 days
    </button>
  );
  const buy = (
    <Link
      key="buy"
      to={BUY_URL}
      onClick={() => trackEvent("Budget campaign", { action: "buy-click" })}
      className={buyFirst ? pillFirst : pillSecond}
    >
      Buy Self-Service
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-background antialiased">
      <SEO
        title={`Budget left this year? A year of Lighthouse for ${prices.selfService}`}
        description={`Year-end budget left and nobody wants another escape room? ${prices.selfService} gets all your teams a year of Lighthouse, the self-hosted flow metrics and forecasting tool. The price is the same in January.`}
        canonicalUrl={BUDGET_URL}
        noIndex
      />
      <Navigation />

      <main>
        {/* ── The joke and the offer ── */}
        <section className="relative isolate overflow-hidden bg-gradient-hero pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="absolute inset-0 hero-mesh" aria-hidden="true" />
          <div className="absolute inset-0 bg-grid-faint" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
              Budget season
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-balance text-primary-foreground sm:text-5xl md:text-6xl">
              Budget left, and nobody wants another escape room?
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-pretty text-primary-foreground/85 md:text-2xl/8">
              {prices.selfService} gets all your teams a year of Lighthouse. The price is the same in
              January, but the budget often isn&apos;t.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {buyFirst ? [buy, trial] : [trial, buy]}
            </div>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-primary-foreground/70" data-testid="budget-hint">
              {buyFirst ? (
                <>
                  The budget closes soon. A Scrum Master got from the download to his first forecast
                  in under ten minutes, on camera.{" "}
                  <Link to={DEMO_URL} className="text-primary-foreground underline underline-offset-4">
                    Watch him do it
                  </Link>
                  .
                </>
              ) : (
                <>
                  Try it on your own data first. The trial runs for 30 days, we don&apos;t ask for a
                  card, and there is still time before the budget closes.
                </>
              )}
            </p>
          </div>
        </section>

        {/* ── Escape room against Lighthouse ── */}
        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Two ways to spend what&apos;s left
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7" data-testid="budget-room">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">An escape room</h3>
                </div>
                <dl className="space-y-4">
                  {ROWS.map((row) => (
                    <div key={row.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-lg text-foreground/80">{row.room}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div
                className="rounded-2xl border-2 border-primary/40 bg-accent/40 p-7 shadow-soft"
                data-testid="budget-lighthouse"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Lighthouse Self-Service
                  </h3>
                </div>
                <dl className="space-y-4">
                  {ROWS.map((row) => (
                    <div key={row.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-foreground">{row.lighthouse}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
              To be fair, the escape room is more fun. And if three teams and one portfolio are
              enough for you, the{" "}
              <Link to={COMMUNITY_URL} className="font-medium text-primary underline underline-offset-4">
                Community edition
              </Link>{" "}
              is free, so you can have both.
            </p>
          </div>
        </section>

        {/* ── For the person who holds the budget ── */}
        <section className="border-y border-border/60 bg-gradient-subtle py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
                For whoever signs it off
              </h2>
              <p className="text-lg text-muted-foreground">
                Four answers, so you don&apos;t have to read the whole product page.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {ANSWERS.map((item) => (
                <div key={item.question} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                    {item.question}
                  </h3>
                  <p className="text-base leading-relaxed text-foreground/75">{item.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={FORWARD_URL}
                data-skip-autotrack
                onClick={() => trackEvent("Budget campaign", { action: "forward" })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-background px-7 py-3.5 text-base font-semibold text-primary no-underline transition-colors hover:bg-accent"
              >
                <Mail className="h-4 w-4" />
                Send this page to whoever holds the budget
              </a>
              <p className="mt-3 text-sm text-muted-foreground">
                Opens an email draft in your own mail program. You choose who gets it.
              </p>
            </div>
            <p className="mt-12 text-center text-sm text-muted-foreground">
              This page comes down after {BUDGET_LAST_DAY_LABEL}. Lighthouse will cost the same after
              that.
            </p>
          </div>
        </section>
      </main>

      <SimpleFooter />

      <TrialRequestDialog open={trialOpen} onOpenChange={setTrialOpen} source="budget-page" />
    </div>
  );
};

export default Budget;
