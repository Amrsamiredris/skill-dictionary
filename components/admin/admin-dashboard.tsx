"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdminDashboardData } from "@/lib/admin-data";
import type { VercelAnalyticsSnapshot } from "@/lib/vercel-metrics";
import { SKILLS } from "@/lib/skills";

type Tab = "overview" | "skills" | "activity" | "users" | "messages" | "traffic";

export function AdminDashboard({
  data,
  vercel,
}: {
  data: AdminDashboardData;
  vercel: VercelAnalyticsSnapshot;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [skillSearch, setSkillSearch] = useState("");

  const totals = data.totals;
  const likePct =
    totals && totals.likes + totals.dislikes > 0
      ? Math.round((totals.likes / (totals.likes + totals.dislikes)) * 100)
      : null;

  const filteredSkills = data.skills.filter((s) => {
    const q = skillSearch.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.skill_id.toLowerCase().includes(q)
    );
  });

  const maxDaily = Math.max(...data.dailyEvents.map((d) => d.total), 1);
  const maxVercelDay = Math.max(...vercel.pageviewsByDay.map((d) => d.count), 1);

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">skill / dict</p>
          <h1 className="admin-title">Admin dashboard</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link href="/" className="admin-ghost-btn">
            View site
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="admin-ghost-btn">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Dashboard sections">
        {(
          [
            ["overview", "Overview"],
            ["skills", "All skills"],
            ["activity", "Activity"],
            ["users", "Users"],
            ["messages", "Messages"],
            ["traffic", "Vercel traffic"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`admin-tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="admin-panel">
          <div className="admin-kpi-grid">
            <Kpi label="Skills in catalog" value={String(SKILLS.length)} />
            <Kpi label="Total copies" value={String(totals?.copies ?? 0)} accent />
            <Kpi label="GitHub clicks" value={String(totals?.github_clicks ?? 0)} />
            <Kpi
              label="Install yes / no"
              value={`${totals?.installs_yes ?? 0} / ${totals?.installs_no ?? 0}`}
            />
            <Kpi
              label="Likes / dislikes"
              value={`${totals?.likes ?? 0} / ${totals?.dislikes ?? 0}`}
            />
            <Kpi label="Overall liked" value={likePct !== null ? `${likePct}%` : "—"} />
            <Kpi label="Registered users" value={String(data.profiles.length)} />
            <Kpi label="Pageviews (7d)" value={String(vercel.pageviews7d)} />
            <Kpi label="Visitors (7d)" value={String(vercel.visitors7d)} />
            <Kpi label="Recent sessions" value={String(data.uniqueSessions)} />
          </div>

          <div className="admin-split">
            <section className="admin-card">
              <h2>Skill events — last 30 days</h2>
              <BarChart
                items={data.dailyEvents.map((d) => ({
                  label: d.day.slice(5),
                  value: d.total,
                  max: maxDaily,
                }))}
              />
            </section>
            <section className="admin-card">
              <h2>Event breakdown (recent)</h2>
              <ul className="admin-breakdown">
                {Object.entries(data.eventBreakdown).map(([type, count]) => (
                  <li key={type}>
                    <span>{formatEvent(type)}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="admin-split">
            <section className="admin-card">
              <h2>Top copied skills</h2>
              <MiniTable
                headers={["Skill", "Copies", "GitHub", "Liked"]}
                rows={data.skills.slice(0, 8).map((s) => [
                  s.name,
                  String(s.copies),
                  String(s.github_clicks),
                  s.likePct !== null ? `${s.likePct}%` : "—",
                ])}
              />
            </section>
            <section className="admin-card">
              <h2>Lowest rated (3+ votes)</h2>
              <MiniTable
                headers={["Skill", "Liked", "Votes"]}
                rows={data.skills
                  .filter((s) => s.likes + s.dislikes >= 3)
                  .sort((a, b) => (a.likePct ?? 100) - (b.likePct ?? 100))
                  .slice(0, 8)
                  .map((s) => [
                    s.name,
                    s.likePct !== null ? `${s.likePct}%` : "—",
                    String(s.likes + s.dislikes),
                  ])}
              />
            </section>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <input
              type="search"
              className="admin-search"
              placeholder="Search skills…"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />
            <span className="admin-muted">{filteredSkills.length} skills</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-wide">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>GitHub</th>
                  <th>Install Y</th>
                  <th>Install N</th>
                  <th>👍</th>
                  <th>👎</th>
                  <th>Liked</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((s) => (
                  <tr key={s.skill_id}>
                    <td>{s.name}</td>
                    <td>{s.category}</td>
                    <td>{s.copies}</td>
                    <td>{s.github_clicks}</td>
                    <td>{s.installs_yes}</td>
                    <td>{s.installs_no}</td>
                    <td>{s.likes}</td>
                    <td>{s.dislikes}</td>
                    <td>{s.likePct !== null ? `${s.likePct}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="admin-panel admin-split">
          <section className="admin-card">
            <h2>Recent events</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Skill</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentEvents.map((e) => (
                    <tr key={e.id}>
                      <td>{formatTime(e.created_at)}</td>
                      <td>{formatEvent(e.event_type)}</td>
                      <td>{e.skill_id}</td>
                      <td>{e.user_id ? "signed in" : "anon"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card">
            <h2>Recent feedback</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Skill</th>
                    <th>Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {data.feedbackRows.map((f) => (
                    <tr key={f.id}>
                      <td>{formatTime(f.created_at)}</td>
                      <td>{f.skill_id}</td>
                      <td>{f.vote === 1 ? "👍" : "👎"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-panel">
          <section className="admin-card">
            <h2>Registered profiles ({data.profiles.length})</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Public</th>
                    <th>Joined</th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {data.profiles.map((p) => (
                    <tr key={p.id}>
                      <td>@{p.username}</td>
                      <td>{p.is_public ? "Yes" : "No"}</td>
                      <td>{formatDate(p.created_at)}</td>
                      <td>
                        {p.is_public ? (
                          <a href={`/u/${p.username}`} className="admin-link">
                            /u/{p.username}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === "messages" && (
        <div className="admin-panel">
          <section className="admin-card">
            <h2>Contact messages ({data.contactMessages.length})</h2>
            {data.contactMessages.length === 0 ? (
              <p className="admin-muted">No messages yet.</p>
            ) : (
              <ul className="admin-messages">
                {data.contactMessages.map((m) => (
                  <li key={m.id} className="admin-message">
                    <div className="admin-message-meta">
                      <time>{formatTime(m.created_at)}</time>
                      {m.user_id && <span>user {m.user_id.slice(0, 8)}…</span>}
                    </div>
                    <p>{m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === "traffic" && (
        <div className="admin-panel">
          {!vercel.configured ? (
            <section className="admin-card admin-notice">
              <h2>Vercel Analytics not configured</h2>
              <p>
                Add <code>VERCEL_ACCESS_TOKEN</code>, <code>VERCEL_TEAM_ID</code>,
                and <code>VERCEL_PROJECT_ID</code> to your Vercel env vars to
                pull live traffic data.
              </p>
            </section>
          ) : (
            <>
              <div className="admin-kpi-grid">
                <Kpi label="Pageviews (7d)" value={String(vercel.pageviews7d)} accent />
                <Kpi label="Unique visitors (7d)" value={String(vercel.visitors7d)} />
              </div>
              <section className="admin-card">
                <h2>Pageviews by day</h2>
                <BarChart
                  items={vercel.pageviewsByDay.map((d) => ({
                    label: d.day.slice(5),
                    value: d.count,
                    max: maxVercelDay,
                  }))}
                />
              </section>
              <div className="admin-split">
                <RankList title="Top pages" items={vercel.topPages} />
                <RankList title="Top countries" items={vercel.topCountries} />
                <RankList title="Devices" items={vercel.topDevices} />
                <RankList title="Referrers" items={vercel.topReferrers} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`admin-kpi${accent ? " accent" : ""}`}>
      <div className="admin-kpi-value">{value}</div>
      <div className="admin-kpi-label">{label}</div>
    </div>
  );
}

function BarChart({
  items,
}: {
  items: Array<{ label: string; value: number; max: number }>;
}) {
  if (items.length === 0) {
    return <p className="admin-muted">No data yet.</p>;
  }
  return (
    <div className="admin-bars">
      {items.map((item) => (
        <div key={item.label} className="admin-bar-row">
          <span className="admin-bar-label">{item.label}</span>
          <div className="admin-bar-track">
            <div
              className="admin-bar-fill"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
          <span className="admin-bar-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function MiniTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RankList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; count: number }>;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <section className="admin-card">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="admin-muted">No data.</p>
      ) : (
        <ul className="admin-rank-list">
          {items.map((item) => (
            <li key={item.label}>
              <span className="admin-rank-label">{item.label || "(direct)"}</span>
              <div className="admin-bar-track compact">
                <div
                  className="admin-bar-fill alt"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatEvent(type: string): string {
  return type.replace(/_/g, " ");
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}
