import { ArrowUpRight, Globe, Laptop, Building2, ShieldCheck, Database, Github } from "lucide-react";

// Answers the two questions an evaluator raises before anything else: "can it
// reach our private Jira?" and "won't our tracker just build this?". Until
// October 2026 neither was answered anywhere on the site.
//
// Every claim here is checked against the Lighthouse docs and the privacy
// policy: Jira Server/Data Center connect with a personal access token, OAuth
// is a paid-edition option for Jira Cloud and Azure DevOps, and usage data is
// opt-in and carries no content. Keep it that way when editing.

const Node = ({
  icon: Icon,
  title,
  detail,
  tone = "inside",
}: {
  icon: typeof Laptop;
  title: string;
  detail: string;
  tone?: "inside" | "outside" | "us";
}) => (
  <div
    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left ${
      tone === "inside"
        ? "border-primary/30 bg-background"
        : tone === "outside"
          ? "border-border bg-background"
          : "border-dashed border-border bg-muted/40"
    }`}
  >
    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone === "us" ? "text-muted-foreground" : "text-primary"}`} />
    <div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{detail}</div>
    </div>
  </div>
);

const Link = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-muted-foreground" aria-hidden="true">
    <span className="h-4 w-px bg-primary/40" />
    {label}
    <span className="h-4 w-px bg-primary/40" />
  </div>
);

const WhereItRuns = ({ onOpenPrivacy }: { onOpenPrivacy: () => void }) => (
  <section id="where-it-runs" className="py-20 md:py-24 bg-gradient-subtle border-y border-border scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
          Where it runs
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
          Runs where your data lives
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          You install Lighthouse yourself, on a laptop or on your servers. It talks to your tracker directly, so a Jira behind your firewall works the same as Jira Cloud.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start mb-16">
        {/* The diagram: what sits inside your network, what sits outside. */}
        <figure className="lg:col-span-3" aria-labelledby="where-it-runs-caption">
          <div className="rounded-2xl border-2 border-dashed border-primary/40 p-5 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-4">Your network</div>
            <Node icon={Globe} title="Your browser" detail="Opens Lighthouse like any internal web app" />
            <Link label="Lighthouse UI, your login" />
            <Node
              icon={Laptop}
              title="Lighthouse"
              detail="Desktop app on Windows, macOS or Linux, a Docker container, or Kubernetes with the Helm chart. Its database stays with it."
            />
            <Link label="Reads your work items" />
            <Node
              icon={Database}
              title="Jira Server or Data Center"
              detail="Or any other tracker inside your network. Connected with a personal access token."
            />
          </div>
          <Link label="For cloud trackers, Lighthouse calls their API" />
          <Node
            icon={Building2}
            title="Jira Cloud, Azure DevOps, Linear, ServiceNow"
            detail="The hosted trackers you already use"
            tone="outside"
          />
          <div className="mt-4">
            <Node
              icon={ShieldCheck}
              title="LetPeopleWork"
              detail="Receives nothing from your Lighthouse, unless someone switches on usage data. That never contains work items, names or queries."
              tone="us"
            />
          </div>
          <figcaption id="where-it-runs-caption" className="sr-only">
            Diagram: your browser, Lighthouse and an on-premise Jira all sit inside your network. Lighthouse calls hosted trackers through their API. LetPeopleWork receives nothing unless usage data is switched on.
          </figcaption>
        </figure>

        <dl className="lg:col-span-2 space-y-7">
          <div>
            <dt className="text-lg font-bold text-foreground mb-1.5">Private Jira works</dt>
            <dd className="text-muted-foreground leading-relaxed">
              Jira Server and Data Center connect with a personal access token. Jira Cloud and Azure DevOps can also use OAuth on paid editions.
            </dd>
          </div>
          <div>
            <dt className="text-lg font-bold text-foreground mb-1.5">Your work items stay with you</dt>
            <dd className="text-muted-foreground leading-relaxed">
              Lighthouse keeps its data in its own database on your infrastructure. Usage data is off by default, and if switched on it carries no content.{" "}
              <button type="button" onClick={onOpenPrivacy} className="text-primary underline-offset-4 hover:underline">
                What it contains
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-lg font-bold text-foreground mb-1.5">Your security team can read the code</dt>
            <dd className="text-muted-foreground leading-relaxed">
              The source is public on GitHub. Paid editions add sign-in through your identity provider and role-based access.{" "}
              <a
                href="https://github.com/LetPeopleWork/Lighthouse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                <Github className="h-3.5 w-3.5" />
                Source on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div id="across-tools" className="grid md:grid-cols-2 gap-6 scroll-mt-24">
        <div className="rounded-2xl border border-border bg-background p-7">
          <h3 className="text-xl font-bold text-foreground mb-2">Several trackers, one Lighthouse</h3>
          <p className="text-muted-foreground leading-relaxed">
            One installation connects to Jira, Azure DevOps, Linear and ServiceNow at the same time, so teams do not have to move to one tool first. A feature worked by several teams gets one forecast that combines all of them.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-7">
          <h3 className="text-xl font-bold text-foreground mb-2">Why not wait for your tracker to add this?</h3>
          <p className="text-muted-foreground leading-relaxed">
            It may add more charts, and for one team in one tool those can be enough. Lighthouse does flow and forecasting only, works the same across trackers, and checks its own past forecasts. The source is public, so you are not locked in to us or to your tracker.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhereItRuns;
