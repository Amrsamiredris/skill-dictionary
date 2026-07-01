"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-eyebrow">skill / dict</p>
        <h1 className="admin-title">Admin sign in</h1>
        <p className="admin-muted">
          Restricted dashboard for site analytics and management.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link href="/" className="back-link">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
