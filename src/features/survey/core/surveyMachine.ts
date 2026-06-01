import { SURVEY_QUESTIONS } from "../content/surveyContent";

export const SURVEY_QUESTION_COUNT = SURVEY_QUESTIONS.length;

interface QuestionMeta {
  readonly required: boolean;
  readonly multiple: boolean;
  readonly text: boolean;
}

const QUESTION_META: readonly QuestionMeta[] = SURVEY_QUESTIONS.map(
  (question) => ({
    required: question.kind === "choice",
    multiple: question.kind === "choice" && question.multiple,
    text: question.kind === "text",
  }),
);

export type SurveyAnswerValue = string | readonly string[];
export type SurveyAnswer = SurveyAnswerValue | null;

export type SurveyPhase =
  | "intro"
  | "question"
  | "exchange"
  | "submitting"
  | "done";

export interface SurveyState {
  readonly phase: SurveyPhase;
  readonly currentIndex: number;
  readonly answers: readonly SurveyAnswer[];
}

export type SurveyMachineAction =
  | { type: "start" }
  | { type: "answer"; value: SurveyAnswerValue }
  | { type: "next" }
  | { type: "back" }
  | { type: "submit" }
  | { type: "submitted" }
  | { type: "retry" };

const emptyAnswers = (): readonly SurveyAnswer[] =>
  QUESTION_META.map((meta) => {
    if (meta.multiple) return [] as readonly string[];
    if (meta.text) return "";
    return null;
  });

export const initialSurveyState = (): SurveyState => ({
  phase: "intro",
  currentIndex: 0,
  answers: emptyAnswers(),
});

const isAnswered = (
  answers: readonly SurveyAnswer[],
  index: number,
): boolean => {
  const meta = QUESTION_META[index];
  const value = answers[index];
  if (meta.text || !meta.required) return true;
  if (meta.multiple) return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.length > 0;
};

export const canSubmitSurvey = (state: SurveyState): boolean =>
  state.answers.every((_, index) => isAnswered(state.answers, index));

const firstUnansweredIndex = (state: SurveyState): number => {
  const index = state.answers.findIndex(
    (_, position) => !isAnswered(state.answers, position),
  );
  return index === -1 ? SURVEY_QUESTION_COUNT - 1 : index;
};

export const surveyProgressLabel = (state: SurveyState): string =>
  `${state.currentIndex + 1} of ${SURVEY_QUESTION_COUNT}`;

const withAnswer = (
  state: SurveyState,
  value: SurveyAnswerValue,
): readonly SurveyAnswer[] =>
  state.answers.map((answer, index) =>
    index === state.currentIndex ? value : answer,
  );

const start = (state: SurveyState): SurveyState => ({
  ...state,
  phase: "question",
  currentIndex: 0,
});

const answer = (state: SurveyState, value: SurveyAnswerValue): SurveyState => ({
  ...state,
  answers: withAnswer(state, value),
});

const next = (state: SurveyState): SurveyState => {
  if (!isAnswered(state.answers, state.currentIndex)) {
    return state;
  }
  if (state.currentIndex >= SURVEY_QUESTION_COUNT - 1) {
    return state;
  }
  return { ...state, currentIndex: state.currentIndex + 1 };
};

const back = (state: SurveyState): SurveyState => {
  if (state.phase === "exchange") {
    return { ...state, phase: "question" };
  }
  if (state.currentIndex === 0) {
    return { ...state, phase: "intro" };
  }
  return { ...state, currentIndex: state.currentIndex - 1 };
};

const submit = (state: SurveyState): SurveyState => {
  if (state.phase === "exchange") {
    return { ...state, phase: "submitting" };
  }
  if (canSubmitSurvey(state)) {
    return { ...state, phase: "exchange" };
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
      return { ...state, phase: "exchange" };
    default:
      return state;
  }
};
