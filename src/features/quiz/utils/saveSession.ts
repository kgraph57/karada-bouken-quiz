import type { QuizResult } from "@/types/quiz";

interface SaveSessionResponse {
  readonly success: boolean;
  readonly data?: { readonly sessionId: string };
  readonly error?: string;
}

export async function saveQuizSession(
  result: QuizResult,
  difficultyLevel: number
): Promise<SaveSessionResponse> {
  try {
    const response = await fetch("/api/quiz/save-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categorySlug: result.categorySlug,
        difficultyLevel,
        totalQuestions: result.totalQuestions,
        correctCount: result.correctCount,
        totalXP: result.totalXP,
        timeTakenSeconds: result.timeTakenSeconds,
        isPerfect: result.perfectScore,
        answers: result.answers.map((a) => ({
          questionId: a.questionId,
          userAnswer: a.userAnswer,
          isCorrect: a.isCorrect,
          timeTakenSeconds: a.timeTakenSeconds,
          xpEarned: a.xpEarned,
        })),
      }),
    });

    return await response.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}
