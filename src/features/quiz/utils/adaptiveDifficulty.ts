import type { DifficultyLevel, UserAnswer } from "@/types/quiz";

const WINDOW_SIZE = 5;
const UP_THRESHOLD = 0.8;
const DOWN_THRESHOLD = 0.4;

/**
 * 直近N問の正答率に基づいて難易度を調整
 * 80%超: 難易度UP, 40%以下: 難易度DOWN
 */
export function calculateNextDifficulty(
  currentDifficulty: DifficultyLevel,
  recentAnswers: readonly UserAnswer[]
): DifficultyLevel {
  if (recentAnswers.length < WINDOW_SIZE) {
    return currentDifficulty;
  }

  const window = recentAnswers.slice(-WINDOW_SIZE);
  const correctCount = window.filter((a) => a.isCorrect).length;
  const accuracy = correctCount / WINDOW_SIZE;

  if (accuracy >= UP_THRESHOLD && currentDifficulty < 5) {
    return (currentDifficulty + 1) as DifficultyLevel;
  }

  if (accuracy <= DOWN_THRESHOLD && currentDifficulty > 1) {
    return (currentDifficulty - 1) as DifficultyLevel;
  }

  return currentDifficulty;
}

/**
 * 難易度レベルの表示名
 */
export function getDifficultyLabel(level: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    1: "やさしい",
    2: "ふつう",
    3: "むずかしい",
    4: "エキスパート",
    5: "マスター",
  };
  return labels[level];
}

/**
 * 難易度レベルの色
 */
export function getDifficultyColor(level: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    1: "text-emerald-500",
    2: "text-sky-500",
    3: "text-amber-500",
    4: "text-orange-500",
    5: "text-rose-500",
  };
  return colors[level];
}
