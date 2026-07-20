import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import HeroDotWave from './HeroDotWave';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from '@/lib/breadcrumb';

// Shared page-level hero, extracted 2026-07-08 from ServicesHero so
// /blog, /case-studies, and /careers don't each copy-paste their own
// version with only the copy changed, the exact "3+ near-identical files"
// case the site's own build standards call out to fix. Same visual
// grammar as the homepage hero and ServicesHero: light bg-accent-dim
// wash, the shared dot-wave generator, no badge, a black headline with
// one phrase highlighted, optional stats row and secondary link.
// Dot-wave rendering itself moved into HeroDotWave.tsx 2026-07-17 so the
// blog post page's custom header (needs a byline row this component
// doesn't support, so it can't just use PageHero) could reuse the exact
// same decoration instead of sitting undecorated next to every page that
// does use PageHero.
//
// Breadcrumb moved in-hero 2026-07-17 (second pass): it originally lived
// in its own plain-background strip above this section (`pt-8 pb-2`,
// added per-page). Adnan's call after seeing it live: it looked
// unimpressive sitting alone on white, and splitting it out didn't
// actually fix the "too much empty space" problem, it just relocated it.
// Breadcrumb now renders inside the hero itself, on the same tinted
// background as everything else, and the section's own top padding
// dropped from pt-32/pt-36 to pt-10/pt-14, tight under the nav instead
// of leaving 128-144px of nothing above the first line of content.

type Stat = { value: string; label: string };
type SecondaryLink = { label: string; href: string; external?: boolean };

export default function PageHero({
  heading,
  subtext,
  ctaLabel,
  ctaHref = '/contact',
  secondaryLink,
  stats,
  ariaLabel,
  breadcrumbItems,
}: {
  heading: ReactNode;
  subtext: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLink?: SecondaryLink;
  stats?: Stat[];
  ariaLabel: string;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  return (
    <section
      className="relative overflow-hidden bg-accent-dim/45 pt-10 pb-16 md:pt-14 md:pb-20"
      aria-label={ariaLabel}
    >
      <HeroDotWave />

      <div className="container-fluid relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          {breadcrumbItems && (
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}
          {/* No animation on the H1: same LCP fix as HeroSection.tsx
              (2026-07-16 remediation) -- this is the largest above-fold
              text on every page that uses PageHero (blog, case-studies,
              careers, services, and the domain pages), so it can't sit at
              opacity:0 waiting on JS to hydrate. See
              docs/09_remediation_plan.md loop 3. */}
          <h1
            className="font-black tracking-tight text-text-primary leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.2rem, 3.6vw, 3.2rem)' }}
          >
            {heading}
          </h1>
          <p className="text-lg text-text-secondary max-w-xl leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {subtext}
          </p>
          {(ctaLabel || secondaryLink) && (
            <div
              className={`flex flex-wrap gap-4 animate-fade-up ${stats ? 'mb-10' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              {ctaLabel && (
                <Link href={ctaHref} className="btn-primary btn-lg">
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              {secondaryLink &&
                (secondaryLink.external ? (
                  <a href={secondaryLink.href} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
                    {secondaryLink.label}
                  </a>
                ) : (
                  <Link href={secondaryLink.href} className="btn-secondary btn-lg">
                    {secondaryLink.label}
                  </Link>
                ))}
            </div>
          )}
          {stats && (
            <div
              className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-border-subtle animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black tracking-tight text-text-primary">{s.value}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
