"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSessionId, getLocalUsage } from "@/lib/session";
import { validateUsername } from "@/lib/username";

export function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle()
        .then(({ data: prof }) => {
          if (prof?.username) router.replace("/profile");
        });
    });
  }, [router]);

  useEffect(() => {
    const err = validateUsername(username);
    if (err || username.length < 3) {
      setAvailable(null);
      return;
    }

    const t = setTimeout(async () => {
      setChecking(true);
      const res = await fetch(
        `/api/profile?username=${encodeURIComponent(username)}`,
      );
      const data = await res.json();
      setAvailable(data.available ?? false);
      setChecking(false);
    }, 400);

    return () => clearTimeout(t);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        sessionId: getSessionId(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    await fetch("/api/migrate-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        usage: getLocalUsage(),
      }),
    });

    router.replace("/profile");
  };

  if (authed === null) {
    return (
      <div className="profile-page">
        <p className="auth-message">Loading…</p>
      </div>
    );
  }

  if (authed === false) {
    return (
      <div className="profile-page">
        <Link href="/" className="back-link">
          ← Back to skills
        </Link>
        <div className="profile-header">
          <h1 className="profile-title">Sign in first</h1>
        </div>
        <p className="auth-message">
          <Link href="/profile">Sign in with email</Link> to claim a username.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Link href="/" className="back-link">
        ← Back to skills
      </Link>
      <div className="profile-header">
        <h1 className="profile-title">Pick a username</h1>
        <p className="profile-subtitle">
          3–20 characters, lowercase letters, numbers, and hyphens.
        </p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="yourname"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]{3,20}"
        />
        {checking && <p className="auth-message">Checking availability…</p>}
        {!checking && available === true && username.length >= 3 && (
          <p className="auth-message" style={{ color: "var(--green)" }}>
            @{username} is available
          </p>
        )}
        {!checking && available === false && (
          <p className="auth-error">Username taken</p>
        )}
        {error && <p className="auth-error">{error}</p>}
        <button
          type="submit"
          className="auth-btn"
          disabled={loading || available === false}
        >
          {loading ? "Creating…" : "Claim username"}
        </button>
      </form>
    </div>
  );
}
