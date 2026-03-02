/** 問題の種類 */
export type QuestionType = "multiple_choice" | "true_false" | "fill_in_blank";

/** 難易度レベル (1-5) */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/** カテゴリslug */
export type CategorySlug =
  | "skeleton"
  | "muscle"
  | "circulatory"
  | "respiratory"
  | "digestive"
  | "nervous"
  | "immune"
  | "sensory"
  | "endocrine"
  | "skin";

/** 解説データ (「へぇ！」の心臓部) */
export interface ExplanationData {
  readonly summary: string;
  readonly detail: string;
  readonly funFact: string;
  readonly medicalNote?: string;
  readonly relatedQuestionIds: readonly string[];
}

/** 問題データ */
export interface Question {
  readonly id: string;
  readonly categorySlug: CategorySlug;
  readonly type: QuestionType;
  readonly difficulty: DifficultyLevel;
  readonly question: string;
  readonly choices?: readonly string[];
  readonly correctAnswer: string;
  readonly hint?: string;
  readonly explanation: ExplanationData;
  readonly tags: readonly string[];
  readonly source: string;
  readonly timeLimitSeconds: number;
  readonly xpReward: number;
}

/** カテゴリ定義 */
export interface Category {
  readonly slug: CategorySlug;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly order: number;
}

/** ユーザー回答 */
export interface UserAnswer {
  readonly questionId: string;
  readonly userAnswer: string;
  readonly isCorrect: boolean;
  readonly timeTakenSeconds: number;
  readonly xpEarned: number;
}

/** クイズセッション (クライアント側) */
export interface QuizSession {
  readonly id: string;
  readonly categorySlug: CategorySlug;
  readonly questions: readonly Question[];
  readonly currentIndex: number;
  readonly answers: readonly UserAnswer[];
  readonly startedAt: string;
  readonly difficultyLevel: DifficultyLevel;
  readonly isCompleted: boolean;
}

/** クイズリザルト */
export interface QuizResult {
  readonly sessionId: string;
  readonly categorySlug: CategorySlug;
  readonly categoryName: string;
  readonly totalQuestions: number;
  readonly correctCount: number;
  readonly totalXP: number;
  readonly timeTakenSeconds: number;
  readonly answers: readonly UserAnswer[];
  readonly perfectScore: boolean;
}

/** 問題カテゴリファイルの構造 */
export interface QuestionFile {
  readonly category: CategorySlug;
  readonly version: string;
  readonly questions: readonly Question[];
}
