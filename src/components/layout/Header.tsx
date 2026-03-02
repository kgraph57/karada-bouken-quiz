"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

export function Header() {
  const { user, isLoading, isConfigured } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-heading text-lg font-bold hover:opacity-80 transition-opacity"
        >
          からだ冒険クイズ
        </Link>

        <div className="flex items-center gap-2">
          {!isConfigured ? null : isLoading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/profile">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">マイページ</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">ログイン</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
