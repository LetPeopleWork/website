# Slice 02 — Name the condition in one tap

> **SUPERSEDED 2026-08-04 (D13).** Group management, synchronous/asynchronous
> modes and secret voting belong in Lighthouse, not on the website page, which is
> deliberately a teaser rather than a feature-complete tool. Kept for the
> reasoning and the learning hypothesis, which still apply to the Lighthouse
> decision this page is meant to inform. Do not build from this brief as-is.

The guidance content shipped instead on the wrap-up under D11, without capturing structured conditions.

**Goal:** When the answer is "yes, if…", capture *what* would need to be true
without anyone typing, and aggregate it into a dependency finding.

**Stories:** US-2 · **Effort:** ~0.5 day · **Order:** second

**Gate:** only build if slice 01 shows the middle answer used on at least 10% of
items. Below that threshold, the middle answer is dead weight — see the kill
condition below.

---

## Learning hypothesis

> **Disproves if it fails:** that coupling is the valuable output of a sizing
> round (job `find-the-coupling`, and decision D3). Two distinct failures:
>
> - *Unused* — the middle answer stays under 10% of items. Then Benji's mechanism
>   is Lunar Logic's card deck with a timer bolted on, the one genuinely novel
>   part of it is imaginary, and we should say so publicly rather than ship it.
> - *Miscategorised* — the middle answer is used, but the preset chips do not
>   cover what people mean. The taxonomy is wrong and needs re-deriving from real
>   rounds, not from the four categories we guessed in this document.
>
> **Confirms if it succeeds:** that a sizing round doubles as a dependency scan,
> which is a finding no competing tool produces and the strongest reason for this
> page to exist at all.

---

## IN scope

- Choosing the middle answer reveals a chip row and hides the three main answers.
- Four chips: *a specific person* · *pairing* · *a decision first* · *another team*.
  Selectable by click or number key; selecting one advances immediately.
- Result screen aggregates by condition type with counts, phrased as a system
  finding ("3 of your 12 items depend on something outside the team"), never
  naming an individual.
- Condition-type distribution added to the completion event as bucketed counts.

## OUT of scope

- Free text on any chip, including an "other" chip — "other" records only that it
  was other. A text field here is the single fastest way to reintroduce the
  deliberation D4 exists to prevent.
- Editing or revisiting a condition after advancing.
- Per-person attribution of a condition.

---

## Acceptance criteria

- AC-2.1 · AC-2.2 · AC-2.3 · AC-2.4 (see `feature-delta.md`)
- **Production data:** chip distribution measured over at least three real rounds
  from at least two different teams before the taxonomy is considered settled.
- **Dogfood:** same-day use in a LetPeopleWork session; record which chip was
  reached for most, and whether anyone asked for one that does not exist.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — one chip row plus a result aggregation. |
| Depends on a new abstraction? | No — extends slice 01's reducer with one field. |
| Disproves a pre-commitment? | Yes — D3, the claim that the middle answer is the invention. |
| Synthetic data only? | No — three real rounds, two teams. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

Slice 01 shipped, and its middle-bucket usage measured. This gate is the point of
the slice order — do not build the chips on the assumption the bucket gets used.

## Notes for DESIGN

- The chip vocabulary is structural on purpose. "A specific person" not "Sarah";
  the aggregate reads as a system property, which is what makes it usable in a
  steering conversation without it landing as blame (job `find-the-coupling`,
  anxiety force).
- Hiding the three main answers while the chips are up is deliberate: it makes the
  follow-up non-optional without adding a validation error, and it keeps exactly
  one decision on screen at a time.
