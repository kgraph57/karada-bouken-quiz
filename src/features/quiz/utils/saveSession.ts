import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .insert({
        user_id: user.id,
        category_slug: result.categorySlug,
        difficulty_level: difficultyLevel,
        total_questions: result.totalQuestions,
        correct_count: result.correctCount,
        total_xp: result.totalXP,
        time_taken_seconds: result.timeTakenSeconds,
        is_perfect: result.perfectScore,
      })
      .select("id")
      .single();

    if (sessionError) {
      return { success: false, error: "Failed to save session" };
    }

    const answerRecords = result.answers.map((a) => ({
      session_id: session.id,
      user_id: user.id,
      question_id: a.questionId,
      user_answer: a.userAnswer,
      is_correct: a.isCorrect,
      time_taken_seconds: a.timeTakenSeconds,
      xp_earned: a.xpEarned,
    }));

    await supabase.from("quiz_answers").insert(answerRecords);

    await supabase
      .from("profiles")
      .update({
        total_xp: result.totalXP,
        total_questions_answered: result.totalQuestions,
        total_correct: result.correctCount,
        last_played_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return { success: true, data: { sessionId: session.id } };
  } catch {
    return { success: false, error: "Failed to save session" };
  }
}
