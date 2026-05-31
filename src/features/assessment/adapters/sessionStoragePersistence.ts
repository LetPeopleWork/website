import { z } from "zod";
import { QUESTION_COUNT } from "../core/scoring";
import type { Answer } from "../core/quizMachine";

export interface AnswersPersistence {
  load(): readonly Answer[] | null;
  save(answers: readonly Answer[]): void;
  clear(): void;
}

const STORAGE_KEY = "assessment.answers.v1";

const answerSchema = z
  .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.null()])
  .array()
  .length(QUESTION_COUNT);

const parseDraft = (raw: string): readonly Answer[] | null => {
  const parsed = answerSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : null;
};

export const createSessionStoragePersistence = (
  storage: Storage = sessionStorage,
): AnswersPersistence => ({
  load() {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    try {
      const draft = parseDraft(raw);
      if (draft === null) {
        storage.removeItem(STORAGE_KEY);
      }
      return draft;
    } catch {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
  },
  save(answers) {
    storage.setItem(STORAGE_KEY, JSON.stringify(answers));
  },
  clear() {
    storage.removeItem(STORAGE_KEY);
  },
});
