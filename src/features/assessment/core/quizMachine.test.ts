import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  initialState,
  reduce,
  progressLabel,
  canProduceResult,
  firstUnansweredIndex,
  type QuizState,
} from "./quizMachine";

const answerAll = (
  values: readonly number[],
  start: QuizState = reduce(initialState(), { type: "start" }),
): QuizState =>
  values.reduce(
    (state, value) =>
      reduce(reduce(state, { type: "answer", value }), { type: "next" }),
    start,
  );

const sixAnswers = () =>
  fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 6, maxLength: 6 });

describe("quizMachine (#2, #3, #6 + progress)", () => {
  it("#2 advances one question at a time from '1 of 6' to '6 of 6'", () => {
    let state = reduce(initialState(), { type: "start" });
    expect(state.phase).toBe("question");
    const labels: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      labels.push(progressLabel(state));
      state = reduce(reduce(state, { type: "answer", value: 1 }), {
        type: "next",
      });
    }
    expect(labels).toEqual([
      "1 of 6",
      "2 of 6",
      "3 of 6",
      "4 of 6",
      "5 of 6",
      "6 of 6",
    ]);
    expect(canProduceResult(state)).toBe(true);
  });

  it("#3 going back to change an earlier answer preserves the other answers", () => {
    let state = reduce(initialState(), { type: "start" });
    state = reduce(reduce(state, { type: "answer", value: 1 }), { type: "next" });
    state = reduce(reduce(state, { type: "answer", value: 2 }), { type: "next" });
    state = reduce(reduce(state, { type: "answer", value: 3 }), { type: "next" });

    state = reduce(reduce(state, { type: "back" }), { type: "answer", value: 0 });

    expect(state.answers[0]).toBe(1);
    expect(state.answers[1]).toBe(2);
    expect(state.answers[2]).toBe(0);
  });

  it("#6 a result cannot be produced before all six are answered", () => {
    const state = answerAll([1, 2]);
    expect(canProduceResult(state)).toBe(false);
    expect(firstUnansweredIndex(state)).toBe(2);

    const jumped = reduce(state, { type: "submit" });
    expect(jumped.phase).toBe("question");
    expect(jumped.currentIndex).toBe(2);
  });

  it("#6 submit after six answers moves to the teaser with a full answer vector", () => {
    fc.assert(
      fc.property(sixAnswers(), (values) => {
        const state = reduce(answerAll(values), { type: "submit" });
        expect(state.phase).toBe("teaser");
        expect(canProduceResult(state)).toBe(true);
        expect(state.answers).toEqual(values);
      }),
    );
  });

  it("restart returns to a fresh first question", () => {
    const completed = reduce(answerAll([3, 3, 3, 3, 3, 3]), { type: "submit" });
    const restarted = reduce(completed, { type: "restart" });
    expect(restarted.phase).toBe("question");
    expect(restarted.currentIndex).toBe(0);
    expect(restarted.answers.every((answer) => answer === null)).toBe(true);
  });
});
