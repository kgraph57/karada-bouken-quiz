import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";

export const metadata = {
  title: "カテゴリ選択",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-2">冒険の地図</h1>
        <p className="text-muted-foreground mb-6">
          気になるカテゴリを選んで、からだの冒険に出発しよう！
        </p>

        {/* クイックアクション */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/quiz/daily"
            className="flex-1 flex items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Calendar className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-heading font-bold text-sm">
                デイリーチャレンジ
              </p>
              <p className="text-xs text-muted-foreground">毎日変わる10問</p>
            </div>
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 flex items-center gap-2 rounded-2xl border-2 border-indigo-200 bg-indigo-50/80 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Trophy className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-heading font-bold text-sm">ランキング</p>
              <p className="text-xs text-muted-foreground">冒険者の順位</p>
            </div>
          </Link>
        </div>

        <div className="grid gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/quiz/${category.slug}/play`}
              className="group flex items-center gap-4 rounded-2xl border-2 bg-white/80 p-5 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-4xl shrink-0">{category.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {category.description}
                </p>
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                10問
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
