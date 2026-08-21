# Slice 03 — Make it survive a projector

**Goal:** A Scrum Master runs the example round in front of a team, on a shared
screen, without the page working against them.

**Stories:** GW-3 · **Effort:** ~0.5 day · **Order:** third

**Gate — deliberately not a metric.** Build this only after Benji's or Peter's
own team has actually run the walkthrough in a session. Whether a page is
usable in front of a room is not something analytics can tell you; someone has
to stand in front of the room. If that has not happened, this slice is not
ready, regardless of how the numbers look.

---

## Learning hypothesis

> **Disproves if it fails:** Benji's opening claim — that fake data is enough to
> produce a real team discussion. *"mit einem Team kannst du fast 'richtige'
> Diskussionen führen auch mit den Demo Daten."* If a team looks at the example
> items and shrugs, the whole premise of a walkthrough-as-facilitation-aid is
> wrong, and the honest conclusion is that this only ever works on the team's own
> backlog.
>
> **Confirms if it succeeds:** something more valuable than the slice itself —
> that the page can be handed to a Scrum Master as a ready-made session with zero
> preparation. That is a distribution mechanism, not a feature.

---

## IN scope

- Legibility at projection scale: the item title and the three answers stay the
  largest elements; nothing critical relies on hover.
- No advance without a user action anywhere in guided mode, so a facilitator can
  talk over any step. (G6)
- A test over `sampleItems` asserting the example backlog still spans items that
  provoke all three answers, so a future copy edit cannot quietly flatten the
  thing that makes the discussion work. (G1)

## OUT of scope

- A dedicated "presentation mode", full-screen toggle, or font-size control.
  Start by making the normal guided screens survive a projector; only add a mode
  if that genuinely fails.
- Anything multi-device. Parent D13 and D14 still bind.
- Facilitator notes or a script. If the round needs a script, the round is wrong.

---

## Acceptance criteria

- AC-3.1 · AC-3.2 · AC-3.3 (see `feature-delta.md`)
- **Production data:** at least one real team session, run by someone who is not
  the person who built it.
- **Dogfood:** a LetPeopleWork retro or refinement, with a written note of what
  the team actually argued about — that note is the evidence for G1, and it is
  worth more than the slice.

## Taste tests

| Test | Verdict |
|---|---|
| Ships 4+ new components? | No — mostly a legibility pass plus one data test. |
| Depends on a new abstraction? | No. |
| Disproves a pre-commitment? | Yes — Benji's fake-data-carries-real-discussion claim, which is the premise of the whole feature. |
| Synthetic data only? | The point of the slice is a real team on synthetic content. Acceptable and explicit. |
| Duplicate of another slice at different scale? | No. |

---

## Dependencies

Slices 01 and 02 shipped, and a real session run.

## Notes for DESIGN

- The reason fake data works here is worth stating plainly, because it is the
  insight that makes this a facilitation aid rather than a demo: **nobody has to
  defend their own estimate.** A team can practise disagreeing about whether
  something is too big when the item belongs to no one, and the social stakes
  that normally distort a first attempt are simply absent. That is why a retro is
  the right room for it.
- Resist the presentation-mode toggle until the plain screens have failed in an
  actual room. Most "projector mode" features are built for an imagined session
  rather than an observed one.
