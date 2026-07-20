'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { buildDotWave } from '@/lib/dot-wave';

const STATS = [
  { value: '10+', label: 'Production systems launched' },
  { value: '8', label: 'Industries served' },
  { value: '6-pass', label: 'Audit before every launch' },
];

// Dot-wave artifact (replaced the square "bits galaxy" 2026-07-08 to match
// the halftone-dot language used on Hero 2/HeroSectionDark.tsx). Built as
// horizontal bands from top to bottom of the hero, each band's left edge
// pushed further left the lower it sits, on a sine-eased curve rather than
// a straight diagonal, so the boundary reads as the edge of one large
// incomplete circle instead of a wedge, wider at the bottom than the top.
// Generator lives in src/lib/dot-wave.ts (extracted 2026-07-08) so the
// smaller corner accents elsewhere on the site use the identical pattern
// instead of a different-looking one-off.
const DOT_VIEW_W = 700;
const DOT_VIEW_H = 780;

const DOTS = buildDotWave({
  viewW: DOT_VIEW_W,
  viewH: DOT_VIEW_H,
  rows: 20,
  baseReach: 180,
  growReach: 460,
  rightBleed: 50,
  baseCount: 10,
  growCount: 8,
});

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-accent-dim/45 pt-20 pb-20 md:pt-28 md:pb-28"
      aria-label="Bitsbuffer hero"
    >
      {/* Dot-wave artifact, bleeds to the browser's right edge rather than
          sitting inside a boxed card, spans the full section height so it
          reads as top-right corner to bottom-right corner. Scroll-tied
          sway was tried and removed 2026-07-08, wasn't visibly doing
          anything worth the extra moving part. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] lg:block"
        aria-hidden="true"
      >
        <svg
          viewBox={`0 0 ${DOT_VIEW_W} ${DOT_VIEW_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              className={`${d.fill} ${d.dust ? 'bit-dust' : ''}`}
              style={
                d.dust
                  ? ({
                      '--base-o': d.o,
                      '--dur': `${5 + (i % 7)}s`,
                      '--delay': `${-((i % 11) + (i % 3) * 0.5)}s`,
                    } as CSSProperties)
                  : { opacity: d.o }
              }
            />
          ))}
        </svg>
      </div>

      <div className="container-fluid relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div>
          <span className="badge mb-6 animate-fade-up" style={{ animationDelay: '50ms' }}>
            Software studio · Workflow product
          </span>
          {/* No animation on the H1: this is the LCP element (largest text
              block above the fold). It used to fade in with the rest of
              the stagger, which pushed real LCP measurement out to 8.11s
              and made Lighthouse credit the header's static nav link as
              LCP instead, since that text painted immediately and this one
              didn't. Left permanently static so it's part of the first
              real paint. See docs/09_remediation_plan.md loop 3. */}
          <h1
            className="font-black tracking-tight text-text-primary leading-[1.03] mb-5"
            style={{ fontSize: 'clamp(2.6rem, 4.2vw, 4rem)' }}
          >
            Custom software engineered around{' '}
            <span className="text-accent">how your team actually works.</span>
          </h1>
          <p
            className="text-lg text-text-secondary max-w-xl leading-relaxed mb-8 animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            Bitsbuffer builds production-grade platforms across {siteConfig.industriesList}.
            Workflow Engine, our flagship product, is the proving ground for everything we ship.
          </p>
          <div className="flex flex-wrap gap-4 mb-10 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link href="/contact" className="btn-primary btn-lg">
              Book a discovery call
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={siteConfig.flagshipProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-lg"
            >
              Explore Workflow Engine
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <div
            className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-border-subtle animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black tracking-tight text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Empty spacer column at lg+ so the text column doesn't underlap
            the absolutely-positioned artifact bleeding off the right edge. */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
