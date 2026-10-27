import { ArrowUpRight } from "lucide-react";
import { Github } from "@/components/icons/BrandIcons";
import WhereItRunsDiagram from "./WhereItRunsDiagram";

// Answers the two questions an evaluator raises before anything else: "can it
// reach a Jira that only lives inside our network?" and "won't our tracker
// just build this?". Until
// October 2026 neither was answered anywhere on the site.
//
// Every claim here is checked against the Lighthouse docs and the privacy
// policy: Jira Server/Data Center connect with a personal access token, OAuth
// is a paid-edition option for Jira Cloud and Azure DevOps, and usage data is
// opt-in and carries no content. Keep it that way when editing.

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
          Install Lighthouse on your own machine, in your network, or with your favorite cloud provider. Then connect it to your work tracker, whether it's cloud-based or self-hosted.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start mb-16">
        {/* The diagram: what sits inside your network, what sits outside. */}
        <div className="lg:col-span-3">
          <WhereItRunsDiagram />
        </div>

        <dl className="lg:col-span-2 space-y-7">
          <div>
            <dt className="text-lg font-bold text-foreground mb-1.5">Your work items stay with you</dt>
            <dd className="text-muted-foreground leading-relaxed">
              Lighthouse keeps everything in its own database, on your systems. Usage data is off unless someone turns it on, and even then it holds no work items, names or queries.{" "}
              <button type="button" onClick={onOpenPrivacy} className="text-primary underline-offset-4 hover:underline">
                What it contains
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-lg font-bold text-foreground mb-1.5">Your security team can read the code</dt>
            <dd className="text-muted-foreground leading-relaxed">
              If IT wants to know what this new tool does, they can read every line on GitHub. Paid editions add sign-in through your identity provider and role-based access.{" "}
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
            One installation can talk to Jira, Azure DevOps, Linear and ServiceNow at the same time. Nobody has to migrate to one tool before you can start.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-7">
          <h3 className="text-xl font-bold text-foreground mb-2">Why not wait for your tracker to add this?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Maybe it will, and for one team in one tool its charts may be all you need. Lighthouse only does flow and forecasting, the same way across trackers, and it checks its own forecasts. Because the source is public, you're not locked in, to us or to your tracker.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhereItRuns;
