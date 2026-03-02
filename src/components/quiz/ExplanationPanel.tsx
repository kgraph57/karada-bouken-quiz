"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ExplanationData } from "@/types/quiz";
import {
  Lightbulb,
  BookOpen,
  Sparkles,
  Stethoscope,
  ChevronDown,
  ArrowRight,
  Share2,
  Bookmark,
} from "lucide-react";

interface ExplanationPanelProps {
  readonly explanation: ExplanationData;
  readonly isCorrect: boolean;
  readonly xpEarned: number;
  readonly onNext: () => void;
}

export function ExplanationPanel({
  explanation,
  isCorrect,
  xpEarned,
  onNext,
}: ExplanationPanelProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      className={cn(
        "mt-6 rounded-2xl border-2 p-6 space-y-4",
        isCorrect ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"
      )}
    >
      {/* 正誤 + XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <span className="text-2xl">✅</span>
          ) : (
            <span className="text-2xl">📚</span>
          )}
          <span className="font-heading font-bold text-lg">
            {isCorrect ? "正解！" : "おしい！学びのチャンス"}
          </span>
        </div>
        <span className="text-sm font-bold text-primary">+{xpEarned} XP</span>
      </div>

      {/* サマリー */}
      <div className="flex items-start gap-3 rounded-xl bg-white/80 p-4">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <p className="font-medium leading-relaxed">{explanation.summary}</p>
      </div>

      {/* へぇ！ファクト */}
      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-100">
        <Sparkles className="h-5 w-5 shrink-0 text-purple-500 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-purple-600 mb-1">
            へぇ！ポイント
          </p>
          <p className="font-medium leading-relaxed">{explanation.funFact}</p>
        </div>
      </div>

      {/* 詳細解説 (折りたたみ) */}
      <button
        type="button"
        onClick={() => setShowDetail(!showDetail)}
        className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        <span>もっと詳しく</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            showDetail && "rotate-180"
          )}
        />
      </button>

      {showDetail && (
        <div className="rounded-xl bg-white/80 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {explanation.detail}
        </div>
      )}

      {/* おかもん先生メモ */}
      {explanation.medicalNote && (
        <div className="flex items-start gap-3 rounded-xl bg-blue-50/80 p-4 border border-blue-100">
          <Stethoscope className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-600 mb-1">
              おかもん先生メモ
            </p>
            <p className="text-sm leading-relaxed">
              {explanation.medicalNote}
            </p>
          </div>
        </div>
      )}

      {/* アクション */}
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={onNext} className="flex-1 gap-2" size="lg">
          次の問題
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="shrink-0">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="shrink-0">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
