// /compare/: Lighthouse vs ActionableAgile vs Nave.
//
// Facts about the other tools come from their own public pages and the
// Atlassian and Visual Studio marketplaces, checked on the date in `checked`.
// Re-check them whenever this page is edited. A wrong claim about a
// competitor costs more trust than the page earns, so anything we could not
// confirm (for example ActionableAgile on Azure DevOps Server, or what either
// tool offers for AI assistants) is left out rather than guessed.
//
// Sources (October 2026):
// - https://www.55degrees.se/pricing, https://www.55degrees.se/products/actionableagileanalytics
// - https://marketplace.atlassian.com/apps/1216661 (Cloud, Server, Data Center)
// - https://marketplace.visualstudio.com/items?itemName=actionableagile.aa-analytics-paid ("for Azure DevOps Services")
// - https://www.55degrees.se/products/portfolioforecaster (Jira Cloud only)
// - https://getnave.com/pricing, https://getnave.com/dashboard-for-jira, https://getnave.com/dashboard-for-azure-devops

const checked = "October 2026";

export const compare = (prices) => ({
  path: "compare",
  navLabel: "Lighthouse vs ActionableAgile vs Nave",
  eyebrow: "Comparison",
  title: "Lighthouse vs ActionableAgile vs Nave: a self-hosted alternative",
  description:
    "Lighthouse, ActionableAgile and Nave side by side: where each one runs, where your data ends up, how they charge and which trackers they connect to.",
  h1: "Lighthouse vs ActionableAgile vs Nave",
  lede: "All three show cycle time, throughput, work in progress and work item age, and all three run Monte Carlo forecasts from your throughput instead of estimates. They differ in where they run, where your data ends up and how they charge.",
  published: "2026-07-16",
  updated: "2026-10-17",
  body: `
<p><strong>The short version:</strong> ActionableAgile and Nave are established commercial products. ActionableAgile charges per user and Nave per connected board. Lighthouse is the self-hosted, source-available alternative with a free edition and a flat yearly licence. If your tracker only lives inside your network, or you work with Azure DevOps Server, Linear or ServiceNow, that difference decides most of it.</p>
<p>We build Lighthouse, so read our framing with that in mind. The facts in the table come from the vendors' own pages, linked below it.</p>

<h2>Side by side</h2>
<div class="wrap">
<table>
<thead><tr><th>&nbsp;</th><th>Lighthouse</th><th>ActionableAgile</th><th>Nave</th></tr></thead>
<tbody>
<tr><th>Made by</th><td>LetPeopleWork GmbH, Switzerland</td><td>55 Degrees AB, Sweden</td><td>Nave</td></tr>
<tr><th>Where it runs</th><td>On your systems: desktop app for Windows, macOS and Linux, Docker, or Kubernetes with the official Helm chart</td><td>Standalone web app, apps for Jira Cloud and Jira Data Center, and an extension for Azure DevOps Services</td><td>Web app, with an app for Jira Cloud and Data Center</td></tr>
<tr><th>Where your data ends up</th><td>In Lighthouse's own database on your systems. Usage data to us is off unless someone turns it on, and never contains work items.</td><td>The Data Center app runs inside your own Jira. The other editions run in the vendor's or Atlassian's cloud; the vendor says it processes work data without exporting it.</td><td>Nave's cloud, hosted in the EU. A Jira Data Center has to be reachable from the internet, or you upload exports.</td></tr>
<tr><th>Trackers</th><td>Jira Cloud, Jira Server and Data Center, Azure DevOps Services and Server, Linear, ServiceNow, CSV</td><td>Jira Cloud, Jira Data Center, Azure DevOps Services, Trello, file upload</td><td>Jira, Azure DevOps (Server through exports), Trello, Asana, CSV and JSON</td></tr>
<tr><th>Forecasting</th><td>Monte Carlo "when" and "how many" per team, continuous forecasts for every feature in a portfolio, features shared by several teams, and a backtest of its own forecasts</td><td>Monte Carlo "when" and "how many". Multi-team views come with Portfolio Forecaster, a separate product for Jira Cloud.</td><td>Monte Carlo completion dates and "how many" at 50, 85 and 95%</td></tr>
<tr><th>Source code</th><td>Public on GitHub under a source-available licence</td><td>Not public</td><td>Not public</td></tr>
<tr><th>Free to use</th><td>Community edition, free for up to 3 teams and 1 portfolio with 1 delivery. Premium trial for 30 days, no sign-up or credit card.</td><td>30-day trial with all features for up to 3 users. No free edition.</td><td>14-day trial, no credit card. No free edition.</td></tr>
<tr><th>Pricing model</th><td>Flat yearly Premium licence, not per user: Self-Service ${prices.selfService} a year, or Enterprise ${prices.enterprise} a year with priority support</td><td>Per user, monthly or yearly</td><td>Per connected board, with unlimited users</td></tr>
</tbody>
</table>
</div>
<p class="note">Checked in ${checked} against the vendors' public pages. Prices and features change, so check the details at <a href="https://www.55degrees.se/pricing" rel="nofollow">55degrees.se</a> and <a href="https://getnave.com/pricing" rel="nofollow">getnave.com</a>. Spotted something wrong? Tell us at <a href="mailto:contact@letpeople.work">contact@letpeople.work</a> and we'll fix it.</p>

<h2>When ActionableAgile or Nave fit better</h2>
<p>If you want a managed web app with nothing to install, both are mature and well regarded. ActionableAgile grew out of Daniel Vacanti's work on flow metrics, and its Jira apps put the charts right inside Jira. If your work lives in Trello, both of them support it, and Nave also supports Asana. Lighthouse supports neither.</p>

<h2>When Lighthouse fits better</h2>
<p>Lighthouse is the better fit when the data has to stay inside your network, for example with a Jira Data Center or an Azure DevOps Server that isn't reachable from the internet. It also fits when per-user pricing gets expensive across many teams, or when you want to try the full core for free without a procurement round. One installation can connect to Jira, Azure DevOps, Linear and ServiceNow at the same time, so teams on different trackers end up in one portfolio forecast.</p>
<p>Lighthouse also has an MCP server, so AI assistants such as Claude or Copilot can query your flow data, and its Forecast Reality Check tests the forecasts against weeks that already happened. Because the source is public, your security team can read what it does with your data.</p>

<h2>Looking for a self-hosted alternative to ActionableAgile?</h2>
<p>If your Jira or Azure DevOps sits inside the company network, a cloud tool first needs a way in. If the licence is per user, the bill grows with every team that starts using it. Lighthouse runs on a laptop or a server next to your tracker, so you can check its forecasts on your own data before anyone has to approve a new vendor. See <a href="https://letpeople.work/jira-forecasting-without-story-points/">how forecasting without story points works in Jira</a>, or <a href="https://letpeople.work/azure-devops-forecasting/">how Lighthouse connects to Azure DevOps</a>.</p>
`,
  faqs: [
    {
      question: "Is there a self-hosted alternative to ActionableAgile and Nave?",
      answer: `Yes. Lighthouse runs on your own systems, as a desktop app, a Docker container or on Kubernetes, and keeps your work items in its own database there. It connects to Jira Cloud and Data Center, Azure DevOps Services and Server, Linear and ServiceNow. The Community edition is free for up to 3 teams; paid editions are a flat yearly licence instead of per-user pricing. ActionableAgile's Jira Data Center app also runs inside your own Jira.`,
    },
    {
      question: "How does Lighthouse compare to ActionableAgile?",
      answer:
        "Both show flow metrics and run Monte Carlo forecasts for when work will be done and how much will be done by a date. ActionableAgile is sold per user as a web app, as Jira Cloud and Data Center apps and as an Azure DevOps Services extension. Lighthouse is self-hosted and source-available and free for up to 3 teams. Portfolio forecasts and features shared by several teams are part of the same product, and it also connects to Linear and ServiceNow.",
    },
    {
      question: "How does Lighthouse compare to Nave?",
      answer:
        "Both show flow metrics and run Monte Carlo forecasts from throughput. Nave is a web app hosted in the EU, priced per connected board, and supports Trello and Asana as well as Jira and Azure DevOps. Lighthouse runs on your own systems, so it also reaches a Jira or Azure DevOps Server that is not on the internet, and it uses a flat yearly licence with a free edition.",
    },
    {
      question: "Does Lighthouse charge per user?",
      answer: `No. The Community edition is free for up to 3 teams and 1 portfolio with 1 delivery. The paid features are called Premium in the app and the documentation, and two licences include them: Self-Service at ${prices.selfService} a year, and Enterprise at ${prices.enterprise} a year, which adds priority support. Neither has limits on teams or portfolios.`,
    },
  ],
});
