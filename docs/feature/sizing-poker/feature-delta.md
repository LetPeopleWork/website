# Feature: sizing-poker

Wave log for the Sizing Poker subpage on letpeople.work.
Density: `lean` + `ask-intelligent` (resolved from `~/.nwave/global-config.json`).
Tier-1 `[REF]` sections only; Tier-2 expansions available on request.

---

## Wave: DISCUSS / [REF] Persona ID

**Revised 2026-08-04** after Benji's and Peter's review. The original persona
(`facilitator-with-flow-data`, someone who already has a cycle-time percentile)
was wrong in both directions: too expert, and not specific enough about role.

`po-or-scrum-master-who-has-not-seen-this` — a Product Owner or Scrum Master who
runs refinement, is dissatisfied with story-point estimation, and has **never met
the terminology**. No SLE, no cycle-time percentile, quite possibly no flow data
at all. They will try it alone first, then bring it to the team if it survives
contact.

Explicitly **not** developers. Benji: "Kein Entwickler wird das von sich aus
machen." A developer is a participant in a round somebody else facilitates; they
will not arrive at this page under their own steam. Peter, on the hostility this
topic attracts: "vor allem wenn ich mir die grumpy Leute auf Reddit so durchlese"
— which is a reason to lead with a mechanism the visitor can try in silence,
rather than an argument they have to agree with first.

---

## Wave: DISCUSS / [REF] JTBD one-liner

When I am about to pull the next item into a system that is not starving, I want
to know whether it fits the time my system actually takes, so I can start it or
slice it without holding an estimation meeting.

Traces to `size-without-estimating` in `docs/product/jobs.yaml`.
Secondary jobs: `find-the-coupling`, `know-my-sle`.

---

## Wave: DISCUSS / [REF] Locked decisions

**[D1] Do not build a planning poker tool. Build the question.**
Research found at least six free, no-signup, link-sharing planning poker tools,
several with Jira integration and persistent async rooms (Kollabe, Planning Poker
Online, Scrum Poker, planningpoker.live, PlanITPoker, online-planningpoker.com).
Entering that category means competing on realtime rooms and integrations we will
not build, against tools that are already free. The defensible asset is the
*question* — anchored to the team's own SLE — not the room it is asked in.

**[D2] The named prior art is a physical card deck, not a web app.**
`estimation.lunarlogic.io` sells a cardstock deck for $16.90 with three values:
`1` / `Too Big` / `No Clue`. Oliver's "what exists offline" is literally offline.
There is no digital tool that anchors sizing to an empirically-derived SLE. That
gap is the wedge.

**[D3] The middle answer is the invention, and it is not Lunar Logic's.**
Lunar Logic's third card surfaces *ignorance* ("no clue"). Benji's middle answer
surfaces *coupling* ("yes, if Sarah is free", "yes, if we pair"). A dependency
finding is a system finding, not an estimation finding. This is the only part of
the mechanism no existing tool produces, and therefore the part most worth
protecting and most worth testing early.

**[D4] Liz Rettig's worry is the specification, not a caveat.**
> "The only thing I worry about is that it promotes too much thinking up front
> about work items. As long as it's just a quick yes or no…"

Enforced in the product, not left to facilitation discipline:
no free-text field anywhere in the voting loop; one item on screen at a time so
items cannot be compared or calibrated against each other; three buttons bound to
keys 1/2/3; the "yes, if…" follow-up is tap-to-select chips, never typing; a
per-round timer visible while voting.

**[D5] Seconds-per-item is the headline result metric.**
The end screen leads with seconds per item. This makes the abort condition the
product's own primary output: if the mechanism is slow, our tool says so, in
public, without us having to be honest about it separately. This is both the
value proof and the falsification instrument.

**[D6] No backend for the MVP. Async ships as shareable result codes.**
Supabase is available (`supabase/functions/`, used by the assessment), so a
backend is *possible* — but rooms mean session lifecycle, expiry, abuse surface,
and rate limiting for a page whose entire promise is speed and simplicity.
With three options and N items, one participant's answers encode to a short
base-36 code (12 items = 3^12 = 531,441, a 4-character code). Participant votes,
gets a code, drops it in Slack; the facilitator pastes the codes in and sees only
the split items. Genuinely async, zero infrastructure, and it lands in Slack where
the team already is. Revisit a backend only if slice 3 shows codes failing.

**[D7] "Hangs off the backlog" belongs in Lighthouse, not on the marketing site.**
The board card ("Build the Sizing Poker MVP on a website subpage") and Benji's
differentiator ("bei uns hängt es schon am Backlog") are in tension: a static
GitHub Pages page cannot reach a customer's Jira without an authenticated proxy,
which is explicitly out of scope and carries the credential-exposure risk covered
by the standing L-1 rule. Resolution: the website page is the *mechanism* — paste
or type your items, no login. Lighthouse is where it hangs off the backlog and
knows the SLE from real data. The page links there rather than pretending.

**[D8] Keep `/sizing-poker` as the URL; let the page headline reframe.**
"Sizing Poker" is already public in today's release notes and carries search
value against "planning poker". But *poker* imports exactly the mental model D4
is trying to suppress — rounds, reveal, negotiation, convergence. The URL and the
announced name stay; the page's own headline is the question itself ("Does it
fit?"). No re-vote, no reveal ceremony, no convergence ritual is built.

**[D10] No terminology before the wrap-up.** (Benji, 2026-08-04)
The first version opened with a paragraph of explanation, a field labelled
"Your Service Level Expectation", and the unit "days, 85% of the time". Benji's
verdict on it: *"Finde das zu viel Text, ich habs nicht gelesen und einfach auf
Start geklickt."* He skipped the lot and clicked Start — which is the correct
behaviour, and the finding. The flow is now intro → config → round → wrap-up:
the config asks "How fast should your items be done?" in days, with no percentile
and no jargon, and "Service Level Expectation", "cycle time" and "Work Item Age"
appear exactly once each, in the wrap-up, as answers to two questions the visitor
now has a reason to ask. A test asserts the jargon is absent from every screen
before the wrap-up, and that the intro stays under 50 words.

**[D11] Guidance sits on the wrap-up, not in the round.**
Benji proposed a hint at vote time: *"If it's a maybe, think about what needs to
be true so it becomes a yes. If it's a no, consider options you have like
splitting or working in a pair."* The content is right and it is now in the
product — but attached to the Maybe and Needs-work lists on the wrap-up, not
shown during voting. Reason: it is an instruction to *think*, and D4 exists
because Liz Rettig's constraint is that thinking at vote time is what kills the
mechanism. Putting it where the action happens keeps both. Flagged for Benji to
overrule if he disagrees.

**[D12] The page is a teaser, and that is a specification, not a limitation.**
(Benji and Peter, 2026-08-04) *"Das Website tool soll gar nicht feature complete
sein, sondern teasern"* — with the appetite it creates satisfiable by Lighthouse.
Peter: *"less is more und gleichzeitig einen Mehrwert/Appetit geben."* The bar is
that it must be genuinely **useful** on its own while staying deliberately
incomplete. Practical consequence: the wrap-up's two Lighthouse questions are now
the most load-bearing part of the page, not a footer. Every future feature
request for this page gets tested against "does this deepen the tease, or does it
start replacing Lighthouse?"

**[D13] Group management, sync/async modes and secret voting are Lighthouse's, not the website's.**
Benji: group sessions are the better long-term shape — *"weil man dann kein
Refinement Meeting mehr braucht, bzw. da nur die Maybe's und No's anschauen
muss"* — but *"das wäre dann in-Tool und nicht auf der Website"*. This retires
slice 03 (async result codes) from the website scope entirely, and reduces slice
02 to the wrap-up guidance already shipped under D11. Both briefs are marked
superseded. The website page's second job is to produce the evidence for whether
that Lighthouse investment is worth making at all.

**[D9] Reference-class / child-count sizing modes stay out.**
Chris G's 20.07. thread frames Sizing Poker as one mode of a general sizer
parameterised by SLE, child count, or reference class. Noted, deliberately not
built. Adding a mode selector before the single mode is proven is the fastest way
to make the page slow.

---

## Wave: DISCUSS / [REF] User stories with elevator pitches

### US-1 — Run a sizing round against my own SLE
`job_id: size-without-estimating`

As a facilitator with a cycle-time percentile, I want to put my candidate items
through one question each, so that I leave with a start-or-slice decision per item
and no story points.

#### Elevator Pitch
Before: I run a 45-minute estimation round and leave with numbers nobody uses.
After: open `letpeople.work/sizing-poker`, enter my SLE, paste my items, press 1/2/3 → sees `8 items in 0:42 — 5.3 seconds per item`, a three-way split bar, and the list of items to slice.
Decision enabled: which items I pull today and which go back for slicing, before anyone starts them.

**Acceptance criteria**
- AC-1.1 Given an SLE of 8 and 8 pasted items, when I answer all 8, then the result screen shows total elapsed time and mean seconds per item, computed from first item shown to last answer.
- AC-1.2 The voting screen contains no text input of any kind. (Enforced by test asserting zero `input`/`textarea` elements in the run view.)
- AC-1.3 Exactly one item is visible during voting; no list of upcoming or previous items is rendered.
- AC-1.4 Keys `1`, `2`, `3` register the three answers and advance; the same actions are reachable by click and by keyboard tab order.
- AC-1.5 Items answered "no" are listed verbatim on the result screen under a slice-these heading, with singular and plural phrasing both correct.
- AC-1.6 Nothing is transmitted off the client during a round. (Test asserts no network call fires between round start and result render.)

### US-2 — Name the condition without typing
`job_id: find-the-coupling`

As a facilitator, I want the "yes, if…" answer to capture *what* would need to be
true in a single tap, so that the round produces a dependency list without ever
becoming a discussion.

#### Elevator Pitch
Before: "yes but only if…" is said out loud, agreed to, and immediately forgotten.
After: press `2` → sees four chips (a specific person / pairing / a decision first / another team), taps one → sees on the result screen `2× a specific person, 1× another team`.
Decision enabled: which dependencies to resolve before the sprint, and whether the pattern is a person, a team, or a decision bottleneck.

**Acceptance criteria**
- AC-2.1 Choosing the middle answer reveals a chip row and hides the three main answers, so the round cannot continue without naming a condition.
- AC-2.2 Chips are selectable by click and by number key; selecting one advances immediately to the next item.
- AC-2.3 No chip opens a text field. An "other" chip, if added, records only that it was other.
- AC-2.4 The result screen aggregates conditions by type with counts, and states the finding in system terms, never naming a person.

### US-3 — Size independently, discuss only the disagreements
`job_id: size-without-estimating`

As a team member in a distributed team, I want to answer on my own and share a
short code, so that we only spend meeting time on items where we actually
disagree.

#### Elevator Pitch
Before: we book an hour so six people can agree out loud about twelve items, ten of which nobody disputes.
After: run the round alone, press `Copy my code` → sees `K3F9`, pastes it in Slack; the facilitator pastes the codes into the compare box → sees `3 of 12 items split the room` with only those three listed.
Decision enabled: whether to hold the meeting at all, and if so, exactly which items to put on the agenda.

**Acceptance criteria**
- AC-3.1 Completing a round yields a code encoding the answers for that item list; the same answers over the same list always yield the same code.
- AC-3.2 Pasting two or more codes renders per-item agreement, flagging items where participants disagree and items where anyone answered "no".
- AC-3.3 Compare works with codes from a different device and browser, with no shared session and no network call.
- AC-3.4 A code from a different item list is rejected with a message stating the lists do not match, not a silent wrong answer.

### US-4 — Get an SLE when I do not have one
`job_id: know-my-sle`

As a visitor without flow data, I want to proceed anyway and learn where a real
SLE comes from, so that a missing number does not stop me trying the mechanism.

#### Elevator Pitch
Before: "Service Level Expectation" is a term I would have to go and look up first.
After: leave the SLE field at its default → sees `Don't know it? Use the 85th percentile of your cycle time. No data yet? Start at 10 days and correct it once you have some.` and a link to how Lighthouse computes it.
Decision enabled: whether to run the round now with a guess, or go and get the real number first.

**Acceptance criteria**
- AC-4.1 The SLE field is pre-filled with a usable default and the round can be started without changing it.
- AC-4.2 The helper text states the 85th-percentile definition and offers a starting value, in under 30 words.
- AC-4.3 A link to Lighthouse and to the two related workshops is present on the result screen, below the findings, never interrupting the round.

---

## Wave: DISCUSS / [REF] Definition of Done

1. All acceptance criteria for the shipped slice pass as automated tests.
2. Core logic (`core/`) is pure, has unit tests, and no React or I/O imports.
3. Page renders with `SEO` + `Navigation` + `SimpleFooter` chrome matching the site shell.
4. Route registered in `src/App.tsx` above the `*` catch-all, lazy-loaded.
5. `scripts/prerender-meta.mjs` `seoRoutes` entry added, plus `public/sitemap.xml` and `public/llms.txt`.
6. `trackEvent` fires on round start and completion with non-personal props only (counts and buckets — never item titles).
7. `npx tsc --noEmit && npx vite build && npx vitest run` all clean.
8. Keyboard-operable end to end; visible focus states; `prefers-reduced-motion` respected.
9. Verified in the browser in both light and dark at mobile and desktop widths.

---

## Wave: DISCUSS / [REF] Out-of-scope

- Realtime multiplayer rooms, presence, or a reveal animation. (D1, D6)
- Any connection to Jira, Azure DevOps, or Linear from the website page. (D7)
- Accounts, login, or per-team persistence of rounds.
- Storing item titles anywhere off the client, including in analytics.
- Reference-class, child-count, or any second sizing mode. (D9)
- Re-voting, convergence rounds, or discussion timers — the poker ceremony. (D8)
- Computing an SLE for the visitor from raw cycle-time data. That is Lighthouse.

---

## Wave: DISCUSS / [REF] WS strategy

Single implementation, no environment switching and no vendor abstraction layer.
Slice 1 *is* the walking skeleton: it exercises the full path from setup through
voting to result in the real page shell, on the real route, with real pasted
items. Nothing is stubbed because nothing is remote.

Note: this repo had no `docs/` before this wave, so the project's A/B/C/D walking
skeleton taxonomy was not available to cite. Strategy is stated descriptively.

---

## Wave: DISCUSS / [REF] Driving ports

| Surface | Entry point | Notes |
|---|---|---|
| Web route | `GET /sizing-poker` | Lazy-loaded React page, `src/pages/SizingPoker.tsx` |
| Keyboard | `1` `2` `3`, chip number keys | Primary input during a round; mouse is the fallback, not the reverse |
| Clipboard (out) | Copy round summary; copy participant code | Slack is the delivery channel |
| Clipboard (in) | Paste item list; paste participant codes | No file upload, no tracker auth |

No inbound HTTP API, no CLI, no MCP surface. Deliberately.

---

## Wave: DISCUSS / [REF] Pre-requisites

- None blocking. No DISCOVER or DIVERGE wave ran for this feature; the Slack
  thread stands in for discovery and is recorded as `asserted`, not `validated`,
  in `docs/product/jobs.yaml`.
- Architectural conventions are already established and must be followed:
  feature folder `src/features/sizing-poker/{core,content,components}`, page as
  composition root with adapters injected via optional props, tests colocated,
  design tokens from `src/index.css` (brand `158 29% 26%`).
- Existing commercial hooks to link from the result screen: the "SLE & Right
  Sizing" and "Epic Right Sizing & Slicing" workshops in
  `src/components/ExpertiseAndServices.tsx`.
- Resolved 2026-08-03 by the owners: D7 confirmed as written — the website page
  is mechanism-only, with no tracker connection. Lighthouse remains the place it
  hangs off the backlog.
- Resolved 2026-08-03: slice 1's production-data criterion is satisfied by
  dogfooding on LetPeopleWork's own refinement session. Record the observed
  seconds-per-item back into `slices/slice-01-timed-round.md` once run.

---

## Wave: DISCUSS / [REF] Outcome KPIs

| KPI | Target | Measurement | Meaning if missed |
|---|---|---|---|
| Median seconds per item | < 15s | Client-side timer, reported as a bucketed Plausible prop | D4 confirmed: the mechanism invites deliberation. Stop. |
| Round completion rate | > 70% | `Sizing round completed` / `Sizing round started` | People abandon mid-round; the loop is too long or too dull. |
| Middle-bucket usage | 10%–40% of items | Bucketed prop on completion | Below 10%: D3 disproven, the middle answer is dead weight and this is Lunar Logic with a timer. Above 40%: the chip set is a dumping ground, or the backlog is the actual finding. |
| Repeat use | > 20% of teams run a second round within 14 days | Distinct-session return rate | One-time curiosity, not a tool. |
| Onward click | > 8% of completions click Lighthouse or a workshop | `trackEvent` on the result-screen links | The page entertains but does not connect to anything we do. |

All props stay counts and buckets. Item titles never leave the browser.

---

## Wave: DISCUSS / [REF] Scope Assessment

**PASS — right-sized.** Four user stories, one bounded context, one technology,
zero integration points, no backend. Estimated total effort ~2.5 days across three
slices. None of the oversized signals fire.
