"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XPCalculation } from "@/types/gamification";

interface XPGainProps {
  readonly xp: XPCalculation | null;
  readonly show: boolean;
}

export function XPGain({ xp, show }: XPGainProps) {
  if (!xp) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-1"
        >
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-primary"
          >
            +{xp.totalXP} XP
          </motion.span>

          <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground">
            {xp.baseXP > 0 && <span>基本 {xp.baseXP}</span>}
            {xp.difficultyBonus > 0 && (
              <span className="text-amber-500">+難易度 {xp.difficultyBonus}</span>
            )}
            {xp.speedBonus > 0 && (
              <span className="text-sky-500">+速答 {xp.speedBonus}</span>
            )}
            {xp.streakBonus > 0 && (
              <span className="text-orange-500">+連続 {xp.streakBonus}</span>
            )}
            {xp.perfectBonus > 0 && (
              <span className="text-purple-500">+パーフェクト {xp.perfectBonus}</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
