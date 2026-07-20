'use client';

import { Camera, ShieldCheck, Layers, KeyRound } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Built 2026-07-08 for the /about rebuild. Same icon-card pattern as
// QualityAuditSection and ServicesOfferingsSection. Every value here maps
// to something already true and demonstrable elsewhere on the site
// (real photos not stock, the six-pass audit, one standard across both
// products, client owns the code), not aspirational language invented
// for this page.
const VALUES = [
  {
    Icon: Camera,
    title: 'Real, not staged',
    body: 'The photos on this page are the actual studio. Case studies name real stacks. Nothing here is a stock placeholder.',
  },
  {
    Icon: ShieldCheck,
    title: 'Discipline over shortcuts',
    body: 'Every release, client work and Workflow Engine alike, goes through the same six-pass audit before it ships.',
  },
  {
    Icon: Layers,
    title: 'One standard, two products',
    body: 'Custom builds and Workflow Engine are different roadmaps, but they answer to the same delivery bar.',
  },
  {
    Icon: KeyRound,
    title: 'You own what we build',
    body: 'No lock-in. When a project ships, the code is yours, not licensed back to you.',
  },
];

export default function AboutValuesSection() {
  return (
    <section className="section relative overflow-hidden bg-surface" aria-label="How we work">
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-10">How we work</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 100} className="h-full">
              <div className="card h-full">
                <span className="w-11 h-11 rounded-lg gloss-accent text-white flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
