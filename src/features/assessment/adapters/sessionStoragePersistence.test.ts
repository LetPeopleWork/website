import { describe, it, expect, beforeEach } from "vitest";
import { createSessionStoragePersistence } from "./sessionStoragePersistence";

describe("sessionStorage persistence (#4 resume, #5 gentle restart)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("#4 round-trips a partial answer draft so a refresh can resume", () => {
    const persistence = createSessionStoragePersistence();
    persistence.save([0, 1, 2, 3, null, null]);

    expect(persistence.load()).toEqual([0, 1, 2, 3, null, null]);
  });

  it("#5 returns null when there is no draft so the visitor restarts gently", () => {
    const persistence = createSessionStoragePersistence();
    expect(persistence.load()).toBeNull();
  });

  it("#5 returns null and self-heals when the stored draft is corrupt", () => {
    sessionStorage.setItem(
      "assessment.answers.v1",
      "{ this is not valid json",
    );
    const persistence = createSessionStoragePersistence();

    expect(persistence.load()).toBeNull();
    expect(sessionStorage.getItem("assessment.answers.v1")).toBeNull();
  });

  it("rejects a draft whose shape is not six 0-3-or-null answers", () => {
    sessionStorage.setItem(
      "assessment.answers.v1",
      JSON.stringify([9, 9, 9]),
    );
    const persistence = createSessionStoragePersistence();

    expect(persistence.load()).toBeNull();
  });

  it("clear removes the draft", () => {
    const persistence = createSessionStoragePersistence();
    persistence.save([1, 1, 1, 1, 1, 1]);
    persistence.clear();

    expect(persistence.load()).toBeNull();
  });
});
