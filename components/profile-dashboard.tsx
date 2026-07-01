"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import type { UserSkillStat } from "@/lib/types";
import { getSkillById, SKILLS } from "@/lib/skills";
import { AuthForm } from "@/components/auth-form";

export function ProfileDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserSkillStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUser({ id: data.user.id, email: data.user.email });

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!prof) {
        router.replace("/onboarding");
        return;
      }

      setProfile(prof as Profile);

      const res = await fetch("/api/profile/stats");
      if (res.ok) {
        const body = await res.json();
        setStats(body.stats ?? []);
      }

      setLoading(false);
    });
  }, [router]);

  const togglePublic = async () => {
    if (!profile) return;
    const next = !profile.is_public;
    const res = await fetch("/api/profile/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: next }),
    });
    if (res.ok) setProfile({ ...profile, is_public: next });
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: contactMsg }),
    });
    setContactLoading(false);
    if (res.ok) {
      setContactSent(true);
      setContactMsg("");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="auth-message">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1 className="profile-title">Your profile</h1>
          <p className="profile-subtitle">Optional — the catalog works without an account.</p>
        </div>
        <AuthForm redirectTo="/onboarding" />
      </div>
    );
  }

  if (!profile) return null;

  const totalCopies = stats.reduce((s, r) => s + r.copies, 0);
  const totalGithub = stats.reduce((s, r) => s + r.github_clicks, 0);
  const totalInstalled = stats.reduce((s, r) => s + r.installs_yes, 0);

  const topSkills = [...stats]
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 5);

  const catCounts: Record<string, number> = {};
  for (const row of stats) {
    const skill = getSkillById(row.skill_id);
    if (skill) {
      catCounts[skill.cat] = (catCounts[skill.cat] ?? 0) + row.copies;
    }
  }
  const topCats = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="profile-page">
      <Link href="/" className="back-link">
        ← Back to skills
      </Link>
      <div className="profile-header">
        <h1 className="profile-title">@{profile.username}</h1>
        <p className="profile-subtitle">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
        {profile.is_public && (
          <p className="profile-subtitle">
            Public profile:{" "}
            <Link href={`/u/${profile.username}`}>
              /u/{profile.username}
            </Link>
          </p>
        )}
      </div>

      <section className="profile-section">
        <h3>Your stats</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{totalCopies}</div>
            <div className="stat-label">Copies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalGithub}</div>
            <div className="stat-label">GitHub clicks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalInstalled}</div>
            <div className="stat-label">Installed (yes)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{SKILLS.length}</div>
            <div className="stat-label">Skills available</div>
          </div>
        </div>
      </section>

      {topSkills.length > 0 && (
        <section className="profile-section">
          <h3>Top skills</h3>
          <ul className="skill-list">
            {topSkills.map((row) => {
              const skill = getSkillById(row.skill_id);
              return (
                <li key={row.skill_id}>
                  <span>{skill?.name ?? row.skill_id}</span>
                  <span className="skill-count">{row.copies} copies</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {topCats.length > 0 && (
        <section className="profile-section">
          <h3>Top categories</h3>
          <ul className="skill-list">
            {topCats.map(([cat, count]) => (
              <li key={cat}>
                <span>{cat}</span>
                <span className="skill-count">{count} copies</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stats.length === 0 && (
        <section className="profile-section">
          <p className="auth-message">
            No copies yet — browse skills and start copying prompts.
          </p>
        </section>
      )}

      <section className="profile-section">
        <h3>Privacy</h3>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Public profile</div>
            <div className="toggle-hint">
              Others can see your stats at /u/{profile.username}
            </div>
          </div>
          <button
            type="button"
            className={`toggle-switch${profile.is_public ? " on" : ""}`}
            onClick={togglePublic}
            aria-pressed={profile.is_public}
            aria-label="Toggle public profile"
          />
        </div>
      </section>

      <section className="profile-section">
        <h3>Contact Amr</h3>
        {contactSent ? (
          <p className="auth-message">Message sent. Thanks!</p>
        ) : (
          <form className="contact-form" onSubmit={sendContact}>
            <textarea
              placeholder="Feedback, skill requests, or just say hi…"
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              required
              minLength={3}
            />
            <button
              type="submit"
              className="auth-btn"
              disabled={contactLoading}
              style={{ marginTop: "var(--space-3)" }}
            >
              {contactLoading ? "Sending…" : "Send message"}
            </button>
            <p className="auth-message" style={{ marginTop: "var(--space-2)" }}>
              Or email{" "}
              <a href="mailto:amrsamiredris@gmail.com">amrsamiredris@gmail.com</a>
            </p>
          </form>
        )}
      </section>

      <button
        type="button"
        className="how-it-works"
        onClick={signOut}
        style={{ marginTop: "var(--space-4)" }}
      >
        Sign out
      </button>
    </div>
  );
}
