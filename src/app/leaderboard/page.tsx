"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getLevelForXP } from "@/data/levels";
import { ArrowLeft, Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  readonly id: string;
  readonly display_name: string | null;
  readonly total_xp: number;
  readonly current_level: number;
  readonly total_correct: number;
}

const RANK_ICONS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { user, isConfigured } = useAuth();
  const [entries, setEntries] = useState<readonly LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, total_xp, current_level, total_correct")
        .order("total_xp", { ascending: false })
        .limit(50);

      if (data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          カテゴリ選択に戻る
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-7 w-7 text-amber-500" />
          <h1 className="font-heading text-2xl font-bold">ランキング</h1>
        </div>

        {!isConfigured ? (
          <div className="rounded-2xl border bg-white/80 p-8 text-center">
            <Medal className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              ランキングは近日公開予定です
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ログインして冒険すると、ここにランキングが表示されます
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border bg-white/80 p-8 text-center">
            <Medal className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              まだランキングデータがありません
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              クイズに挑戦してランキングに登場しよう！
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const level = getLevelForXP(entry.total_xp);
              const isCurrentUser = user?.id === entry.id;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    isCurrentUser
                      ? "border-primary/30 bg-primary/5"
                      : "bg-white/80"
                  } ${index < 3 ? "border-amber-200" : ""}`}
                >
                  <span className="w-8 text-center text-lg font-bold">
                    {index < 3 ? RANK_ICONS[index] : `${index + 1}`}
                  </span>
                  <span className="text-xl">{level.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {entry.display_name ?? "冒険者"}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs text-primary">
                          (あなた)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lv.{level.level} {level.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {entry.total_xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
