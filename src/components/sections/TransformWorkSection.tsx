import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';

export default function TransformWorkSection() {
  return (
    <section className="section relative overflow-hidden" aria-label="Process first: we map the workflow before we build">
      {/* Continuing the alternating corner convention: FeaturedUpdatesSection
          and ServiceToolsSection both use top-left/bottom-right,
          SolutionsExplorerSection uses the inverse. ProblemSolutionSection
          in between here went dark and dropped corner dots for its own
          radial-texture treatment, so this picks the alternation back up
          from ServiceToolsSection, top-right/bottom-left. */}
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-lg order-2 lg:order-1">
          <Image
            src="/images/training.jpeg"
            alt="A Bitsbuffer team training and process session"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 lg:order-2">
          {/* Reframed 2026-07-20: the previous version pitched Workflow
              Engine, which by then was already carried by HeroSection,
              ServiceToolsSection (module by module), and DarkScaleSection,
              making this section the third repetition on one page. It now
              owns the one claim no other section makes: Bitsbuffer maps
              and fixes the business process BEFORE deciding what to build.
              This is the process-first differentiator (BPM discipline),
              and it feeds both offerings: a custom build scoped right, or
              Workflow Engine where the process fits it. CTA moved from
              wfengine.com to /contact with a concrete, low-friction ask
              (process-mapping session), the only section-level CTA on the
              page with that offer. No "certified BPM" wording by design:
              we only name certifications we actually hold. */}
          <p className="badge mb-4">Process first</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-4">
            We fix the workflow before we build the software.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Automating a broken process only makes the bottleneck run faster. So every Bitsbuffer
            engagement starts with process mapping: we sit with the people doing the work, trace where
            tasks wait, where data gets typed twice, and where approvals stall, and fix the flow on
            paper first. Only then do we decide what deserves to be built, and what should stay a
            simple process change that costs you nothing. It is the same discipline we ran on our own
            operations before Workflow Engine ever reached a client, and it is why our builds ship
            smaller, land sooner, and automate the right steps instead of all of them.
          </p>
          <Link href="/contact" className="btn-primary">
            Book a process-mapping session
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
