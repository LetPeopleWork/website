# Slice 01 — The timed round (walking skeleton)

**Goal:** A facilitator can put a real backlog through the three-way question on a
shared screen and see, at the end, how many seconds per item it took.

**Stories:** US-1, US-4 · **Effort:** ~1 day · **Order:** first (highest learning leverage)

---

## Learning hypothesis

> **Disproves the feature if it fails:** that the three-way question is faster than
> estimating. If median seconds-per-item exceeds 15, or more than 30% of started
> rounds are abandoned, Liz Rettig's worry is confirmed — the question invites
> deliberation rather than replacing it, and the premise the whole page rests on
> is wrong.
>
> **Confirms if it succeeds:** that a sizing decision per item can be made in
> roughly the time it takes to read the item, which is the only claim that
> justifies building anything further.

This slice is deliberately built so it can fail loudly. Seconds-per-item is the
headline output, not a hidden metric — the tool reports its own verdict.

---

## IN scope

- Route `/sizing-poker`, lazy-loaded, full site chrome (`SEO` / `Navigation` / `SimpleFooter`).
- Setup: SLE number field (default 8, helper text per AC-4.1/4.2) + textarea, one item per line.
- Run: one item on screen, three answers, keys `1`/`2`/`3`, elapsed timer, progress rail.
- Result: seconds-per-item as the lead figure, total time, three-way split bar,
  verbatim list of "no" items, correct singular and plural phrasing.
- "Run another round" reset. Copy-summary-for-Slack button.
- `trackEvent("Sizing round started")` and `trackEvent("Sizing round completed", {...})`
  with bucketed counts only.
- Result-screen links to Lighthouse and the two workshops, below the findings.

## OUT of scope

- Condition chips (slice 02) — the middle answer records only that it was chosen.
- Participant codes and compare (slice 03).
- Any backend, persistence, account, or tracker connection.
- Re-vote, reveal, convergence, or any poker ceremony.

---

## Acceptance criteria

- AC-1.1 · AC-1.2 · AC-1.3 · AC-1.4 · AC-1.5 · AC-1.6 (see `feature-delta.md`)
- AC-4.1 · AC-4.2 · AC-4.3
- **Production data:** the round is exercised at least once against a real team's
  real backlog export, not the built-in sample. The sample list exists for
  first-time visitors; it does not count as evidence.
- **Dogfood:** run in a LetPeopleWork refinement session the same day it lands,
  and record the resulting seconds-per-item in this brief.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — three views (setup, run, result) in one feature folder. |
| Depends on a new abstraction? | No. Pure `core/` reducer + timer, existing shadcn primitives. |
| Disproves a pre-commitment? | Yes — the central speed claim, publicly. |
| Synthetic data only? | No — production-data criterion is explicit above. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

None. Nothing remote, nothing stubbed.

## Notes for DESIGN

- `src/features/sizing-poker/core/roundMachine.ts` — pure reducer, phases
  `setup | running | done`; no `Date.now()` inside the reducer, pass timestamps in
  so it stays testable (mirrors the assessment's `quizMachine.ts` convention).
- Timing starts when the first item renders, not when Start is clicked, so the
  measurement is answering time and not typing time. State this in the result copy.
- The run view must contain no `input` or `textarea` node — AC-1.2 is asserted
  structurally, so the constraint cannot rot.
