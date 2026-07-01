import { createAdminClient } from "@/lib/supabase/admin";
import type {
  FeedbackAgg,
  GlobalTotals,
  SkillStats,
  UserSkillStat,
} from "@/lib/types";

export async function getSkillStats(): Promise<SkillStats[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin.from("skill_stats_agg").select("*");
  if (error || !data) return [];
  return data as SkillStats[];
}

export async function getFeedbackAgg(): Promise<FeedbackAgg[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin.from("skill_feedback_agg").select("*");
  if (error || !data) return [];
  return data as FeedbackAgg[];
}

export async function getGlobalTotals(): Promise<GlobalTotals | null> {
  const stats = await getSkillStats();
  const feedback = await getFeedbackAgg();

  if (stats.length === 0 && feedback.length === 0) return null;

  const totals: GlobalTotals = {
    copies: 0,
    github_clicks: 0,
    installs_yes: 0,
    installs_no: 0,
    likes: 0,
    dislikes: 0,
  };

  for (const s of stats) {
    totals.copies += s.copies;
    totals.github_clicks += s.github_clicks;
    totals.installs_yes += s.installs_yes;
    totals.installs_no += s.installs_no;
  }

  for (const f of feedback) {
    totals.likes += f.likes;
    totals.dislikes += f.dislikes;
  }

  return totals;
}

export async function getUserSkillStats(
  userId: string,
): Promise<UserSkillStat[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("user_skill_stats")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data as UserSkillStat[];
}

export async function getProfileByUsername(username: string) {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
