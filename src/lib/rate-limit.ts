const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  rateLimit.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  });
}

/**
 * In-memory sliding window rate limiter.
 * Per-serverless-instance (not shared across instances).
 */
export function checkRateLimit(
  identifier: string,
  limit = 20,
  windowMs = 60_000
): { success: boolean; remaining: number; reset: number } {
  cleanup();

  const now = Date.now();
  const entry = rateLimit.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: entry.resetTime };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, reset: entry.resetTime };
}

export function getRateLimitHeaders(result: { remaining: number; reset: number }) {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
  };
}

export function rateLimitResponse(result: { remaining: number; reset: number }) {
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      ...getRateLimitHeaders(result),
      'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
    },
  });
}

/**
 * Extract client IP from request headers.
 * Works with Vercel (x-forwarded-for) and standard proxies.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
