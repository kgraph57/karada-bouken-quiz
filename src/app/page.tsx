import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Brain, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
      {/* ヒーロー */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center gap-3 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🦴
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
              🧠
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              ❤️
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            からだ冒険クイズ
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Dr.おかもん監修</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            あなたの体をめぐる知的冒険。
            <br />
            医師監修のクイズで「へぇ！」を体験しよう。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 text-lg px-8">
              <Link href="/quiz">
                冒険をはじめる
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/quiz/daily">
                <Calendar className="h-5 w-5" />
                今日のチャレンジ
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white/80 p-6 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-heading font-bold text-lg">へぇ！の連続</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                正解・不正解に関わらず、驚きの解説で楽しく学べる
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-6 text-center">
              <Heart className="mx-auto h-8 w-8 text-rose-500 mb-3" />
              <h3 className="font-heading font-bold text-lg">医師監修</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                現役医師が全問題を監修。正確で信頼できる情報
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-6 text-center">
              <Brain className="mx-auto h-8 w-8 text-indigo-500 mb-3" />
              <h3 className="font-heading font-bold text-lg">10カテゴリ</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                骨・筋肉・心臓・脳まで、体の全領域を冒険
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* カテゴリプレビュー */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">
            冒険の地図
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/quiz/${category.slug}/play`}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-white/80 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        <p>からだ冒険クイズ - Dr.おかもん監修</p>
        <p className="mt-1">医学的な情報は参考としてご利用ください。</p>
      </footer>
    </div>
  );
}
