import { describe, it, expect } from "vitest";
import { surveyContent, SURVEY_QUESTIONS } from "./surveyContent";
import { surveyAnswersSchema } from "../core/answers";

const NO_SCORING_KEYS = ["band", "raw_sum", "rawSum", "score"];

describe("survey content config", () => {
  it("loads the four confirmed single-select questions", () => {
    expect(SURVEY_QUESTIONS.map((question) => question.id)).toEqual([
      "team-count",
      "role",
      "discovery-channel",
      "assessment-interest",
    ]);
  });

  it("gives every question a stable id, a prompt, and at least two options", () => {
    for (const question of SURVEY_QUESTIONS) {
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

  it("offers an option set that the answers schema accepts for each question", () => {
    const selection = {
      teamCount: SURVEY_QUESTIONS[0].options[0].id,
      role: SURVEY_QUESTIONS[1].options[0].id,
      discoveryChannel: SURVEY_QUESTIONS[2].options[0].id,
      assessmentInterest: SURVEY_QUESTIONS[3].options[0].id,
    };
    expect(surveyAnswersSchema.safeParse(selection).success).toBe(true);
  });
});
