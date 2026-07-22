import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { isRateLimited, resetRateLimit } from '@/lib/auth/rate-limit';

export const runtime = 'nodejs'; // bcryptjs needs Node, not Edge

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
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? '';

  // TEMPORARY diagnostic, 2026-07-22 (Adnan): login kept failing on
  // Hostinger after the hash was updated, with no way to tell from outside
  // whether the server had a stale value, a mismatched ADMIN_EMAIL, or a
  // mangled paste (wrapping quotes, trailing whitespace/newline). Logs the
  // shape of both values, never the real password or hash. Remove this
  // block once login is confirmed working.
  console.log('[admin/auth/login][DIAGNOSTIC]', {
    adminEmailRaw: JSON.stringify(process.env.ADMIN_EMAIL ?? ''),
    adminEmailLength: (process.env.ADMIN_EMAIL ?? '').length,
    hashLength: adminPasswordHash.length,
    hashPrefix: adminPasswordHash.slice(0, 7),
    hashSuffix: adminPasswordHash.slice(-6),
    hashHasBackslash: adminPasswordHash.includes('\\'),
    hashHasQuote: adminPasswordHash.includes('"') || adminPasswordHash.includes("'"),
    hashStartsEndsClean: /^\$2[aby]\$\d{2}\$/.test(adminPasswordHash) && !/\s/.test(adminPasswordHash),
  });

  if (!adminEmail || !adminPasswordHash) {
    console.error('[admin/auth/login] ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set in .env.local');
    return NextResponse.json({ error: 'Admin login is not configured yet' }, { status: 500 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Constant-shape response regardless of which check fails, so the API
  // never reveals whether the email or the password was the wrong part.
  const emailMatches = email === adminEmail;
  const passwordMatches = await verifyPassword(password, adminPasswordHash);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  resetRateLimit(ip);

  const token = await createSessionToken({ email: adminEmail });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
  return response;
}
