/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Apex is canonical as of 2026-07-20 (docs/13 pre-launch audit). Must
  // match siteConfig.url in src/lib/site-config.ts and the redirect
  // target in src/middleware.ts.
  siteUrl: 'https://bitsbuffer.com',
  generateRobotsTxt: false,
  sitemapBaseFileName: 'sitemap',
  // Admin panel added 2026-07-18: internal tool, never indexed, never in
  // the sitemap. src/app/admin/layout.tsx also sets robots noindex as a
  // second layer, this is belt-and-suspenders in case next-sitemap ever
  // picks up dynamic /admin routes.
  // Case studies muted 2026-07-22: routes 301 to home (next.config.ts),
  // so they must not appear in the sitemap either.
  // flagship-domains excluded 2026-07-30: dropped from nav/footer/llms.txt
  // 2026-07-20 but never removed from the sitemap, so it sat there with
  // zero internal links pointing to it (Semrush: "orphaned sitemap page").
  // Page itself is untouched, still reachable directly, just not listed.
  exclude: ['/admin', '/admin/*', '/case-studies', '/case-studies/*', '/flagship-domains'],
};
