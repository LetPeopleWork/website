// /jira-forecasting-without-story-points/
//
// Built from Peter's and Benji's blog posts, which it links to. Every number
// here comes from one of those posts or from the Lighthouse docs; do not add
// numbers that are not in a source. Voice rules: memory/website-copy-voice.md.

const BLOG = "https://blog.letpeople.work/p";
const post = (slug, text) => `<a href="${BLOG}/${slug}">${text}</a>`;

export const jiraWithoutStoryPoints = () => ({
  path: "jira-forecasting-without-story-points",
  navLabel: "Forecasting Jira without story points",
  eyebrow: "Guide",
  title: "How to forecast Jira releases without story points | LetPeopleWork",
  description:
    "Forecast a Jira release from what your team has finished, with Monte Carlo instead of story points: what you need, which date to promise and where it breaks.",
  h1: "How to forecast Jira releases without story points",
  lede: "Someone asks when the release will be done. You could add up the story points and divide by velocity. Or you could count what the team really finished over the last weeks and let a Monte Carlo simulation give you dates with their odds. This guide walks through the second way, and says where it falls short as it goes.",
  published: "2026-10-17",
  updated: "2026-10-17",
  body: `
<h2>Why story points make a weak forecast</h2>
<p>Story points were meant to start a conversation about a piece of work. As an input for a forecast they cause trouble. When Peter plotted his teams' story points against how long the items really took, he found almost no relationship: items estimated at 2 points took anywhere from a few days to almost 160 days (${post("reality-check-through-scatter-plotting", "Reality check through scatter plotting")}).</p>
<p>Estimates are noisy as well. Two teams estimating similar features can land far apart, and once teams get compared on their numbers, a 5 has a way of turning into an 8 (${post("the-hidden-cost-of-noise-in-your", "The hidden cost of noise")}, ${post("why-you-should-compare-metrics-of-different-teams-with-each-other", "Why you should compare metrics of different teams")}). Divide one noisy number by another and you get a date that looks precise.</p>
<p>If your team finds points useful for talking through a piece of work, keep them for that. You don't need them to forecast.</p>

<h2>What you need instead: finished items and their dates</h2>
<p>Throughput is the number of items your team finishes per day. Jira already records it, because every issue that reaches Done has a date. There is no extra field to fill in and no estimation meeting. Each item counts as one, whatever its size. That sounds crude, and it works well enough as long as items are kept reasonably small (more on that further down).</p>
<p>Holidays and sick days are already in that history, so you don't have to plan capacity on top of it.</p>

<h2>How a Monte Carlo forecast works</h2>
<p>Take the last 30 days and how many items the team finished on each of them. To forecast, the simulation builds one possible future: for every day ahead it picks one of those past days at random and uses its count. It keeps adding until the remaining items are done, or until the target date is reached. Then it builds the next future. Lighthouse does this 10,000 times, and the share of futures that make it is your probability.</p>
<p>That gives you two kinds of answers:</p>
<ul>
<li><strong>When will these items be done?</strong> You get dates with their odds, for example 50% by one date and 85% by a later one.</li>
<li><strong>How many items will be done by a date?</strong> You get counts with their odds.</li>
</ul>
<p>Benji's ${post("an-introduction-and-step-by-step-guide-to-monte-carlo-simulations", "step-by-step guide to Monte Carlo simulations")} builds the same thing in a spreadsheet, if you want to see every step.</p>

<h2>Which date to promise</h2>
<p>The 50% date is a coin flip: half of the simulated futures finish later. That's fine for planning inside the team. For a customer or a steering committee, Peter's advice is short: use the 85% date and sleep well. When missing would be expensive, use 95%.</p>
<p>An 85% date still misses roughly one time in seven. Say so when you share it. A range with its odds makes for a better conversation than a single date that everyone suspects is a guess (${post("dear-stakeholder-heres-why-im-giving", "Dear stakeholder, here's why I'm giving you a range")}).</p>

<h2>Does it hold up? Check it against your own past</h2>
<p>Benji compared both methods on a real team with six developers. Their average from the previous month said 37.5 items in the next 30 days. The Monte Carlo forecast said 38 items at 50%, 35 at 70%, 31 at 85% and 27 at 95%. The team finished 30, one fewer than the 85% forecast and well short of what the average promised (${post("the-flaw-of-averages-comparing-monte-carlo-simulations-with-estimates-based-on-averages-267528ae4f47", "The flaw of averages")}).</p>
<p>When Peter backtested his own team, the 85% forecast said 12 items for two weeks. They finished 16 (${post("how-lighthouse-changed-the-way-i", "How Lighthouse changed the way I work")}).</p>
<p>You can run the same check on your data. Lighthouse's Forecast Reality Check forecasts weeks that already happened, as if they hadn't, and compares the result with what the team really finished, for each percentile and history window.</p>

<h2>What about items of very different sizes?</h2>
<p>Counting items doesn't need them all to be the same size. It needs them small enough that one giant ticket can't swallow a month. The common way to get there is a service level expectation (SLE): the team agrees that 85% of its items should be done within, say, 10 days. Before anyone starts an item, the team asks one question. Can we finish this within our SLE? If not, split it first.</p>
<p><a href="https://letpeople.work/sizing-poker/">Sizing Poker</a> asks that question for a whole backlog in a few minutes, in the browser and for free.</p>
<p>Epics that have no child items yet get a size from your history. Lighthouse can assume, for example, as many items as 85% of your past features needed. In Benji's own team, 85% of features had 7 child items or fewer (${post("low-wip-small-features-high-freedom", "Low WIP, small features, high freedom")}).</p>

<h2>Where it falls short</h2>
<ul>
<li><strong>It assumes the next weeks look roughly like the last ones.</strong> A reorganisation, a new team or a holiday season changes that. Pick a history window that resembles what's coming: a team that formed a month ago shouldn't use three months of history.</li>
<li><strong>It can't see work that doesn't exist yet.</strong> In one case study a release grew from 29 items to 63, with 34 added along the way, 26 of them bugs. Forecasting the original 29 said 9 April, and the release shipped on 25 April. Re-run with all 63 items, the 85% forecast said 26 April. So re-forecast whenever the scope moves (${post("monte-carlo-simulations-accuracy-and-unplanned-work-a-case-study-9dab4d36bd02", "Monte Carlo simulations, accuracy and unplanned work")}).</li>
<li><strong>Several teams on one feature lower the odds.</strong> All of them have to make it. Five teams that are each 85% sure give you a joint date that is close to a coin flip (${post("an-introduction-and-step-by-step", "Forecasting across several teams")}).</li>
<li><strong>Spiky throughput gives wide ranges.</strong> That's useful information in its own right: predictability is something a team can work on.</li>
</ul>

<h2>What Jira does on its own</h2>
<p>Jira Plans, part of Jira Premium and Enterprise on Cloud and called Advanced Roadmaps on Data Center, schedules work from estimates, team capacity and velocity, in story points or hours. Items without an estimate are left out of the capacity (<a href="https://support.atlassian.com/jira-software-cloud/docs/what-are-capacity-and-velocity-in-advanced-roadmaps/" rel="nofollow">capacity and velocity in Plans</a>). The velocity chart can count issues instead of points, and the control chart shows cycle time with an average. A forecast with its odds isn't part of Jira, as far as Atlassian's documentation shows. Marketplace apps such as ActionableAgile add Monte Carlo charts inside Jira. Lighthouse does it from outside, on your own systems (<a href="https://letpeople.work/compare/">how they compare</a>).</p>

<h2>Doing it in Jira with Lighthouse</h2>
<p>A spreadsheet is fine for a one-off forecast. Lighthouse keeps forecasting against your Jira as items finish:</p>
<ol>
<li>Install Lighthouse on your laptop or a server, as a desktop app, a Docker container or on Kubernetes.</li>
<li>Connect Jira. Jira Cloud uses your username and an API token. Jira Server and Data Center, version 8 or later, use a personal access token, so a Jira that is only reachable inside your network works as well.</li>
<li>Add a team with a JQL query, for example <code>project = "SHOP" AND labels = "checkout"</code>. Then say which issue types count and which states mean doing and done.</li>
<li>Ask when a set of items will be done, or how many will be done by a date. Epics are forecast too, including epics that several teams work on.</li>
</ol>
<p>Lighthouse doesn't use story points for its forecasts. If you keep estimating anyway, it can show how your estimates compare with how long items really took. On paid editions it can also write the 85% date back into a Jira field, so people see it where they already look.</p>
<p>About two weeks of finished work is usually enough for a first forecast. The <a href="https://docs.lighthouse.letpeople.work/concepts/howlighthouseforecasts.html">documentation explains how Lighthouse forecasts</a> in more detail.</p>
`,
  faqs: [
    {
      question: "Can I forecast in Jira without story points?",
      answer:
        "Yes. Count the items your team finishes per day and run a Monte Carlo simulation over that history. You get dates with their odds, for example the date you are 85% likely to make. Jira already records when each issue reached Done, so you need no extra field and no estimation meeting.",
    },
    {
      question: "How much history do I need?",
      answer:
        "About two weeks of finished work is usually enough for a first forecast. Use a history window that looks like the weeks ahead, typically 30 to 90 days, and forecast again as new items finish.",
    },
    {
      question: "Which percentile should I commit to?",
      answer:
        "The 85% date for anything you promise outside the team. The 50% date is a coin flip, which is fine for planning inside the team. Use 95% when missing the date would be expensive.",
    },
    {
      question: "What if our items are very different in size?",
      answer:
        "Agree on a service level expectation, for example that 85% of items are done within 10 days, and split anything that won't fit before you start it. Counting items then works, because no single item is big enough to swallow the forecast.",
    },
    {
      question: "Does Jira have Monte Carlo forecasting built in?",
      answer:
        "Not as far as Atlassian's documentation shows. Jira Plans, called Advanced Roadmaps on Data Center, schedules work from estimates, team capacity and velocity in story points or hours, and leaves items without an estimate out of the capacity. Marketplace apps such as ActionableAgile, or a separate tool such as Lighthouse, add Monte Carlo forecasts.",
    },
    {
      question: "Does this work with Jira Data Center?",
      answer:
        "Yes. Lighthouse connects to Jira Server and Data Center from version 8 with a personal access token. Because you run Lighthouse yourself, it can sit in the same network as your Jira.",
    },
  ],
});
