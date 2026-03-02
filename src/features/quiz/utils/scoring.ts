import type { DifficultyLevel } from "@/types/quiz";
import type { XPCalculation } from "@/types/gamification";

interface ScoringInput {
  readonly baseXP: number;
  readonly difficulty: DifficultyLevel;
  readonly timeTakenSeconds: number;
  readonly timeLimitSeconds: number;
  readonly isCorrect: boolean;
  readonly consecutiveCorrect: number;
  readonly isSessionPerfect: boolean;
  readonly isLastQuestion: boolean;
}

export function calculateXP(input: ScoringInput): XPCalculation {
  if (!input.isCorrect) {
    return {
      baseXP: 0,
      difficultyBonus: 0,
      speedBonus: 0,
      streakBonus: 0,
      perfectBonus: 0,
      totalXP: 5, // 解説を読んだ「学びポイント」
    };
  }

  const difficultyBonus = input.difficulty * 5;

  const timeRatio = input.timeTakenSeconds / input.timeLimitSeconds;
  let speedBonus = 0;
  if (timeRatio <= 0.25) {
    speedBonus = 20;
  } else if (timeRatio <= 0.5) {
    speedBonus = 10;
  }

  const streakBonus = Math.min(input.consecutiveCorrect * 2, 20);

  const perfectBonus =
    input.isSessionPerfect && input.isLastQuestion ? 50 : 0;

  const totalXP =
    input.baseXP + difficultyBonus + speedBonus + streakBonus + perfectBonus;

  return {
    baseXP: input.baseXP,
    difficultyBonus,
    speedBonus,
    streakBonus,
    perfectBonus,
    totalXP,
  };
}

export function calculateAccuracy(
  correct: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
