'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Rebuilt 2026-07-17, Adnan's call: the original 4 questions weren't real
// buyer questions, they were generic reassurance copy. Replaced with 12
// questions researched against what people actually search before hiring a
// custom software studio (cost, outsourcing risk, custom-vs-off-the-shelf,
// code ownership, security, post-launch support, discovery process) and
// tied directly to this page's own target keywords (metadata.keywords in
// app/page.tsx: custom software development, workflow automation,
// enterprise software, fintech development, ecommerce engineering,
// workflow engine). Every answer restates a fact already established
// elsewhere on the site, nothing new invented for this section: code
// ownership and the "operating partner" line were already here, the
// 21-to-50-person/Layyah team fact is from About, the ISO 27001 framing is
// the same jurisdiction-neutral pattern used in the fintech blog post and
// domain page, and Workflow Engine vs. custom dev restates ServiceToolsSection.
const FAQS = [
  {
    q: 'How long does a typical custom software build take?',
    a: 'Timelines depend on scope. Discovery scopes it precisely in the first call, so you get a real date, not a guess.',
  },
  {
    q: 'How much does custom software development cost?',
    a: 'It depends on integrations, compliance requirements, and how much of your current workflow needs rebuilding versus connecting. We do not quote a number before discovery, a number given without scoping is a guess dressed up as a quote. The first call gives you a real range.',
  },
  {
    q: 'Who owns the code when we are done?',
    a: 'You do. Full source, no lock-in, no retained rights on our side.',
  },
  {
    q: 'What happens after launch?',
    a: 'We stay on as the operating partner, not a vendor who disappears. Ongoing support and evolution are part of the model.',
  },
  {
    q: 'Do you only build Workflow Engine, or custom projects too?',
    a: `Both. Workflow Engine is our flagship product and proving ground. We still take on custom development across ${siteConfig.industriesList}.`,
  },
  {
    q: 'Do I actually need custom software, or is off-the-shelf enough?',
    a: 'Off-the-shelf is fine for standard workflows every business shares. Custom earns its cost once your process is different on purpose and a generic tool forces constant workarounds around it. Part of discovery is being honest with you about which one you actually need, not selling custom by default.',
  },
  {
    q: 'Do you outsource the work, or does your own team build it?',
    a: 'Our own team builds it. The same 21 to 50 person studio in Lahore, Pakistan that scopes your project is the one that builds and ships it, nothing gets handed to a different team once the contract is signed.',
  },
  {
    q: 'Is our source code and data safe while you are building it?',
    a: 'Yes. You hold full ownership of the source code throughout the build, not just at handover, and every engagement starts with an NDA. For regulated industries like fintech or healthcare, security requirements are scoped against recognized frameworks (ISO 27001 for audit trails, ISO 27799 for health data) during discovery, not added after launch.',
  },
  {
    q: 'What industries do you build custom software for?',
    a: `${siteConfig.industriesList}. Every build is scoped through the same discovery process and audited the same six ways, regardless of industry.`,
  },
  {
    q: 'Do you build fintech software, and is it compliant?',
    a: 'Yes. Fintech builds are scoped against ISO 27001’s audit-trail controls first, then localized to whichever regulator actually applies to your market, instead of assuming one country’s rules by default.',
  },
  {
    q: 'Can you build workflow automation for our business, not just HR?',
    a: 'Yes, two ways: through Workflow Engine directly if your process fits one of its existing modules, or as a fully custom build if it does not. Discovery is where we figure out which path actually fits, not where we sell you into one by default.',
  },
  {
    q: 'What does the discovery process actually involve?',
    a: 'A structured first call where we map your current workflow, the systems it touches, and where it actually breaks. That call is what produces a real timeline and cost, not a template estimate sent before anyone understands the project.',
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

// Rebuilt as an independent-toggle accordion 2026-07-08, was a static list
// with every answer always visible. Each question opens on its own, not a
// single-active accordion like SolutionsExplorerSection's scenarios: FAQ
// browsing is naturally a "compare a few answers side by side" behavior,
// forcing the last one shut the moment a new one opens would fight that.
// First question starts open so the section doesn't look empty on load
// and demonstrates the interaction immediately, badge removed and heading
// recolored to text-accent-bright per the convention used across every
// rebuilt section, corner dots continue the alternation from
// QualityAuditSection's top-left/bottom-right.
export default function HomeFAQSection() {
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
    <section className="section relative overflow-hidden" aria-label="Frequently asked questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">Before you book a call</h2>
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
                    {/* pl-11 = the 8px icon (h-8/w-8 = 32px) plus the
                        gap-3 (12px) beside it, so the answer lines up
                        under the question text, not under the icon. */}
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
