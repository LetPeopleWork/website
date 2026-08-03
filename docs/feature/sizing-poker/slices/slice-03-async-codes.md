# Slice 03 — Async by shareable code

**Goal:** Everyone answers independently, shares a short code, and the team
discusses only the items where they actually disagreed.

**Stories:** US-3 · **Effort:** ~1 day · **Order:** third

---

## Learning hypothesis

> **Disproves if it fails:** that asynchronous sizing beats a synchronous session
> — Benji's explicitly stated preference. Two distinct failures:
>
> - *Pointless* — participants agree on more than ~90% of items. Then the compare
>   step is ceremony over a foregone conclusion, and one person sizing on a shared
>   screen is strictly better. Benji's preference would be wrong, and cheaply so.
> - *Unused* — codes do not get pasted back. The handoff through Slack is too much
>   friction, and async needs real shared state (a backend) or should be dropped.
>
> **Confirms if it succeeds:** that a distributed team can skip the meeting for
> most items and arrive with a three-item agenda — which is a bigger time saving
> than the per-item speed gain slice 01 measures.

---

## IN scope

- On completing a round, a short base-36 code encoding that participant's answers
  for that item list (12 items = 3^12 = 531,441, fits in 4 characters).
- A compare box accepting two or more codes; renders per-item agreement, flagging
  split items and any item where anyone answered "no".
- Mismatched-list detection: a code from a different item list is rejected with a
  clear message, never silently misread.
- Result copy that names the payoff: "3 of 12 items split the room. Discuss those."

## OUT of scope

- Any server, room, or stored session. The code *is* the transport. (D6)
- Identity — codes are anonymous; the compare view shows counts, not who voted what.
- Merging or resolving disagreements in the tool. It sets the agenda; the team has
  the conversation.

---

## Acceptance criteria

- AC-3.1 · AC-3.2 · AC-3.3 · AC-3.4 (see `feature-delta.md`)
- Round-trip property test (`fast-check` is already available): for any item list
  and any answer sequence, `decode(encode(answers)) === answers`.
- **Production data:** at least one real distributed team runs a full async cycle
  — independent rounds, codes into Slack, facilitator compares — without a
  LetPeopleWork person walking them through it.
- **Dogfood:** used for a real LetPeopleWork refinement, async, same week.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — a code display and a compare view. |
| Depends on a new abstraction? | Yes — the codec. It ships *inside* this slice with its own property tests, not ahead of it as scaffolding. |
| Disproves a pre-commitment? | Yes — Benji's stated preference for async over synchronous. |
| Synthetic data only? | No — a real distributed team, unassisted. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

Slices 01 and 02 shipped — the code must encode the condition chip, so the chip
taxonomy needs to be settled before the encoding is fixed. Changing the alphabet
after codes are in circulation breaks AC-3.4.

## Notes for DESIGN

- Codec lives in `core/roundCode.ts`, pure, property-tested. Include a short hash
  of the normalised item list in the code so AC-3.4 is decidable offline.
- Version the code format from the first release (a leading character), so the
  chip taxonomy can grow later without silently misreading old codes.
- This slice is the one place a backend would be the obvious alternative. It is
  deliberately not taken (D6) — but if the *unused* failure mode above fires, that
  is the evidence that would justify revisiting it, and Supabase is already wired
  into this repo for the assessment.
