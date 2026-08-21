# Slice 02 — Teach what a "No" is for, once

**Goal:** The first time a learner answers "No" in guided mode, show them that
the answer is the start of a conversation about slicing, not a label to record.

**Stories:** GW-2 · **Effort:** ~0.5 day · **Order:** second

**Gate:** only build once slice 01 shows people reaching the round at all. A
prompt on the first "No" is worthless if nobody gets past the setup.

---

## Learning hypothesis

> **Disproves if it fails:** that the "No" answer needs teaching at all. If
> people dismiss the prompt in under three seconds, or their later answers are
> indistinguishable from a control run, then "too big → slice it" was already
> obvious and the prompt is just an interruption. That is a real possible
> outcome and the honest response is to delete it, not to make it prettier.
>
> **Confirms if it succeeds:** that the middle and "No" answers carry a meaning
> people do not arrive with — which is also the strongest available evidence for
> the parent feature's D3 claim that the answers, not the speed, are the
> invention.

---

## IN scope

- On the first "No" of a guided round only: a short prompt asking what would
  make it a yes, naming splitting and "does someone specific need to be free" as
  the two usual answers.
- Dismissable in one action. Captures nothing.
- Never fires outside guided mode.

## OUT of scope

- Capturing the answer. This teaches; it does not collect. Capturing is the
  parent feature's shelved `slice-02-conditions`, superseded twice and still
  superseded.
- A prompt on "Maybe". One lesson per walkthrough; two is a lecture.
- Repeating on later "No" answers. Benji: *"beim ersten Mal."*

---

## Acceptance criteria

- AC-2.1 · AC-2.2 · AC-2.3 (see `feature-delta.md`)
- A test asserts the prompt cannot render when `mode` is normal — this is the
  guard on D4 and D11, and it is the one thing about this slice that could
  damage the parent feature if it leaked.
- **Production data:** observed with a real team, watching whether the prompt
  starts a conversation or gets waved away.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — one prompt. |
| Depends on a new abstraction? | No; slice 01 established guided mode. |
| Disproves a pre-commitment? | Yes — that the answers carry non-obvious meaning (D3). |
| Synthetic data only? | Content synthetic, usage must be real. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

Slice 01 shipped, and people observed reaching the round.

## Notes for DESIGN

- The prompt is the third home this idea has been offered. It works here and not
  in the other two because teaching is the declared purpose of the mode — see
  G3, and D11/D17 in the parent for why it stays out of a normal round.
- Wording should name the two moves and stop: *"What would make this a yes?
  Could it be split into something smaller? Does someone specific need to be
  free?"* No third option, no free-text box.
