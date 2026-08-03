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

const typeItems = async (user: ReturnType<typeof userEvent.setup>, lines: string[]) => {
  const box = screen.getByLabelText(/items you'd bring to refinement/i);
  await user.clear(box);
  await user.type(box, lines.join("\n"));
};

beforeEach(() => {
  trackEvent.mockClear();
});

describe("Sizing Poker round", () => {
  it("#AC-1.3 shows exactly one item at a time, and no other item is on screen", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["First item", "Second item"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));

    expect(screen.getByTestId("sizing-item")).toHaveTextContent("First item");
    expect(screen.queryByText("Second item")).not.toBeInTheDocument();
  });

  it("#AC-1.2 renders no text input anywhere in the voting view", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await user.click(screen.getByRole("button", { name: /start the round/i }));

    const run = screen.getByTestId("sizing-run");
    expect(run.querySelectorAll("input, textarea")).toHaveLength(0);
  });

  it("#AC-1.4 accepts the keyboard shortcuts and advances", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["First item", "Second item"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));

    await user.keyboard("1");
    expect(screen.getByTestId("sizing-item")).toHaveTextContent("Second item");
  });

  it("#AC-1.1 reports mean seconds per item from the driven clock", async () => {
    const user = userEvent.setup();
    const clock = makeClock();
    renderPage(clock.now);

    await typeItems(user, ["One", "Two"]);
    // round starts at t=0, last answer lands at t=8s -> 2 items, 4.0s each
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    clock.set(4_000);
    await user.keyboard("1");
    clock.set(8_000);
    await user.keyboard("1");

    expect(screen.getByTestId("sizing-seconds-per-item")).toHaveTextContent("4.0");
    expect(screen.getByTestId("sizing-result")).toHaveTextContent("2 items in 0:08 total");
  });

  it("#AC-1.5 lists the too-big items verbatim, with singular phrasing for one", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["Small thing", "Migrate the whole database"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("1");
    await user.keyboard("3");

    const findings = screen.getByTestId("sizing-findings");
    expect(findings).toHaveTextContent("Slice this one before anyone starts it");
    expect(within(findings).getByText("Migrate the whole database")).toBeInTheDocument();
  });

  it("#AC-1.5 uses plural phrasing for more than one too-big item", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["Big one", "Bigger one"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("3");
    await user.keyboard("3");

    expect(screen.getByTestId("sizing-findings")).toHaveTextContent(
      "Slice these 2 before anyone starts them",
    );
  });

  it("calls out a healthy backlog when everything fits", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["A", "B"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("1");
    await user.keyboard("1");

    expect(screen.getByTestId("sizing-findings")).toHaveTextContent("Everything fits");
  });

  it("#AC-1.6 never puts item titles into analytics", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["Commercially sensitive project name"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("3");

    expect(trackEvent).toHaveBeenCalledWith(
      "Sizing round completed",
      expect.objectContaining({ items: 1, too_big: 1 }),
    );
    expect(JSON.stringify(trackEvent.mock.calls)).not.toContain("Commercially sensitive");
  });

  it("#AC-4.1 starts with the default SLE without the visitor touching it", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    expect(screen.getByLabelText(/service level expectation/i)).toHaveValue(8);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    expect(screen.getByTestId("sizing-run")).toHaveTextContent("within 8 days");
  });

  it("refuses to start an empty round", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    const box = screen.getByLabelText(/items you'd bring to refinement/i);
    await user.clear(box);

    expect(screen.getByRole("button", { name: /start the round/i })).toBeDisabled();
    expect(screen.getByTestId("sizing-item-count")).toHaveTextContent("Add at least one item");
  });

  it("is marked noindex while unlisted, and does not leave the SPA noindex", async () => {
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

  it("returns to setup on restart and can run a second round", async () => {
    const user = userEvent.setup();
    renderPage(makeClock().now);

    await typeItems(user, ["Only item"]);
    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("1");
    await user.click(screen.getByRole("button", { name: /run another round/i }));

    expect(screen.getByTestId("sizing-setup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /start the round/i }));
    await user.keyboard("1");
    expect(screen.getByTestId("sizing-result")).toBeInTheDocument();
    expect(trackEvent.mock.calls.filter((c) => c[0] === "Sizing round completed")).toHaveLength(2);
  });
});
