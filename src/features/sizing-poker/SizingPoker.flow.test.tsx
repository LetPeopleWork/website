import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SizingPoker from "@/pages/SizingPoker";

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
    const target = screen.getByLabelText(/how fast should your items be done/i);
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

  it("offers a way out mid-round, so a wrong setting does not trap you", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await setUpRound(user, ["One", "Two", "Three"]);
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /start over/i }));

    expect(screen.getByTestId("sizing-config")).toBeInTheDocument();
    expect(screen.queryByTestId("sizing-run")).not.toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: /copy all three lists/i }));

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
