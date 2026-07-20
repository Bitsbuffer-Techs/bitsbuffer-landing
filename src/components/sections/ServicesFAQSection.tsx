'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Same independent-toggle accordion as HomeFAQSection, services-specific
// questions carried over from the old /services page rather than invented
// fresh, they already held up as real questions prospects ask. Corner dots
// continue the alternation from QualityAuditSection's top-left/bottom-right
// right before this one on the page.
const FAQS = [
  {
    q: 'How do you start a project?',
    a: 'We begin with the workflow, the constraints, and the decisions the software has to support. That keeps the scope practical from the start.',
  },
  {
    q: 'Can you build for regulated or specialized teams?',
    a: 'Yes. We design around governance, reliability, and the need for systems that can evolve without breaking trust.',
  },
  {
    q: 'Do you support iterative delivery?',
    a: 'Yes. We often ship in phases so teams can learn quickly and keep improving without waiting for a perfect version.',
  },
  {
    q: 'Do you also build products for your own studio?',
    a: 'Yes. Workflow Engine is our flagship product, and it informs how we approach custom work as well.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function ServicesFAQSection() {
  const [openKeys, setOpenKeys] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <section className="section relative overflow-hidden bg-surface" aria-label="Services frequently asked questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
            What working with us looks like
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = openKeys.has(i);
            return (
              <Reveal
                key={item.q}
                delay={i * 80}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isOpen ? 'border-accent/30 bg-surface-raised' : 'border-border bg-surface-raised'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isOpen ? 'gloss-accent text-white' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      <MessageCircleQuestion className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-base font-bold text-text-primary">{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div className={`accordion-panel ${isOpen ? 'is-open' : ''}`}>
                  <div>
                    <p className="pl-11 pr-5 pb-5 text-sm text-text-secondary leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
