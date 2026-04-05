import {
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "@/constants";

type Entry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Entry>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    store.set(key, {
      count: 1,
      expiresAt: now + AUTH_RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= AUTH_RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.expiresAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

