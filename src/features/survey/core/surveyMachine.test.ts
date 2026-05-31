import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  initialSurveyState,
  reduceSurvey,
  surveyProgressLabel,
  canSubmitSurvey,
  SURVEY_QUESTION_COUNT,
  type SurveyState,
} from "./surveyMachine";

const answerInOrder = (
  values: readonly string[],
  start: SurveyState = reduceSurvey(initialSurveyState(), { type: "start" }),
): SurveyState =>
  values.reduce(
    (state, value) =>
      reduceSurvey(reduceSurvey(state, { type: "answer", value }), {
        type: "next",
      }),
    start,
  );

const optionStrings = () =>
  fc.array(fc.string({ minLength: 1 }), {
    minLength: SURVEY_QUESTION_COUNT,
    maxLength: SURVEY_QUESTION_COUNT,
  });

describe("surveyMachine (one question per screen)", () => {
  it("advances one question at a time from '1 of 4' to '4 of 4'", () => {
    let state = reduceSurvey(initialSurveyState(), { type: "start" });
    expect(state.phase).toBe("question");
    const labels: string[] = [];
    for (let i = 0; i < SURVEY_QUESTION_COUNT; i += 1) {
      labels.push(surveyProgressLabel(state));
      state = reduceSurvey(reduceSurvey(state, { type: "answer", value: "x" }), {
        type: "next",
      });
    }
    expect(labels).toEqual(["1 of 4", "2 of 4", "3 of 4", "4 of 4"]);
    expect(canSubmitSurvey(state)).toBe(true);
  });

  it("going back to change an earlier answer preserves the other answers", () => {
    let state = reduceSurvey(initialSurveyState(), { type: "start" });
    state = reduceSurvey(reduceSurvey(state, { type: "answer", value: "a" }), {
      type: "next",
    });
    state = reduceSurvey(reduceSurvey(state, { type: "answer", value: "b" }), {
      type: "next",
    });
    state = reduceSurvey(reduceSurvey(state, { type: "answer", value: "c" }), {
      type: "next",
    });

    state = reduceSurvey(reduceSurvey(state, { type: "back" }), {
      type: "answer",
      value: "z",
    });

    expect(state.answers[0]).toBe("a");
    expect(state.answers[1]).toBe("b");
    expect(state.answers[2]).toBe("z");
  });

  it("cannot submit before every question is answered and jumps to the first gap", () => {
    const state = answerInOrder(["a", "b"]);
    expect(canSubmitSurvey(state)).toBe(false);

    const jumped = reduceSurvey(state, { type: "submit" });
    expect(jumped.phase).toBe("question");
    expect(jumped.currentIndex).toBe(2);
  });

  it("submit after every answer moves to submitting with a full answer vector", () => {
    fc.assert(
      fc.property(optionStrings(), (values) => {
        const state = reduceSurvey(answerInOrder(values), { type: "submit" });
        expect(state.phase).toBe("submitting");
        expect(canSubmitSurvey(state)).toBe(true);
        expect(state.answers).toEqual(values);
      }),
    );
  });

  it("back from the first question returns to the intro", () => {
    const started = reduceSurvey(initialSurveyState(), { type: "start" });
    const back = reduceSurvey(started, { type: "back" });
    expect(back.phase).toBe("intro");
  });
});
