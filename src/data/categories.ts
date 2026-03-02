import type { Category } from "@/types/quiz";

export const CATEGORIES: readonly Category[] = [
  {
    slug: "skeleton",
    name: "骨格系",
    description: "206個の骨が作る、驚きのフレームワーク",
    icon: "🦴",
    color: "amber",
    order: 1,
  },
  {
    slug: "muscle",
    name: "筋肉系",
    description: "600以上の筋肉が生み出す、動きの芸術",
    icon: "💪",
    color: "red",
    order: 2,
  },
  {
    slug: "circulatory",
    name: "循環器系",
    description: "休むことなく全身を巡る、命のネットワーク",
    icon: "❤️",
    color: "rose",
    order: 3,
  },
  {
    slug: "respiratory",
    name: "呼吸器系",
    description: "1日2万回の呼吸を支える、ガス交換の達人",
    icon: "🫁",
    color: "sky",
    order: 4,
  },
  {
    slug: "digestive",
    name: "消化器系",
    description: "9メートルの旅で食べ物を栄養に変える工場",
    icon: "🍽️",
    color: "orange",
    order: 5,
  },
  {
    slug: "nervous",
    name: "神経系",
    description: "860億のニューロンが織りなす、超高速ネットワーク",
    icon: "🧠",
    color: "purple",
    order: 6,
  },
  {
    slug: "immune",
    name: "免疫系",
    description: "24時間戦い続ける、体の最強防衛軍",
    icon: "🛡️",
    color: "green",
    order: 7,
  },
  {
    slug: "sensory",
    name: "感覚器系",
    description: "5つの感覚で世界を捉える、驚異のセンサー群",
    icon: "👁️",
    color: "indigo",
    order: 8,
  },
  {
    slug: "endocrine",
    name: "内分泌系",
    description: "微量のホルモンで体全体をコントロールする司令塔",
    icon: "⚗️",
    color: "teal",
    order: 9,
  },
  {
    slug: "skin",
    name: "皮膚・外皮系",
    description: "体最大の臓器が守る、外界との境界線",
    icon: "🧤",
    color: "yellow",
    order: 10,
  },
] as const;

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
