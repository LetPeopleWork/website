import { Building2, Database, Globe, Laptop, ShieldCheck } from "lucide-react";

type Tone = "inside" | "outside" | "us";

const Node = ({
  icon: Icon,
  title,
  detail,
  tone = "inside",
}: {
  icon: typeof Laptop;
  title: string;
  detail: string;
  tone?: Tone;
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

/** A labelled connector: vertical when stacked, horizontal between columns on wide screens. */
const Connector = ({ label, wide = false }: { label: string; wide?: boolean }) => (
  <div
    className={`flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground ${
      wide ? "py-1.5 md:py-0 md:flex-col md:px-1" : "py-1.5"
    }`}
    aria-hidden="true"
  >
    <span className={`bg-primary/40 ${wide ? "h-4 w-px md:h-px md:w-6" : "h-4 w-px"}`} />
    <span className={wide ? "md:max-w-[6rem] md:text-center" : ""}>{label}</span>
    <span className={`bg-primary/40 ${wide ? "h-4 w-px md:h-px md:w-6" : "h-4 w-px"}`} />
  </div>
);

// What sits inside the customer's network and what sits outside. Used in the
// "Where it runs" section (stacked) and in the homepage hero for the hosting
// chip (wide). Every statement here is checked against the Lighthouse docs and
// the privacy policy; keep it that way when editing.
const WhereItRunsDiagram = ({ layout = "stacked" }: { layout?: "stacked" | "wide" }) => {
  const wide = layout === "wide";
  return (
    <figure aria-label="Where Lighthouse runs" data-testid="where-it-runs-diagram">
      <div className="rounded-2xl border-2 border-dashed border-primary/40 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-4 text-left">Your network</div>
        <div className={wide ? "md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch" : ""}>
          <Node icon={Globe} title="Your browser" detail="Opens Lighthouse like any internal web app" />
          <Connector label="Your login" wide={wide} />
          <Node
            icon={Laptop}
            title="Lighthouse"
            detail="Desktop app, Docker container, or Kubernetes with our Helm chart. Its database stays with it."
          />
          <Connector label="Reads work items" wide={wide} />
          <Node
            icon={Database}
            title="Your tracker, on your servers"
            detail="Jira Data Center, Azure DevOps Server or another tracker inside your network, connected with a personal access token"
          />
        </div>
      </div>
      <div className={wide ? "mt-4 grid gap-3 md:grid-cols-2" : ""}>
        {!wide && <Connector label="For hosted trackers, Lighthouse calls their API" />}
        <Node
          icon={Building2}
          title="Jira Cloud, Azure DevOps Services, Linear, ServiceNow"
          detail="Hosted trackers are reached through their API"
          tone="outside"
        />
        <div className={wide ? "" : "mt-4"}>
          <Node
            icon={ShieldCheck}
            title="LetPeopleWork"
            detail="Gets nothing from your Lighthouse. Usage data is off unless someone turns it on, and it never holds work items, names or queries."
            tone="us"
          />
        </div>
      </div>
      <figcaption className="sr-only">
        Your browser, Lighthouse and a tracker on your own servers, such as Jira Data Center or Azure DevOps Server, all sit inside your network. Lighthouse calls hosted trackers through their API. LetPeopleWork receives nothing unless usage data is turned on.
      </figcaption>
    </figure>
  );
};

export default WhereItRunsDiagram;
