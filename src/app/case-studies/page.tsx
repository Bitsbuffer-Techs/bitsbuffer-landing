import type { Metadata } from 'next';
import { caseStudies } from '@/lib/case-studies';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';
import CaseStudiesGridSection from '@/components/sections/CaseStudiesGridSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

// Rebuilt 2026-07-08, same convention as /services and /blog: PageHero
// instead of a badge + plain H1, the grid split into its own client
// component (CaseStudiesGridSection) so this file stays a server
// component and keeps exporting `metadata`, FinalCTASection closes the
// page instead of a one-off inline CTA card. Cards use `tagline`, not the
// truncated `description` field, see case-studies.ts's header comment.
export const metadata: Metadata = {
  title: 'Case Studies',
  description: `Real production software Bitsbuffer has shipped across ${siteConfig.industriesList}, each built and delivered for a real client or product.`,
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
};

export default function CaseStudiesPage() {
  return (
    <main>
      <PageSchema
        title="Case Studies"
        description={`Real production software Bitsbuffer has shipped across ${siteConfig.industriesList}, each built and delivered for a real client or product.`}
        url={`${siteConfig.url}/case-studies`}
        type="CollectionPage"
      />
      <PageHero
        ariaLabel="Bitsbuffer case studies"
        breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'Case Studies', href: '/case-studies' }]}
        heading={
          <>
            Real projects, shipped across <span className="text-accent">commerce, fintech,</span> and
            operations.
          </>
        }
        subtext="These are production systems we have built and maintained for real clients and products, not concept work. Every one shipped, and most are still running today."
      />
      <CaseStudiesGridSection caseStudies={caseStudies} />
      <FinalCTASection />
    </main>
  );
}
