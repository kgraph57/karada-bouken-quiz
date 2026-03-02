"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface FillInQuestionProps {
  readonly question: string;
  readonly correctAnswer: string;
  readonly hint?: string;
  readonly isAnswered: boolean;
  readonly selectedAnswer: string | null;
  readonly onSelect: (answer: string) => void;
}

export function FillInQuestion({
  question,
  correctAnswer,
  hint,
  isAnswered,
  selectedAnswer,
  onSelect,
}: FillInQuestionProps) {
  const [inputValue, setInputValue] = useState("");
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedAnswer?.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSelect(inputValue.trim());
    }
  };

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

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={isAnswered ? (selectedAnswer ?? "") : inputValue}
            onChange={(e) => !isAnswered && setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isAnswered && handleSubmit()}
            disabled={isAnswered}
            placeholder="答えを入力..."
            className={cn(
              "w-full rounded-xl border-2 px-4 py-3 text-lg font-medium outline-none transition-all",
              !isAnswered && "border-border focus:border-primary",
              isAnswered && isCorrect && "border-green-500 bg-green-50",
              isAnswered && !isCorrect && "border-red-500 bg-red-50"
            )}
          />
          {isAnswered && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
          )}
        </div>

        {isAnswered && !isCorrect && (
          <p className="text-sm text-muted-foreground">
            正解: <span className="font-bold text-green-600">{correctAnswer}</span>
          </p>
        )}

        {!isAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="w-full"
            size="lg"
          >
            回答する
          </Button>
        )}
      </div>
    </div>
  );
}
