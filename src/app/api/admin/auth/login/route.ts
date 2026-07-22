import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { isRateLimited, resetRateLimit } from '@/lib/auth/rate-limit';

// 2026-07-22 (Adnan): switched off bcrypt on purpose. This is a single-admin
// blog panel, not a multi-tenant system, and the bcrypt hash's dollar signs
// kept getting mangled between .env.local (Next.js expands unescaped $ as a
// variable reference) and Hostinger's raw env var field (no expansion at
// all, so the escaped `\$` form landed as literal backslashes instead).
// That single mismatch cost real downtime twice. ADMIN_PASSWORD is now
// compared directly -- plain text in the env var, no hashing, no escaping
// rules to get wrong across two different environments. The comparison
// still hashes both sides to a fixed-length digest before a constant-time
// compare, so a wrong guess can't be timed to learn the real password's
// length or leak information via a thrown exception on mismatched buffer
// sizes. If this app ever grows past one trusted admin, move back to a
// real hash (scripts/hash-password.ts still exists) rather than reusing
// this pattern for more users.
export const runtime = 'nodejs';

function safeEqual(a: string, b: string): boolean {
  const digestA = createHash('sha256').update(a).digest();
  const digestB = createHash('sha256').update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'local';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const adminEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  if (!adminEmail || !adminPassword) {
    console.error('[admin/auth/login] ADMIN_EMAIL or ADMIN_PASSWORD not set');
    return NextResponse.json({ error: 'Admin login is not configured yet' }, { status: 500 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Constant-shape response regardless of which check fails, so the API
  // never reveals whether the email or the password was the wrong part.
  const emailMatches = email === adminEmail;
  const passwordMatches = safeEqual(password, adminPassword);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  resetRateLimit(ip);

  const token = await createSessionToken({ email: adminEmail });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
  return response;
}
