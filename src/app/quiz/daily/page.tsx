"use client";

import { useEffect, useRef } from "react";
import { QuizCard } from "@/components/quiz/QuizCard";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ALL_QUESTIONS } from "@/data/questions";
import { selectDailyQuestions } from "@/features/quiz/utils/questionSelector";
import { saveQuizSession } from "@/features/quiz/utils/saveSession";
import { ShareButtons } from "@/components/share/ShareButtons";
import { ArrowLeft, Trophy, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getTodayLabel(): string {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
}

export default function DailyChallengePage() {
  const { user } = useAuth();
  const {
    session,
    currentQuestion,
    isCompleted,
    result,
    startSession,
    submitAnswer,
    nextQuestion,
  } = useQuizSession();
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!session) {
      const dailyQuestions = selectDailyQuestions(ALL_QUESTIONS, 10);
      startSession("skeleton", dailyQuestions, 3);
    }
  }, [session, startSession]);

  useEffect(() => {
    if (isCompleted && result && user && !hasSaved.current) {
      hasSaved.current = true;
      saveQuizSession(result, session?.difficultyLevel ?? 3);
    }
  }, [isCompleted, result, user, session?.difficultyLevel]);

  if (isCompleted && result) {
    const accuracy = Math.round(
      (result.correctCount / result.totalQuestions) * 100
    );
    const minutes = Math.floor(result.timeTakenSeconds / 60);
    const seconds = result.timeTakenSeconds % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border-2 border-amber-200 bg-white/90 p-8 text-center space-y-6">
            <div>
              <Calendar className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">
                {getTodayLabel()} のデイリーチャレンジ
              </p>
            </div>

            <div>
              {result.perfectScore && (
                <div className="text-5xl mb-4">🎉</div>
              )}
              <Trophy
                className={`mx-auto h-16 w-16 ${
                  accuracy >= 80
                    ? "text-amber-500"
                    : accuracy >= 50
                      ? "text-gray-400"
                      : "text-amber-700"
                }`}
              />
              <h1 className="font-heading text-3xl font-bold mt-4">
                {result.correctCount}/{result.totalQuestions} 正解！
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-2xl font-bold">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">正答率</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-2xl font-bold text-primary">
                  +{result.totalXP}
                </p>
                <p className="text-xs text-muted-foreground">XP獲得</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-2xl font-bold">
                  {minutes}:{String(seconds).padStart(2, "0")}
                </p>
                <p className="text-xs text-muted-foreground">タイム</p>
              </div>
            </div>

            <p className="text-lg font-medium">
              {result.perfectScore
                ? "パーフェクト！今日も完璧な冒険！"
                : accuracy >= 80
                  ? "すばらしい！明日も挑戦しよう！"
                  : accuracy >= 50
                    ? "いい調子！明日はもっといけるはず"
                    : "明日のチャレンジでリベンジだ！"}
            </p>

            <ShareButtons
              result={{
                ...result,
                categoryName: "デイリーチャレンジ",
              }}
              categoryIcon="📅"
            />

            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/quiz">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  カテゴリ選択へ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>{getTodayLabel()} のデイリーチャレンジ</span>
        </div>
        <QuizCard
          question={currentQuestion}
          questionNumber={session.currentIndex + 1}
          totalQuestions={session.questions.length}
          onAnswer={submitAnswer}
          onNext={nextQuestion}
        />
      </div>
    </div>
  );
}
