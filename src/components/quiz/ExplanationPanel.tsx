"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "mt-6 rounded-2xl border-2 p-6 space-y-4",
        isCorrect
          ? "border-green-200 bg-green-50/50"
          : "border-amber-200 bg-amber-50/50"
      )}
    >
      {/* 正誤 + XP */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 12,
              delay: 0.2,
            }}
            className="text-2xl"
          >
            {isCorrect ? "✅" : "📚"}
          </motion.span>
          <span className="font-heading font-bold text-lg">
            {isCorrect ? "正解！" : "おしい！学びのチャンス"}
          </span>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          className="text-sm font-bold text-primary"
        >
          +{xpEarned} XP
        </motion.span>
      </motion.div>

      {/* サマリー */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-start gap-3 rounded-xl bg-white/80 p-4"
      >
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <p className="font-medium leading-relaxed">{explanation.summary}</p>
      </motion.div>

      {/* へぇ！ファクト */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-100"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-purple-500 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-purple-600 mb-1">
            へぇ！ポイント
          </p>
          <p className="font-medium leading-relaxed">{explanation.funFact}</p>
        </div>
      </motion.div>

      {/* 詳細解説 (折りたたみ) */}
      <button
        type="button"
        onClick={() => setShowDetail(!showDetail)}
        className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        <span>もっと詳しく</span>
        <motion.span
          animate={{ rotate: showDetail ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-white/80 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {explanation.detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* おかもん先生メモ */}
      {explanation.medicalNote && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-start gap-3 rounded-xl bg-blue-50/80 p-4 border border-blue-100"
        >
          <Stethoscope className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-600 mb-1">
              おかもん先生メモ
            </p>
            <p className="text-sm leading-relaxed">
              {explanation.medicalNote}
            </p>
          </div>
        </motion.div>
      )}

      {/* アクション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-2"
      >
        <Button onClick={onNext} className="w-full gap-2" size="lg">
          次の問題
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
