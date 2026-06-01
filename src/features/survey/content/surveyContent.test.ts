import { describe, it, expect } from "vitest";
import {
  surveyContent,
  SURVEY_QUESTIONS,
  SURVEY_CHOICE_QUESTIONS,
} from "./surveyContent";
import { surveyAnswersSchema } from "../core/answers";

const NO_SCORING_KEYS = ["band", "raw_sum", "rawSum", "score"];

describe("survey content config", () => {
  it("loads the six confirmed questions in feedback-first order", () => {
    expect(SURVEY_QUESTIONS.map((question) => question.id)).toEqual([
      "recommend",
      "primary-use",
      "improvement",
      "team-count",
      "role",
      "discovery-channel",
    ]);
  });

  it("models a single-select, a multiselect, and a free-text question", () => {
    const byId = Object.fromEntries(
      SURVEY_QUESTIONS.map((question) => [question.id, question]),
    );
    expect(byId.recommend.kind).toBe("choice");
    expect(byId["primary-use"]).toMatchObject({
      kind: "choice",
      multiple: true,
    });
    expect(byId.improvement.kind).toBe("text");
  });

  it("gives every choice question a stable id, a prompt, and at least two options", () => {
    for (const question of SURVEY_CHOICE_QUESTIONS) {
      expect(question.id.trim().length).toBeGreaterThan(0);
      expect(question.prompt.trim().length).toBeGreaterThan(0);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      const optionIds = question.options.map((option) => option.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      for (const option of question.options) {
        expect(option.id.trim().length).toBeGreaterThan(0);
        expect(option.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("exposes no scoring concept anywhere in the survey content", () => {
    const serialized = JSON.stringify(surveyContent);
    for (const key of NO_SCORING_KEYS) {
      expect(serialized).not.toContain(`"${key}"`);
    }
  });

  it("offers an option set that the answers schema accepts", () => {
    const selection = {
      recommend: SURVEY_CHOICE_QUESTIONS[0].options[0].id,
      primaryUse: [SURVEY_CHOICE_QUESTIONS[1].options[0].id],
      teamCount: SURVEY_CHOICE_QUESTIONS[2].options[0].id,
      role: SURVEY_CHOICE_QUESTIONS[3].options[0].id,
      discoveryChannel: SURVEY_CHOICE_QUESTIONS[4].options[0].id,
    };
    expect(surveyAnswersSchema.safeParse(selection).success).toBe(true);
  });
});
