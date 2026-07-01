import { createAdminClient } from "@/lib/supabase/admin";
import { SKILLS, getSkillById } from "@/lib/skills";
import type { FeedbackAgg, GlobalTotals, Profile, SkillStats } from "@/lib/types";
import { getFeedbackAgg, getGlobalTotals, getSkillStats } from "@/lib/stats-server";

export type SkillEvent = {
  id: string;
  skill_id: string;
  skill_name: string;
  event_type: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
};

export type SkillFeedbackRow = {
  id: string;
  skill_id: string;
  skill_name: string;
  vote: number;
  session_id: string;
  user_id: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  user_id: string | null;
  username: string | null;
  message: string;
  skill_id: string | null;
  created_at: string;
};

export type DailyEventCount = {
  day: string;
  copy: number;
  github_click: number;
  install_yes: number;
  install_no: number;
  total: number;
};

export type WeeklyEventCount = {
  week: string;
  weekLabel: string;
  copy: number;
  github_click: number;
  install_yes: number;
  install_no: number;
  total: number;
};

export type EnrichedSkillRow = SkillStats & {
  name: string;
  category: string;
  likes: number;
  dislikes: number;
  likePct: number | null;
};

export type AuthBreakdown = {
  totalEvents: number;
  anonymousEvents: number;
  signedInEvents: number;
  anonymousPct: number;
  signedInPct: number;
  uniqueSessions: number;
  uniqueSignedInUsers: number;
};

export type UserWithStats = Profile & {
  totalCopies: number;
  totalGithub: number;
  totalInstalls: number;
};

export type AdminDashboardData = {
  totals: GlobalTotals | null;
  skills: EnrichedSkillRow[];
  allEvents: SkillEvent[];
  dailyEvents: DailyEventCount[];
  weeklyEvents: WeeklyEventCount[];
  profiles: Profile[];
  usersWithStats: UserWithStats[];
  contactMessages: ContactMessage[];
  feedbackRows: SkillFeedbackRow[];
  globalEventBreakdown: Record<string, number>;
  authBreakdown: AuthBreakdown;
  vercelConfigured: boolean;
};

export async function getAllEvents(limit = 500): Promise<SkillEvent[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("skill_events")
    .select("id, skill_id, event_type, user_id, session_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Omit<SkillEvent, "skill_name">[]).map((e) => ({
    ...e,
    skill_name: getSkillById(e.skill_id)?.name ?? e.skill_id,
  }));
}

export async function getFeedbackRows(limit = 200): Promise<SkillFeedbackRow[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("skill_feedback")
    .select("id, skill_id, vote, session_id, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Omit<SkillFeedbackRow, "skill_name">[]).map((f) => ({
    ...f,
    skill_name: getSkillById(f.skill_id)?.name ?? f.skill_id,
  }));
}

export async function getContactMessages(
  profiles: Profile[],
  limit = 100,
): Promise<ContactMessage[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const profileMap = new Map(profiles.map((p) => [p.id, p.username]));

  const { data, error } = await admin
    .from("contact_messages")
    .select("id, user_id, message, skill_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as ContactMessage[]).map((m) => ({
    ...m,
    username: m.user_id ? profileMap.get(m.user_id) ?? null : null,
  }));
}

export async function getProfiles(): Promise<Profile[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("profiles")
    .select("id, username, display_name, is_public, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Profile[];
}

export async function getAuthBreakdown(): Promise<AuthBreakdown> {
  const admin = createAdminClient();
  const empty: AuthBreakdown = {
    totalEvents: 0,
    anonymousEvents: 0,
    signedInEvents: 0,
    anonymousPct: 0,
    signedInPct: 0,
    uniqueSessions: 0,
    uniqueSignedInUsers: 0,
  };
  if (!admin) return empty;

  const { data, error } = await admin
    .from("skill_events")
    .select("user_id, session_id");

  if (error || !data) return empty;

  const sessions = new Set<string>();
  const users = new Set<string>();
  let signedIn = 0;

  for (const row of data) {
    if (row.user_id) {
      signedIn += 1;
      users.add(row.user_id);
    }
    if (row.session_id) sessions.add(row.session_id);
  }

  const total = data.length;
  const anonymous = total - signedIn;

  return {
    totalEvents: total,
    anonymousEvents: anonymous,
    signedInEvents: signedIn,
    anonymousPct: total > 0 ? Math.round((anonymous / total) * 100) : 0,
    signedInPct: total > 0 ? Math.round((signedIn / total) * 100) : 0,
    uniqueSessions: sessions.size,
    uniqueSignedInUsers: users.size,
  };
}

export async function getGlobalEventBreakdown(): Promise<Record<string, number>> {
  const admin = createAdminClient();
  if (!admin) return {};

  const { data, error } = await admin
    .from("skill_events")
    .select("event_type");

  if (error || !data) return {};

  const breakdown: Record<string, number> = {};
  for (const row of data) {
    const t = String(row.event_type);
    breakdown[t] = (breakdown[t] ?? 0) + 1;
  }
  return breakdown;
}

export async function getDailyEventCounts(days = 90): Promise<DailyEventCount[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const { data, error } = await admin
    .from("skill_events")
    .select("event_type, created_at")
    .gte("created_at", since.toISOString());

  if (error || !data) return [];

  const byDay = new Map<string, DailyEventCount>();

  for (const row of data) {
    const day = String(row.created_at).slice(0, 10);
    const entry = byDay.get(day) ?? {
      day,
      copy: 0,
      github_click: 0,
      install_yes: 0,
      install_no: 0,
      total: 0,
    };
    const type = String(row.event_type);
    if (type === "copy") entry.copy += 1;
    else if (type === "github_click") entry.github_click += 1;
    else if (type === "install_yes") entry.install_yes += 1;
    else if (type === "install_no") entry.install_no += 1;
    entry.total += 1;
    byDay.set(day, entry);
  }

  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}

export function aggregateWeekly(daily: DailyEventCount[]): WeeklyEventCount[] {
  const byWeek = new Map<string, WeeklyEventCount>();

  for (const d of daily) {
    const date = new Date(d.day + "T00:00:00Z");
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setUTCDate(diff);
    const week = monday.toISOString().slice(0, 10);
    const weekLabel = `Wk ${monday.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

    const entry = byWeek.get(week) ?? {
      week,
      weekLabel,
      copy: 0,
      github_click: 0,
      install_yes: 0,
      install_no: 0,
      total: 0,
    };
    entry.copy += d.copy;
    entry.github_click += d.github_click;
    entry.install_yes += d.install_yes;
    entry.install_no += d.install_no;
    entry.total += d.total;
    byWeek.set(week, entry);
  }

  return [...byWeek.values()].sort((a, b) => a.week.localeCompare(b.week));
}

async function getUsersWithStats(profiles: Profile[]): Promise<UserWithStats[]> {
  const admin = createAdminClient();
  if (!admin) {
    return profiles.map((p) => ({
      ...p,
      totalCopies: 0,
      totalGithub: 0,
      totalInstalls: 0,
    }));
  }

  const { data } = await admin
    .from("user_skill_stats")
    .select("user_id, copies, github_clicks, installs_yes");

  const statsByUser = new Map<
    string,
    { copies: number; github: number; installs: number }
  >();

  for (const row of data ?? []) {
    const uid = String(row.user_id);
    const cur = statsByUser.get(uid) ?? { copies: 0, github: 0, installs: 0 };
    cur.copies += Number(row.copies ?? 0);
    cur.github += Number(row.github_clicks ?? 0);
    cur.installs += Number(row.installs_yes ?? 0);
    statsByUser.set(uid, cur);
  }

  return profiles.map((p) => {
    const s = statsByUser.get(p.id) ?? { copies: 0, github: 0, installs: 0 };
    return {
      ...p,
      totalCopies: s.copies,
      totalGithub: s.github,
      totalInstalls: s.installs,
    };
  });
}

function enrichSkills(
  skillStats: SkillStats[],
  feedback: FeedbackAgg[],
): EnrichedSkillRow[] {
  const feedbackMap = new Map(feedback.map((f) => [f.skill_id, f]));
  const statsMap = new Map(skillStats.map((s) => [s.skill_id, s]));

  return SKILLS.map((skill) => {
    const stats = statsMap.get(skill.id) ?? {
      skill_id: skill.id,
      copies: 0,
      github_clicks: 0,
      installs_yes: 0,
      installs_no: 0,
    };
    const fb = feedbackMap.get(skill.id);
    const likes = fb?.likes ?? 0;
    const dislikes = fb?.dislikes ?? 0;
    const total = likes + dislikes;
    return {
      ...stats,
      name: skill.name,
      category: skill.cat,
      likes,
      dislikes,
      likePct: total > 0 ? Math.round((likes / total) * 100) : null,
    };
  });
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const profiles = await getProfiles();

  const [
    totals,
    skillStats,
    feedback,
    allEvents,
    dailyEvents,
    contactMessages,
    feedbackRows,
    globalEventBreakdown,
    authBreakdown,
  ] = await Promise.all([
    getGlobalTotals(),
    getSkillStats(),
    getFeedbackAgg(),
    getAllEvents(500),
    getDailyEventCounts(90),
    getContactMessages(profiles),
    getFeedbackRows(),
    getGlobalEventBreakdown(),
    getAuthBreakdown(),
  ]);

  const weeklyEvents = aggregateWeekly(dailyEvents);
  const usersWithStats = await getUsersWithStats(profiles);

  const vercelConfigured = Boolean(
    process.env.VERCEL_ACCESS_TOKEN &&
      process.env.VERCEL_TEAM_ID &&
      process.env.VERCEL_PROJECT_ID,
  );

  return {
    totals,
    skills: enrichSkills(skillStats, feedback).sort((a, b) => b.copies - a.copies),
    allEvents,
    dailyEvents,
    weeklyEvents,
    profiles,
    usersWithStats,
    contactMessages,
    feedbackRows,
    globalEventBreakdown,
    authBreakdown,
    vercelConfigured,
  };
}
