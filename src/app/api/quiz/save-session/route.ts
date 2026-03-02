import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

const answerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  timeTakenSeconds: z.number().int().min(0),
  xpEarned: z.number().int().min(0),
});

const sessionSchema = z.object({
  categorySlug: z.string(),
  difficultyLevel: z.number().int().min(1).max(5),
  totalQuestions: z.number().int().min(1),
  correctCount: z.number().int().min(0),
  totalXP: z.number().int().min(0),
  timeTakenSeconds: z.number().int().min(0),
  isPerfect: z.boolean(),
  answers: z.array(answerSchema),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Auth not configured" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // セッション保存
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: user.id,
      category_slug: data.categorySlug,
      difficulty_level: data.difficultyLevel,
      total_questions: data.totalQuestions,
      correct_count: data.correctCount,
      total_xp: data.totalXP,
      time_taken_seconds: data.timeTakenSeconds,
      is_perfect: data.isPerfect,
    })
    .select("id")
    .single();

  if (sessionError) {
    return NextResponse.json(
      { success: false, error: "Failed to save session" },
      { status: 500 },
    );
  }

  // 回答保存
  const answerRecords = data.answers.map((answer) => ({
    session_id: session.id,
    user_id: user.id,
    question_id: answer.questionId,
    user_answer: answer.userAnswer,
    is_correct: answer.isCorrect,
    time_taken_seconds: answer.timeTakenSeconds,
    xp_earned: answer.xpEarned,
  }));

  const { error: answersError } = await supabase
    .from("quiz_answers")
    .insert(answerRecords);

  if (answersError) {
    return NextResponse.json(
      { success: false, error: "Failed to save answers" },
      { status: 500 },
    );
  }

  // プロフィール更新 (XP, 正解数, etc.)
  const { error: profileError } = await supabase.rpc("update_profile_stats", {
    p_user_id: user.id,
    p_xp: data.totalXP,
    p_correct: data.correctCount,
    p_total: data.totalQuestions,
  });

  if (profileError) {
    // プロフィール更新失敗はセッション保存には影響させない
    // RPC未作成の場合のフォールバック
    await supabase
      .from("profiles")
      .update({
        total_xp: data.totalXP,
        total_questions_answered: data.totalQuestions,
        total_correct: data.correctCount,
        last_played_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  return NextResponse.json({
    success: true,
    data: { sessionId: session.id },
  });
}
