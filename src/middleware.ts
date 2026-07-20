import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/session';

// Two jobs:
// 1. Canonical-host enforcement, site-wide. Apex (bitsbuffer.com) is
//    canonical as of 2026-07-20 (docs/13 pre-launch audit finding #4 --
//    robots.txt/sitemap/schema all declared a host nothing was enforcing,
//    the same bug class that flagged 49 duplicate pages on WF Engine).
//    Any request arriving on www.bitsbuffer.com gets a permanent redirect
//    to the same path+query on the apex host, before anything else runs.
// 2. Session gate on every /admin page and every /api/admin/* route.
//    Runs on the Edge runtime (Next.js middleware default), which is
//    exactly why session.ts uses jose instead of jsonwebtoken.
//
// Requires apex DNS (A/ALIAS record, not just the www CNAME) and a valid
// SSL cert on the apex host at the deploy target -- not something this
// file can verify. Confirm both are actually provisioned before relying
// on this redirect in production.

const CANONICAL_HOST = 'bitsbuffer.com';
const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PUBLIC_API_PATHS = ['/api/admin/auth/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  if (host === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = 'https';
    // 308 keeps the original method, so POSTs to /api/contact or
    // /api/careers from a stray www link still land correctly instead of
    // getting silently downgraded to a GET.
    return NextResponse.redirect(url, 308);
  }

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_ADMIN_PATHS.some((p) => pathname === p);
  const isPublicApi = PUBLIC_API_PATHS.some((p) => pathname === p);
  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isApiRoute = pathname.startsWith('/api/admin');

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Broadened from admin-only so the host redirect above runs site-wide.
  // Excludes static assets and image-optimizer output, which don't need
  // host enforcement and shouldn't pay the Edge-function cost per request.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
