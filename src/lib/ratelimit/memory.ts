/**
 * Edge-compatible in-memory sliding window rate limiter.
 *
 * Uses a Map keyed by identifier (e.g. IP + route). Each entry stores an
 * array of request timestamps. On each call, timestamps older than the
 * window are purged before the count is checked.
 *
 * NOTE: State is per-instance and resets on cold start. Acceptable for dev
 * and single-instance deployments. Use upstashRateLimit for multi-instance.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms when the oldest in-window request expires
}

// Module-level store — survives across calls within the same instance.
const store = new Map<string, number[]>();

export function memoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Retrieve and prune timestamps that have fallen outside the window.
  const timestamps = (store.get(identifier) ?? []).filter(
    (ts) => ts > windowStart
  );

  if (timestamps.length >= limit) {
    // Oldest timestamp still inside the window tells us when a slot opens.
    const oldestInWindow = timestamps[0];
    const reset = oldestInWindow + windowMs;
    store.set(identifier, timestamps);
    return { success: false, remaining: 0, reset };
  }

  // Record this request.
  timestamps.push(now);
  store.set(identifier, timestamps);

  const remaining = limit - timestamps.length;
  // Reset time: when the earliest recorded timestamp will leave the window.
  const reset = timestamps[0] + windowMs;

  return { success: true, remaining, reset };
}
