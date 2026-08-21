import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SizingPoker from "@/pages/SizingPoker";
import { sizingPokerContent } from "@/features/sizing-poker/content/sizingPokerContent";

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/plausible", () => ({ trackEvent, default: {} }));

/**
 * A clock the test steps explicitly. It must not auto-advance on read: the
 * running view also calls now() to paint its timer, so a self-advancing clock
 * would move by an amount that depends on how often React re-renders.
 */
const makeClock = () => {
  const clock = { t: 0 };
  return { now: () => clock.t, set: (ms: number) => (clock.t = ms) };
};

const renderPage = (now: () => number) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/sizing-poker"]}>
        <SizingPoker now={now} />
      </MemoryRouter>
    </HelmetProvider>,
  );

type User = ReturnType<typeof userEvent.setup>;

/** Intro -> config, then fill in the round. */
const setUpRound = async (user: User, items: string[], targetDays?: string) => {
  await user.click(screen.getByRole("button", { name: /try it out/i }));
  if (targetDays) {
    const target = screen.getByLabelText(/how quickly should an item normally be done/i);
    await user.clear(target);
    await user.type(target, targetDays);
  }
  await user.type(screen.getByLabelText(/which items do you want to size/i), items.join("\n"));
  await user.click(screen.getByRole("button", { name: /start sizing/i }));
};

beforeEach(() => {
  trackEvent.mockClear();
});

describe("the way in", () => {
  it("opens on a short intro, not on a form", () => {
    renderPage(makeClock().now);

    expect(screen.getByTestId("sizing-intro")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-config")).not.toBeInTheDocument();
  });

  it("keeps the intro under 50 words, since the first reviewer skipped past it unread", () => {
    renderPage(makeClock().now);

    const words = screen.getByTestId("sizing-intro").textContent!.trim().split(/\s+/).length;
    expect(words).toBeLessThan(50);
  });

  it("never says SLE, cycle time or percentile before the wrap-up", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    const jargon = /service level expectation|\bSLE\b|cycle time|percentile|85%/i;
    expect(screen.getByTestId("sizing-intro").textContent).not.toMatch(jargon);

    await user.click(screen.getByRole("button", { name: /try it out/i }));
    expect(screen.getByTestId("sizing-config").textContent).not.toMatch(jargon);

    await user.type(screen.getByLabelText(/which items do you want to size/i), "One thing");
    await user.click(screen.getByRole("button", { name: /start sizing/i }));
    expect(screen.getByTestId("sizing-run").textContent).not.toMatch(jargon);
  });

  it("tells the facilitator to collect answers simultaneously, before the round", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await user.click(screen.getByRole("button", { name: /try it out/i }));

    // The page cannot enforce independent answers on a shared screen, so it
    // says so where reading is free. Not during the round: a countdown per item
    // would fix anchoring but inflate the seconds-per-item claim. See D14.
    expect(screen.getByTestId("sizing-facilitation-hint")).toHaveTextContent(
      /at the same time/i,
    );
  });

  it("offers an example backlog so nobody has to invent one", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await user.click(screen.getByRole("button", { name: /try it out/i }));
    expect(screen.getByTestId("sizing-item-count")).toHaveTextContent("Add at least one item");

    await user.click(screen.getByRole("button", { name: /use an example backlog/i }));
    expect(screen.getByTestId("sizing-item-count")).toHaveTextContent("8 items ready");
  });
});

describe("the round", () => {
  it("#AC-1.3 shows exactly one item at a time, and no other item is on screen", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["First item", "Second item"]);

    expect(screen.getByTestId("sizing-item")).toHaveTextContent("First item");
    expect(screen.queryByText("Second item")).not.toBeInTheDocument();
  });

  it("#AC-1.2 renders no text input anywhere in the voting view", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One thing"]);

    const run = screen.getByTestId("sizing-run");
    expect(run.querySelectorAll("input, textarea")).toHaveLength(0);
  });

  it("#AC-1.4 accepts the keyboard shortcuts and advances", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["First item", "Second item"]);
    await user.keyboard("1");

    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Second item");
  });

  it("keeps the results when a round stops early: planned ten, sized five", async () => {
    const user = userEvent.setup();
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
    renderPage(makeClock().now);

    await setUpRound(user, items);
    await user.keyboard("1");
    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /finish early/i }));

    // Running out of time is the ordinary way a session ends. The five answers
    // are a real result and must survive.
    const result = screen.getByTestId("sizing-result");
    expect(result).toHaveTextContent("5 of 10 items sized");
    expect(within(screen.getByTestId("sizing-list-ready")).getAllByRole("listitem")).toHaveLength(3);
    expect(within(screen.getByTestId("sizing-list-maybe")).getAllByRole("listitem")).toHaveLength(1);
    expect(within(screen.getByTestId("sizing-list-toobig")).getAllByRole("listitem")).toHaveLength(1);
  });

  it("lists what it never reached, so the next round knows where to start", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["Done one", "Done two", "Never reached", "Also not reached"]);
    await user.keyboard("1");
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /finish early/i }));

    const unsized = screen.getByTestId("sizing-list-unsized");
    expect(within(unsized).getByText("Never reached")).toBeInTheDocument();
    expect(within(unsized).getByText("Also not reached")).toBeInTheDocument();
    expect(within(unsized).queryByText("Done one")).not.toBeInTheDocument();
  });

  it("does not claim a pace on a partial round", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One", "Two", "Three"]);
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /finish early/i }));

    const result = screen.getByTestId("sizing-result");
    expect(result).toHaveTextContent(/Stopped early/i);
    expect(result).not.toHaveTextContent(/faster than estimating/i);
  });

  it("goes back to config when nothing has been answered yet", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One", "Two", "Three"]);
    // Nothing answered, so there is no result to show: this is the wrong-target
    // escape hatch, and it reads as such.
    await user.click(screen.getByRole("button", { name: /start over/i }));

    expect(screen.getByTestId("sizing-config")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-result")).not.toBeInTheDocument();
  });

  it("includes the unsized items in the copied summary", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    renderPage(makeClock().now);

    await setUpRound(user, ["Sized thing", "Left over"]);
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /finish early/i }));
    await user.click(screen.getByRole("button", { name: /copy the lists/i }));

    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain("1 of 2 items sized");
    expect(copied).toContain("Not sized yet");
    expect(copied).toContain("Left over");
  });

  it("has no way to revisit a previous answer, which would be deliberation", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One", "Two"]);
    await user.keyboard("1");

    const run = screen.getByTestId("sizing-run");
    expect(within(run).queryByRole("button", { name: /^back$/i })).not.toBeInTheDocument();
    expect(within(run).queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
  });

  it("asks the question in the visitor's own number of days", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One thing"], "21");

    expect(screen.getByTestId("sizing-run")).toHaveTextContent("Doable in 21 days or less?");
  });
});

describe("the wrap-up", () => {
  it("#AC-1.1 reports mean seconds per item from the driven clock", async () => {
    const user = userEvent.setup();
    const clock = makeClock();
    renderPage(clock.now);

    await setUpRound(user, ["One", "Two"]);
    // round starts at t=0, last answer lands at t=8s -> 2 items, 4.0s each
    clock.set(4_000);
    await user.keyboard("1");
    clock.set(8_000);
    await user.keyboard("1");

    expect(screen.getByTestId("sizing-seconds-per-item")).toHaveTextContent("4.0");
    expect(screen.getByTestId("sizing-result")).toHaveTextContent("2 items in 0:08 total");
  });

  it("splits the items into three actionable lists a PO can act on", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["Ready thing", "Blocked thing", "Huge thing"]);
    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");

    expect(within(screen.getByTestId("sizing-list-ready")).getByText("Ready thing")).toBeInTheDocument();
    expect(within(screen.getByTestId("sizing-list-maybe")).getByText("Blocked thing")).toBeInTheDocument();
    expect(within(screen.getByTestId("sizing-list-toobig")).getByText("Huge thing")).toBeInTheDocument();
  });

  it("hides a list that has no items in it", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["A", "B"]);
    await user.keyboard("1");
    await user.keyboard("1");

    expect(screen.getByTestId("sizing-list-ready")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-list-maybe")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sizing-list-toobig")).not.toBeInTheDocument();
  });

  it("only now introduces the terminology, and points at Lighthouse for both questions", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One thing"]);
    await user.keyboard("1");

    const nextSteps = screen.getByTestId("sizing-next-steps");
    expect(nextSteps).toHaveTextContent(/Service Level Expectation/i);
    expect(nextSteps).toHaveTextContent(/Work Item Age/i);
    expect(within(nextSteps).getAllByRole("link")).toHaveLength(2);
  });

  it("copies all three lists as plain text for the PO's tracker", async () => {
    const user = userEvent.setup();
    // Defined after setup() on purpose: userEvent installs its own clipboard
    // stub, so a mock defined before this line gets silently overwritten.
    // navigator.clipboard is also getter-only in jsdom, hence defineProperty.
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    renderPage(makeClock().now);

    await setUpRound(user, ["Ready thing", "Huge thing"]);
    await user.keyboard("1");
    await user.keyboard("3");
    await user.click(screen.getByRole("button", { name: /copy the lists/i }));

    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain("Ready to go");
    expect(copied).toContain("Ready thing");
    expect(copied).toContain("Huge thing");
  });

  it("#AC-1.6 never puts item titles into analytics", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["Commercially sensitive project name"]);
    await user.keyboard("3");

    expect(trackEvent).toHaveBeenCalledWith(
      "Sizing round completed",
      expect.objectContaining({ items: 1, needs_work: 1 }),
    );
    expect(JSON.stringify(trackEvent.mock.calls)).not.toContain("Commercially sensitive");
  });

  it("returns to config, not the intro, when running a second round", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["Only item"]);
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /run another round/i }));

    expect(screen.getByTestId("sizing-config")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-intro")).not.toBeInTheDocument();
  });
});

describe("staying unlisted", () => {
  it("is marked noindex, and does not leave the SPA noindex", async () => {
    const { unmount } = renderPage(makeClock().now);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    unmount();

    // Any normal page rendering afterwards must put the tag back, otherwise one
    // visit to an unlisted route would deindex the whole client-rendered site.
    const { default: SEO } = await import("@/components/SEO");
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Normal page" />
        </MemoryRouter>
      </HelmetProvider>,
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
  });
});

describe("the walkthrough (G8-G18)", () => {
  const startWalkthrough = async (user: User) => {
    await user.click(screen.getByRole("button", { name: /walk me through it/i }));
    await user.click(screen.getByRole("button", { name: /start sizing/i }));
  };

  it("G8/G9: sits beside the normal start, and does not displace it", () => {
    renderPage(makeClock().now);

    expect(screen.getByRole("button", { name: /try it out/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /walk me through it/i })).toBeInTheDocument();
  });

  it("G15: guided config shows one focused control and no items form", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await user.click(screen.getByRole("button", { name: /walk me through it/i }));

    const config = screen.getByTestId("sizing-config");
    expect(config.querySelectorAll("textarea")).toHaveLength(0);
    expect(screen.getByTestId("guided-ring")).toBeInTheDocument();
    expect(screen.getByTestId("guided-confirmation")).toHaveTextContent(/three of its items/i);
    expect(screen.getByTestId("walkthrough-bar")).toBeInTheDocument();
  });

  it("G17: sizes exactly three curated items, all drawn from the example backlog", async () => {
    const { guided, sampleItems } = sizingPokerContent;
    expect(guided.items).toHaveLength(3);
    guided.items.forEach((entry) => expect(sampleItems).toContain(entry.title));
  });

  it("G16/G12: item 1 carries the noticing aside below, item 2 the nudge above", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);

    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Add CSV export");
    expect(screen.getByTestId("guided-note-after")).toHaveTextContent(/notice what makes you think/i);
    expect(screen.queryByTestId("guided-note-before")).not.toBeInTheDocument();

    await user.keyboard("1");
    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Rework the onboarding");
    expect(screen.getByTestId("guided-note-before")).toHaveTextContent(/who it needs/i);
    expect(screen.queryByTestId("guided-note-after")).not.toBeInTheDocument();
  });

  it("G3: the first No replaces the answers with the lesson, once, and Got it finishes the arc", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);

    await user.keyboard("1"); // yes on the reflex item
    await user.keyboard("2"); // maybe on the dependency
    await user.keyboard("3"); // no on the big one -> lesson

    const lesson = screen.getByTestId("guided-lesson");
    expect(lesson).toHaveTextContent(/you said no/i);
    expect(lesson).toHaveTextContent(/split into something smaller/i);
    // The answers are gone while the lesson is up.
    expect(screen.queryByRole("button", { name: /^yes/i })).not.toBeInTheDocument();
    // Mashing keys cannot skip it.
    await user.keyboard("1");
    expect(screen.getByTestId("guided-lesson")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /got it/i }));
    expect(screen.getByTestId("guided-ending")).toBeInTheDocument();
  });

  it("G10: the guided ending shows the three lists but never a pace", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);
    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");
    await user.click(screen.getByRole("button", { name: /got it/i }));

    const ending = screen.getByTestId("guided-ending");
    expect(screen.queryByTestId("sizing-seconds-per-item")).not.toBeInTheDocument();
    expect(ending).not.toHaveTextContent(/seconds per item/i);
    expect(screen.getByTestId("guided-list-ready")).toHaveTextContent("Add CSV export");
    expect(screen.getByTestId("guided-list-maybe")).toHaveTextContent("Rework the onboarding");
    expect(screen.getByTestId("guided-list-toobig")).toHaveTextContent("Migrate the reporting");
    expect(screen.getByTestId("guided-handover")).toHaveTextContent(/your own backlog/i);
  });

  it("the handover leads to a clean normal config, ready for the visitor's items", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);
    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");
    await user.click(screen.getByRole("button", { name: /got it/i }));
    await user.click(screen.getByRole("button", { name: /size my own items/i }));

    expect(screen.getByTestId("sizing-config")).toBeInTheDocument();
    expect(screen.queryByTestId("walkthrough-bar")).not.toBeInTheDocument();
    // The example items never leaked into the visitor's own textarea.
    expect(screen.getByLabelText(/which items do you want to size/i)).toHaveValue("");
  });

  it("G11: Escape exits the coaching but keeps the round exactly where it was", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);
    await user.keyboard("1");
    await user.keyboard("{Escape}");

    expect(screen.queryByTestId("walkthrough-bar")).not.toBeInTheDocument();
    expect(screen.getByTestId("sizing-run")).toBeInTheDocument();
    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Rework the onboarding");
  });

  it("G10 survives an exit: a round that began guided still ends without a pace", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);
    await user.keyboard("{Escape}");
    await user.keyboard("1");
    await user.keyboard("1");
    await user.keyboard("1");

    expect(screen.getByTestId("guided-ending")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-seconds-per-item")).not.toBeInTheDocument();
  });

  it("G2: guided analytics are separable, and a normal round says so too", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await startWalkthrough(user);
    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");
    await user.click(screen.getByRole("button", { name: /got it/i }));

    expect(trackEvent).toHaveBeenCalledWith("Walkthrough started");
    expect(trackEvent).toHaveBeenCalledWith("Sizing round started", { items: 3, mode: "guided" });
    expect(trackEvent).toHaveBeenCalledWith(
      "Sizing round completed",
      expect.objectContaining({ mode: "guided" }),
    );
    expect(trackEvent).toHaveBeenCalledWith("Walkthrough completed");

    trackEvent.mockClear();
    await user.click(screen.getByRole("button", { name: /size my own items/i }));
    await user.type(screen.getByLabelText(/which items do you want to size/i), "My real item");
    await user.click(screen.getByRole("button", { name: /start sizing/i }));
    await user.keyboard("1");

    expect(trackEvent).toHaveBeenCalledWith("Sizing round started", { items: 1, mode: "normal" });
    expect(trackEvent).toHaveBeenCalledWith(
      "Sizing round completed",
      expect.objectContaining({ mode: "normal" }),
    );
  });

  it("G4: no jargon on any guided screen, lesson and ending included", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    const jargon = /service level expectation|\bSLE\b|cycle time|percentile|85%|kanban/i;

    await user.click(screen.getByRole("button", { name: /walk me through it/i }));
    expect(screen.getByTestId("sizing-config").textContent).not.toMatch(jargon);

    await user.click(screen.getByRole("button", { name: /start sizing/i }));
    expect(screen.getByTestId("sizing-run").textContent).not.toMatch(jargon);

    await user.keyboard("1");
    await user.keyboard("2");
    await user.keyboard("3");
    expect(screen.getByTestId("guided-lesson").textContent).not.toMatch(jargon);

    await user.click(screen.getByRole("button", { name: /got it/i }));
    expect(screen.getByTestId("guided-ending").textContent).not.toMatch(jargon);
  });
});

describe("G19: the walkthrough guarantees all three answers", () => {
  it("a wrong answer gets a coach reply and the item waits for the right one", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);
    await user.click(screen.getByRole("button", { name: /walk me through it/i }));
    await user.click(screen.getByRole("button", { name: /start sizing/i }));

    // Item 1 teaches Yes; try No.
    await user.keyboard("3");
    expect(screen.getByTestId("guided-redirect")).toHaveTextContent(/click yes/i);
    // Not recorded: still on item 1, and no lesson hijacked by the wrong No.
    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Add CSV export");
    expect(screen.queryByTestId("guided-lesson")).not.toBeInTheDocument();

    // The target answer clears the note and moves on.
    await user.keyboard("1");
    expect(screen.queryByTestId("guided-redirect")).not.toBeInTheDocument();
    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Rework the onboarding");
  });

  it("the redirect copy carries no jargon either", async () => {
    const jargon = /service level expectation|\bSLE\b|cycle time|percentile|85%|kanban/i;
    sizingPokerContent.guided.items.forEach((entry) => {
      expect(entry.redirect).not.toMatch(jargon);
    });
  });
});
