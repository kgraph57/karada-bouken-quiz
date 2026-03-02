import type { CategorySlug, DifficultyLevel } from "./quiz";

/** プロフィール (profiles テーブル) */
export interface Profile {
  readonly id: string;
  readonly display_name: string | null;
  readonly avatar_url: string | null;
  readonly total_xp: number;
  readonly current_level: number;
  readonly current_streak: number;
  readonly longest_streak: number;
  readonly total_questions_answered: number;
  readonly total_correct: number;
  readonly last_played_at: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

/** クイズセッション (quiz_sessions テーブル) */
export interface QuizSessionRecord {
  readonly id: string;
  readonly user_id: string;
  readonly category_slug: CategorySlug;
  readonly difficulty_level: DifficultyLevel;
  readonly total_questions: number;
  readonly correct_count: number;
  readonly total_xp: number;
  readonly time_taken_seconds: number;
  readonly is_perfect: boolean;
  readonly completed_at: string;
  readonly created_at: string;
}

/** クイズ回答 (quiz_answers テーブル) */
export interface QuizAnswerRecord {
  readonly id: string;
  readonly session_id: string;
  readonly user_id: string;
  readonly question_id: string;
  readonly user_answer: string;
  readonly is_correct: boolean;
  readonly time_taken_seconds: number;
  readonly xp_earned: number;
  readonly created_at: string;
}

/** ユーザーバッジ (user_badges テーブル) */
export interface UserBadgeRecord {
  readonly id: string;
  readonly user_id: string;
  readonly badge_id: string;
  readonly earned_at: string;
}
