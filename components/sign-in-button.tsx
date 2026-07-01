"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function SignInButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadProfile(data.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfileUsername(null);
    });

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();
      setProfileUsername(data?.username ?? null);
    }

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) return null;

  if (user && profileUsername) {
    return (
      <Link href="/profile" className="sign-in-link">
        @{profileUsername}
      </Link>
    );
  }

  if (user) {
    return (
      <Link href="/onboarding" className="sign-in-link">
        Set username
      </Link>
    );
  }

  return (
    <Link href="/profile" className="sign-in-link">
      Sign in
    </Link>
  );
}
