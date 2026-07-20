import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import ServicesHero from '@/components/sections/ServicesHero';
import ServicesOfferingsSection from '@/components/sections/ServicesOfferingsSection';
import PlatformOverviewSection from '@/components/sections/PlatformOverviewSection';
import FeaturedProjectsSection from '@/components/sections/FeaturedProjectsSection';
import QualityAuditSection from '@/components/sections/QualityAuditSection';
import ServicesFAQSection from '@/components/sections/ServicesFAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

// Rebuilt 2026-07-08 to match the conventions established across the
// homepage rebuild: no badges, text-accent-bright section headings,
// alternating corner dots, glossy buttons and icon badges, Framer Motion
// scroll-reveal on every grid, benefit-led copy instead of feature bullets.
// PlatformOverviewSection and QualityAuditSection are reused directly
// rather than rebuilt, both were already built to this standard and
// PlatformOverviewSection specifically had no page rendering it at all
// (commented out on the homepage), this gives it a real home instead of
// sitting as dead code. FeaturedProjectsSection is now shared between the
// homepage and this page, its convention pass (badge removed, heading
// recolored) applies everywhere it renders, not just here.
export const metadata: Metadata = {
  title: 'Custom Software Development Services',
  description: `Bitsbuffer builds production software across ${siteConfig.industriesList}, scoped through discovery and audited the same way Workflow Engine is.`,
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <main>
      <PageSchema
        title="Custom Software Development Services"
        description={`Bitsbuffer builds production software across ${siteConfig.industriesList}, scoped through discovery and audited the same way Workflow Engine is.`}
        url={`${siteConfig.url}/services`}
        type="CollectionPage"
      />

      <ServicesHero />
      <ServicesOfferingsSection />
      <PlatformOverviewSection />
      <FeaturedProjectsSection />
      <div id="audit">
        <QualityAuditSection />
      </div>
      <ServicesFAQSection />
      <FinalCTASection />
    </main>
  );
}
