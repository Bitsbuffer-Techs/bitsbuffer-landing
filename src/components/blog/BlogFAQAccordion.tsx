'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import type { BlogFAQ } from '@/lib/blog-posts';

// Same independent-toggle accordion pattern as DomainFAQAccordion.tsx /
// HomeFAQSection.tsx, parameterized for blog posts (immersive-UI pass,
// 2026-07-17) so the article page stops rendering FAQs as flat
// question/answer text and gets the same interactive treatment as every
// other FAQ block on the site. FAQPage schema itself still lives in
// blog/[slug]/page.tsx (one script tag per page, not duplicated here).
export default function BlogFAQAccordion({ faqs }: { faqs: BlogFAQ[] }) {
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
    <div className="flex flex-col gap-3">
      {faqs.map((item, i) => {
        const isOpen = openKeys.has(i);
        return (
          <div
            key={item.q}
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
                <p className="pl-11 pr-5 pb-5 text-sm leading-relaxed text-text-secondary">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
