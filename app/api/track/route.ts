import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import type { EventType } from "@/lib/types";
import { SKILLS } from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

const VALID_EVENTS: EventType[] = [
  "copy",
  "github_click",
  "install_yes",
  "install_no",
];

export async function POST(request: Request) {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let body: { skillId?: string; eventType?: string; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { skillId, eventType, sessionId } = body;

  if (!skillId || !eventType || !sessionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!VALID_EVENTS.includes(eventType as EventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  if (!SKILLS.some((s) => s.id === skillId)) {
    return NextResponse.json({ error: "Unknown skill" }, { status: 400 });
  }

  if (!checkRateLimit(`track:${sessionId}`)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    /* anonymous */
  }

  const { error } = await admin.from("skill_events").insert({
    skill_id: skillId,
    event_type: eventType,
    session_id: sessionId,
    user_id: userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
