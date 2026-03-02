"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface ChoiceQuestionProps {
  readonly question: string;
  readonly choices: readonly string[];
  readonly correctAnswer: string;
  readonly hint?: string;
  readonly isAnswered: boolean;
  readonly selectedAnswer: string | null;
  readonly onSelect: (answer: string) => void;
}

export function ChoiceQuestion({
  question,
  choices,
  correctAnswer,
  hint,
  isAnswered,
  selectedAnswer,
  onSelect,
}: ChoiceQuestionProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold leading-relaxed">
        {question}
      </h2>

      {hint && !isAnswered && (
        <button
          type="button"
          onClick={() => setShowHint(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showHint ? `💡 ${hint}` : "💡 ヒントを見る"}
        </button>
      )}

      <div className="grid gap-3">
        {choices.map((choice, index) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectChoice = choice === correctAnswer;
          const letter = String.fromCharCode(65 + index);

          const getAnimation = () => {
            if (!isAnswered) return {};
            if (isCorrectChoice) {
              return {
                scale: [1, 1.03, 1],
                transition: { duration: 0.3 },
              };
            }
            if (isSelected && !isCorrectChoice) {
              return {
                x: [0, -6, 6, -4, 4, 0],
                transition: { duration: 0.4 },
              };
            }
            return {};
          };

          return (
            <motion.button
              key={choice}
              type="button"
              onClick={() => !isAnswered && onSelect(choice)}
              disabled={isAnswered}
              animate={getAnimation()}
              whileTap={!isAnswered ? { scale: 0.98 } : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
                !isAnswered &&
                  "hover:border-primary hover:bg-primary/5 hover:shadow-sm cursor-pointer",
                isAnswered && isCorrectChoice && "border-green-500 bg-green-50",
                isAnswered &&
                  isSelected &&
                  !isCorrectChoice &&
                  "border-red-500 bg-red-50",
                !isAnswered && "border-border",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                  isAnswered && isCorrectChoice && "bg-green-500 text-white",
                  isAnswered &&
                    isSelected &&
                    !isCorrectChoice &&
                    "bg-red-500 text-white",
                  !isAnswered && "bg-muted text-muted-foreground",
                )}
              >
                {isAnswered && isCorrectChoice ? (
                  <CheckCircle className="h-5 w-5" />
                ) : isAnswered && isSelected && !isCorrectChoice ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  letter
                )}
              </span>
              <span className="font-medium">{choice}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
