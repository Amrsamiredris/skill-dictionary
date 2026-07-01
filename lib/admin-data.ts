import { createAdminClient } from "@/lib/supabase/admin";
import { SKILLS, getSkillById } from "@/lib/skills";
import type { FeedbackAgg, GlobalTotals, Profile, SkillStats } from "@/lib/types";
import { getFeedbackAgg, getGlobalTotals, getSkillStats } from "@/lib/stats-server";

export type SkillEvent = {
  id: string;
  skill_id: string;
  event_type: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
};

export type SkillFeedbackRow = {
  id: string;
  skill_id: string;
  vote: number;
  session_id: string;
  user_id: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  user_id: string | null;
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

export type EnrichedSkillRow = SkillStats & {
  name: string;
  category: string;
  likes: number;
  dislikes: number;
  likePct: number | null;
};

export type AdminDashboardData = {
  totals: GlobalTotals | null;
  skills: EnrichedSkillRow[];
  recentEvents: SkillEvent[];
  dailyEvents: DailyEventCount[];
  profiles: Profile[];
  contactMessages: ContactMessage[];
  feedbackRows: SkillFeedbackRow[];
  eventBreakdown: Record<string, number>;
  uniqueSessions: number;
  signedInEvents: number;
  vercelConfigured: boolean;
};

export async function getRecentEvents(limit = 150): Promise<SkillEvent[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("skill_events")
    .select("id, skill_id, event_type, user_id, session_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as SkillEvent[];
}

export async function getFeedbackRows(limit = 100): Promise<SkillFeedbackRow[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("skill_feedback")
    .select("id, skill_id, vote, session_id, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as SkillFeedbackRow[];
}

export async function getContactMessages(limit = 50): Promise<ContactMessage[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("contact_messages")
    .select("id, user_id, message, skill_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as ContactMessage[];
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

export async function getDailyEventCounts(days = 30): Promise<DailyEventCount[]> {
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
  }).sort((a, b) => b.copies - a.copies);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    totals,
    skillStats,
    feedback,
    recentEvents,
    dailyEvents,
    profiles,
    contactMessages,
    feedbackRows,
  ] = await Promise.all([
    getGlobalTotals(),
    getSkillStats(),
    getFeedbackAgg(),
    getRecentEvents(),
    getDailyEventCounts(),
    getProfiles(),
    getContactMessages(),
    getFeedbackRows(),
  ]);

  const eventBreakdown: Record<string, number> = {};
  let signedInEvents = 0;
  const sessions = new Set<string>();

  for (const e of recentEvents) {
    eventBreakdown[e.event_type] = (eventBreakdown[e.event_type] ?? 0) + 1;
    if (e.user_id) signedInEvents += 1;
    if (e.session_id) sessions.add(e.session_id);
  }

  const vercelConfigured = Boolean(
    process.env.VERCEL_ACCESS_TOKEN &&
      process.env.VERCEL_TEAM_ID &&
      process.env.VERCEL_PROJECT_ID,
  );

  return {
    totals,
    skills: enrichSkills(skillStats, feedback),
    recentEvents: recentEvents.map((e) => ({
      ...e,
      skill_id: getSkillById(e.skill_id)?.name ?? e.skill_id,
    })),
    dailyEvents,
    profiles,
    contactMessages,
    feedbackRows,
    eventBreakdown,
    uniqueSessions: sessions.size,
    signedInEvents,
    vercelConfigured,
  };
}
