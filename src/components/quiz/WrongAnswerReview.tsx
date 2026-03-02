"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getQuestionById } from "@/data/questions";
import type { UserAnswer } from "@/types/quiz";
import { ChevronDown, XCircle, Lightbulb } from "lucide-react";

interface WrongAnswerReviewProps {
  readonly answers: readonly UserAnswer[];
}

export function WrongAnswerReview({ answers }: WrongAnswerReviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const wrongAnswers = answers.filter((a) => !a.isCorrect);

  if (wrongAnswers.length === 0) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border-2 border-red-100 bg-red-50/50 p-4 text-left transition-colors hover:bg-red-50"
      >
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-400" />
          <span className="font-heading font-bold text-sm">
            まちがえた問題を復習（{wrongAnswers.length}問）
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {wrongAnswers.map((answer, index) => {
                const question = getQuestionById(answer.questionId);
                if (!question) return null;

                return (
                  <WrongAnswerCard
                    key={answer.questionId}
                    index={index + 1}
                    questionText={question.question}
                    userAnswer={answer.userAnswer}
                    correctAnswer={question.correctAnswer}
                    summary={question.explanation.summary}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface WrongAnswerCardProps {
  readonly index: number;
  readonly questionText: string;
  readonly userAnswer: string;
  readonly correctAnswer: string;
  readonly summary: string;
}

function WrongAnswerCard({
  index,
  questionText,
  userAnswer,
  correctAnswer,
  summary,
}: WrongAnswerCardProps) {
  const formatAnswer = (answer: string): string => {
    if (answer === "true") return "◯";
    if (answer === "false") return "✕";
    if (answer === "") return "（時間切れ）";
    return answer;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border bg-white p-4 space-y-3"
    >
      <p className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-1">Q{index}.</span>
        {questionText}
      </p>

      <div className="flex gap-3 text-sm">
        <div
          className={cn(
            "flex-1 rounded-lg p-2 text-center",
            "bg-red-50 border border-red-200",
          )}
        >
          <p className="text-xs text-red-500 mb-0.5">あなたの回答</p>
          <p className="font-bold text-red-600">{formatAnswer(userAnswer)}</p>
        </div>
        <div
          className={cn(
            "flex-1 rounded-lg p-2 text-center",
            "bg-green-50 border border-green-200",
          )}
        >
          <p className="text-xs text-green-500 mb-0.5">正解</p>
          <p className="font-bold text-green-600">
            {formatAnswer(correctAnswer)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-amber-50/80 p-3">
        <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        <p className="text-xs leading-relaxed text-amber-900">{summary}</p>
      </div>
    </motion.div>
  );
}
