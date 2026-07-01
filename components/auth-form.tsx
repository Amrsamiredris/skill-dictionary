"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthForm({ redirectTo = "/onboarding" }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <p className="auth-message">
        Profiles are not configured yet. You can still browse and copy skills.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <p className="auth-message">
        Check your inbox for a magic link. You can close this tab after signing
        in.
      </p>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="auth-message">
        Want to save your stats across devices? Sign in with email — totally
        optional.
      </p>
      <input
        type="email"
        className="auth-input"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Sending…" : "Send magic link"}
      </button>
      <Link href="/" className="back-link">
        ← Back to skills
      </Link>
    </form>
  );
}
