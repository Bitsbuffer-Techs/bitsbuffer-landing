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
  exclude: ['/admin', '/admin/*'],
};
