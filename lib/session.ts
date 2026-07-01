const SESSION_KEY = "sd_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const USAGE_KEY = "sd_usage";

export function getLocalUsage(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

export function saveLocalUsage(data: Record<string, number>): void {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

const FEEDBACK_KEY = "sd_feedback";

export function getLocalFeedback(): Record<string, 1 | -1> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, 1 | -1>;
  } catch {
    return {};
  }
}

export function saveLocalFeedback(skillId: string, vote: 1 | -1): void {
  try {
    const current = getLocalFeedback();
    current[skillId] = vote;
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

const INSTALL_PROMPT_KEY = "sd_install_prompted";

export function hasSeenInstallPrompt(skillId: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = sessionStorage.getItem(INSTALL_PROMPT_KEY);
    if (!raw) return false;
    const set = JSON.parse(raw) as string[];
    return set.includes(skillId);
  } catch {
    return false;
  }
}

export function markInstallPromptSeen(skillId: string): void {
  try {
    const raw = sessionStorage.getItem(INSTALL_PROMPT_KEY);
    const set: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!set.includes(skillId)) set.push(skillId);
    sessionStorage.setItem(INSTALL_PROMPT_KEY, JSON.stringify(set));
  } catch {
    /* ignore */
  }
}
