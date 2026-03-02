"use client";

import { Flame } from "lucide-react";

interface StreakDisplayProps {
  readonly currentStreak: number;
  readonly longestStreak: number;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
}: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <Flame
        className={`h-5 w-5 ${
          currentStreak >= 7
            ? "text-orange-500"
            : currentStreak >= 3
              ? "text-amber-500"
              : "text-gray-400"
        }`}
      />
      <div>
        <span className="font-bold text-lg">{currentStreak}</span>
        <span className="text-xs text-muted-foreground ml-1">日連続</span>
      </div>
      {longestStreak > currentStreak && (
        <span className="text-xs text-muted-foreground">
          (最長: {longestStreak}日)
        </span>
      )}
    </div>
  );
}
