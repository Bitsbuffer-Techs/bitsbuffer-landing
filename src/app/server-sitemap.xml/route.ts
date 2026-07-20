import { NextResponse } from 'next/server';
import { getAllPublishedPosts } from '@/lib/db/blog-repo';
import { siteConfig } from '@/lib/site-config';

// Blog posts live in Mongo, so the static sitemap next-sitemap generates
// at build time never sees them (found in docs/13 pre-launch audit,
// 2026-07-20: all 20 published posts were missing from sitemap-0.xml).
// This route serves them at request time instead. robots.txt lists both
// sitemaps: /sitemap.xml (static routes) and this one (blog).

export const dynamic = 'force-dynamic';

function lastmod(publishedAt: string, updatedAt?: string): string {
  const raw = updatedAt ?? publishedAt;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export async function GET() {
  try {
    const posts = await getAllPublishedPosts();

    const urls = posts
      .map(
        (post) =>
          `<url><loc>${siteConfig.url}/blog/${post.slug}</loc><lastmod>${lastmod(
            post.publishedAt,
            post.updatedAt,
          )}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        // Crawlers get a fresh-enough copy without hitting Mongo on
        // every request; CDN/proxy caches for an hour.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    // Mongo down: return 503 so crawlers retry later instead of caching
    // an empty sitemap as the truth.
    console.error('[server-sitemap] failed to build blog sitemap:', error);
    return new NextResponse(null, { status: 503 });
  }
}
