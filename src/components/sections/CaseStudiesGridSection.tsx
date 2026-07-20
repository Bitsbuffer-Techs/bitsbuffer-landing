'use client';

import Link from 'next/link';
import { ShoppingCart, Landmark, Sprout, Boxes, Sparkles, GraduationCap, HeartHandshake, Scale } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies';
import { DOMAIN_LABEL, DOMAIN_STYLES, DOMAIN_SOLID, DOMAIN_ICON } from '@/lib/case-studies';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Built 2026-07-08, same split pattern as BlogGridSection: /case-studies's
// page.tsx stays a server component for `metadata`, this client component
// takes the data via props. Cards use `tagline` (complete copy), never the
// `description` field, since case-studies.ts's own header comment flags
// every description as cut mid-sentence, do not publish a sentence that
// stops mid-word. Corner dots start top-left/bottom-right, the first real
// corner-dot section after PageHero (which uses the dot-wave, not
// CornerDots).
//
// Card header rebuilt 2026-07-17, Adnan's call: wanted real images on
// these cards, but none of these 9 projects have a real screenshot on
// file, and this page's entire premise is "real, named, shipped work,
// not concept work" -- faking a screenshot with generic stock photography
// would undercut the exact thing the page is trying to prove, the same
// reasoning that got stock photos pulled off the blog earlier this
// project. Went with a branded icon graphic instead: full-opacity domain
// color, the same dot-wave texture used sitewide, and the same icon
// already used on the matching /services/[domain] page where one exists.
// No photo, but reads as considered design rather than an empty color
// bar, and can't be mistaken for a real product screenshot.
const ICONS = { ShoppingCart, Landmark, Sprout, Boxes, Sparkles, GraduationCap, HeartHandshake, Scale } as const;

export default function CaseStudiesGridSection({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="All case studies">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {caseStudies.map((project, i) => {
          const style = DOMAIN_STYLES[project.domain] ?? DOMAIN_STYLES.erp;
          const solid = DOMAIN_SOLID[project.domain] ?? DOMAIN_SOLID.erp;
          const Icon = ICONS[DOMAIN_ICON[project.domain] ?? DOMAIN_ICON.erp];
          return (
            <Reveal key={project.slug} delay={i * 80}>
              <Link
                href={`/case-studies/${project.slug}`}
                className="rounded-xl border border-border bg-surface-raised overflow-hidden block hover:border-accent/40 transition-colors h-full flex flex-col"
              >
                <div className={`relative h-36 md:h-40 overflow-hidden flex items-center justify-center ${style.bg}`} aria-hidden="true">
                  <CornerDots corner="bottom-right" />
                  <span
                    className={`absolute top-4 left-4 text-[11px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-surface-raised/90 backdrop-blur-sm shadow-sm ${style.text}`}
                  >
                    {DOMAIN_LABEL[project.domain] ?? project.domain}
                  </span>
                  <span className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-md ${solid}`}>
                    <Icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-text-primary mb-2">{project.name}</h2>
                  <p className="text-sm leading-relaxed text-text-secondary flex-1">{project.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-border-subtle">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[11px] font-medium text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border-subtle">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
