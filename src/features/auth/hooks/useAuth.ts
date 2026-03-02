"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UseAuthReturn {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly isConfigured: boolean;
  readonly signInWithGoogle: () => Promise<void>;
  readonly signInWithEmail: (email: string, password: string) => Promise<void>;
  readonly signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  readonly signOut: () => Promise<void>;
}

const noop = async () => {};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured],
  );

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/karada-bouken-quiz/quiz`,
      },
    });
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
    },
    [supabase],
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!supabase) return;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) throw new Error(error.message);
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  if (!configured) {
    return {
      user: null,
      isLoading: false,
      isConfigured: false,
      signInWithGoogle: noop,
      signInWithEmail: noop,
      signUp: noop,
      signOut: noop,
    };
  }

  return {
    user,
    isLoading,
    isConfigured: true,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
  };
}
