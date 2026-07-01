import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getFeedbackAgg,
  getGlobalTotals,
  getSkillStats,
} from "@/lib/stats-server";
import { getSkillById } from "@/lib/skills";

export default async function AdminStatsPage() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!adminEmail || !user || user.email !== adminEmail) {
    redirect("/");
  }

  const [totals, skillStats, feedback] = await Promise.all([
    getGlobalTotals(),
    getSkillStats(),
    getFeedbackAgg(),
  ]);

  const feedbackMap = new Map(feedback.map((f) => [f.skill_id, f]));

  const enriched = skillStats
    .map((s) => {
      const skill = getSkillById(s.skill_id);
      const fb = feedbackMap.get(s.skill_id);
      const likeTotal = (fb?.likes ?? 0) + (fb?.dislikes ?? 0);
      const likePct =
        likeTotal > 0
          ? Math.round(((fb?.likes ?? 0) / likeTotal) * 100)
          : null;
      return { ...s, name: skill?.name ?? s.skill_id, likePct, fb };
    })
    .sort((a, b) => b.copies - a.copies);

  const topCopied = enriched.slice(0, 10);
  const topGithub = [...enriched]
    .sort((a, b) => b.github_clicks - a.github_clicks)
    .slice(0, 10);
  const lowestRated = [...enriched]
    .filter((s) => s.fb && s.fb.likes + s.fb.dislikes >= 3)
    .sort((a, b) => (a.likePct ?? 100) - (b.likePct ?? 100))
    .slice(0, 10);

  return (
    <div className="profile-page" style={{ maxWidth: 960 }}>
      <Link href="/" className="back-link">
        ← Back to skills
      </Link>
      <div className="profile-header">
        <h1 className="profile-title">Admin stats</h1>
        <p className="profile-subtitle">Global site analytics</p>
      </div>

      {totals && (
        <section className="profile-section">
          <h3>Totals</h3>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{totals.copies}</div>
              <div className="stat-label">Copies</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totals.github_clicks}</div>
              <div className="stat-label">GitHub clicks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totals.installs_yes}</div>
              <div className="stat-label">Install yes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totals.installs_no}</div>
              <div className="stat-label">Install no</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {totals.likes + totals.dislikes > 0
                  ? `${Math.round((totals.likes / (totals.likes + totals.dislikes)) * 100)}%`
                  : "—"}
              </div>
              <div className="stat-label">Liked</div>
            </div>
          </div>
        </section>
      )}

      <AdminTable title="Top copied" rows={topCopied} />
      <AdminTable title="Top GitHub clicks" rows={topGithub} />
      <AdminTable title="Lowest rated (min 3 votes)" rows={lowestRated} />
    </div>
  );
}

function AdminTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    name: string;
    copies: number;
    github_clicks: number;
    installs_yes: number;
    installs_no: number;
    likePct: number | null;
  }>;
}) {
  if (rows.length === 0) return null;

  return (
    <section className="profile-section">
      <h3>{title}</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Skill</th>
            <th>Copies</th>
            <th>GitHub</th>
            <th>Install Y/N</th>
            <th>Liked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.copies}</td>
              <td>{row.github_clicks}</td>
              <td>
                {row.installs_yes}/{row.installs_no}
              </td>
              <td>
                {row.likePct !== null ? `${row.likePct}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
