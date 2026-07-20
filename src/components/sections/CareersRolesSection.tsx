'use client';

import { Code2, Terminal, Palette, Workflow } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Built 2026-07-08 to replace the old plain bulleted role list with the
// icon-card grid pattern used everywhere else on the rebuilt site
// (QualityAuditSection, ServicesOfferingsSection). top-right/bottom-left
// so this doesn't repeat FinalCTASection's top-left/bottom-right directly
// below it.
const ROLES = [
  {
    Icon: Code2,
    title: 'Product engineers',
    body: 'Own a feature end to end, from the first architecture call to what ships in production.',
  },
  {
    Icon: Terminal,
    title: 'Full-stack developers',
    body: 'Comfortable across the stack we actually run: Next.js, NestJS, MongoDB, and everything between.',
  },
  {
    Icon: Palette,
    title: 'Designers and product thinkers',
    body: 'Shape how a workflow feels before a line of code is written, then stay close through delivery.',
  },
  {
    Icon: Workflow,
    title: 'Delivery and operations specialists',
    body: 'Keep client work and internal builds moving without anything falling through the cracks.',
  },
];

export default function CareersRolesSection() {
  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="Roles we hire for">
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-3">We are often looking for</h2>
        <p className="text-text-secondary mb-10 max-w-2xl">
          Bitsbuffer runs as a team of roughly 21 to 50 people. We hire around real project need, not a fixed
          headcount plan, so open roles shift as delivery work does.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROLES.map(({ Icon, title, body }, i) => (
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
