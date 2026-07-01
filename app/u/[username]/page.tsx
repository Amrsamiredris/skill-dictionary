import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileByUsername, getUserSkillStats } from "@/lib/stats-server";
import { getSkillById } from "@/lib/skills";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile || !profile.is_public) {
    return { title: "Profile — skill / dict" };
  }
  return {
    title: `@${profile.username} — skill / dict`,
    description: `See ${profile.username}'s skill usage on skill / dict`,
    openGraph: {
      title: `@${profile.username} on skill / dict`,
      description: "AI agent skill usage stats",
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) notFound();

  if (!profile.is_public) {
    return (
      <div className="profile-page">
        <Link href="/" className="back-link">
          ← Back to skills
        </Link>
        <h1 className="profile-title">Private profile</h1>
        <p className="profile-subtitle">
          @{username} has chosen to keep their profile private.
        </p>
      </div>
    );
  }

  const stats = await getUserSkillStats(profile.id);
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
      </div>

      <section className="profile-section">
        <h3>Stats</h3>
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
        <p className="auth-message">No activity yet.</p>
      )}
    </div>
  );
}
