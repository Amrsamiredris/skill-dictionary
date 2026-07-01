import { createClient } from "@/lib/supabase/server";

export function getAdminEmail(): string | null {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? null;
}

export async function getAdminUser() {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;
  if (user.email.toLowerCase() !== adminEmail) return null;
  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  return user;
}
