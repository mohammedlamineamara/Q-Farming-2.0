import { TRPCError } from "@trpc/server";

export interface RateLimiterOptions {
  windowMs: number;
  maxAttempts: number;
  message?: string;
}

interface AttemptRecord {
  count: number;
  resetAt: number;
}

/**
 * In-Memory Sliding Window Rate Limiter.
 *
 * NOTE FOR PRODUCTION DEPLOYMENT:
 * This is an in-memory implementation intended for single-instance or local execution.
 * For distributed multi-instance production environments (e.g. multi-replica Cloud Run),
 * this storage layer should be replaced with a Redis-backed or Memcached-backed store
 * implementing the same check/record interface without changing router logic.
 */
class MemoryRateLimiter {
  private attempts = new Map<string, AttemptRecord>();

  /**
   * Cleans up expired rate-limit records to prevent unbounded memory growth.
   */
  private cleanup(now: number) {
    if (this.attempts.size > 5000) {
      for (const [key, record] of this.attempts.entries()) {
        if (now > record.resetAt) {
          this.attempts.delete(key);
        }
      }
    }
  }

  /**
   * Asserts that the identifier has not exceeded its attempt limit.
   * Throws TRPCError TOO_MANY_REQUESTS (HTTP 429) if exceeded.
   */
  assertAllowed(identifier: string, options: RateLimiterOptions) {
    const now = Date.now();
    this.cleanup(now);

    const record = this.attempts.get(identifier);
    if (!record || now > record.resetAt) {
      return;
    }

    if (record.count >= options.maxAttempts) {
      const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: options.message ?? `Too many attempts. Please try again in ${retryAfterSeconds} seconds.`,
      });
    }
  }

  /**
   * Records a failed attempt for the identifier.
   */
  recordFailure(identifier: string, options: RateLimiterOptions) {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetAt) {
      this.attempts.set(identifier, {
        count: 1,
        resetAt: now + options.windowMs,
      });
    } else {
      record.count += 1;
    }
  }

  /**
   * Resets attempts upon successful operation (e.g. successful login).
   */
  reset(identifier: string) {
    this.attempts.delete(identifier);
  }
}

export const rateLimiter = new MemoryRateLimiter();

/**
 * Extracts a client identifier from the request.
 * Checks standard forwarded headers. In a reverse-proxy setup (like Google Cloud Run / nginx),
 * the first IP in x-forwarded-for or x-real-ip represents the client origin.
 */
export function getClientIdentifier(req: Request, prefix: string = ""): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "unknown-ip";
  return `${prefix}:${ip}`;
}

export const AUTH_RATE_LIMIT_CONFIGS = {
  login: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxAttempts: 5,           // 5 failed attempts per IP
    message: "Too many failed login attempts. Please try again in a few minutes.",
  },
  register: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,          // 10 registrations per IP per hour
    message: "Registration limit exceeded. Please try again later.",
  },
} as const;
