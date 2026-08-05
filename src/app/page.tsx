import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/site-config';

// ─── ABOVE FOLD: server components, no dynamic() wrapper, streamed eagerly ─
import HeroSection from '@/components/sections/HeroSection';
import AskBitsbufferSection from '@/components/sections/AskBitsbufferSection';
import TrustBandSection from '@/components/sections/TrustBandSection';

// ─── BELOW FOLD: code-split via dynamic() (smaller JS chunks, each its own
// request), still server-rendered into the initial HTML -- content stays
// available to crawlers and first paint, nothing removed from the response.
//
// Two things were already tried and measured here before this pattern:
// (1) a client-only `ssr: false` + IntersectionObserver "true lazy mount"
// -- on a real mobile viewport these sections sit close enough to the fold
// that their observers fired almost immediately after hydration anyway, so
// it paid chunk-fetch + client mount cost on top of what SSR already did
// more cheaply, and measured 3-4x worse blocking time. Reverted.
// (2) plain dynamic() with a `loading` fallback (no explicit Suspense) --
// this is what shipped after the revert above. It still hydrates every
// section in one continuous synchronous pass once each chunk arrives,
// which is what was driving total blocking time on this page specifically
// (9 below-fold sections, several running their own whileInView
// IntersectionObserver + Framer Motion setup, all hydrating back-to-back).
//
// This version wraps each section in a real <Suspense> boundary instead of
// relying on dynamic()'s `loading` option alone. With App Router's
// streaming SSR, an explicit Suspense boundary is what unlocks React 18's
// selective hydration: the renderer can hydrate boundaries independently
// and yield back to the main thread between them, instead of one unbroken
// block of hydration work. Content, order, and visual output are
// unchanged -- this only changes how the browser schedules the hydration
// work already happening.
const FeaturedUpdatesSection = dynamic(() => import('@/components/sections/FeaturedUpdatesSection'));
const SolutionsExplorerSection = dynamic(() => import('@/components/sections/SolutionsExplorerSection'));
const ServiceToolsSection = dynamic(() => import('@/components/sections/ServiceToolsSection'));
const ProblemSolutionSection = dynamic(() => import('@/components/sections/ProblemSolutionSection'));
const TransformWorkSection = dynamic(() => import('@/components/sections/TransformWorkSection'));
const DarkScaleSection = dynamic(() => import('@/components/sections/DarkScaleSection'));
// TeamProofSection hidden 2026-07-23 (Adnan's call): section is being
// rebuilt, not deleted. Component file is untouched -- re-add the import
// and the <Suspense> block below to bring it back.
const QualityAuditSection = dynamic(() => import('@/components/sections/QualityAuditSection'));
// FAQ carries FAQPage schema + visible copy that matters for GEO/AEO --
// kept server-rendered, never deferred.
const HomeFAQSection = dynamic(() => import('@/components/sections/HomeFAQSection'));
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'));

const skeleton = (height: number) => (
  <div className="section">
    <div className="container-site rounded-xl bg-surface animate-pulse" style={{ height }} />
  </div>
);

// FeaturedUpdatesSection (below) now reads published posts from MongoDB
// (2026-07-18, blog admin panel build), so the homepage needs a
// revalidate window instead of being fully static -- the admin panel's
// publish route also calls revalidatePath('/') directly for an instant
// update, this is just the fallback.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Custom software studio behind Workflow Engine',
  description: `Bitsbuffer builds custom software engineered around how your team actually works, across ${siteConfig.industriesList}. Home of Workflow Engine.`,
  keywords: [
    'custom software development',
    'workflow automation',
    'enterprise software',
    'fintech development',
    'ecommerce engineering',
    'workflow engine',
  ],
  openGraph: {
    title: 'Custom software studio behind Workflow Engine',
    description: `Bitsbuffer builds custom software engineered around how your team actually works, across ${siteConfig.industriesList}.`,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/api/og?title=Bitsbuffer`,
        width: 1200,
        height: 630,
        alt: 'Bitsbuffer custom software studio behind Workflow Engine',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom software studio behind Workflow Engine',
    description: 'Bitsbuffer builds custom software engineered around how your team actually works.',
    images: [`${siteConfig.url}/api/og?title=Bitsbuffer`],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

// Single WebPage schema for the homepage (2026-07-31 fix): this used to
// be TWO separate WebPage blocks -- this one plus a <PageSchema> call
// right below with a different name/description for the same URL,
// flagged sitewide by Semrush as a structured-data markup error (two
// competing descriptions of the same page). Name now matches the real
// rendered <title> (metadata.title + layout.tsx's "%s | Bitsbuffer"
// template) instead of either of the two mismatched versions that used
// to exist. Breadcrumb kept since it's the more complete of the two.
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Custom software studio behind Workflow Engine | ${siteConfig.name}`,
  description: `Custom software studio building production-grade platforms for ${siteConfig.industriesList}, and the studio behind Workflow Engine.`,
  url: siteConfig.url,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url }],
  },
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Above fold */}
      <HeroSection />
      <TrustBandSection />
      <AskBitsbufferSection />

      {/* Below fold, each its own Suspense boundary -- see note above on
          why this replaced dynamic()'s `loading` option alone. */}
      <Suspense fallback={skeleton(256)}>
        <FeaturedUpdatesSection />
      </Suspense>
      <Suspense fallback={skeleton(384)}>
        <SolutionsExplorerSection />
      </Suspense>
      <Suspense fallback={skeleton(256)}>
        <ServiceToolsSection />
      </Suspense>
      <Suspense fallback={skeleton(256)}>
        <ProblemSolutionSection />
      </Suspense>
      <Suspense fallback={skeleton(320)}>
        <TransformWorkSection />
      </Suspense>
      <Suspense fallback={skeleton(256)}>
        <DarkScaleSection />
      </Suspense>
      <Suspense fallback={skeleton(256)}>
        <QualityAuditSection />
      </Suspense>
      <Suspense fallback={skeleton(256)}>
        <HomeFAQSection />
      </Suspense>
      {/* FinalCTASection re-enabled 2026-07-16 (remediation pass, Adnan's
          call): every other page on the site closes on it, and the
          homepage was the one page ending on a second copy of the same
          low-commitment "Ask Bitsbuffer" widget shown near the top
          instead of the reassurance copy and next-step options
          FinalCTASection carries. See docs/08_content_positioning_audit.md
          findings 8 and 9. */}
      <FinalCTASection />
    </main>
  );
}
