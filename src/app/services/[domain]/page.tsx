import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingCart,
  Landmark,
  Sprout,
  Boxes,
  Stethoscope,
  Truck,
  GraduationCap,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { domainPages, getDomainPage } from '@/lib/domain-pages';
import { caseStudies, DOMAIN_LABEL, DOMAIN_STYLES } from '@/lib/case-studies';
import { getPublishedPostsByDomain } from '@/lib/db/blog-repo';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';
import CornerDots from '@/components/ui/CornerDots';
import DomainFAQAccordion from '@/components/sections/DomainFAQAccordion';
import FinalCTASection from '@/components/sections/FinalCTASection';

// Built 2026-07-17, Adnan's call (freeze override): one page per industry
// instead of one generalist /services page trying to rank for all 8 at
// once. See docs/10_domain_pages_research.md and
// docs/11_domain_pages_plan.md. Content lives entirely in
// src/lib/domain-pages.ts -- this file is the template, not the copy.
const ICONS = {
  ShoppingCart,
  Landmark,
  Sprout,
  Boxes,
  Stethoscope,
  Truck,
  GraduationCap,
  Building2,
} as const;

// case-studies.ts's Domain type only covers the 4 slugs that have real
// named proof (ecommerce, fintech, agritech, erp); healthcare, logistics,
// edtech, realestate never get passed here since their proof.kind is
// 'capability', not 'case-study'.
const CASE_STUDY_DOMAIN_STYLE = DOMAIN_STYLES as Record<string, { bg: string; text: string }>;
const CASE_STUDY_DOMAIN_LABEL = DOMAIN_LABEL as Record<string, string>;

export async function generateStaticParams() {
  return domainPages.map((d) => ({ domain: d.slug }));
}

// The 8 domain slugs are static, but each page's "From the blog" section
// (added 2026-07-18) now reads live from MongoDB, so the page itself needs
// a revalidate window -- otherwise a newly published post for this domain
// would never show up here without a full rebuild. The admin panel's
// publish route also calls revalidatePath directly for an instant update.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const page = getDomainPage(domain);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/services/${page.slug}`,
    },
  };
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const page = getDomainPage(domain);

  if (!page) {
    notFound();
  }

  const Icon = ICONS[page.iconName];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.label,
    name: page.title,
    description: page.metaDescription,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: 'Worldwide',
    url: `${siteConfig.url}/services/${page.slug}`,
  };

  const breadcrumbItems = [
    { label: 'Home', href: '' },
    { label: 'Services', href: '/services' },
    { label: page.label, href: `/services/${page.slug}` },
  ];

  const proofCaseStudies =
    page.proof.kind === 'case-study'
      ? page.proof.slugs
          .map((slug) => caseStudies.find((c) => c.slug === slug))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
      : [];

  // "From the blog" only renders once a real post exists for this domain
  // (blog-writing skill section 6) -- no empty or placeholder section.
  const domainPosts = await getPublishedPostsByDomain(page.slug);

  return (
    <main>
      <PageSchema
        title={page.title}
        description={page.metaDescription}
        url={`${siteConfig.url}/services/${page.slug}`}
        type="ItemPage"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        ariaLabel={`${page.label} software development`}
        breadcrumbItems={breadcrumbItems}
        heading={page.h1}
        subtext={page.subtext}
        ctaLabel="Book a discovery call"
        ctaHref="/contact"
        secondaryLink={{ label: 'See all services', href: '/services' }}
      />

      {/* Answer-first block: the visitor's WIIFM question answered
          immediately, not buried after scrolling. */}
      <section className="border-b border-border-subtle bg-surface" aria-label={`${page.label} overview`}>
        <div className="container-site max-w-3xl py-10">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg gloss-accent text-white">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <p className="text-lg text-text-secondary leading-relaxed">{page.answerBlock}</p>
          </div>
        </div>
      </section>

      {/* What we build -- the 5 real scenarios, same audited WIIFM copy
          used in SolutionsExplorerSection, given room to breathe on a
          dedicated page instead of an accordion tab. */}
      <section className="section relative overflow-hidden bg-surface-raised" aria-label={`What we build for ${page.label}`}>
        <CornerDots corner="top-left" />
        <CornerDots corner="bottom-right" />
        <div className="container-site relative">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-10">
            What we build for {page.label.toLowerCase()}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.scenarios.map((s) => (
              <div key={s.key} className="card overflow-hidden p-0 flex flex-col">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof -- real named case studies where they exist, honest
          capability language where they don't. Never a fabricated claim. */}
      <section className="section relative overflow-hidden bg-surface" aria-label="Proof">
        <CornerDots corner="top-right" />
        <CornerDots corner="bottom-left" />
        <div className="container-site relative">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-8">
            {page.proof.kind === 'case-study' ? "Real projects we've shipped" : 'How we approach it'}
          </h2>
          {page.proof.kind === 'case-study' ? (
            <div className="grid md:grid-cols-3 gap-6">
              {proofCaseStudies.map((project) => {
                const style = CASE_STUDY_DOMAIN_STYLE[project.domain] ?? CASE_STUDY_DOMAIN_STYLE.erp;
                return (
                  <Link
                    key={project.slug}
                    href={`/case-studies/${project.slug}`}
                    className="rounded-xl border border-border bg-surface-raised overflow-hidden block transition-colors hover:border-accent/40"
                  >
                    <div className={`h-24 flex items-center px-5 ${style.bg}`} aria-hidden="true">
                      <span className={`text-xs font-black uppercase tracking-[0.1em] ${style.text}`}>
                        {CASE_STUDY_DOMAIN_LABEL[project.domain] ?? project.domain}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-text-primary mb-1">{project.name}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{project.tagline}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card max-w-2xl flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-accent mt-1" aria-hidden="true" />
              <p className="text-text-secondary leading-relaxed">{page.proof.statement}</p>
            </div>
          )}
        </div>
      </section>

      {domainPosts.length > 0 && (
        <section className="section relative overflow-hidden bg-surface-raised" aria-label={`${page.label} articles`}>
          <div className="container-site relative">
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
                From the blog
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-accent-bright hover:text-accent">
                View all articles
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {domainPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-xl border border-border bg-surface overflow-hidden block hover:border-accent/40 transition-colors p-5 flex flex-col"
                >
                  <span className="inline-flex self-start text-[11px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-accent/10 text-accent-bright mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-text-primary mb-2">{post.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted pt-4 mt-4 border-t border-border-subtle">
                    <span>{post.publishedAt}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <DomainFAQAccordion domainLabel={page.label} faqs={page.faqs} />

      <FinalCTASection />
    </main>
  );
}
