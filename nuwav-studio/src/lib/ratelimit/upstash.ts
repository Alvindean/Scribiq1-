/**
 * Upstash Redis sliding window rate limiter.
 *
 * Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the
 * environment. The Ratelimit client is a lazy singleton — created only on the
 * first call so that import-time evaluation never fails in environments where
 * the vars are absent (the caller must ensure they are set before invoking).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { memoryRateLimit } from "./memory";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms
}

// Lazy singleton — keyed by "limit:windowSeconds" so different route configs
// each get their own Ratelimit instance backed by the same Redis connection.
const clients = new Map<string, Ratelimit>();

function getClient(limit: number, windowSeconds: number): Ratelimit {
  const key = `${limit}:${windowSeconds}`;
  if (clients.has(key)) {
    return clients.get(key)!;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Upstash rate limiter requires UPSTASH_REDIS_REST_URL and " +
        "UPSTASH_REDIS_REST_TOKEN environment variables to be set."
    );
  }

  const redis = new Redis({ url, token });

  const client = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: false,
  });

  clients.set(key, client);
  return client;
}

export async function upstashRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const client = getClient(limit, windowSeconds);
  const result = await client.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset, // already epoch ms from @upstash/ratelimit
  };
}

export interface CheckRateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
}

/**
 * Check a per-user rate limit for an authenticated route.
 *
 * - Uses Upstash Redis when UPSTASH_REDIS_REST_URL is set (distributed, durable).
 * - Falls back to the in-process memory limiter otherwise (dev-safe).
 * - On any unexpected error: logs and returns success=true so the route is
 *   never blocked by a rate-limit infrastructure failure.
 *
 * @param userId   Authenticated user ID — used as the rate-limit key.
 * @param prefix   Short string identifying the route, e.g. "generate".
 * @param requests Maximum requests allowed within the window.
 * @param windowSeconds Window duration in seconds.
 */
export async function checkUserRateLimit(
  userId: string,
  prefix: string,
  requests: number,
  windowSeconds: number
): Promise<CheckRateLimitResult> {
  const identifier = `rl:${prefix}:${userId}`;

  try {
    const useUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL);

    const result = useUpstash
      ? await upstashRateLimit(identifier, requests, windowSeconds)
      : memoryRateLimit(identifier, requests, windowSeconds * 1000);

    return { success: result.success, limit: requests, remaining: result.remaining };
  } catch (err) {
    console.error("[ratelimit] checkUserRateLimit error — allowing request:", err);
    return { success: true, limit: requests, remaining: -1 };
  }
}
