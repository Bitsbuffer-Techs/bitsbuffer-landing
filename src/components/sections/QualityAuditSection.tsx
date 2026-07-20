'use client';

import Link from 'next/link';
import { ArrowRight, Code2, Gauge, Accessibility as AccessibilityIcon, Search, Bot, MonitorSmartphone } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Re-crafted 2026-07-20: the 6 flat cards read as hollow, lots of air,
// one line of copy per pass, no proof. Now a two-column layout: a left
// rail that carries the story (why the audit exists, the WebAIM 94.8%
// stat, and a link to the full 6-pass blog post, which is also the
// upward interlink that post needs), and a right-side numbered timeline
// where every pass keeps its one-line definition and gains a real
// "Caught:" line from actual Bitsbuffer builds. Deliberately zero new
// cost: no images, no new client JS, same lucide icons, same Reveal
// stagger. Density comes from content and structure, not decoration.
const PASSES = [
  {
    n: '01',
    title: 'Code quality',
    body: 'Dead code, copy-paste patterns, and convention drift caught before merge.',
    caught: "Duplicated logic flagged before it became the next developer's maintenance debt.",
    Icon: Code2,
  },
  {
    n: '02',
    title: 'Performance',
    body: 'Split rendering, compressed assets, no dead weight shipped to the browser.',
    caught: 'Below-the-fold sections hydrating independently and dragging the mobile score down.',
    Icon: Gauge,
  },
  {
    n: '03',
    title: 'Accessibility',
    body: 'Every control keyboard-operable, real focus states, no invisible traps.',
    caught: "Low-contrast text, the same failure WebAIM finds on 79.1% of the web's top home pages.",
    Icon: AccessibilityIcon,
  },
  {
    n: '04',
    title: 'SEO',
    body: 'Canonical tags, structured data, and sitemap coverage on every route.',
    caught: 'Duplicate titles and metas across pages, invisible in any browser check.',
    Icon: Search,
  },
  {
    n: '05',
    title: 'AI visibility',
    body: 'llms.txt, AI-crawler-friendly robots.txt, FAQ schema actually wired in.',
    caught: 'Structured data gaps quietly keeping content out of AI answer engines.',
    Icon: Bot,
  },
  {
    n: '06',
    title: 'UI / UX',
    body: 'A real human walkthrough in an actual browser, every time, no exceptions.',
    caught: 'Five published articles rendering with blank bodies while every automated pass ran green.',
    Icon: MonitorSmartphone,
  },
];

export default function QualityAuditSection() {
  return (
    <section
      className="section relative overflow-hidden bg-surface-raised border-y border-border-subtle"
      aria-label="Bitsbuffer 6-pass launch audit"
    >
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">
        {/* Left rail: the story and the proof. Sticky on desktop so the
            rail keeps the reader company while the six passes scroll. */}
        <div className="lg:sticky lg:top-24">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-4">
            Every launch clears a 6-pass audit.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            A site that compiles clean is not a site that works. This audit exists because a demo form
            once looked correct in the code and silently dropped real submissions before anyone caught
            it. That bug became a standing rule: six passes, fixed order, every launch. The same
            checklist we run before shipping Workflow Engine, applied to every client build.
          </p>

          <div className="rounded-xl border border-border bg-bg/60 p-5 mb-6">
            <p className="text-3xl font-black text-accent">94.8%</p>
            <p className="text-sm text-text-secondary leading-relaxed mt-1">
              of the web&apos;s top one million home pages fail automated accessibility checks, averaging 51
              errors each (WebAIM Million, 2025). The audit exists so nothing we ship is one of them.
            </p>
          </div>

          <Link
            href="/blog/the-6-pass-audit-behind-every-launch"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent-bright hover:underline"
          >
            Read the full audit, including what each pass has caught
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Right: the six passes as a connected numbered timeline. */}
        <ol className="relative">
          {PASSES.map((p, i) => (
            <li key={p.n}>
              {/* Reveal renders a div, so it lives inside the li (ol > li >
                  div is valid, ol > div is not). The flex row and bottom
                  padding sit on Reveal's own div via className. */}
              <Reveal delay={i * 100} className={`relative flex gap-5 ${i < PASSES.length - 1 ? 'pb-8' : ''}`}>
                {/* Icon column with connecting line */}
                <div className="flex flex-col items-center self-stretch">
                  <span className="w-11 h-11 shrink-0 rounded-lg gloss-accent text-white flex items-center justify-center">
                    <p.Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  {i < PASSES.length - 1 && <span className="w-px flex-1 bg-border mt-2" aria-hidden="true" />}
                </div>

                <div className="pt-1 pb-2">
                  <p className="text-xs font-black tracking-[0.1em] text-accent-bright mb-1">
                    {p.n} <span className="text-text-primary normal-case tracking-normal text-sm font-bold ml-1">{p.title}</span>
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-2">{p.body}</p>
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold text-accent">Caught on a real build: </span>
                    <span className="text-text-secondary">{p.caught}</span>
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
