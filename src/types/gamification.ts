import type { CategorySlug } from "./quiz";

/** バッジのレアリティ */
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

/** バッジ獲得条件 */
export type BadgeCondition =
  | { readonly type: "first_answer" }
  | { readonly type: "category_complete"; readonly categorySlug: CategorySlug }
  | { readonly type: "all_categories" }
  | { readonly type: "streak"; readonly days: number }
  | { readonly type: "total_correct"; readonly count: number }
  | { readonly type: "perfect_session"; readonly count: number }
  | { readonly type: "speed_demon"; readonly count: number }
  | { readonly type: "daily_challenge"; readonly count: number }
  | { readonly type: "level_reached"; readonly level: number }
  | { readonly type: "share_first" }
  | { readonly type: "bookmark_count"; readonly count: number }
  | { readonly type: "time_of_day"; readonly hour: number; readonly direction: "before" | "after" };

/** バッジ定義 */
export interface BadgeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly rarity: BadgeRarity;
  readonly condition: BadgeCondition;
}

/** レベル定義 */
export interface LevelDefinition {
  readonly level: number;
  readonly title: string;
  readonly requiredXP: number;
  readonly icon: string;
}

/** XP計算結果 */
export interface XPCalculation {
  readonly baseXP: number;
  readonly difficultyBonus: number;
  readonly speedBonus: number;
  readonly streakBonus: number;
  readonly perfectBonus: number;
  readonly totalXP: number;
}

/** ユーザーの進捗状態 */
export interface UserProgress {
  readonly totalXP: number;
  readonly currentLevel: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly totalQuestionsAnswered: number;
  readonly totalCorrect: number;
  readonly earnedBadgeIds: readonly string[];
}
