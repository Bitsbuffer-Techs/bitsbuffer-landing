import PageHero from '@/components/ui/PageHero';
import { siteConfig } from '@/lib/site-config';

// Refactored 2026-07-08 to call the shared PageHero (extracted from this
// file's original implementation) instead of duplicating the dot-wave /
// stagger markup, now that /blog, /case-studies, and /careers need the
// same hero shape with different copy.
const STATS = [
  { value: '10+', label: 'Systems shipped' },
  { value: '8', label: 'Industries served' },
  { value: '6', label: 'Audit passes per site' },
  { value: '1', label: 'Delivery standard' },
];

export default function ServicesHero() {
  return (
    <PageHero
      ariaLabel="Custom software services"
      breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'Services', href: '/services' }]}
      heading={
        <>
          Custom software, built the same disciplined way we build{' '}
          <span className="text-accent">Workflow Engine</span>.
        </>
      }
      subtext={`Bitsbuffer takes on production builds across ${siteConfig.industriesList}, scoped through real discovery, then audited the same six ways every release of our own flagship product is.`}
      ctaLabel="Start a project"
      ctaHref="/contact"
      secondaryLink={{ label: 'See the 6-pass audit', href: '#audit' }}
      stats={STATS}
    />
  );
}
