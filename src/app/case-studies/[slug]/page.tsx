import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { caseStudies, DOMAIN_LABEL, DOMAIN_STYLES } from '@/lib/case-studies';
import { getDomainPage } from '@/lib/domain-pages';
import { siteConfig } from '@/lib/site-config';
import Breadcrumb from '@/components/ui/Breadcrumb';

export async function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  // Uses tagline, not the raw `description` field: description is flagged
  // in case-studies.ts as cut mid-sentence off the old site, and a meta
  // description that literally ends in "..." is a broken search snippet.
  return {
    title: `${project.name} | Case Study`,
    description: `${project.tagline}. A ${DOMAIN_LABEL[project.domain]} build by Bitsbuffer, built with ${project.stack.slice(0, 3).join(', ')}.`,
    alternates: {
      canonical: `${siteConfig.url}/case-studies/${project.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudies.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const style = DOMAIN_STYLES[project.domain] ?? DOMAIN_STYLES.erp;
  // Only 4 of case-studies.ts's 8 Domain values have a matching dedicated
  // services page today (ecommerce, fintech, agritech, erp) -- the other
  // 4 (ai, nonprofit, legaltech, and any future addition) simply don't
  // render this link rather than pointing at a page that doesn't exist.
  const domainServicePage = getDomainPage(project.domain);

  const breadcrumbItems = [
    { label: 'Home', href: '' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: project.name, href: `/case-studies/${project.slug}` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.tagline,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Light convention touch 2026-07-08: badge dropped for the same
          domain-colored pill used on the /case-studies grid cards, heading
          moved off `.section-title` to explicit utility classes (the
          site-wide cascade-order fix), no other structural change. The
          `description` field is real but truncated mid-sentence (flagged
          in case-studies.ts), so it's intentionally left out of this page
          rather than published cut off, tagline plus the delivered/stack
          cards below carry the content instead. */}
      <section className="section pt-10">
        <div className="container-site max-w-3xl">
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to case studies
          </Link>
          <span className={`inline-flex text-xs font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full mb-5 ${style.bg} ${style.text}`}>
            {DOMAIN_LABEL[project.domain] ?? project.domain}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">{project.name}</h1>
          <p className="text-lg text-text-secondary leading-relaxed">{project.tagline}</p>
        </div>
      </section>

      <section className="section border-y border-border-subtle bg-surface">
        <div className="container-site grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-3">What we delivered</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              We&apos;re finalizing the full write-up of scope, decisions, and outcomes for this project.
              Reach out and we&apos;ll walk you through it directly, including what shipped and why.
            </p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-3">Stack</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              {project.stack.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site card lg:p-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">Ready to build something similar?</h2>
          <p className="text-text-secondary max-w-2xl mb-6">
            We can apply the same product and delivery approach to your next build.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Start a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {domainServicePage && (
              <Link href={`/services/${domainServicePage.slug}`} className="btn-secondary">
                See our {domainServicePage.label} services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
