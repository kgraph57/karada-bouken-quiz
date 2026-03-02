import type { Question, CategorySlug } from "@/types/quiz";

import skeletonData from "./skeleton.json";
import muscleData from "./muscle.json";
import circulatoryData from "./circulatory.json";
import respiratoryData from "./respiratory.json";
import digestiveData from "./digestive.json";
import nervousData from "./nervous.json";
import immuneData from "./immune.json";
import sensoryData from "./sensory.json";
import endocrineData from "./endocrine.json";
import skinData from "./skin.json";

const questionFiles = [
  skeletonData,
  muscleData,
  circulatoryData,
  respiratoryData,
  digestiveData,
  nervousData,
  immuneData,
  sensoryData,
  endocrineData,
  skinData,
];

export const ALL_QUESTIONS: readonly Question[] = questionFiles.flatMap(
  (file) => file.questions as unknown as Question[]
);

export function getQuestionsByCategory(
  categorySlug: CategorySlug
): readonly Question[] {
  return ALL_QUESTIONS.filter((q) => q.categorySlug === categorySlug);
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export function getCategoryQuestionCount(categorySlug: CategorySlug): number {
  return getQuestionsByCategory(categorySlug).length;
}
