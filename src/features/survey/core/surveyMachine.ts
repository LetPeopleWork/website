export const SURVEY_QUESTION_COUNT = 4;

export type SurveyPhase = "intro" | "question" | "submitting" | "done";

export type SurveyAnswer = string | null;

export interface SurveyState {
  readonly phase: SurveyPhase;
  readonly currentIndex: number;
  readonly answers: readonly SurveyAnswer[];
}

export type SurveyMachineAction =
  | { type: "start" }
  | { type: "answer"; value: string }
  | { type: "next" }
  | { type: "back" }
  | { type: "submit" }
  | { type: "submitted" }
  | { type: "retry" };

const emptyAnswers = (): readonly SurveyAnswer[] =>
  Array.from({ length: SURVEY_QUESTION_COUNT }, () => null);

export const initialSurveyState = (): SurveyState => ({
  phase: "intro",
  currentIndex: 0,
  answers: emptyAnswers(),
});

export const canSubmitSurvey = (state: SurveyState): boolean =>
  state.answers.every((answer) => answer !== null);

const firstUnansweredIndex = (state: SurveyState): number => {
  const index = state.answers.findIndex((answer) => answer === null);
  return index === -1 ? SURVEY_QUESTION_COUNT - 1 : index;
};

export const surveyProgressLabel = (state: SurveyState): string =>
  `${state.currentIndex + 1} of ${SURVEY_QUESTION_COUNT}`;

const withAnswer = (
  state: SurveyState,
  value: string,
): readonly SurveyAnswer[] =>
  state.answers.map((answer, index) =>
    index === state.currentIndex ? value : answer,
  );

const start = (state: SurveyState): SurveyState => ({
  ...state,
  phase: "question",
  currentIndex: 0,
});

const answer = (state: SurveyState, value: string): SurveyState => ({
  ...state,
  answers: withAnswer(state, value),
});

const next = (state: SurveyState): SurveyState => {
  if (state.answers[state.currentIndex] === null) {
    return state;
  }
  if (state.currentIndex >= SURVEY_QUESTION_COUNT - 1) {
    return state;
  }
  return { ...state, currentIndex: state.currentIndex + 1 };
};

const back = (state: SurveyState): SurveyState => {
  if (state.currentIndex === 0) {
    return { ...state, phase: "intro" };
  }
  return { ...state, currentIndex: state.currentIndex - 1 };
};

const submit = (state: SurveyState): SurveyState => {
  if (canSubmitSurvey(state)) {
    return { ...state, phase: "submitting" };
  }
  return {
    ...state,
    phase: "question",
    currentIndex: firstUnansweredIndex(state),
  };
};

export const reduceSurvey = (
  state: SurveyState,
  action: SurveyMachineAction,
): SurveyState => {
  switch (action.type) {
    case "start":
      return start(state);
    case "answer":
      return answer(state, action.value);
    case "next":
      return next(state);
    case "back":
      return back(state);
    case "submit":
      return submit(state);
    case "submitted":
      return { ...state, phase: "done" };
    case "retry":
      return { ...state, phase: "question" };
    default:
      return state;
  }
};
