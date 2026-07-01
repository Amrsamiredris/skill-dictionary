const RESERVED = new Set([
  "admin",
  "api",
  "profile",
  "u",
  "auth",
  "onboarding",
  "stats",
  "admin",
  "www",
  "app",
  "login",
  "signin",
  "sign-in",
  "settings",
]);

export function validateUsername(username: string): string | null {
  const normalized = username.trim().toLowerCase();
  if (normalized.length < 3 || normalized.length > 20) {
    return "Username must be 3–20 characters.";
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(normalized) && normalized.length > 2) {
    if (!/^[a-z0-9]{3,20}$/.test(normalized)) {
      return "Use lowercase letters, numbers, and hyphens only.";
    }
  }
  if (RESERVED.has(normalized)) return "This username is reserved.";
  return null;
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}
