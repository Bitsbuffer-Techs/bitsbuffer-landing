import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';
import CareersRolesSection from '@/components/sections/CareersRolesSection';
import CareersApplicationSection from '@/components/sections/CareersApplicationSection';

// Rebuilt 2026-07-08, same convention as /services, /blog, /case-studies:
// PageHero instead of a badge + plain H1, the old plain bulleted role list
// replaced with an icon-card grid (CareersRolesSection).
// FinalCTASection swapped for CareersApplicationSection 2026-07-17,
// Adnan's call: "Tell us what you are building" (FinalCTASection's own
// copy) is written for a prospect scoping a project, not a candidate
// applying for a role. This page now closes on an actual application
// form (resume upload, /api/careers, nodemailer to hr@bitsbuffer.com)
// instead of a mismatched generic CTA.
export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Bitsbuffer is hiring product-minded engineers and delivery professionals to build production software in Pakistan, across commerce, fintech, and ERP work.',
  alternates: {
    canonical: `${siteConfig.url}/careers`,
  },
};

export default function CareersPage() {
  return (
    <main>
      <PageSchema
        title="Careers"
        description="Bitsbuffer is hiring product-minded engineers and delivery professionals to build software in Pakistan and beyond."
        url={`${siteConfig.url}/careers`}
        type="WebPage"
      />
      <PageHero
        ariaLabel="Careers at Bitsbuffer"
        breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'Careers', href: '/careers' }]}
        heading={
          <>
            We are growing a <span className="text-accent">product-minded</span> team.
          </>
        }
        subtext="Bitsbuffer operates as a team of roughly 21 to 50 people. We grow around product delivery, engineering craft, and implementation quality, not headcount targets."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
      <CareersRolesSection />
      <CareersApplicationSection />
    </main>
  );
}
