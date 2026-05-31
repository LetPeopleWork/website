import { describe, it, expect } from "vitest";
import { getMockSurveyAnswers, surveyAnswersSchema } from "./answers";

describe("survey answers core (no scoring)", () => {
  it("produces answers that validate against the production schema", () => {
    const answers = getMockSurveyAnswers();
    expect(surveyAnswersSchema.safeParse(answers).success).toBe(true);
  });

  it("applies overrides while staying schema-valid", () => {
    const answers = getMockSurveyAnswers({ role: "engineering-developer" });
    expect(answers.role).toBe("engineering-developer");
    expect(surveyAnswersSchema.safeParse(answers).success).toBe(true);
  });

  it("carries one selected option per question and no scoring fields", () => {
    const answers = getMockSurveyAnswers();
    expect(Object.keys(answers).sort()).toEqual([
      "assessmentInterest",
      "discoveryChannel",
      "role",
      "teamCount",
    ]);
  });

  it("rejects an unknown option value for a question", () => {
    const broken = { ...getMockSurveyAnswers(), teamCount: "not-an-option" };
    expect(surveyAnswersSchema.safeParse(broken).success).toBe(false);
  });
});
