# Feature: sizing-guided-walkthrough

A guided first run of the sizing round, on the example backlog, for someone who
has never done this and does not know what a good number even is.

Extends `docs/feature/sizing-poker/` rather than replacing it. Every decision
D1-D17 there still binds; this delta only records what is new or newly in
tension. Density: `lean` + `ask-intelligent` (Tier-1 `[REF]` only).

Source: Benji and Peter, Slack, 2026-08-21.

---

## Wave: DISCUSS / [REF] Persona ID

Same primary persona as the parent feature — `po-or-scrum-master-who-has-not-seen-this`
— but caught one moment earlier, at the point of *"I clicked the link and now
what?"* rather than *"I am running a session."*

The new thing is a **second moment for the same person**: the PO or Scrum
Master standing in front of their team, screen shared, running the example
round as a demonstration. Benji: *"das könnte man halt gut mal mit einem Team
auch anschauen."* Peter's framing was an assistant on first visit; Benji's was
something you can also show to a team, possibly in a retro. Both are the same
persona, in facilitator posture instead of learner posture.

Developers remain out of scope as an entry point (parent feature, persona note).

---

## Wave: DISCUSS / [REF] JTBD one-liner

When I have landed on a sizing tool I have never used and do not know what a
good number of days even is, I want to be walked through one round on example
work, so I can decide whether this is worth doing with my own team.

Traces to `learn-by-doing-not-reading` in `docs/product/jobs.yaml`.
Secondary: `rehearse-on-fake-data`.

---

## Wave: DISCUSS / [REF] Locked decisions

**[G1] The finding is bigger than the feature: the example backlog already carries a real conversation.**
Benji, unprompted, describing actual use: *"mit einem Team kannst du fast
'richtige' Diskussionen führen auch mit den Demo Daten. Weil man den Titel
anschaut und sagt: Ok hier brauchen wir Marketing oder das fühlt sich nach viel
an weil Core Funktionalität und bei anderem 'Ja gut ist nur etwas UI anpassen
das hat Platz'."*

Checked against the shipped `sampleItems` and it holds — the eight items do span
his three reaction types: *Rework the onboarding email sequence* (needs
marketing), *Migrate the reporting database to the new cluster* (core, feels
big), *Add CSV export to the metrics table* (small, fits). That was luck rather
than design, and it is now a **constraint**: the example backlog is a product
surface, not filler. Any future edit to `sampleItems` must preserve a spread
that provokes all three verdicts. Worth a test.

**[G2] Guided mode and round mode have opposite goals, and that is fine — provided they never share a number.**
The round is optimised for speed; D4 treats anything that invites deliberation
as an abort condition and D5 makes seconds-per-item the falsification
instrument. A walkthrough with hints and prompts is *deliberately slow*. These
do not conflict, because they are different modes with different jobs: the round
replaces estimation, the walkthrough teaches the mechanism.

They do conflict in exactly one place, and it is easy to miss:
**a guided round must never feed the seconds-per-item KPI.** Someone reading
coach panels will spend 60s+ on an item. Left unseparated, guided rounds would
silently inflate the one metric the page exists to produce and destroy the
evidence D5 was built to gather. Hard requirement: guided rounds emit their own
events, and every existing sizing event carries a `mode: guided | normal` flag
so historical data stays interpretable.

**[G3] The "what could we do?" prompt belongs here, and only here.**
Benji: *"Beim ersten Mal wo man 'No' klickt, evtl. fragen: What could we do?
--> split? Who is needed so it would be possible?"*

This is the third appearance of the condition prompt: originally
`sizing-poker/slices/slice-02-conditions.md`, then narrowed by D11 (guidance
belongs on the wrap-up), then narrowed again by D17 (one tap of "why" is
recording, not deliberating). In guided mode the objection dissolves entirely —
prompting someone to think is not a hazard when teaching is the whole point.
Note Benji's *"beim ersten Mal"*: the prompt fires once, then gets out of the
way. Teaching that repeats is nagging.

**[G4] No jargon, extended to the coach copy.**
Benji: *"idealerweise ohne all den Jargon (kein 'SLE', kein 'Kanban', kein
'Cycle Time')."* This is D10 restated, and the walkthrough is where it is
hardest to hold — explaining *how to pick a good number* is exactly where "85th
percentile" wants to appear. The wording that survives the constraint is
behavioural: *"how long does a typical item take once someone starts it? Not
the longest, not the shortest — the one that would not surprise anyone."* The
existing jargon test extends to cover every guided screen.

**[G5] Build it as a flag on the existing steps, not as an overlay engine.**
Benji described *"overlays"* and *"es highlighted das Feld"*, which is the
spotlight pattern everyone pictures because everyone has seen intro.js. Declined
as the implementation, not as the experience.

The page is already a linear four-phase wizard (intro → config → running →
done). A spotlight layer that positions itself over arbitrary DOM is fragile on
responsive and mobile, fights scroll and z-index, and needs either a dependency
or a lot of portal code — to reproduce stepping that the page already does.
Guided mode is instead a flag carried through the existing components: the same
screens, plus pre-filled example data, an inline coach panel per step, a ring
class on the field being discussed, and the auto-advance the round already has.
Same experience Benji described, a fraction of the surface area, and it works on
a phone.

**[G6] Auto-advance on action, never on a timer.**
Benji: *"wenn man das gemacht hat, gehts automatisch zum nächsten Punkt."*
Correct for the solo learner. But the second audience is a facilitator with the
screen shared, mid-sentence, in front of a team — and a screen that moves on its
own while someone is talking is actively hostile. Advancing when the user acts
satisfies both; advancing on elapsed time serves only the first and sabotages
the second.

**[G7] "Interactive Tutorial" is the working name, flagged not settled.** *(Settled 2026-08-21 by G8: "Walk me through it".)*
D16 is the precedent: the page has already been burned once by a name setting
the wrong expectation. "Tutorial" promises *learn this interface*; the value on
offer is *learn this method*. Alternatives worth a minute of the owners' time:
"Walk me through it", "Show me with an example", "Try it on an example". Not
decided here — it is a one-string change and the owners should pick.

**[G8] "Walk me through it", as a second button beside the normal start.**
(Peter, 2026-08-21, choosing from the G7 alternatives.) Primary `Try it out`,
outline `Walk me through it`, same size, side by side on the intro. G7 is
settled.

**[G9] The entry is a content choice, not a competence test.**
Two buttons at the door force a decision before the visitor has learned
anything, and "try it yourself" versus "be guided" reads as *are you
competent?* — a question people answer defensively, and answer wrong. The
visitors who most need the walkthrough are the least likely to click a button
that admits it.

The distinction that carries no status is **whose items**: yours, or our
example. Both labels self-describe, so neither gets an explanatory caption —
adding one would reintroduce exactly the text D10 removed.

One residual ambiguity, accepted rather than fixed in the label: someone
arriving with a backlog ready may click "Walk me through it" expecting coaching
on *their* items. The first coach note sets the expectation instead — *"I've
loaded an example backlog so you don't have to think of one."* Keeps the button
short.

**[G10] The guided run does not show seconds-per-item. Not hidden from analytics — absent from the screen.**
G2 keeps guided rounds out of the metric. The interface consequence is larger
and was nearly missed: a guided pace is a *fake* pace, produced by someone
reading coach notes rather than reacting. Ending a walkthrough on the normal
wrap-up would make the first number a newcomer ever sees from this tool a false
one — and it is the specific number the product stakes its claim on (D5).

The guided ending is therefore its own screen: no pace metric, and the space it
would have occupied goes to the handover — *"That's the whole method. Now try it
on your own backlog."* That is also the conversion KPI. The ending is the part
of a walkthrough everyone under-designs, and it is where this one either works
or does not.

**[G11] Mode chrome: a slim bar, an exit, and no progress indicator.**
A thin bar at the top of the guided screens: `Walkthrough` left, `Exit` right.
One element carrying mode identity and escape, and it is what makes `Esc`
discoverable.

Deliberately **no step counter**. Three phases does not warrant a progress bar,
and during the round the existing item counter already reads "Item 3 of 8" — two
progress indicators on one screen is noise, and the walkthrough's would be the
less useful of the two.

Exiting **does not reset**: the visitor stays exactly where they are, minus the
coaching. Training wheels that can be dropped, not a track they are locked onto.
A walkthrough that punishes leaving is one people avoid entering.

**[G12] Coach placement differs per screen, and the difference is the point.**
- *Config* — the note is instructional, so it sits **above** the field it
  explains. Read, then act.
- *Round* — the note is an aside about how to think, not what to press, so it
  sits **below** the three answers and stays quiet. The item title must remain
  the largest element on screen (AC-3.2, the projector case); a panel above it
  would compete for exactly the attention the item needs.
- *First "No"* — not a panel at all. It replaces the three answers inline, the
  pattern the condition chips used in the original prototype and which worked
  there. It is a moment, not furniture.

**[G13] Coach notes carry a hard length cap, enforced by the content schema.**
One or two sentences, `z.string().max(...)` like every other string in
`sizingPokerContent.ts`. On a phone a three-line note pushes the three answers
below the fold, which breaks the answer-at-a-glance design the entire round
depends on. A cap in the schema fails the build; a cap in a review comment does
not survive the second edit.

**[G14] The walkthrough and "Use an example backlog" both stay, with distinct jobs.**
Config already offers "Use an example backlog", so a walkthrough creates a second
route to the same data. Both are kept deliberately: the walkthrough is example
**plus coaching**, for a first-timer; the link is example **fast**, for someone
who has done this before and wants the demo data without being taught. Left
unexamined they would read as a duplicate; named, they are two speeds.

**[G15] One highlight, one focus per guided step — Benji's sequential model, restored.**
(2026-08-21, after first feedback: "the UI looked a bit crowded.")

An audit against Benji's own words found the drift: his design is sequential
single-focus — *"es highlighted das Feld ... und wenn man das gemacht hat, gehts
automatisch zum nächsten Punkt wieder mit highlight."* The first mock instead
showed the whole config form in guided mode (mode bar, coach panel, ringed days
field, an eight-row example textarea, start button) — four stacked boxes, which
is exactly the crowding the feedback named. The complaint validated Benji's
original over the adaptation.

Restored: in guided mode the prefilled backlog is **confirmed, not shown** — a
one-line check ("Example backlog loaded — 8 items ready. You'll see them one at
a time.") replaces the textarea, so the only interactive element on screen is
the one the coach is talking about. The heading follows ("One thing before you
start"), and the mode bar slims from a boxed pill to a hairline row. Rule for
the build: **each guided step renders exactly one focused control; everything
prefilled collapses to a confirmation.**

**[G16] Benji's point 2 — "if not, what causes you to think?" — lands in the round coach.**
The same audit found his second numbered point missing entirely. It is now the
round-screen coach line: *"Read the title and react — first instinct. If it's a
no, notice what makes you think that. You'll use it in a moment."* A private
noticing rather than a question to answer, which keeps the vote a reflex (D4)
while planting the thought the first-"No" screen (G3) then picks up — the two
moments now form one arc instead of the prompt arriving cold.

**[G17] The walkthrough guarantees all three answers: three curated items, one specimen per answer, nudged but never commanded.**
(Design call, 2026-08-21, on Peter's question "should the user do Yes, Maybe and
No in the walkthrough?")

Yes — because the method *is* the three answers, and with free choice over fake
items most people rationally answer Yes to everything (they have no context in
which anything feels impossible). They would finish having pressed one button
repeatedly, and the two answers that carry the method — the Maybe that surfaces
coupling (parent D3) and the No that starts the slicing conversation (G3) —
would never fire. Leaving the core lesson to chance is the one failure a
walkthrough cannot afford. The opposite pole, scripted clicks ("now press No"),
teaches button locations rather than judgment and contradicts the "react, don't
analyse" coaching.

The design in between:

- **Three items, not eight.** A teaching round needs one specimen per answer,
  not repetition; three items is about a minute. The full example backlog stays
  for normal rounds — the walkthrough sizes a curated subset.
- *Item 1 — the reflex.* "Add CSV export to the metrics table", no steering.
  Nearly everyone says Yes, which is itself the lesson: most answers take a
  second. Carries the G16 noticing line.
- *Item 2 — the dependency.* "Rework the onboarding email sequence", Benji's own
  "hier brauchen wir Marketing" example. The coach points at *who* it needs,
  before the answer (the only pre-answer coach note, G12 exception); the user
  draws the Maybe conclusion themselves.
- *Item 3 — the No.* "Migrate the reporting database to the new cluster",
  Benji's "fühlt sich nach viel an" example. Needs no nudge; the No triggers
  the one-time G3 lesson.
- **Nudge, never command.** If someone answers against the grain the round
  simply continues — no correction, no branching. A rare missed lesson costs
  less than forced clicks cost everyone. *(Superseded by G19 — Peter overruled
  the miss-tolerance.)*
- **Dividend:** the guided ending's split is 1/1/1 — one item in each list — so
  the output format itself teaches what each answer is for.

**[G19] Every walkthrough must actually visit Yes, Maybe and No — enforced by acknowledge-explain-redirect, not by disabling buttons.**
(Peter, 2026-08-21: *"In the walkthrough I should need to have Yes, Maybe and
No."* — overrules G17's miss-tolerance.)

G17 guaranteed the three answers only statistically; Peter's decision makes the
guarantee absolute. The failure mode to avoid is Simon Says: greying out two
buttons or auto-advancing teaches button locations, not judgment. Instead a
"wrong" answer is *answered*: the coach replies in a note above the answers —
first validating the instinct, then explaining why this item is the specimen
for a different answer, then naming the target ("Click Maybe and see what it's
for"). The vote is not recorded until the target answer lands, so the ending's
1/1/1 split is now a certainty, not a dividend.

Mechanics: each guided item carries a `target` verdict and a `redirect` string
(content module); the machine stores `guidedTargets` only when a guided round
starts with them, and a non-target guided vote sets `redirectPending` without
recording anything — in particular, a wrong "No" on items 1–2 does **not** fire
the G3 lesson, which stays bound to the item designed for it. Exit drops the
enforcement with the rest of the coaching (G11: exit keeps the round, now as a
free one). Normal rounds and target-less guided starts are byte-for-byte
unchanged, so G2's evidence separation is untouched.

**[G20] The walkthrough is Benji's popup model: the real screens, highlight steps, and one popup per click. Supersedes G3, G12, G15, G16, G17 and G19.**
(Benji's feedback and spec, Slack 21.8.2026; Peter's decision 22.8.2026 after
comparing four live prototypes: "Nehme Version 1,2,3 weg und baue dafuer
SizingPoker4 ein.")

What changed and why:

- **The full example backlog, not a curated three.** Benji: "ich wuerde alle
  Items vom Beispiel mit rein nehmen." The guided round now runs all 8 sample
  items through the REAL config form, prefilled - the screen being explained
  is the one a team will later use with its own backlog. G15's reduced config
  and G17's curated items are gone.
- **No prescribed answers.** Benji did not understand the target/redirect
  mechanic ("nicht 'vorgeben' was jetzt richtig sein soll - das habe ich
  nicht verstanden"), which is the strongest possible evidence against a
  teaching device. G19's enforcement is removed from the machine entirely;
  guided votes record exactly like normal ones.
- **Highlight steps.** Two on the config (day field, items box) and two on
  the first item (title: "read and discuss", answers: "choose"), each a dim
  layer with the element cut out and a bottom-docked card. Docked, never
  anchored: an anchored card covered the Start button in prototype B.
- **One popup per click, every click.** Yes is one line; Maybe and No carry
  Benji's discussion prompts, with an example that fits the item on screen
  (content holds one maybe- and one no-example per sample item). The vote
  dispatches when the popup closes, so the item under discussion stays
  visible. This replaces the G3 first-No lesson and the coach notes - the
  machine no longer knows about lessons at all; pausing is a page concern.
- **What survives:** the entry point (G8/G9), advance-on-action (G6), the
  mode bar with Exit (G11), the guided ending without a pace (G10,
  startedGuided), mode-separated analytics (G2), and the jargon ban (G4),
  now enforced across the popups.
- The popup texts are Benji's own words from the thread; the highlight and
  example texts are drafts for Benji and Peter to rewrite (their explicit
  wish). All of it lives in the content module's `guided` section.

**[G18] Guided screens are styled in the site's shipped tokens, plus two new ones for the coach voice.**
The mock now uses the exact palette from `src/index.css` (teal primary
`158 29% 26%`, the verdict trio, `shadow-soft`, shadcn button and card shapes),
committed to the light look the site actually serves — `.dark` is defined but
never toggled. The coach voice is the one addition: slate (`hsl(215 45% 34%)`
plus wash and rule), the same hue family as `--foreground`, so it harmonises
with the site while staying clearly distinct from brand teal — the visitor can
always tell the product's voice from the guide's. Building this adds
`--coach`, `--coach-wash`, `--coach-rule` to `index.css` following the
verdict-token precedent.

---

## Wave: DISCUSS / [REF] User stories with elevator pitches

### GW-1 — Be walked through a first round
`job_id: learn-by-doing-not-reading`

As a PO or Scrum Master who has just landed on the page, I want to be taken
through one round on example work with the next move explained at each step, so
that I understand the mechanism without having to supply anything of my own.

#### Elevator Pitch
Before: I land on a sizing tool, I am asked for a number of days I have never thought about, and I leave.
After: click **Interactive Tutorial** on the intro → sees the example backlog already loaded, the days field ringed, and a short note explaining how to pick a number → answer the first item → the round carries on.
Decision enabled: whether this method is worth ten minutes of my team's time.

**Acceptance criteria**
- AC-1.1 The guided entry point is on the intro step, alongside the normal start, and does not displace it.
- AC-1.2 Starting the walkthrough loads the example backlog and a sensible default number of days without any typing.
- AC-1.3 Each guided step shows exactly one coach note, and the control that note refers to is visually emphasised.
- AC-1.4 The walkthrough advances when the user acts. No step advances on a timer. (G6)
- AC-1.5 No guided screen contains "SLE", "Service Level Expectation", "cycle time", "percentile", "Kanban" or "85%". Asserted by extending the existing jargon test to guided mode. (G4)
- AC-1.6 The walkthrough can be left at any point, landing on the normal page with the round intact.

### GW-2 — Learn what a "No" is actually for
`job_id: learn-by-doing-not-reading`

As someone new to this, I want the first "No" to show me what the answer is
*for*, so that I understand the point is a decision about the work, not a label
on it.

#### Elevator Pitch
Before: I click "No", the round moves on, and I have learned nothing except that a button works.
After: click **No** for the first time in guided mode → sees "What would make this a yes? Could it be split into something smaller? Does someone specific need to be free?" → continue.
Decision enabled: that "too big" is the start of a conversation about slicing, not a verdict to record and forget.

**Acceptance criteria**
- AC-2.1 The prompt fires on the first "No" of a guided round only, never on later ones. (G3)
- AC-2.2 The prompt is dismissable in one action and captures nothing — it teaches, it does not collect.
- AC-2.3 The prompt never appears outside guided mode, protecting D4 and D11.

### GW-3 — Run the example with a team, having prepared nothing
`job_id: rehearse-on-fake-data`

As a Scrum Master with a team in a retro, I want to run the example round on the
shared screen with no preparation, so that we can have the real argument about
sizing on work that belongs to nobody.

#### Elevator Pitch
Before: trying a new sizing method with the team means preparing a session and spending the team's real backlog on an experiment that might not work.
After: open the page, click **Interactive Tutorial**, share the screen → sees eight example items that provoke genuinely different reactions → the team argues about whether "Migrate the reporting database" fits.
Decision enabled: whether the team wants to do this for real next refinement.

**Acceptance criteria**
- AC-3.1 The example backlog spans items that reliably provoke all three answers. Asserted by a test over `sampleItems` categories, so a future edit cannot quietly flatten it. (G1)
- AC-3.2 Guided screens stay legible when projected: the item title and the three answers remain the largest elements at desktop width.
- AC-3.3 Nothing in guided mode advances without a user action, so a facilitator can talk over any step. (G6)

---

## Wave: DISCUSS / [REF] Definition of Done

1. All acceptance criteria for the shipped slice pass as automated tests.
2. Guided state lives in the existing `roundMachine`, pure, with unit tests; no new state container.
3. No new runtime dependency — guided mode is a flag through existing components. (G5)
4. Jargon test extended to cover every guided screen. (G4)
5. Analytics separate guided from normal, and existing sizing events carry the mode flag. (G2)
6. `npx tsc --noEmit && npx vite build && npx vitest run` all clean.
7. Keyboard-operable end to end; the walkthrough is escapable at every step.
8. Verified in the browser at mobile and desktop widths, and once at projector scale.
9. Dogfooded: run once with a real team before the second slice is planned.

---

## Wave: DISCUSS / [REF] Out-of-scope

- A spotlight/overlay engine positioned over arbitrary DOM. (G5)
- Any tutorial that plays without user action, including video. Benji explicitly ruled video out: *"nein, auf der Website — man klickt."*
- Capturing anything the learner types or picks during the walkthrough.
- A second walkthrough for the compare/multi-device flows — those do not exist on the website. (parent D13, D14)
- Editing the example backlog through the UI.
- Progress persistence across visits.

---

## Wave: DISCUSS / [REF] WS strategy

Single implementation, no environment switching. Slice 1 is the walking
skeleton: entry point → guided config → guided first item, on the real route,
in the real components. Nothing stubbed, because nothing is remote.

---

## Wave: DISCUSS / [REF] Driving ports

| Surface | Entry point | Notes |
|---|---|---|
| Web route | `GET /sizing-poker` | Guided mode is a state of the existing page, not a new route |
| Button | "Interactive Tutorial" on the intro step | Working name, see G7 |
| Keyboard | `1` `2` `3`, `Esc` to leave guided mode | Same answer keys as the normal round |

No inbound API, no CLI, no new route. Deliberately.

---

## Wave: DISCUSS / [REF] Pre-requisites

- Parent decisions D1-D17 in `docs/feature/sizing-poker/feature-delta.md` all
  still bind. G2, G3 and G6 are the three places this feature touches them, and
  each is reconciled above rather than overridden.
- Timing: Peter, 2026-08-21 — *"wenn wieder usage verfügbar ist."* Nothing is
  built in this wave.
- Still outstanding from the parent feature and **more relevant now, not less**:
  no real team has run a real round yet, so seconds-per-item remains unmeasured.
  G2 exists precisely so that building this does not destroy the ability to
  measure it later.
- Naming decision (G7) is the owners'.

---

## Wave: DISCUSS / [REF] Outcome KPIs

| KPI | Target | Measurement | Meaning if missed |
|---|---|---|---|
| Walkthrough start rate | > 25% of intro views | `Tutorial started` / intro views | The entry point is invisible, or nobody feels they need help. |
| Walkthrough completion | > 60% of starts | `Tutorial completed` / `Tutorial started` | Too long, or the coach notes are not earning their space. |
| **Conversion to a real round** | **> 30% of completers start a round with their own items** | round started with `mode: normal` after a completed guided round, same session | The walkthrough entertains but does not hand over. This is the KPI that matters — the tutorial exists to get someone to the real thing. |
| First-No prompt engagement | prompt visible > 3s before dismissal | timing on the GW-2 prompt | It reads as an interruption rather than a lesson. |
| Guided rounds excluded from pace data | 100% | assert `mode` present on every sizing event | G2 has failed and the D5 evidence is contaminated. |

All properties stay counts, buckets and modes. Item titles never leave the
browser (parent AC-1.6 still binds).

---

## Wave: DISCUSS / [REF] Scope Assessment

**PASS — right-sized.** Three user stories, one bounded context, one technology,
zero integration points, no backend. Estimated ~2 days across two slices plus a
gated third. No oversized signal fires.
