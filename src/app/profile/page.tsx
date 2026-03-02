"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  getLevelForXP,
  getLevelProgress,
  getXPToNextLevel,
} from "@/data/levels";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Trophy, Zap, Target, Flame } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        const supabase = createClient();
        if (!supabase) return;
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          setProfile(data as Profile);
        }
      };
      fetchProfile();
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  const level = profile ? getLevelForXP(profile.total_xp) : getLevelForXP(0);
  const progress = profile ? getLevelProgress(profile.total_xp) : 0;
  const xpToNext = profile ? getXPToNextLevel(profile.total_xp) : 100;
  const accuracy =
    profile && profile.total_questions_answered > 0
      ? Math.round(
          (profile.total_correct / profile.total_questions_answered) * 100,
        )
      : 0;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

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

        <div className="rounded-3xl border-2 bg-white/90 p-8 space-y-6">
          {/* ユーザー情報 */}
          <div className="text-center">
            <div className="text-4xl mb-2">{level.icon}</div>
            <h1 className="font-heading text-2xl font-bold">
              {profile?.display_name ?? user.email?.split("@")[0] ?? "冒険者"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{level.title}</p>
          </div>

          {/* レベル進捗 */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium">Lv.{level.level}</span>
              <span className="text-muted-foreground">
                {xpToNext > 0 ? `次のレベルまで ${xpToNext} XP` : "MAX"}
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Zap className="mx-auto h-5 w-5 text-amber-500 mb-1" />
              <p className="text-2xl font-bold">{profile?.total_xp ?? 0}</p>
              <p className="text-xs text-muted-foreground">総XP</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Target className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">正答率</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Trophy className="mx-auto h-5 w-5 text-indigo-500 mb-1" />
              <p className="text-2xl font-bold">
                {profile?.total_questions_answered ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">回答数</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Flame className="mx-auto h-5 w-5 text-orange-500 mb-1" />
              <p className="text-2xl font-bold">
                {profile?.current_streak ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">連続日数</p>
            </div>
          </div>

          {/* アクション */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href="/quiz">冒険を続ける</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
