// Simple in-memory rate limiter for API routes.
// Uses a sliding window per key (typically user ID).
// Resets on server restart — fine for Vercel serverless where each
// invocation gets fresh memory, but the Map provides burst protection
// within a single instance lifetime.

const store = new Map<string, number[]>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Check if a request is within the rate limit.
 * @param key    Unique identifier (e.g. user ID)
 * @param limit  Max requests allowed in the window
 * @param windowMs  Time window in milliseconds (default 60 s)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const timestamps = store.get(key) || [];

  // Remove timestamps outside the window
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    store.set(key, recent);
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  store.set(key, recent);
  return { allowed: true, remaining: limit - recent.length };
}
