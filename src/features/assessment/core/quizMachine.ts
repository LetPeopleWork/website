import { QUESTION_COUNT } from "./scoring";

export type Phase = "intro" | "question" | "teaser";

export type Answer = number | null;

export interface QuizState {
  readonly phase: Phase;
  readonly currentIndex: number;
  readonly answers: readonly Answer[];
}

export type QuizAction =
  | { type: "start" }
  | { type: "answer"; value: number }
  | { type: "next" }
  | { type: "back" }
  | { type: "submit" }
  | { type: "restart" };

const emptyAnswers = (): readonly Answer[] =>
  Array.from({ length: QUESTION_COUNT }, () => null);

export const initialState = (answers?: readonly Answer[]): QuizState => ({
  phase: "intro",
  currentIndex: 0,
  answers: answers ?? emptyAnswers(),
});

export const firstUnansweredIndex = (state: QuizState): number => {
  const index = state.answers.findIndex((answer) => answer === null);
  return index === -1 ? QUESTION_COUNT - 1 : index;
};

export const canProduceResult = (state: QuizState): boolean =>
  state.answers.every((answer) => answer !== null);

export const progressLabel = (state: QuizState): string =>
  `${state.currentIndex + 1} of ${QUESTION_COUNT}`;

const withAnswer = (
  state: QuizState,
  value: number,
): readonly Answer[] =>
  state.answers.map((answer, index) =>
    index === state.currentIndex ? value : answer,
  );

const start = (state: QuizState): QuizState => ({
  ...state,
  phase: "question",
  currentIndex: 0,
});

const answer = (state: QuizState, value: number): QuizState => ({
  ...state,
  answers: withAnswer(state, value),
});

const next = (state: QuizState): QuizState => {
  if (state.answers[state.currentIndex] === null) {
    return state;
  }
  if (state.currentIndex >= QUESTION_COUNT - 1) {
    return state;
  }
  return { ...state, currentIndex: state.currentIndex + 1 };
};

const back = (state: QuizState): QuizState => {
  if (state.currentIndex === 0) {
    return { ...state, phase: "intro" };
  }
  return { ...state, currentIndex: state.currentIndex - 1 };
};

const submit = (state: QuizState): QuizState => {
  if (canProduceResult(state)) {
    return { ...state, phase: "teaser" };
  }
  return {
    ...state,
    phase: "question",
    currentIndex: firstUnansweredIndex(state),
  };
};

export const reduce = (state: QuizState, action: QuizAction): QuizState => {
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
    case "restart":
      return start(initialState());
    default:
      return state;
  }
};
