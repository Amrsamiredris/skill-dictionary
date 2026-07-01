import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SKILLS } from "@/lib/skills";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { sessionId?: string; usage?: Record<string, number> };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const sessionId = body.sessionId;
  if (sessionId) {
    await supabase.rpc("link_session_to_user", {
      p_session_id: sessionId,
      p_user_id: user.id,
    });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const usage = body.usage ?? {};
  const skillIds = Object.keys(usage).filter((id) =>
    SKILLS.some((s) => s.id === id),
  );

  if (skillIds.length > 0) {
    const events = skillIds.flatMap((skillId) =>
      Array.from({ length: Math.min(usage[skillId] ?? 0, 100) }, () => ({
        skill_id: skillId,
        event_type: "copy" as const,
        user_id: user.id,
        session_id: sessionId ?? null,
      })),
    );

    if (events.length > 0) {
      await admin.from("skill_events").insert(events);
    }
  }

  return NextResponse.json({ ok: true });
}
