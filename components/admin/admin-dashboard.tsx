"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AdminDashboardData, SkillEvent } from "@/lib/admin-data";
import type { VercelAnalyticsSnapshot } from "@/lib/vercel-metrics";
import { SKILLS } from "@/lib/skills";
import {
  DonutChart,
  MetricTrend,
  TimeSeriesChart,
} from "@/components/admin/admin-charts";

type Tab =
  | "overview"
  | "trends"
  | "skills"
  | "events"
  | "inbox"
  | "users"
  | "traffic";

type SortKey =
  | "name"
  | "category"
  | "copies"
  | "github_clicks"
  | "installs_yes"
  | "installs_no"
  | "likes"
  | "dislikes"
  | "likePct";

export function AdminDashboard({
  data,
  vercel,
}: {
  data: AdminDashboardData;
  vercel: VercelAnalyticsSnapshot;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [skillSearch, setSkillSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("copies");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [chartMode, setChartMode] = useState<"daily" | "weekly">("daily");
  const [eventFilter, setEventFilter] = useState("all");
  const [eventSearch, setEventSearch] = useState("");

  const totals = data.totals;
  const likePct =
    totals && totals.likes + totals.dislikes > 0
      ? Math.round((totals.likes / (totals.likes + totals.dislikes)) * 100)
      : null;

  const chartData =
    chartMode === "daily" ? data.dailyEvents : data.weeklyEvents;

  const recentDaily = data.dailyEvents;
  const last7 = recentDaily.slice(-7);
  const prev7 = recentDaily.slice(-14, -7);
  const sumWeek = (days: typeof last7, key: keyof (typeof last7)[0]) =>
    days.reduce((s, d) => s + (Number(d[key]) || 0), 0);

  const filteredSkills = useMemo(() => {
    const q = skillSearch.toLowerCase();
    let rows = data.skills.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.skill_id.toLowerCase().includes(q)
      );
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? (sortKey === "name" || sortKey === "category" ? "" : 0);
      const bv = b[sortKey] ?? (sortKey === "name" || sortKey === "category" ? "" : 0);
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? Number(av) - Number(bv)
        : Number(bv) - Number(av);
    });
    return rows;
  }, [data.skills, skillSearch, sortKey, sortDir]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.toLowerCase();
    return data.allEvents.filter((e) => {
      if (eventFilter !== "all" && e.event_type !== eventFilter) return false;
      if (!q) return true;
      return (
        e.skill_name.toLowerCase().includes(q) ||
        e.skill_id.toLowerCase().includes(q) ||
        e.event_type.toLowerCase().includes(q) ||
        (e.session_id ?? "").toLowerCase().includes(q)
      );
    });
  }, [data.allEvents, eventFilter, eventSearch]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

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
            ["trends", "Trends"],
            ["skills", `All skills (${SKILLS.length})`],
            ["events", `Event log (${data.allEvents.length})`],
            ["inbox", `Inbox (${data.contactMessages.length})`],
            ["users", `Users (${data.profiles.length})`],
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
            <Kpi label="Total events" value={String(data.authBreakdown.totalEvents)} />
            <Kpi label="Unique sessions" value={String(data.authBreakdown.uniqueSessions)} />
            <Kpi
              label="Signed-in users"
              value={String(data.authBreakdown.uniqueSignedInUsers)}
            />
            <Kpi label="Pageviews (7d)" value={String(vercel.pageviews7d)} />
          </div>

          <div className="admin-split">
            <section className="admin-card">
              <div className="admin-card-header">
                <h2>Anonymous vs signed-in</h2>
              </div>
              <DonutChart
                segments={[
                  {
                    label: "Anonymous",
                    value: data.authBreakdown.anonymousEvents,
                    color: "var(--muted)",
                  },
                  {
                    label: "Signed in",
                    value: data.authBreakdown.signedInEvents,
                    color: "var(--accent)",
                  },
                ]}
              />
              <div className="admin-auth-stats">
                <span>{data.authBreakdown.anonymousPct}% anonymous</span>
                <span>{data.authBreakdown.signedInPct}% signed in</span>
                <span>{data.authBreakdown.uniqueSessions} unique sessions</span>
              </div>
            </section>
            <section className="admin-card">
              <h2>All-time event types</h2>
              <ul className="admin-breakdown">
                {Object.entries(data.globalEventBreakdown).map(([type, count]) => (
                  <li key={type}>
                    <span>{formatEvent(type)}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>Event trends</h2>
              <div className="admin-toggle-group">
                <button
                  type="button"
                  className={`admin-toggle${chartMode === "daily" ? " active" : ""}`}
                  onClick={() => setChartMode("daily")}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={`admin-toggle${chartMode === "weekly" ? " active" : ""}`}
                  onClick={() => setChartMode("weekly")}
                >
                  Weekly
                </button>
              </div>
            </div>
            <TimeSeriesChart data={chartData} mode={chartMode} metric="stacked" />
          </section>

          <section className="admin-card">
            <h2>Week-over-week (last 7 vs prior 7 days)</h2>
            <div className="admin-trend-grid">
              <MetricTrend
                label="Copies"
                current={sumWeek(last7, "copy")}
                previous={sumWeek(prev7, "copy")}
              />
              <MetricTrend
                label="GitHub"
                current={sumWeek(last7, "github_click")}
                previous={sumWeek(prev7, "github_click")}
              />
              <MetricTrend
                label="Install yes"
                current={sumWeek(last7, "install_yes")}
                previous={sumWeek(prev7, "install_yes")}
              />
              <MetricTrend
                label="Total events"
                current={sumWeek(last7, "total")}
                previous={sumWeek(prev7, "total")}
              />
            </div>
          </section>
        </div>
      )}

      {tab === "trends" && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <span className="admin-muted">Last 90 days</span>
            <div className="admin-toggle-group">
              <button
                type="button"
                className={`admin-toggle${chartMode === "daily" ? " active" : ""}`}
                onClick={() => setChartMode("daily")}
              >
                Daily
              </button>
              <button
                type="button"
                className={`admin-toggle${chartMode === "weekly" ? " active" : ""}`}
                onClick={() => setChartMode("weekly")}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="admin-split">
            <section className="admin-card">
              <h2>Total events</h2>
              <TimeSeriesChart data={chartData} mode={chartMode} metric="total" />
            </section>
            <section className="admin-card">
              <h2>By type (stacked)</h2>
              <TimeSeriesChart data={chartData} mode={chartMode} metric="stacked" />
            </section>
          </div>
          <section className="admin-card">
            <h2>Daily breakdown table</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Copies</th>
                    <th>GitHub</th>
                    <th>Install Y</th>
                    <th>Install N</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.dailyEvents].reverse().map((d) => (
                    <tr key={d.day}>
                      <td>{d.day}</td>
                      <td>{d.copy}</td>
                      <td>{d.github_click}</td>
                      <td>{d.install_yes}</td>
                      <td>{d.install_no}</td>
                      <td><strong>{d.total}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
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
            <span className="admin-muted">
              Showing {filteredSkills.length} of {SKILLS.length} skills
            </span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-wide">
              <thead>
                <tr>
                  <SortTh label="Skill" sortKey="name" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="Category" sortKey="category" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="Copies" sortKey="copies" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="GitHub" sortKey="github_clicks" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="Install Y" sortKey="installs_yes" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="Install N" sortKey="installs_no" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="👍" sortKey="likes" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="👎" sortKey="dislikes" current={sortKey} dir={sortDir} onSort={toggleSort} />
                  <SortTh label="Liked %" sortKey="likePct" current={sortKey} dir={sortDir} onSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((s) => (
                  <tr key={s.skill_id} className={s.copies === 0 ? "admin-row-dim" : ""}>
                    <td>
                      <span className="admin-skill-name">{s.name}</span>
                      <span className="admin-skill-id">{s.skill_id}</span>
                    </td>
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

      {tab === "events" && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <input
              type="search"
              className="admin-search"
              placeholder="Search skill, session…"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
            />
            <select
              className="admin-select"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option value="all">All events</option>
              <option value="copy">Copy</option>
              <option value="github_click">GitHub click</option>
              <option value="install_yes">Install yes</option>
              <option value="install_no">Install no</option>
            </select>
            <span className="admin-muted">
              {filteredEvents.length} of {data.allEvents.length} events
            </span>
          </div>
          <section className="admin-card">
            <h2>Raw event log</h2>
            <div className="admin-table-wrap admin-table-tall">
              <table className="admin-table admin-table-wide">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event</th>
                    <th>Skill</th>
                    <th>Auth</th>
                    <th>Session ID</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card">
            <h2>Recent feedback votes</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Skill</th>
                    <th>Vote</th>
                    <th>Auth</th>
                    <th>Session</th>
                  </tr>
                </thead>
                <tbody>
                  {data.feedbackRows.map((f) => (
                    <tr key={f.id}>
                      <td>{formatTime(f.created_at)}</td>
                      <td>{f.skill_name}</td>
                      <td>{f.vote === 1 ? "👍" : "👎"}</td>
                      <td>{f.user_id ? "signed in" : "anon"}</td>
                      <td className="admin-mono">{truncate(f.session_id, 12)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === "inbox" && (
        <div className="admin-panel">
          <section className="admin-card">
            <h2>Contact inbox ({data.contactMessages.length})</h2>
            {data.contactMessages.length === 0 ? (
              <p className="admin-muted">No messages yet.</p>
            ) : (
              <ul className="admin-inbox">
                {data.contactMessages.map((m) => (
                  <li key={m.id} className="admin-inbox-item">
                    <div className="admin-inbox-header">
                      <div>
                        <strong>
                          {m.username ? `@${m.username}` : "Anonymous user"}
                        </strong>
                        <time>{formatTime(m.created_at)}</time>
                      </div>
                      {m.user_id && (
                        <span className="admin-mono admin-inbox-id">
                          {m.user_id.slice(0, 8)}…
                        </span>
                      )}
                    </div>
                    <p className="admin-inbox-body">{m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-panel">
          <section className="admin-card">
            <h2>Registered users ({data.usersWithStats.length})</h2>
            <div className="admin-table-wrap">
              <table className="admin-table admin-table-wide">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Public</th>
                    <th>Joined</th>
                    <th>Copies</th>
                    <th>GitHub</th>
                    <th>Installs</th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {data.usersWithStats.map((u) => (
                    <tr key={u.id}>
                      <td>@{u.username}</td>
                      <td>
                        <span className={`admin-badge${u.is_public ? " public" : ""}`}>
                          {u.is_public ? "Public" : "Private"}
                        </span>
                      </td>
                      <td>{formatDate(u.created_at)}</td>
                      <td>{u.totalCopies}</td>
                      <td>{u.totalGithub}</td>
                      <td>{u.totalInstalls}</td>
                      <td>
                        {u.is_public ? (
                          <Link href={`/u/${u.username}`} className="admin-link">
                            /u/{u.username}
                          </Link>
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

      {tab === "traffic" && (
        <div className="admin-panel">
          {!vercel.configured ? (
            <section className="admin-card admin-notice">
              <h2>Vercel Analytics not configured</h2>
              <p>
                Add <code>VERCEL_ACCESS_TOKEN</code>, <code>VERCEL_TEAM_ID</code>,
                and <code>VERCEL_PROJECT_ID</code> to your Vercel env vars.
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
                <TimeSeriesChart
                  data={vercel.pageviewsByDay.map((d) => ({
                    day: d.day,
                    copy: 0,
                    github_click: 0,
                    install_yes: 0,
                    install_no: 0,
                    total: d.count,
                  }))}
                  mode="daily"
                  metric="total"
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

function EventRow({ event }: { event: SkillEvent }) {
  return (
    <tr>
      <td>{formatTime(event.created_at)}</td>
      <td>
        <span className={`admin-event-pill ${event.event_type}`}>
          {formatEvent(event.event_type)}
        </span>
      </td>
      <td>
        <span>{event.skill_name}</span>
        <span className="admin-skill-id">{event.skill_id}</span>
      </td>
      <td>
        <span className={`admin-badge${event.user_id ? " signed-in" : ""}`}>
          {event.user_id ? "Signed in" : "Anonymous"}
        </span>
      </td>
      <td className="admin-mono">{truncate(event.session_id ?? "—", 14)}</td>
      <td className="admin-mono">
        {event.user_id ? truncate(event.user_id, 10) : "—"}
      </td>
    </tr>
  );
}

function SortTh({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (k: SortKey) => void;
}) {
  return (
    <th>
      <button type="button" className="admin-sort-btn" onClick={() => onSort(sortKey)}>
        {label}
        {current === sortKey && (
          <span aria-hidden="true">{dir === "asc" ? " ↑" : " ↓"}</span>
        )}
      </button>
    </th>
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

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n) + "…";
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
    second: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}
