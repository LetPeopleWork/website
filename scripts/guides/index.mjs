// The guide pages, in the order they are listed in "More from LetPeopleWork".
// Each module exports one guide; see scripts/guide-page.mjs for the fields.
import { azureDevOpsForecasting } from "./azure-devops-forecasting.mjs";
import { compare } from "./compare.mjs";
import { jiraWithoutStoryPoints } from "./jira-forecasting-without-story-points.mjs";

export const loadGuides = (prices) => [
  jiraWithoutStoryPoints(prices),
  azureDevOpsForecasting(prices),
  compare(prices),
];
