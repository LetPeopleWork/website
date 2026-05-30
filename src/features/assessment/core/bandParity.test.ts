import { describe, it, expect } from "vitest";
import { bandOfScore as coreBandOfScore } from "./scoring";
import { bandOfScore as sharedBandOfScore } from "@shared/bands";

describe("band-range parity between the website scoring core and supabase/_shared/bands", () => {
  it("agrees on the band for every score across the whole 0-100 range", () => {
    const divergences = Array.from({ length: 101 }, (_, score) => score).filter(
      (score) => coreBandOfScore(score) !== sharedBandOfScore(score),
    );
    expect(divergences).toEqual([]);
  });
});
