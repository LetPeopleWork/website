export type BandName =
  | "Flying blind"
  | "Drifting"
  | "Flow-aware"
  | "Predictable";

export interface BandRange {
  readonly name: BandName;
  readonly min: number;
  readonly max: number;
}

export const BAND_RANGES: readonly BandRange[] = [
  { name: "Flying blind", min: 0, max: 25 },
  { name: "Drifting", min: 26, max: 50 },
  { name: "Flow-aware", min: 51, max: 75 },
  { name: "Predictable", min: 76, max: 100 },
];

export const bandOfScore = (value: number): BandName | null => {
  const match = BAND_RANGES.find(
    (range) => value >= range.min && value <= range.max,
  );
  return match ? match.name : null;
};

export const isScoreInRange = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= 100;

export const bandMatchesScore = (score: number, band: string): boolean =>
  isScoreInRange(score) && bandOfScore(score) === band;
