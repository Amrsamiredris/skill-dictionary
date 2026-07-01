import type { EventType } from "@/lib/types";
import { getSessionId } from "@/lib/session";

export async function trackEvent(
  skillId: string,
  eventType: EventType,
): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId, eventType, sessionId }),
    });
  } catch {
    /* silent — copy-and-go must never break */
  }
}

export async function submitFeedback(
  skillId: string,
  vote: 1 | -1,
): Promise<boolean> {
  const sessionId = getSessionId();
  if (!sessionId) return false;

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId, vote, sessionId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
