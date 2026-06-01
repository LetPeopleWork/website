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

  it("carries an answer per required question and no scoring fields", () => {
    const answers = getMockSurveyAnswers();
    expect(Object.keys(answers).sort()).toEqual([
      "discoveryChannel",
      "primaryUse",
      "recommend",
      "role",
      "teamCount",
    ]);
  });

  it("accepts multiple selections for the multiselect question", () => {
    const answers = getMockSurveyAnswers({
      primaryUse: ["forecasting", "flow-metrics"],
    });
    expect(answers.primaryUse).toEqual(["forecasting", "flow-metrics"]);
    expect(surveyAnswersSchema.safeParse(answers).success).toBe(true);
  });

  it("rejects an empty multiselect and an unknown option value", () => {
    expect(
      surveyAnswersSchema.safeParse({
        ...getMockSurveyAnswers(),
        primaryUse: [],
      }).success,
    ).toBe(false);
    const broken = { ...getMockSurveyAnswers(), teamCount: "not-an-option" };
    expect(surveyAnswersSchema.safeParse(broken).success).toBe(false);
  });
});
