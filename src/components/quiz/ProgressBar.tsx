"use client";

interface ProgressBarProps {
  readonly current: number;
  readonly total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground font-medium">
        {current}/{total}
      </span>
      <div className="relative h-2 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">
        {percentage}%
      </span>
    </div>
  );
}
