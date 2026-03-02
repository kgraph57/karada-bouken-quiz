"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerReturn {
  readonly timeRemaining: number;
  readonly elapsed: number;
  readonly isRunning: boolean;
  readonly isExpired: boolean;
  readonly start: () => void;
  readonly stop: () => number;
  readonly reset: (newDuration: number) => void;
}

export function useTimer(durationSeconds: number): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = durationSeconds - timeRemaining;
  const isExpired = timeRemaining <= 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const stop = useCallback((): number => {
    clearTimer();
    setIsRunning(false);
    return elapsed;
  }, [clearTimer, elapsed]);

  const reset = useCallback(
    (newDuration: number) => {
      clearTimer();
      setTimeRemaining(newDuration);
      setIsRunning(false);
      startTimeRef.current = null;
    },
    [clearTimer]
  );

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  return {
    timeRemaining,
    elapsed,
    isRunning,
    isExpired,
    start,
    stop,
    reset,
  };
}
