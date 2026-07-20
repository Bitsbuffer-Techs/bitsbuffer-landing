import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock, CheckCircle2, Quote } from 'lucide-react';
import { getPublishedPostBySlug, getAllPublishedPosts } from '@/lib/db/blog-repo';
import { getDomainPage } from '@/lib/domain-pages';
import { siteConfig } from '@/lib/site-config';
import Breadcrumb from '@/components/ui/Breadcrumb';
import HeroDotWave from '@/components/ui/HeroDotWave';
import LinkedParagraph from '@/components/blog/LinkedParagraph';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import BlogFAQAccordion from '@/components/blog/BlogFAQAccordion';
import RelatedPostsSection from '@/components/blog/RelatedPostsSection';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Turns an H2 string into a stable anchor id for the table of contents,
// e.g. `The audit trail problem hiding inside "we will reconcile it later"`
// -> `the-audit-trail-problem-hiding-inside-we-will-reconcile-it-later`.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Revalidates on a 5-minute fallback timer; the admin panel's
// publish/unpublish/edit routes also call revalidatePath directly for an
// instant update, this is just the safety net.
export const revalidate = 300;

// No generateStaticParams: posts are created/published/unpublished at any
// time from the admin panel, not known at build time. Next.js renders
// dynamic params on demand and caches per `revalidate` above.

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPublishedPosts();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Organization', name: siteConfig.name },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

  const domainPage = post.domain ? getDomainPage(post.domain) : undefined;
  const ctaLabel = post.ctaLabel ?? 'Start a conversation';
  const ctaHref = post.ctaHref ?? (domainPage ? `/services/${domainPage.slug}` : '/contact');

  const toc = (post.sections ?? [])
    .filter((s): s is typeof s & { heading: string } => Boolean(s.heading))
    .map((s) => ({ heading: s.heading, id: slugify(s.heading) }));

  const breadcrumbItems = [
    { label: 'Home', href: '' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <main>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ─── ARTICLE HEADER ───────────────────────────────────────────────
          Bigger, magazine-style masthead instead of the old badge + plain
          H1: byline row (studio "avatar" + date + reading time + domain
          tag) gives the article a human source the way a TechCrunch
          byline does, without inventing a named author we can't stand
          behind. No cover photo, by design (2026-07-16 remediation) --
          the typographic scale here is what used to be a hero image. */}
      <section className="relative overflow-hidden bg-accent-dim/45 pt-10 pb-14 md:pt-14">
        <HeroDotWave />
        <div className="container-site relative max-w-[820px]">
          <div className="mb-5">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <span className="badge mb-5">{post.category}</span>
          <h1
            className="font-black tracking-tight text-text-primary leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)' }}
          >
            {post.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-7 max-w-[680px]">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-border-subtle">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full gloss-accent text-white text-sm font-black">
                B
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-text-primary">Bitsbuffer Studio</p>
                <p className="text-xs text-text-muted">Engineering &amp; product team</p>
              </div>
            </div>
            <span className="h-4 w-px bg-border-subtle" aria-hidden="true" />
            <div className="flex items-center gap-1.5 text-sm text-text-muted">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{post.readingTime}</span>
            </div>
            {domainPage && (
              <Link
                href={`/services/${domainPage.slug}`}
                className="text-sm font-semibold text-accent-bright hover:text-accent"
              >
                {domainPage.label} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── ARTICLE BODY ─────────────────────────────────────────────────
          Two-column on desktop: flowing prose column (no per-section card
          boxing -- that read as flat/uniform, see docs/09_remediation_plan.md
          loop 7) plus a sticky sidebar with the table of contents and CTA,
          the pattern long-form editorial sites (TechCrunch, Stripe, a16z)
          use to keep a long piece navigable without breaking it into
          identical boxes. */}
      <section className="border-b border-border-subtle bg-surface">
        <div className="container-site py-12">
          <div className="mx-auto grid max-w-[1080px] gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <article className="max-w-[680px] min-w-0">
              {post.sections && post.sections.length > 0 ? (
                <div className="space-y-10">
                  {(() => {
                    let headingNumber = 0;
                    return post.sections.map((section, i) => {
                    const isLede = i === 0 && !section.heading;
                    if (section.heading) headingNumber += 1;
                    const currentHeadingNumber = headingNumber;
                    return (
                      <div key={section.heading ?? `lede-${i}`}>
                        {section.heading && (
                          <h2
                            id={slugify(section.heading)}
                            className="scroll-mt-28 text-2xl md:text-[1.65rem] font-black tracking-tight text-text-primary mb-4"
                          >
                            <span className="text-accent-bright mr-2 text-lg font-black align-top">
                              {String(currentHeadingNumber).padStart(2, '0')}
                            </span>
                            {section.heading}
                          </h2>
                        )}
                        <div className="space-y-4">
                          {section.paragraphs.map((paragraph, pi) => (
                            <LinkedParagraph
                              key={paragraph}
                              text={paragraph}
                              className={
                                isLede && pi === 0
                                  ? 'text-xl md:text-[1.35rem] font-medium text-text-primary leading-snug'
                                  : 'text-base leading-relaxed text-text-secondary'
                              }
                            />
                          ))}
                        </div>

                        {/* Key takeaways box: rendered right after the lede,
                            not as its own `sections` entry, so it always
                            sits in the same place regardless of post content. */}
                        {isLede && post.keyTakeaways && post.keyTakeaways.length > 0 && (
                          <div className="mt-6 rounded-xl border border-accent/25 bg-accent-dim/40 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-accent-bright mb-3">
                              Key takeaways
                            </p>
                            <ul className="space-y-2.5">
                              {post.keyTakeaways.map((point) => (
                                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-primary">
                                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.stat && (
                          <div className="mt-6 flex items-baseline gap-4 rounded-xl border border-border bg-surface-raised px-5 py-4">
                            <p className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright whitespace-nowrap">
                              {section.stat.value}
                            </p>
                            <p className="text-sm text-text-secondary leading-snug">{section.stat.label}</p>
                          </div>
                        )}

                        {section.pullQuote && (
                          <blockquote className="mt-6 border-l-4 border-accent pl-5 py-1">
                            <Quote className="h-5 w-5 text-accent/50 mb-1" aria-hidden="true" />
                            <p className="text-xl md:text-2xl font-bold text-text-primary leading-snug">
                              {section.pullQuote}
                            </p>
                          </blockquote>
                        )}

                        {section.table && (
                          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-sm border-collapse">
                              <thead>
                                <tr className="border-b border-border bg-surface-raised">
                                  {section.table.headers.map((h) => (
                                    <th key={h} className="text-left py-3 px-4 font-bold text-text-primary">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {section.table.rows.map((row, ri) => (
                                  <tr key={ri} className="border-b border-border-subtle last:border-0">
                                    {row.map((cell, ci) => (
                                      <td key={ci} className="py-3 px-4 text-text-secondary">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  });
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  {(post.content ?? []).map((paragraph, pi) => (
                    <LinkedParagraph
                      key={paragraph}
                      text={paragraph}
                      className={
                        pi === 0
                          ? 'text-xl md:text-[1.35rem] font-medium text-text-primary leading-snug'
                          : 'text-base leading-relaxed text-text-secondary'
                      }
                    />
                  ))}
                </div>
              )}

              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12 pt-10 border-t border-border-subtle">
                  <h2 className="text-2xl font-black tracking-tight text-text-primary mb-5">
                    Frequently asked questions
                  </h2>
                  <BlogFAQAccordion faqs={post.faqs} />
                </div>
              )}
            </article>

            {/* Sticky sidebar: table of contents + inline CTA. Desktop only
                (lg:block) -- on mobile the TOC would just push the CTA
                below the fold for no benefit, so it's dropped entirely
                rather than collapsed into an accordion nobody opens. */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {toc.length >= 3 && (
                  <nav aria-label="Table of contents" className="rounded-xl border border-border bg-surface-raised p-5">
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-text-muted mb-3">
                      In this article
                    </p>
                    <ol className="space-y-2.5">
                      {toc.map((item, i) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="flex items-start gap-2 text-sm text-text-secondary hover:text-accent transition-colors leading-snug"
                          >
                            <span className="text-accent-bright font-bold">{String(i + 1).padStart(2, '0')}</span>
                            {item.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div className="rounded-xl border border-accent/25 bg-accent-dim/40 p-5">
                  <p className="text-sm font-bold text-text-primary mb-2">
                    {domainPage ? `Building for ${domainPage.label.toLowerCase()}?` : 'Have a project like this?'}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    Tell us where the process breaks down. We&apos;ll tell you honestly whether custom software fixes it.
                  </p>
                  <Link href={ctaHref} className="btn-primary w-full justify-center text-sm">
                    {ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <RelatedPostsSection
        currentSlug={post.slug}
        domain={post.domain}
        category={post.category}
        posts={allPosts}
      />

      <section className="section">
        <div className="container-site card lg:p-10">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            {domainPage ? `Want ${domainPage.label.toLowerCase()} software built around your team?` : 'Want a product or workflow built around your team?'}
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl">
            We help teams move from scattered tools to dependable software that actually supports the work.
          </p>
          <Link href={ctaHref} className="btn-primary">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
