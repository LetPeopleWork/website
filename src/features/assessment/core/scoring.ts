export type AnswerOrdinal = 0 | 1 | 2 | 3;

export type Answers = readonly [
  AnswerOrdinal,
  AnswerOrdinal,
  AnswerOrdinal,
  AnswerOrdinal,
  AnswerOrdinal,
  AnswerOrdinal,
];

export type BandName =
  | "Flying blind"
  | "Drifting"
  | "Flow-aware"
  | "Predictable";

export interface ScoreResult {
  readonly rawSum: number;
  readonly score: number;
  readonly band: BandName;
}

interface BandRange {
  readonly min: number;
  readonly max: number;
  readonly name: BandName;
}

const BAND_RANGES: readonly BandRange[] = [
  { min: 0, max: 25, name: "Flying blind" },
  { min: 26, max: 50, name: "Drifting" },
  { min: 51, max: 75, name: "Flow-aware" },
  { min: 76, max: 100, name: "Predictable" },
];

export const QUESTION_COUNT = 6;
const MAX_RAW_SUM = QUESTION_COUNT * 3;

export const bandOfScore = (value: number): BandName => {
  const match = BAND_RANGES.find(
    (range) => value >= range.min && value <= range.max,
  );
  if (!match) {
    throw new RangeError(`Score ${value} is outside the 0-100 band table`);
  }
  return match.name;
};

export const score = (answers: readonly number[]): ScoreResult => {
  const rawSum = answers.reduce((sum, answer) => sum + answer, 0);
  const normalized = Math.round((rawSum / MAX_RAW_SUM) * 100);
  return { rawSum, score: normalized, band: bandOfScore(normalized) };
};
