"use client";

import { cn } from "@/lib/utils";

interface TimerProps {
  readonly timeRemaining: number;
  readonly totalTime: number;
}

export function Timer({ timeRemaining, totalTime }: TimerProps) {
  const percentage = (timeRemaining / totalTime) * 100;
  const isUrgent = timeRemaining <= 5;
  const isWarning = timeRemaining <= 10 && !isUrgent;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isUrgent && "bg-red-500 animate-pulse",
            isWarning && "bg-amber-500",
            !isUrgent && !isWarning && "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={cn(
          "text-sm font-medium tabular-nums min-w-[2.5rem] text-right",
          isUrgent && "text-red-500 font-bold",
          isWarning && "text-amber-500"
        )}
      >
        {timeRemaining}s
      </span>
    </div>
  );
}
