import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';
import AboutOriginSection from '@/components/sections/AboutOriginSection';
import AboutGallerySection from '@/components/sections/AboutGallerySection';
import AboutValuesSection from '@/components/sections/AboutValuesSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

// Rebuilt 2026-07-08 as the site's "inspiring" page, per the user's
// explicit ask, real photos and a real origin story instead of two
// generic cards and a plain paragraph. Same PageHero + FinalCTASection
// bookends as /blog, /case-studies, and /careers.
export const metadata: Metadata = {
  title: 'About Bitsbuffer',
  description:
    'Bitsbuffer is a 21 to 50 person software studio in Lahore, Pakistan, building custom production software and the flagship Workflow Engine HRMS platform.',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

const STATS = [
  { value: '21-50', label: 'People on the team' },
  { value: '8', label: 'Industries served' },
  { value: '10+', label: 'Systems shipped' },
  { value: '2', label: 'Offices: Lahore and Layyah' },
];

export default function AboutPage() {
  return (
    <main>
      <PageSchema
        title="About Bitsbuffer"
        description="Bitsbuffer is a 21 to 50 person software studio in Lahore, Pakistan, building custom production software and the flagship Workflow Engine HRMS platform."
        url={`${siteConfig.url}/about`}
        type="AboutPage"
      />
      <PageHero
        ariaLabel="About Bitsbuffer"
        breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'About', href: '/about' }]}
        heading={
          <>
            A software studio with a <span className="text-accent">real address,</span> a real team, and
            work you can check.
          </>
        }
        subtext="Bitsbuffer is a Pakistan-based studio that has spent years building production software for real clients. Workflow Engine is the product that grew out of that work."
        ctaLabel="Start a project"
        ctaHref="/contact"
        secondaryLink={{ label: 'See our case studies', href: '/case-studies' }}
        stats={STATS}
      />
      <AboutOriginSection />
      <AboutGallerySection />
      <AboutValuesSection />
      <FinalCTASection />
    </main>
  );
}
