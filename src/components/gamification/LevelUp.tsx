"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LevelDefinition } from "@/types/gamification";

interface LevelUpProps {
  readonly level: LevelDefinition | null;
  readonly show: boolean;
  readonly onClose: () => void;
}

export function LevelUp({ level, show, onClose }: LevelUpProps) {
  if (!level) return null;

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
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="mx-4 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-100 p-8 text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: [20, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-medium text-amber-600 mb-2"
            >
              LEVEL UP!
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-6xl mb-4"
            >
              {level.icon}
            </motion.div>
            <h2 className="font-heading text-2xl font-bold mb-1">
              Lv.{level.level}
            </h2>
            <p className="text-lg font-medium text-amber-800">
              {level.title}
            </p>
            <button
              onClick={onClose}
              className="mt-6 block w-full rounded-xl bg-amber-200/80 py-2 text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
