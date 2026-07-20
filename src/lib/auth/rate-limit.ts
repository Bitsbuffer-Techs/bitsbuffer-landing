// Minimal in-memory rate limiter for the login route. Single-instance
// Node process (localhost now, one DigitalOcean droplet later per Icon
// Phase 1 doctrine) so an in-memory Map is proportionate -- a distributed
// limiter (Redis) would be over-engineering for one admin user's login
// form. Resets on server restart, which is fine for this threat model.

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
