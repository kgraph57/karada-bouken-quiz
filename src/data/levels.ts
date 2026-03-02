import type { LevelDefinition } from "@/types/gamification";

export const LEVELS: readonly LevelDefinition[] = [
  { level: 1, title: "からだ初心者", requiredXP: 0, icon: "🌱" },
  { level: 2, title: "からだ見習い", requiredXP: 100, icon: "🔰" },
  { level: 3, title: "からだ探検家", requiredXP: 300, icon: "🔍" },
  { level: 4, title: "からだ研究者", requiredXP: 600, icon: "🔬" },
  { level: 5, title: "からだ博士", requiredXP: 1000, icon: "🎓" },
  { level: 6, title: "からだマイスター", requiredXP: 1500, icon: "⭐" },
  { level: 7, title: "からだの達人", requiredXP: 2200, icon: "💎" },
  { level: 8, title: "人体マスター", requiredXP: 3000, icon: "👑" },
  { level: 9, title: "Dr.レベル", requiredXP: 4000, icon: "🏥" },
  { level: 10, title: "からだ冒険王", requiredXP: 5500, icon: "🏆" },
] as const;

export function getLevelForXP(totalXP: number): LevelDefinition {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.requiredXP) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = getLevelForXP(totalXP);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.requiredXP - totalXP;
}

export function getLevelProgress(totalXP: number): number {
  const currentLevel = getLevelForXP(totalXP);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 100;
  const levelRange = nextLevel.requiredXP - currentLevel.requiredXP;
  const progress = totalXP - currentLevel.requiredXP;
  return Math.round((progress / levelRange) * 100);
}
