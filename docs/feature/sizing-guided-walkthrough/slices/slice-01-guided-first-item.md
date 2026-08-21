# Slice 01 — Walked through the setup and the first item

**Goal:** Someone who has never done this clicks one button and is taken through
picking a number and answering their first item, on example work, without
supplying anything.

**Stories:** GW-1 · **Effort:** ~1 day · **Order:** first (walking skeleton)

---

## Learning hypothesis

> **Disproves if it fails:** that a guided first run is what stands between a
> cold visitor and understanding the mechanism. Two distinct failures:
>
> - *Ignored* — under 25% of intro views start the walkthrough. The help is not
>   wanted, or the entry point is invisible. Cheap to distinguish: move the
>   button once and re-measure before concluding anything about demand.
> - *Dead-ends* — people complete the walkthrough and then leave without running
>   a round on their own items. The tutorial is entertainment, not an on-ramp,
>   and the handover at the end is the thing to fix, not the teaching.
>
> **Confirms if it succeeds:** that the barrier was never the mechanism but the
> cold start — being asked for a number nobody had thought about before.

---

> **Amended 2026-08-21 (G17):** the guided round is three curated items — one
> specimen per answer — not the full example backlog. This slice covers entry,
> guided config, and item 1 (the free-reaction Yes); items 2 and 3 land with
> slice 02, whose first-"No" lesson is item 3's payoff.

## IN scope

- "Interactive Tutorial" entry point on the intro step, beside the normal start.
- Starting it loads the example backlog and a default number of days, no typing.
- Guided config step: one coach note, the days field visually emphasised.
- Guided first item: the question framed as Benji wrote it, plus a short note on
  answering by reaction rather than analysis.
- Advance on user action only. `Esc` (and a visible control) leaves guided mode
  with the round intact.
- `Tutorial started` / `Tutorial completed` events, and a `mode` flag on every
  existing sizing event so pace data stays separable. (G2)

## OUT of scope

- The first-"No" prompt (slice 02).
- Projection/facilitator affordances (slice 03, gated).
- Any overlay or spotlight layer. Guided is a flag on the existing steps. (G5)
- Persisting walkthrough progress across visits.

---

## Acceptance criteria

- AC-1.1 · AC-1.2 · AC-1.3 · AC-1.4 · AC-1.5 · AC-1.6 (see `feature-delta.md`)
- **Jargon gate:** the existing "no terminology before the wrap-up" test extends
  to every guided screen, including the coach notes. (G4)
- **Mode gate:** a test asserts every sizing analytics event carries `mode`, and
  that a guided round never emits an event without it. Without this, D5's
  evidence quietly rots. (G2)
- **Production data:** dogfooded with a real team, not just clicked through
  solo. Benji's claim that the example backlog carries a real conversation is
  the thing being tested.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — one coach panel plus a flag threaded through existing steps. |
| Depends on a new abstraction? | No, and G5 exists to keep it that way: no overlay engine. |
| Disproves a pre-commitment? | Yes — that the cold start, not the mechanism, is the barrier. |
| Synthetic data only? | The *content* is deliberately synthetic; the *usage* must not be. Real team, or the slice is not done. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

None technical. The parent feature ships all four phases already; this adds a
flag and a panel.

## Notes for DESIGN

- Guided state belongs in `roundMachine` as a field on `RoundState`, not a
  parallel container — the machine is already pure and tested, and a second
  source of truth for "which step am I on" is how these features rot.
- Coach copy lives in `sizingPokerContent.ts` under a `guided` key, zod-parsed
  at module load like everything else, so a jargon slip fails the build.
- Emphasis on a field is a ring/pulse class, not a positioned overlay. No
  measurement, no portal, works on a phone. (G5)
- Suggested first coach note, jargon-free and behavioural: *"How long does a
  typical item take once someone starts it? Not the longest, not the shortest,
  the one that would not surprise anyone. No idea? Try 10."*
