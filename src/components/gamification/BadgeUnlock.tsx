"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BadgeDefinition } from "@/types/gamification";

interface BadgeUnlockProps {
  readonly badge: BadgeDefinition | null;
  readonly show: boolean;
  readonly onClose: () => void;
}

const rarityColors: Record<string, string> = {
  common: "from-gray-100 to-gray-200 border-gray-300",
  rare: "from-sky-100 to-blue-200 border-sky-400",
  epic: "from-purple-100 to-violet-200 border-purple-400",
  legendary: "from-amber-100 to-yellow-200 border-amber-400",
};

const rarityLabels: Record<string, string> = {
  common: "コモン",
  rare: "レア",
  epic: "エピック",
  legendary: "レジェンダリー",
};

export function BadgeUnlock({ badge, show, onClose }: BadgeUnlockProps) {
  if (!badge) return null;

  const colorClass = rarityColors[badge.rarity] ?? rarityColors.common;
  const rarityLabel = rarityLabels[badge.rarity] ?? "";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className={`mx-4 rounded-3xl border-2 bg-gradient-to-br ${colorClass} p-8 text-center max-w-sm`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium text-muted-foreground mb-2">
              バッジ獲得！
            </p>
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl mb-4"
            >
              {badge.icon}
            </motion.div>
            <h2 className="font-heading text-xl font-bold mb-1">
              {badge.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {badge.description}
            </p>
            <span className="inline-block rounded-full bg-white/50 px-3 py-1 text-xs font-medium">
              {rarityLabel}
            </span>
            <button
              onClick={onClose}
              className="mt-6 block w-full rounded-xl bg-white/80 py-2 text-sm font-medium hover:bg-white transition-colors"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
