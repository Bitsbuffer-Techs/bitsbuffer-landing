import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbSchema, type BreadcrumbItem } from '@/lib/breadcrumb';

// Visible breadcrumb trail, added 2026-07-17 alongside src/lib/breadcrumb.ts.
// Before this, BreadcrumbList schema existed on only 2 of ~11 page types
// and nothing ever rendered on screen for an actual visitor, crawlers got
// structured data, humans got nothing. This component and the schema
// builder share the exact same BreadcrumbItem[] the page passes in, so
// the visible trail and the JSON-LD can't drift out of sync the way the
// old hand-built inline schema on the domain pages could have.
//
// Muted by design (text-xs, text-muted) -- a breadcrumb is a navigation
// aid, not a headline, and every page already has a real H1 doing the
// actual visual anchoring below it.
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length < 2) return null;

  const schema = buildBreadcrumbSchema(items);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" className="relative">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span className="font-medium text-text-secondary" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  // Home's href is '' (schema wants the bare siteConfig.url,
                  // no trailing slash -- see breadcrumb.ts). next/link treats
                  // an empty href as "stay on this page" rather than "/", so
                  // it needs the '/' fallback here or the Home crumb silently
                  // does nothing on click. Bug found + fixed 2026-07-17.
                  <Link href={item.href || '/'} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                )}
                {!isLast && <ChevronRight className="h-3 w-3 flex-shrink-0" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
