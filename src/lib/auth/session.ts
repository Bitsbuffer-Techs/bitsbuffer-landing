import { SignJWT, jwtVerify } from 'jose';

// jose (not jsonwebtoken) specifically because it runs in both the Node
// API routes AND the Edge runtime middleware (src/middleware.ts) that
// gate every /admin and /api/admin request -- jsonwebtoken doesn't work
// in Edge. Single admin user, so this is one signed session cookie, not a
// full access/refresh pair: proportionate to "one person, one browser
// session" per dev-lead's Bitsbuffer reality check, not the multi-user
// RBAC setup the stack canon describes for bigger products.

export const SESSION_COOKIE_NAME = 'bb_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET is not set (or too short). Set a random 32+ character string in .env.local -- ' +
        'generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.email !== 'string') return null;
    return { email: payload.email };
  } catch {
    // Expired, malformed, or wrong-secret token -- all treated as
    // "not logged in," never surfaced as a 500.
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
};
