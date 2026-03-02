"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Link2 } from "lucide-react";
import type { QuizResult } from "@/types/quiz";

interface ShareButtonsProps {
  readonly result: QuizResult;
  readonly categoryIcon: string;
}

function buildShareText(result: QuizResult): string {
  const accuracy = Math.round(
    (result.correctCount / result.totalQuestions) * 100,
  );
  const emoji =
    accuracy === 100
      ? "🎉"
      : accuracy >= 80
        ? "🏆"
        : accuracy >= 50
          ? "💪"
          : "📚";

  return `${emoji} からだ冒険クイズで ${result.correctCount}/${result.totalQuestions} 正解（${accuracy}%）！\n${result.categoryName}カテゴリに挑戦しました\n+${result.totalXP} XP獲得\n\n#からだ冒険クイズ #からぼう`;
}

export function ShareButtons({ result, categoryIcon }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText(result);
  const encodedText = encodeURIComponent(shareText);

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLineShare = () => {
    const url = `https://social-plugins.line.me/lineit/share?text=${encodedText}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "からだ冒険クイズ",
        text: shareText,
      });
    } catch {
      // share cancelled
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground text-center">結果をシェア</p>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleTwitterShare}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleLineShare}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#06C755">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINE
        </Button>
        {"share" in navigator && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleNativeShare}
          >
            <Share2 className="h-4 w-4" />
            シェア
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleCopyLink}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {copied ? "コピー済" : "コピー"}
        </Button>
      </div>
    </div>
  );
}
