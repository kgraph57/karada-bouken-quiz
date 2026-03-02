import type { Question, DifficultyLevel, CategorySlug } from "@/types/quiz";

interface SelectionOptions {
  readonly count: number;
  readonly difficulty?: DifficultyLevel;
  readonly excludeIds?: readonly string[];
}

function shuffleArray<T>(array: readonly T[]): readonly T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectQuestions(
  questions: readonly Question[],
  options: SelectionOptions
): readonly Question[] {
  let filtered = questions;

  if (options.excludeIds && options.excludeIds.length > 0) {
    filtered = filtered.filter((q) => !options.excludeIds?.includes(q.id));
  }

  if (options.difficulty) {
    const targetDifficulty = options.difficulty;
    const range = 1;
    filtered = filtered.filter(
      (q) => Math.abs(q.difficulty - targetDifficulty) <= range
    );
  }

  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, options.count);
}

export function selectDailyQuestions(
  allQuestions: readonly Question[],
  count: number = 10
): readonly Question[] {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const seededRandom = createSeededRandom(seed);

  const shuffled = [...allQuestions].sort(() => seededRandom() - 0.5);
  return shuffled.slice(0, count);
}

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

export function getQuestionsByCategory(
  questions: readonly Question[],
  categorySlug: CategorySlug
): readonly Question[] {
  return questions.filter((q) => q.categorySlug === categorySlug);
}
