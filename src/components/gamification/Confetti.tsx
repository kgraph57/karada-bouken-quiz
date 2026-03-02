"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONFETTI_COLORS = [
  "#f43f5e", "#8b5cf6", "#3b82f6", "#10b981",
  "#f59e0b", "#ec4899", "#06b6d4", "#84cc16",
];

const EMOJIS = ["🎉", "✨", "⭐", "🎊", "💫", "🏆"];

interface ConfettiPiece {
  readonly id: number;
  readonly x: number;
  readonly color: string;
  readonly delay: number;
  readonly rotation: number;
  readonly emoji: string | null;
}

function createPieces(count: number): readonly ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.6,
    rotation: Math.random() * 720 - 360,
    emoji: i < 6 ? EMOJIS[i] : null,
  }));
}

interface ConfettiProps {
  readonly active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<readonly ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      setPieces(createPieces(40));
      const timer = setTimeout(() => setPieces([]), 3000);
      return () => clearTimeout(timer);
    }
    setPieces([]);
  }, [active]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((piece) =>
            piece.emoji ? (
              <motion.div
                key={piece.id}
                initial={{
                  y: -20,
                  x: `${piece.x}vw`,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  y: "100vh",
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.8],
                  rotate: piece.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5,
                  delay: piece.delay,
                  ease: "easeOut",
                }}
                className="absolute text-2xl"
              >
                {piece.emoji}
              </motion.div>
            ) : (
              <motion.div
                key={piece.id}
                initial={{
                  y: -10,
                  x: `${piece.x}vw`,
                  opacity: 1,
                }}
                animate={{
                  y: "100vh",
                  opacity: [1, 1, 0],
                  rotate: piece.rotation,
                  x: `${piece.x + (Math.random() * 20 - 10)}vw`,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: piece.delay,
                  ease: "easeOut",
                }}
                className="absolute h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: piece.color }}
              />
            ),
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
