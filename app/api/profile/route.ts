import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername, validateUsername } from "@/lib/username";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const error = validateUsername(username);
  if (error) {
    return NextResponse.json({ available: false, error }, { status: 200 });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizeUsername(username))
    .maybeSingle();

  return NextResponse.json({ available: !data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { username?: string; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, sessionId } = body;
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const validationError = validateUsername(username);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const normalized = normalizeUsername(username);

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  if (taken) {
    return NextResponse.json({ error: "Username taken" }, { status: 409 });
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username: normalized,
    display_name: normalized,
    is_public: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (sessionId) {
    await supabase.rpc("link_session_to_user", {
      p_session_id: sessionId,
      p_user_id: user.id,
    });
  }

  return NextResponse.json({ ok: true, username: normalized });
}
