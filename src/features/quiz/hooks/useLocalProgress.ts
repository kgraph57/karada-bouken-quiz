"use client";

import { useState, useCallback, useEffect } from "react";
import { getLevelForXP, getLevelProgress, getXPToNextLevel } from "@/data/levels";
import type { LevelDefinition } from "@/types/gamification";

const STORAGE_KEY = "karada-bouken-progress";

interface LocalProgress {
  readonly totalXP: number;
  readonly totalCorrect: number;
  readonly totalAnswered: number;
  readonly sessionsPlayed: number;
  readonly perfectCount: number;
  readonly currentStreak: number;
  readonly lastPlayedDate: string | null;
  readonly categoryStats: Readonly<Record<string, CategoryStat>>;
}

interface CategoryStat {
  readonly played: number;
  readonly correct: number;
  readonly answered: number;
  readonly bestAccuracy: number;
}

interface UseLocalProgressReturn {
  readonly progress: LocalProgress;
  readonly level: LevelDefinition;
  readonly levelProgress: number;
  readonly xpToNext: number;
  readonly accuracy: number;
  readonly addSessionResult: (params: SessionResultParams) => LevelUpInfo | null;
}

interface SessionResultParams {
  readonly categorySlug: string;
  readonly correctCount: number;
  readonly totalQuestions: number;
  readonly totalXP: number;
  readonly isPerfect: boolean;
}

interface LevelUpInfo {
  readonly previousLevel: LevelDefinition;
  readonly newLevel: LevelDefinition;
}

const DEFAULT_PROGRESS: LocalProgress = {
  totalXP: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  sessionsPlayed: 0,
  perfectCount: 0,
  currentStreak: 0,
  lastPlayedDate: null,
  categoryStats: {},
};

function loadProgress(): LocalProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return JSON.parse(stored) as LocalProgress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable
  }
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export function useLocalProgress(): UseLocalProgressReturn {
  const [progress, setProgress] = useState<LocalProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const level = getLevelForXP(progress.totalXP);
  const levelProgress = getLevelProgress(progress.totalXP);
  const xpToNext = getXPToNextLevel(progress.totalXP);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  const addSessionResult = useCallback(
    (params: SessionResultParams): LevelUpInfo | null => {
      const previousLevel = getLevelForXP(progress.totalXP);
      const today = getTodayString();

      const isConsecutiveDay =
        progress.lastPlayedDate !== null &&
        progress.lastPlayedDate !== today;
      const isSameDay = progress.lastPlayedDate === today;

      const newStreak = isSameDay
        ? progress.currentStreak
        : isConsecutiveDay
          ? progress.currentStreak + 1
          : 1;

      const prevCategoryStat = progress.categoryStats[params.categorySlug];
      const categoryAccuracy = Math.round(
        (params.correctCount / params.totalQuestions) * 100,
      );

      const updatedCategoryStat: CategoryStat = {
        played: (prevCategoryStat?.played ?? 0) + 1,
        correct: (prevCategoryStat?.correct ?? 0) + params.correctCount,
        answered: (prevCategoryStat?.answered ?? 0) + params.totalQuestions,
        bestAccuracy: Math.max(
          prevCategoryStat?.bestAccuracy ?? 0,
          categoryAccuracy,
        ),
      };

      const updated: LocalProgress = {
        totalXP: progress.totalXP + params.totalXP,
        totalCorrect: progress.totalCorrect + params.correctCount,
        totalAnswered: progress.totalAnswered + params.totalQuestions,
        sessionsPlayed: progress.sessionsPlayed + 1,
        perfectCount: progress.perfectCount + (params.isPerfect ? 1 : 0),
        currentStreak: newStreak,
        lastPlayedDate: today,
        categoryStats: {
          ...progress.categoryStats,
          [params.categorySlug]: updatedCategoryStat,
        },
      };

      setProgress(updated);
      saveProgress(updated);

      const newLevel = getLevelForXP(updated.totalXP);
      if (newLevel.level > previousLevel.level) {
        return { previousLevel, newLevel };
      }
      return null;
    },
    [progress],
  );

  return {
    progress,
    level,
    levelProgress,
    xpToNext,
    accuracy,
    addSessionResult,
  };
}
