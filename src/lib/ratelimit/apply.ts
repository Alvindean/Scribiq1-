/**
 * Unified rate-limit entry point used by Next.js middleware.
 *
 * Route limits:
 *   POST /api/auth/callback/credentials  → 10 requests / 60 s per IP  (login)
 *   POST /api/auth/signup                → 5  requests / 60 s per IP  (signup)
 *
 * Backend selection:
 *   UPSTASH_REDIS_REST_URL present → upstashRateLimit (distributed, durable)
 *   otherwise                      → memoryRateLimit  (in-process, dev-safe)
 */

import { NextRequest } from "next/server";
import { upstashRateLimit } from "./upstash";
import { memoryRateLimit } from "./memory";

export interface ApplyRateLimitResult {
  limited: boolean;
  response?: Response; // pre-built 429 with Retry-After header
}

interface RouteConfig {
  limit: number;
  windowSeconds: number;
}

const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  "/api/auth/callback/credentials": { limit: 10, windowSeconds: 60 },
  "/api/auth/signup": { limit: 5, windowSeconds: 60 },
};

export async function applyRateLimit(
  req: NextRequest
): Promise<ApplyRateLimitResult> {
  // Only rate-limit POST requests on the configured paths.
  if (req.method !== "POST") {
    return { limited: false };
  }

  const pathname = req.nextUrl.pathname;
  const config = ROUTE_CONFIGS[pathname];

  if (!config) {
    return { limited: false };
  }

  // Derive client IP from the leftmost value in X-Forwarded-For.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const identifier = `${ip}:${pathname}`;

  // Feature-detect backend based on env var presence.
  const useUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL);

  const result = useUpstash
    ? await upstashRateLimit(identifier, config.limit, config.windowSeconds)
    : await Promise.resolve(
        memoryRateLimit(identifier, config.limit, config.windowSeconds * 1000)
      );

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

    return {
      limited: true,
      response: new Response(
        JSON.stringify({ error: "Too many requests" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        }
      ),
    };
  }

  return { limited: false };
}
