"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, CheckCircle, XCircle } from "lucide-react";

interface TrueFalseQuestionProps {
  readonly question: string;
  readonly correctAnswer: string;
  readonly isAnswered: boolean;
  readonly selectedAnswer: string | null;
  readonly onSelect: (answer: string) => void;
}

export function TrueFalseQuestion({
  question,
  correctAnswer,
  isAnswered,
  selectedAnswer,
  onSelect,
}: TrueFalseQuestionProps) {
  const options = [
    { value: "true", label: "◯", icon: CircleCheck },
    { value: "false", label: "✕", icon: CircleX },
  ] as const;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold leading-relaxed">
        {question}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = selectedAnswer === value;
          const isCorrectChoice = value === correctAnswer;

          return (
            <button
              key={value}
              type="button"
              onClick={() => !isAnswered && onSelect(value)}
              disabled={isAnswered}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-8 transition-all duration-200",
                !isAnswered &&
                  "hover:border-primary hover:bg-primary/5 hover:shadow-sm cursor-pointer",
                isAnswered && isCorrectChoice && "border-green-500 bg-green-50",
                isAnswered &&
                  isSelected &&
                  !isCorrectChoice &&
                  "border-red-500 bg-red-50",
                !isAnswered && "border-border"
              )}
            >
              {isAnswered && isCorrectChoice ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : isAnswered && isSelected && !isCorrectChoice ? (
                <XCircle className="h-12 w-12 text-red-500" />
              ) : (
                <Icon className="h-12 w-12 text-muted-foreground" />
              )}
              <span className="text-2xl font-heading font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
