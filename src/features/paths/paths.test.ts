import { afterEach, describe, expect, it } from "vitest";
import {
  PATHS,
  findPath,
  lighthouseHref,
  lighthouseQuestionHref,
  pathFromSearch,
  questionFromSearch,
  writePathToUrl,
} from "./paths";

describe("question tab links", () => {
  it("opens a named question tab from ?question=, and ignores unknown ones", () => {
    expect(questionFromSearch("?question=refine")).toBe("refine");
    expect(questionFromSearch("?question=nonsense")).toBeUndefined();
    expect(questionFromSearch("")).toBeUndefined();
    expect(lighthouseQuestionHref("refine")).toBe("/lighthouse?question=refine#lighthouse-overview");
  });

  it("offers the install video where hosting is the question", () => {
    expect(findPath("security")!.video?.key).toBe("install");
  });
});

describe("situation paths", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("labels every chip as a situation in the first person, not a job title", () => {
    for (const path of PATHS) {
      expect(path.chip).toMatch(/^I/);
      expect(path.chip).not.toMatch(/scrum master|manager|developer|engineer/i);
    }
  });

  it("keeps each subhead short enough to read in the hero", () => {
    for (const path of PATHS) {
      expect(path.subhead.split(/\s+/).length).toBeLessThanOrEqual(40);
    }
  });

  it("reads a known ?for= value and ignores anything else", () => {
    expect(pathFromSearch("?for=portfolio")?.key).toBe("portfolio");
    expect(pathFromSearch("?for=nonsense")).toBeUndefined();
    expect(pathFromSearch("")).toBeUndefined();
    expect(findPath(null)).toBeUndefined();
  });

  it("writes the choice into the URL without adding history, and keeps the hash", () => {
    window.history.replaceState(null, "", "/#home");
    const before = window.history.length;
    writePathToUrl("security");
    expect(window.location.search).toBe("?for=security");
    expect(window.location.hash).toBe("#home");
    expect(window.history.length).toBe(before);
    writePathToUrl(undefined);
    expect(window.location.search).toBe("");
  });

  it("links each situation to the section on /lighthouse that answers it", () => {
    expect(lighthouseHref(findPath("security")!)).toBe("/lighthouse?for=security#where-it-runs");
    expect(lighthouseHref(findPath("team")!)).toBe("/lighthouse?for=team#lighthouse-overview");
  });
});
