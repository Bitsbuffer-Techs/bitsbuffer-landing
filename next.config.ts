import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // A `next build`/`next start` running alongside `next dev` (Turbopack)
  // both targeted `.next` by default and corrupted each other's manifest
  // mid-write (`routesManifest.dataRoutes is not iterable` on start) --
  // hit repeatedly in practice once more than one Cowork session started
  // touching this repo at once. Fixed permanently, not per-incident:
  // `npm run dev`/`dev:next-only` now always set NEXT_DEV_ISOLATED (see
  // package.json), which routes dev's own manifest to `.next-dev`. `next
  // build`/`next start` always keep the standard `.next` -- exactly what
  // a real deploy host expects from a zero-config Next.js app, untouched.
  // AUDIT_BUILD still exists on top of that for a third, fully separate
  // one-off production-build check (`.next-audit`) without disturbing
  // either the standard build or a running dev server.
  distDir: process.env.AUDIT_BUILD
    ? '.next-audit'
    : process.env.NEXT_DEV_ISOLATED
      ? '.next-dev'
      : '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Case Studies muted sitewide 2026-07-22 (Adnan): all links removed
  // (Header, Footer, About, /services featured grid, domain-page proofs)
  // and the routes 301 to home so indexed URLs pass equity back instead
  // of 404ing. Delete this block plus the sitemap exclude and restore the
  // removed links to bring the section back.
  async redirects() {
    return [
      {
        source: '/case-studies',
        destination: '/',
        permanent: true,
      },
      {
        source: '/case-studies/:slug*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
