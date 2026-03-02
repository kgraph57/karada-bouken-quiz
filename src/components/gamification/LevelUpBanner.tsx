"use client";

import { motion } from "framer-motion";
import type { LevelDefinition } from "@/types/gamification";

interface LevelUpBannerProps {
  readonly previousLevel: LevelDefinition;
  readonly newLevel: LevelDefinition;
}

export function LevelUpBanner({
  previousLevel,
  newLevel,
}: LevelUpBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-5 text-center space-y-2"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl"
      >
        {newLevel.icon}
      </motion.div>
      <p className="text-sm text-amber-600 font-medium">レベルアップ！</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">
          Lv.{previousLevel.level} {previousLevel.title}
        </span>
        <span className="text-amber-500">→</span>
        <span className="font-heading font-bold text-lg text-amber-700">
          Lv.{newLevel.level} {newLevel.title}
        </span>
      </div>
    </motion.div>
  );
}
