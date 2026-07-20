'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';
import type { DomainFAQ } from '@/lib/domain-pages';

// Shared FAQ accordion for the 8 domain pages (src/app/services/[domain]/
// page.tsx), same independent-toggle pattern and FAQPage schema as
// HomeFAQSection/ServicesFAQSection, parameterized so each domain gets its
// own visible questions + its own schema instead of one shared block.
export default function DomainFAQAccordion({
  domainLabel,
  faqs,
}: {
  domainLabel: string;
  faqs: DomainFAQ[];
}) {
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section
      className="section relative overflow-hidden bg-surface-raised"
      aria-label={`${domainLabel} frequently asked questions`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
            Questions about {domainLabel.toLowerCase()} builds
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openKeys.has(i);
            return (
              <Reveal
                key={item.q}
                delay={i * 80}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isOpen ? 'border-accent/30 bg-surface' : 'border-border bg-surface'
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
