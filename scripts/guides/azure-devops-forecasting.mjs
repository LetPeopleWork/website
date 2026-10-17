// /azure-devops-forecasting/
//
// Product facts come from the Lighthouse docs
// (docs.lighthouse.letpeople.work: concepts/worktrackingsystems/azuredevops,
// teams/edit, portfolios/edit, settings/worktrackingsystems, licensing).
// Azure DevOps facts come from Microsoft Learn (boards/sprints/forecast,
// report/dashboards/team-velocity). The Marketplace extensions named below
// were checked on the Visual Studio Marketplace in October 2026. Facts that
// are not documented (which Azure DevOps Server versions, which PAT scopes)
// are left out on purpose.

const BLOG = "https://blog.letpeople.work/p";
const DOCS = "https://docs.lighthouse.letpeople.work";

export const azureDevOpsForecasting = () => ({
  path: "azure-devops-forecasting",
  navLabel: "Azure DevOps delivery forecasting",
  eyebrow: "Azure DevOps",
  title: "Azure DevOps delivery forecasting with Monte Carlo | LetPeopleWork",
  description:
    "Forecast Azure DevOps delivery from the work items your teams have closed, with odds instead of story points, and see how Lighthouse connects to your organisation.",
  h1: "Delivery forecasting for Azure DevOps",
  lede: "Your backlog lives in Azure DevOps and someone wants a date. This page shows how to forecast from the work items your teams have already closed, with the odds attached, and how Lighthouse connects to Azure DevOps Services or an Azure DevOps Server inside your network.",
  published: "2026-10-17",
  updated: "2026-10-17",
  body: `
<h2>What Azure DevOps offers on its own</h2>
<p>The Forecast option on a backlog draws lines for the coming sprints from a velocity you type in. It sums Effort or Story Points, so it depends on how well the team estimates, and Microsoft's own documentation says it doesn't account for dependencies or blockers (<a href="https://learn.microsoft.com/en-us/azure/devops/boards/sprints/forecast?view=azure-devops" rel="nofollow">Forecast your product backlog</a>). The Velocity widget can count work items instead of points, and Analytics adds a cumulative flow diagram and cycle time charts with averages.</p>
<p>What you won't find in Microsoft's documentation is a forecast that gives you a date with its odds. For that you need a Monte Carlo simulation over your throughput.</p>

<h2>Forecasting from closed work items</h2>
<p>Throughput is the number of work items a team closes per day. Azure DevOps already knows it, because every item records when it reached its done state. A Monte Carlo simulation builds thousands of possible futures from those past days and counts how many of them make it. You get answers like "85% likely by this date" for a set of items, or "85% likely to finish at least this many" by a date. No estimates are involved.</p>
<p>Benji wrote about running these simulations against Azure DevOps with a nightly script back in 2023 (<a href="${BLOG}/running-monte-carlo-simulations-in-azure-devops-728746ef15be">Running Monte Carlo simulations in Azure DevOps</a>). The method in detail, with which date to promise and where it falls short, is in our guide to <a href="https://letpeople.work/jira-forecasting-without-story-points/">forecasting without story points</a>. It applies to Azure DevOps just the same.</p>

<h2>How Lighthouse connects to Azure DevOps</h2>
<ul>
<li><strong>Connection.</strong> You give Lighthouse your organisation URL and a personal access token. Paid editions can sign in with OAuth through a Microsoft Entra ID app registration instead, for Azure DevOps Services.</li>
<li><strong>Azure DevOps Server.</strong> Lighthouse runs on your own systems, so it can sit in the same network as an Azure DevOps Server and connect with a personal access token. Nothing has to be opened up to the internet.</li>
<li><strong>Teams.</strong> A team is a WIQL query, usually by area path, for example <code>[System.TeamProject] = "Shop" AND [System.AreaPath] = "Shop\\Checkout"</code>. You choose which work item types count, such as User Story, Product Backlog Item and Bug, and map your states to to do, doing and done. A board wizard can read the query, types and states from an existing board for you.</li>
<li><strong>Blocked work.</strong> Rules on any field, a tag for example, mark items as blocked. They feed the blocked and stale item views.</li>
</ul>
<p>The work items Lighthouse reads are stored in its own database on your systems. The <a href="${DOCS}/concepts/worktrackingsystems/azuredevops.html">Azure DevOps setup guide</a> in the documentation has the details.</p>

<h2>Features and epics across teams</h2>
<p>A portfolio is a second WIQL query for your features or epics. Lighthouse follows the parent links from team items to their feature and forecasts every feature in backlog order, continuously. When several teams work on one feature, it simulates each team and combines the results into one probability, which is never higher than the least likely team's, because all of them have to make it.</p>
<p>Features without child items yet get a size from a field you choose, or from your history, for example as many items as 85% of your past features needed. Lighthouse flags those features, so nobody mistakes an assumed size for a real one. Predecessor links show up as dependencies.</p>

<h2>Forecasts back in Azure DevOps</h2>
<p>On paid editions, Lighthouse can write forecasts into a field on the work item, for example the 85% completion date, or the item's age. People then see the forecast where they already look, without opening another tool, and Azure DevOps doesn't send notifications for those updates.</p>

<h2>Other options for Azure DevOps</h2>
<p>Lighthouse isn't the only way to get Monte Carlo forecasts into Azure DevOps. On the Visual Studio Marketplace you'll also find ActionableAgile Analytics for Azure DevOps Services, Agile Analytics by Baytek, Honest Cheetah by Benjamin Day Consulting, and FlowViz by Nicolas Brown, a Power BI template for flow metrics. Lighthouse is a separate application that you run yourself. That lets it bring teams on Jira, Linear or ServiceNow into the same portfolio forecast as your Azure DevOps teams. For ActionableAgile and Nave there is a <a href="https://letpeople.work/compare/">side-by-side comparison</a>.</p>
`,
  faqs: [
    {
      question: "Can Azure DevOps forecast delivery without story points?",
      answer:
        "Not with its own Forecast tool, which works from a velocity in Effort or Story Points. You can forecast from throughput instead: count the work items each team closes per day and run a Monte Carlo simulation over that history. Lighthouse does this against Azure DevOps and gives you dates with their odds.",
    },
    {
      question: "Does Lighthouse work with Azure DevOps Server on-premises?",
      answer:
        "Yes. Lighthouse connects to Azure DevOps Server with a personal access token. Because you run Lighthouse yourself, it can sit in the same network as the server, so nothing has to be reachable from the internet.",
    },
    {
      question: "How do I tell Lighthouse which work items belong to a team?",
      answer:
        "With a WIQL query, usually by team project and area path, plus the work item types that count and how your states map to to do, doing and done. A board wizard can take all three from an existing board.",
    },
    {
      question: "Can Lighthouse write the forecast back to Azure DevOps?",
      answer:
        "Yes, on paid editions. Lighthouse can write values such as the 85% completion date into a field on the work item, so people see the forecast in Azure DevOps.",
    },
    {
      question: "What does it cost?",
      answer:
        "The Community edition is free for up to 3 teams and 1 portfolio, with Monte Carlo forecasts and flow metrics. A Premium license, sold as Self-Service or Enterprise, adds unlimited teams and portfolios, OAuth sign-in and writing forecasts back to Azure DevOps.",
    },
  ],
});
