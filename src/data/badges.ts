import type { BadgeDefinition } from "@/types/gamification";
import type { CategorySlug } from "@/types/quiz";
import { CATEGORIES } from "./categories";

function categoryBadge(slug: CategorySlug, name: string): BadgeDefinition {
  return {
    id: `category_${slug}`,
    name: `${name}マスター`,
    description: `${name}カテゴリの全問題に正解`,
    icon: CATEGORIES.find((c) => c.slug === slug)?.icon ?? "🏅",
    rarity: "rare",
    condition: { type: "category_complete", categorySlug: slug },
  };
}

export const BADGES: readonly BadgeDefinition[] = [
  // 初回系
  {
    id: "first_step",
    name: "はじめの一歩",
    description: "最初の問題に回答",
    icon: "👣",
    rarity: "common",
    condition: { type: "first_answer" },
  },

  // カテゴリ制覇 (10個)
  categoryBadge("skeleton", "骨格"),
  categoryBadge("muscle", "筋肉"),
  categoryBadge("circulatory", "循環器"),
  categoryBadge("respiratory", "呼吸器"),
  categoryBadge("digestive", "消化器"),
  categoryBadge("nervous", "神経"),
  categoryBadge("immune", "免疫"),
  categoryBadge("sensory", "感覚器"),
  categoryBadge("endocrine", "内分泌"),
  categoryBadge("skin", "皮膚"),

  // 全カテゴリ制覇
  {
    id: "all_categories",
    name: "人体マスター",
    description: "全10カテゴリを制覇",
    icon: "🏆",
    rarity: "legendary",
    condition: { type: "all_categories" },
  },

  // ストリーク
  {
    id: "streak_3",
    name: "3日連続",
    description: "3日連続でプレイ",
    icon: "🔥",
    rarity: "common",
    condition: { type: "streak", days: 3 },
  },
  {
    id: "streak_7",
    name: "1週間チャレンジ",
    description: "7日連続でプレイ",
    icon: "💪",
    rarity: "rare",
    condition: { type: "streak", days: 7 },
  },
  {
    id: "streak_30",
    name: "からだ博士への道",
    description: "30日連続でプレイ",
    icon: "🌟",
    rarity: "epic",
    condition: { type: "streak", days: 30 },
  },
  {
    id: "streak_100",
    name: "伝説の冒険者",
    description: "100日連続でプレイ",
    icon: "🏅",
    rarity: "legendary",
    condition: { type: "streak", days: 100 },
  },

  // 正解数
  {
    id: "correct_50",
    name: "50問達成",
    description: "累計50問正解",
    icon: "✨",
    rarity: "common",
    condition: { type: "total_correct", count: 50 },
  },
  {
    id: "correct_200",
    name: "200問達成",
    description: "累計200問正解",
    icon: "💫",
    rarity: "rare",
    condition: { type: "total_correct", count: 200 },
  },
  {
    id: "correct_500",
    name: "500問達成",
    description: "累計500問正解",
    icon: "🌠",
    rarity: "epic",
    condition: { type: "total_correct", count: 500 },
  },
  {
    id: "correct_1000",
    name: "千問の知識",
    description: "累計1000問正解",
    icon: "👑",
    rarity: "legendary",
    condition: { type: "total_correct", count: 1000 },
  },

  // パーフェクト
  {
    id: "perfect_1",
    name: "完璧な冒険",
    description: "セッションで全問正解を1回達成",
    icon: "🎯",
    rarity: "rare",
    condition: { type: "perfect_session", count: 1 },
  },
  {
    id: "perfect_5",
    name: "パーフェクトマスター",
    description: "全問正解を5回達成",
    icon: "💎",
    rarity: "epic",
    condition: { type: "perfect_session", count: 5 },
  },
  {
    id: "perfect_10",
    name: "無敵の冒険者",
    description: "全問正解を10回達成",
    icon: "🌈",
    rarity: "legendary",
    condition: { type: "perfect_session", count: 10 },
  },

  // スピード
  {
    id: "speed_demon",
    name: "電光石火",
    description: "5問連続で制限時間の25%以内に正解",
    icon: "⚡",
    rarity: "epic",
    condition: { type: "speed_demon", count: 5 },
  },

  // レベル
  {
    id: "level_5",
    name: "からだ博士",
    description: "レベル5に到達",
    icon: "🎓",
    rarity: "rare",
    condition: { type: "level_reached", level: 5 },
  },
  {
    id: "level_10",
    name: "からだ冒険王",
    description: "最高レベルに到達",
    icon: "🏆",
    rarity: "legendary",
    condition: { type: "level_reached", level: 10 },
  },

  // その他
  {
    id: "share_first",
    name: "知識の共有者",
    description: "初めて結果をシェア",
    icon: "📤",
    rarity: "common",
    condition: { type: "share_first" },
  },
  {
    id: "early_bird",
    name: "早起き冒険者",
    description: "朝6時前にプレイ",
    icon: "🌅",
    rarity: "rare",
    condition: { type: "time_of_day", hour: 6, direction: "before" },
  },
  {
    id: "night_owl",
    name: "夜のからだ探検家",
    description: "深夜0時以降にプレイ",
    icon: "🦉",
    rarity: "rare",
    condition: { type: "time_of_day", hour: 0, direction: "after" },
  },
] as const;

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.id === id);
}
