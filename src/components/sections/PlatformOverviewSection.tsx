'use client';

import Reveal from '@/components/ui/Reveal';

const STEPS = [
  {
    n: '01 · Discover',
    title: 'Understand the workflow',
    body: 'We map the constraints and business outcomes before a line of code gets written.',
  },
  {
    n: '02 · Design',
    title: 'Architect for scale',
    body: 'A solution architecture built to support reliability and growth, not just a demo.',
  },
  {
    n: '03 · Deliver',
    title: 'Ship in phases',
    body: 'Real users validate every phase. We improve fast instead of guessing upfront.',
  },
];

export default function PlatformOverviewSection() {
  return (
    <section className="section" aria-label="How Bitsbuffer builds">
      {/* Intro text was max-w-2xl but the card row below it used the full
          container-site width (1280px) with no cap of its own, so the
          cards visibly spilled past the edges of the heading/subtext
          column above them, Adnan flagged this as "misaligned" 2026-07-08.
          Wrapping both blocks in the same max-w-5xl column fixes it: text
          keeps its readable line-length via the nested max-w-2xl, cards
          get a shared left/right edge with the heading instead of
          sprawling to the container's full width. */}
      <div className="container-site">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="badge mb-4">How we build</p>
            <h2 className="section-title mb-4">Discover, design, deliver. Every project, no exceptions.</h2>
            <p className="text-text-secondary leading-relaxed">
              We prioritize software that solves the real business problem, not the abstract technical one.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 120} className="h-full">
                <div className="card h-full">
                  <p className="text-xs font-black tracking-[0.1em] text-accent-bright mb-4">{step.n}</p>
                  <h3 className="text-base font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
