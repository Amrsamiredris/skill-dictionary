export type EventType = "copy" | "github_click" | "install_yes" | "install_no";

export type SkillStats = {
  skill_id: string;
  copies: number;
  github_clicks: number;
  installs_yes: number;
  installs_no: number;
};

export type FeedbackAgg = {
  skill_id: string;
  likes: number;
  dislikes: number;
};

export type GlobalTotals = {
  copies: number;
  github_clicks: number;
  installs_yes: number;
  installs_no: number;
  likes: number;
  dislikes: number;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  is_public: boolean;
  created_at: string;
};

export type UserSkillStat = {
  skill_id: string;
  copies: number;
  github_clicks: number;
  installs_yes: number;
  installs_no: number;
};
