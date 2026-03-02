"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  readonly current: number;
  readonly total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-heading font-bold text-muted-foreground">
          Q{current}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < current ? "bg-primary" : "bg-muted",
              i === current - 1 && "bg-primary shadow-sm",
            )}
          />
        ))}
      </div>
    </div>
  );
}
