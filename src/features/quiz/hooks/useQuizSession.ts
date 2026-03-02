"use client";

import { useState, useCallback } from "react";
import type {
  Question,
  QuizSession,
  UserAnswer,
  QuizResult,
  CategorySlug,
  DifficultyLevel,
} from "@/types/quiz";
import { calculateXP } from "@/features/quiz/utils/scoring";
import { getCategoryBySlug } from "@/data/categories";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface UseQuizSessionReturn {
  readonly session: QuizSession | null;
  readonly currentQuestion: Question | null;
  readonly isCompleted: boolean;
  readonly result: QuizResult | null;
  readonly startSession: (
    categorySlug: CategorySlug,
    questions: readonly Question[],
    difficulty: DifficultyLevel
  ) => void;
  readonly submitAnswer: (answer: string, timeTakenSeconds: number) => UserAnswer;
  readonly nextQuestion: () => void;
  readonly consecutiveCorrect: number;
}

export function useQuizSession(): UseQuizSessionReturn {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const currentQuestion =
    session && !session.isCompleted
      ? session.questions[session.currentIndex] ?? null
      : null;

  const isCompleted = session?.isCompleted ?? false;

  const result: QuizResult | null =
    session?.isCompleted
      ? {
          sessionId: session.id,
          categorySlug: session.categorySlug,
          categoryName:
            getCategoryBySlug(session.categorySlug)?.name ?? "",
          totalQuestions: session.questions.length,
          correctCount: session.answers.filter((a) => a.isCorrect).length,
          totalXP: session.answers.reduce((sum, a) => sum + a.xpEarned, 0),
          timeTakenSeconds: session.answers.reduce(
            (sum, a) => sum + a.timeTakenSeconds,
            0
          ),
          answers: session.answers,
          perfectScore: session.answers.every((a) => a.isCorrect),
        }
      : null;

  const startSession = useCallback(
    (
      categorySlug: CategorySlug,
      questions: readonly Question[],
      difficulty: DifficultyLevel
    ) => {
      setSession({
        id: generateSessionId(),
        categorySlug,
        questions,
        currentIndex: 0,
        answers: [],
        startedAt: new Date().toISOString(),
        difficultyLevel: difficulty,
        isCompleted: false,
      });
      setConsecutiveCorrect(0);
    },
    []
  );

  const submitAnswer = useCallback(
    (answer: string, timeTakenSeconds: number): UserAnswer => {
      if (!session || !currentQuestion) {
        throw new Error("No active session or question");
      }

      const isCorrect = checkAnswer(currentQuestion, answer);

      const newConsecutive = isCorrect ? consecutiveCorrect + 1 : 0;
      setConsecutiveCorrect(newConsecutive);

      const isLastQuestion =
        session.currentIndex === session.questions.length - 1;
      const allPreviousCorrect = session.answers.every((a) => a.isCorrect);
      const isSessionPerfect = allPreviousCorrect && isCorrect;

      const xpResult = calculateXP({
        baseXP: currentQuestion.xpReward,
        difficulty: currentQuestion.difficulty,
        timeTakenSeconds,
        timeLimitSeconds: currentQuestion.timeLimitSeconds,
        isCorrect,
        consecutiveCorrect: isCorrect ? newConsecutive : 0,
        isSessionPerfect,
        isLastQuestion,
      });

      const userAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        userAnswer: answer,
        isCorrect,
        timeTakenSeconds,
        xpEarned: xpResult.totalXP,
      };

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: [...prev.answers, userAnswer],
        };
      });

      return userAnswer;
    },
    [session, currentQuestion, consecutiveCorrect]
  );

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      const isCompleted = nextIndex >= prev.questions.length;
      return {
        ...prev,
        currentIndex: isCompleted ? prev.currentIndex : nextIndex,
        isCompleted,
      };
    });
  }, []);

  return {
    session,
    currentQuestion,
    isCompleted,
    result,
    startSession,
    submitAnswer,
    nextQuestion,
    consecutiveCorrect,
  };
}

function checkAnswer(question: Question, answer: string): boolean {
  const normalizedAnswer = answer.trim().toLowerCase();
  const normalizedCorrect = question.correctAnswer.trim().toLowerCase();

  if (question.type === "fill_in_blank") {
    return normalizedAnswer === normalizedCorrect;
  }

  return normalizedAnswer === normalizedCorrect;
}
