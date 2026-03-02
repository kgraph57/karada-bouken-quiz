"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, UserAnswer } from "@/types/quiz";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { FillInQuestion } from "./FillInQuestion";
import { ExplanationPanel } from "./ExplanationPanel";
import { Timer } from "./Timer";
import { ProgressBar } from "./ProgressBar";
import { useTimer } from "@/features/quiz/hooks/useTimer";
import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug } from "@/data/categories";

interface QuizCardProps {
  readonly question: Question;
  readonly questionNumber: number;
  readonly totalQuestions: number;
  readonly onAnswer: (answer: string, timeTakenSeconds: number) => UserAnswer;
  readonly onNext: () => void;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const timer = useTimer(question.timeLimitSeconds);

  const isAnswered = selectedAnswer !== null;
  const category = getCategoryBySlug(question.categorySlug);

  const handleSelect = useCallback(
    (answer: string) => {
      if (isAnswered) return;
      setSelectedAnswer(answer);
      const elapsed = timer.stop();
      const result = onAnswer(answer, elapsed);
      setUserAnswer(result);
    },
    [isAnswered, timer, onAnswer],
  );

  // タイマー切れ時の自動処理
  if (timer.isExpired && !isAnswered) {
    handleSelect("");
  }

  // タイマー開始（初回のみ）
  if (!timer.isRunning && !isAnswered && timer.timeRemaining > 0) {
    timer.start();
  }

  const handleNext = () => {
    setSelectedAnswer(null);
    setUserAnswer(null);
    timer.reset(question.timeLimitSeconds);
    onNext();
  };

  const difficultyLabels = [
    "",
    "かんたん",
    "ふつう",
    "むずかしい",
    "超むずい",
    "鬼ムズ",
  ];

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="space-y-3">
        <ProgressBar current={questionNumber} total={totalQuestions} />
        {!isAnswered && (
          <Timer
            timeRemaining={timer.timeRemaining}
            totalTime={question.timeLimitSeconds}
          />
        )}
        <div className="flex items-center gap-2">
          {category && (
            <Badge variant="secondary">
              {category.icon} {category.name}
            </Badge>
          )}
          <Badge variant="outline">
            {difficultyLabels[question.difficulty]}
          </Badge>
        </div>
      </div>

      {/* 問題 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {question.type === "multiple_choice" && question.choices && (
            <ChoiceQuestion
              question={question.question}
              choices={question.choices}
              correctAnswer={question.correctAnswer}
              hint={question.hint}
              isAnswered={isAnswered}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
            />
          )}

          {question.type === "true_false" && (
            <TrueFalseQuestion
              question={question.question}
              correctAnswer={question.correctAnswer}
              isAnswered={isAnswered}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
            />
          )}

          {question.type === "fill_in_blank" && (
            <FillInQuestion
              question={question.question}
              correctAnswer={question.correctAnswer}
              hint={question.hint}
              isAnswered={isAnswered}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 解説 */}
      {isAnswered && userAnswer && (
        <ExplanationPanel
          explanation={question.explanation}
          isCorrect={userAnswer.isCorrect}
          xpEarned={userAnswer.xpEarned}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
