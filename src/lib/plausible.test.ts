import { beforeEach, describe, expect, it, vi } from "vitest";

const { init, initCalls, track } = vi.hoisted(() => {
  // jsdom has no ResizeObserver; the wrapper only starts the tracker where it exists.
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  // The wrapper calls init() once, when the module loads. Those calls are kept
  // outside the mock: vitest 5 resets mock state before each test.
  const initCalls: unknown[][] = [];
  return { init: vi.fn((...args: unknown[]) => void initCalls.push(args)), initCalls, track: vi.fn() };
});
vi.mock("@plausible-analytics/tracker", () => ({ init, track }));

import { canonicalUrl, trackDownload, trackEvent } from "./plausible";

describe("analytics wrapper", () => {
  beforeEach(() => track.mockClear());

  it("initialises the official tracker once, with automatic pageviews and engagement", () => {
    expect(initCalls).toHaveLength(1);
    expect(initCalls[0][0]).toEqual(
      expect.objectContaining({ domain: "letpeople.work", autoCapturePageviews: true }),
    );
  });

  it("reports every URL with a trailing slash so one page is one dashboard row", () => {
    expect(canonicalUrl("https://letpeople.work/lighthouse")).toBe("https://letpeople.work/lighthouse/");
    expect(canonicalUrl("https://letpeople.work/lighthouse/?for=portfolio#pricing")).toBe(
      "https://letpeople.work/lighthouse/?for=portfolio#pricing",
    );
    expect(canonicalUrl("https://letpeople.work/")).toBe("https://letpeople.work/");
  });

  it("applies the canonical URL to outgoing events, engagement included", () => {
    const { transformRequest } = initCalls[0][0] as {
      transformRequest: (payload: Record<string, string>) => { u: string };
    };
    expect(transformRequest({ n: "engagement", u: "https://letpeople.work/ai", d: "letpeople.work" }).u).toBe(
      "https://letpeople.work/ai/",
    );
  });

  it("sends custom event properties as strings, as the tracker requires", () => {
    trackEvent("Path chosen", { path: "portfolio", step: 2, first: true });
    expect(track).toHaveBeenCalledWith("Path chosen", {
      props: { path: "portfolio", step: "2", first: "true" },
      interactive: undefined,
    });
  });

  it("can mark an event as non-interactive so it does not affect bounce rate", () => {
    trackEvent("Section viewed", { section: "pricing" }, { interactive: false });
    expect(track).toHaveBeenCalledWith("Section viewed", {
      props: { section: "pricing" },
      interactive: false,
    });
  });

  it("normalises download properties", () => {
    trackDownload({ edition: "Standalone", platform: "Windows", format: ".EXE", source: "hero" });
    expect(track).toHaveBeenCalledWith("Download", {
      props: { edition: "standalone", platform: "windows", format: "exe", source: "hero" },
    });
  });
});

describe("analytics wrapper without a browser that supports it", () => {
  it("does not start the tracker and never throws", async () => {
    vi.resetModules();
    const saved = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    init.mockClear();
    track.mockClear();
    const mod = await import("./plausible");
    expect(init).not.toHaveBeenCalled();
    expect(() => mod.trackEvent("Anything")).not.toThrow();
    expect(track).not.toHaveBeenCalled();
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = saved;
  });
});
