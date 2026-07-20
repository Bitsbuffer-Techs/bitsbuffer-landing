import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

// Rebuilt as a single dark closing panel 2026-07-20 (option A of the
// redesign discussion). The old version ended the page with four
// equal-weight light boxes: three cards (two of which pointed at the
// same /contact page) plus a separate reassurance strip, diluting the
// final action into a menu. This is the Stripe/Vercel closing pattern
// instead: one full-width ink panel, one dominant action (discovery
// call, consistent with TransformWorkSection's process-mapping offer),
// one quiet secondary (Workflow Engine, external), and the reassurance
// copy as small print under the buttons. Ink tokens + the same faint
// white dot-grid texture ProblemSolutionSection uses for dark bands, so
// the panel reads as brand teal, not a random navy. CornerDots dropped:
// the contrast of the panel is the visual event, dots around it would
// compete with it. Section padding tightened (was .section's full
// vertical rhythm plus two mb-10 gaps inside).
export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 md:pb-20" aria-label="Take the next step with Bitsbuffer">
      <div className="container-site relative">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 sm:px-12 py-14 md:py-16 text-center">
          {/* Faint dot grid, same treatment as ProblemSolutionSection. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white px-4 py-2.5 mb-8">
              <Image
                src="/bitsbuffer-logo-dark.png"
                alt={siteConfig.name}
                width={140}
                height={36}
                className="h-6 w-auto object-contain"
              />
            </div>

            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              Tell us what you are building.
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              No generic proposal. No obligation. Real workflow mapping starts in the first
              conversation, and a real person answers, no bot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link href="/contact" className="btn-primary btn-lg w-full sm:w-auto">
                Book a discovery call
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={siteConfig.flagshipProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-base font-semibold text-white transition-colors duration-150 hover:bg-white/10 w-full sm:w-auto"
              >
                Explore Workflow Engine
              </a>
            </div>

            {/* white/60, not /50: keeps the small print above the WCAG AA
                4.5:1 contrast line on the ink background. */}
            <p className="text-sm text-white/60">No credit card, no sales deck, no long-term lock-in.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
