#!/usr/bin/env node
/**
 * Creates or updates the admin user with email/password auth in Supabase.
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Usage: node scripts/setup-admin-user.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listError } = await admin.auth.admin.listUsers();
if (listError) {
  console.error("Failed to list users:", listError.message);
  process.exit(1);
}

const existing = list.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase(),
);

if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Failed to update admin password:", error.message);
    process.exit(1);
  }
  console.log(`Updated password for admin user: ${email}`);
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }
  console.log(`Created admin user: ${email}`);
}

console.log("Done. Sign in at /admin/login");
