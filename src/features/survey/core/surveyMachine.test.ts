import { describe, it, expect } from "vitest";
import {
  initialSurveyState,
  reduceSurvey,
  surveyProgressLabel,
  canSubmitSurvey,
  SURVEY_QUESTION_COUNT,
  type SurveyAnswerValue,
  type SurveyState,
} from "./surveyMachine";

const FULL_ANSWERS: readonly SurveyAnswerValue[] = [
  "very-likely",
  ["forecasting"],
  "some free text",
  "just-mine",
  "scrum-master-agile-coach",
  "linkedin",
];

const started = (): SurveyState =>
  reduceSurvey(initialSurveyState(), { type: "start" });

const answerThenNext = (
  state: SurveyState,
  value: SurveyAnswerValue,
): SurveyState =>
  reduceSurvey(reduceSurvey(state, { type: "answer", value }), { type: "next" });

const answerInOrder = (
  values: readonly SurveyAnswerValue[],
  state: SurveyState = started(),
): SurveyState => values.reduce(answerThenNext, state);

describe("surveyMachine (one question per screen)", () => {
  it("advances one question at a time from '1 of 6' to '6 of 6'", () => {
    let state = started();
    expect(state.phase).toBe("question");
    const labels: string[] = [];
    for (let i = 0; i < SURVEY_QUESTION_COUNT; i += 1) {
      labels.push(surveyProgressLabel(state));
      state = answerThenNext(state, FULL_ANSWERS[i]);
    }
    expect(labels).toEqual([
      "1 of 6",
      "2 of 6",
      "3 of 6",
      "4 of 6",
      "5 of 6",
      "6 of 6",
    ]);
    expect(canSubmitSurvey(state)).toBe(true);
  });

  it("going back to change an earlier answer preserves the other answers", () => {
    let state = started();
    state = answerThenNext(state, "very-likely");
    state = answerThenNext(state, ["forecasting"]);
    state = answerThenNext(state, "first text");

    state = reduceSurvey(reduceSurvey(state, { type: "back" }), {
      type: "answer",
      value: "changed text",
    });

    expect(state.answers[0]).toBe("very-likely");
    expect(state.answers[1]).toEqual(["forecasting"]);
    expect(state.answers[2]).toBe("changed text");
  });

  it("cannot submit before every required question is answered and jumps to the first gap", () => {
    const state = answerInOrder(["very-likely", ["forecasting"]]);
    expect(canSubmitSurvey(state)).toBe(false);

    const jumped = reduceSurvey(state, { type: "submit" });
    expect(jumped.phase).toBe("question");
    expect(jumped.currentIndex).toBe(3);
  });

  it("treats the optional free-text question as already satisfied", () => {
    const beforeText = answerInOrder(["very-likely", ["forecasting"]]);
    const afterText = reduceSurvey(beforeText, { type: "next" });
    const complete = answerInOrder(
      ["just-mine", "scrum-master-agile-coach", "linkedin"],
      afterText,
    );
    expect(canSubmitSurvey(complete)).toBe(true);
  });

  it("submit after every answer moves to the exchange step, then to submitting", () => {
    const exchange = reduceSurvey(answerInOrder(FULL_ANSWERS), {
      type: "submit",
    });
    expect(exchange.phase).toBe("exchange");

    const submitting = reduceSurvey(exchange, { type: "submit" });
    expect(submitting.phase).toBe("submitting");
    expect(submitting.answers).toEqual(FULL_ANSWERS);
  });

  it("back from the first question returns to the intro", () => {
    const back = reduceSurvey(started(), { type: "back" });
    expect(back.phase).toBe("intro");
  });
});
