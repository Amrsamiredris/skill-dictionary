import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSkillStats } from "@/lib/stats-server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getUserSkillStats(user.id);
  return NextResponse.json({ stats });
}
