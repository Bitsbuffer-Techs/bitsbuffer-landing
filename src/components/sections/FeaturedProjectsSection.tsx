import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { caseStudies, generalizedCredibility, DOMAIN_LABEL, DOMAIN_STYLES } from '@/lib/case-studies';
import CornerDots from '@/components/ui/CornerDots';

export default function FeaturedProjectsSection() {
  const featured = caseStudies.slice(0, 3);

  return (
    <section className="section relative overflow-hidden border-t border-border-subtle bg-surface" aria-label="Case studies">
      {/* top-right/bottom-left so this doesn't repeat whichever section
          renders directly before it on either page it's used on
          (QualityAuditSection, which follows this everywhere, uses
          top-left/bottom-right). */}
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative">
        {/* text-accent-bright to match the heading treatment used across
            every rebuilt section, badge removed. Now reused on both the
            homepage and /services, so this pass keeps it consistent
            wherever it renders instead of only fixing the homepage copy. */}
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-3">Case studies</h2>
        <p className="text-text-secondary mb-10 max-w-2xl">{generalizedCredibility}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((project) => {
            const style = DOMAIN_STYLES[project.domain] ?? DOMAIN_STYLES.erp;
            return (
            <Link
              key={project.slug}
              href={`/case-studies/${project.slug}`}
              className="rounded-xl border border-border bg-surface overflow-hidden block transition-colors hover:border-accent/40"
            >
              <div className={`h-24 flex items-center px-5 ${style.bg}`} aria-hidden="true">
                <span className={`text-xs font-black uppercase tracking-[0.1em] ${style.text}`}>
                  {DOMAIN_LABEL[project.domain] ?? project.domain}
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
        <div className="mt-8">
          <Link href="/case-studies" className="btn-secondary">
            View all case studies
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
