import { UserRole } from "@/types";

export const USER_ROLES: UserRole[] = ["viewer", "analyst", "admin"];

export const USER_STATUSES = ["active", "inactive"] as const;
export const RECORD_TYPES = ["income", "expense"] as const;

export const DEMO_CATEGORIES = [
  "salary",
  "travel",
  "food",
  "software",
  "tax",
  "utilities",
  "subscriptions",
  "office",
  "marketing",
  "freelance",
] as const;

export const AUTH_COOKIE_NAME = "zf_session";
export const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
export const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 12;

