"use client";

import { useEffect, useRef } from "react";
import { QuizCard } from "@/components/quiz/QuizCard";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getQuestionsByCategory } from "@/data/questions";
import { getCategoryBySlug } from "@/data/categories";
import { selectQuestions } from "@/features/quiz/utils/questionSelector";
import { saveQuizSession } from "@/features/quiz/utils/saveSession";
import type { CategorySlug } from "@/types/quiz";
import { ShareButtons } from "@/components/share/ShareButtons";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlayContentProps {
  readonly categorySlug: string;
}

export function PlayContent({ categorySlug }: PlayContentProps) {
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

  const category = getCategoryBySlug(categorySlug);

  useEffect(() => {
    if (!session && category) {
      const questions = getQuestionsByCategory(categorySlug as CategorySlug);
      const selected = selectQuestions(questions, { count: 10 });
      startSession(categorySlug as CategorySlug, selected, 2);
    }
  }, [session, category, categorySlug, startSession]);

  useEffect(() => {
    if (isCompleted && result && user && !hasSaved.current) {
      hasSaved.current = true;
      saveQuizSession(result, session?.difficultyLevel ?? 2);
    }
  }, [isCompleted, result, user, session?.difficultyLevel]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>カテゴリが見つかりません</p>
      </div>
    );
  }

  if (isCompleted && result) {
    const accuracy = Math.round(
      (result.correctCount / result.totalQuestions) * 100,
    );
    const minutes = Math.floor(result.timeTakenSeconds / 60);
    const seconds = result.timeTakenSeconds % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border-2 bg-white/90 p-8 text-center space-y-6">
            <div>
              {result.perfectScore && <div className="text-5xl mb-4">🎉</div>}
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
              <p className="text-muted-foreground mt-1">
                {category.icon} {category.name}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">正答率</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold text-primary">
                  +{result.totalXP}
                </p>
                <p className="text-xs text-muted-foreground">XP獲得</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold">
                  {minutes}:{String(seconds).padStart(2, "0")}
                </p>
                <p className="text-xs text-muted-foreground">タイム</p>
              </div>
            </div>

            <p className="text-lg font-medium">
              {result.perfectScore
                ? "パーフェクト！すばらしい冒険でした！"
                : accuracy >= 80
                  ? "すごい！からだ博士に近づいています！"
                  : accuracy >= 50
                    ? "いい調子！もっと冒険を続けよう"
                    : "体のひみつはまだまだたくさん！"}
            </p>

            <ShareButtons result={result} categoryIcon={category.icon} />

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  const questions = getQuestionsByCategory(
                    categorySlug as CategorySlug,
                  );
                  const selected = selectQuestions(questions, { count: 10 });
                  startSession(categorySlug as CategorySlug, selected, 2);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                もう一度挑戦
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/quiz">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  カテゴリ選択に戻る
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
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
