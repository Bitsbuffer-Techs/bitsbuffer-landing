import { siteConfig } from './site-config';

// Single source of truth for breadcrumbs, added 2026-07-17. Before this,
// BreadcrumbList JSON-LD existed on only 2 of ~11 page types (homepage,
// domain pages) and was hand-built inline each time, with zero matching
// visible UI anywhere on the site, crawlers got structured data, visitors
// got nothing. Every page now builds its trail as one `BreadcrumbItem[]`
// array and feeds it to both <Breadcrumb /> (the visible trail) and
// `buildBreadcrumbSchema()` (the JSON-LD), so the two can never drift
// apart the way the old inline domain-page version could have.
export type BreadcrumbItem = {
  label: string;
  // Every item, including the current page, carries its real href -- the
  // schema wants a URL for every position (matches the domain pages'
  // original inline BreadcrumbList, which included the current page's own
  // URL as the last item). <Breadcrumb /> is what decides the *last* item
  // renders as plain text with aria-current="page" instead of a link, not
  // this type, so the same array feeds both without duplicating data.
  href: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
