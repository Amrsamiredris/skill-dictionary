import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { SKILLS } from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let body: { skillId?: string; vote?: number; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { skillId, vote, sessionId } = body;

  if (!skillId || !sessionId || (vote !== 1 && vote !== -1)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!SKILLS.some((s) => s.id === skillId)) {
    return NextResponse.json({ error: "Unknown skill" }, { status: 400 });
  }

  if (!checkRateLimit(`feedback:${sessionId}`)) {
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

  const { error } = await admin.from("skill_feedback").upsert(
    {
      skill_id: skillId,
      vote,
      session_id: sessionId,
      user_id: userId,
    },
    { onConflict: "skill_id,session_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
