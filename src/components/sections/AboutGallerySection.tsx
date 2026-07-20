'use client';

import Image from 'next/image';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Built 2026-07-08 for the /about rebuild. Real studio photos in a mosaic
// grid, no stock imagery. Most of these are already in rotation on
// TeamProofSection or used as a blog post image (dinner.jpg), reusing
// them here is fine, they're real photos of the actual studio either
// way. TeamProofSection itself is deliberately not reused on this page,
// showing the same rotating cards twice on one page would be redundant.
const PHOTOS = [
  { src: '/images/office1.jpeg', alt: 'The Bitsbuffer studio floor', span: 'col-span-2 row-span-2' },
  { src: '/images/celebration.jpeg', alt: 'The team celebrating a project milestone', span: 'row-span-1' },
  { src: '/images/dinner.jpg', alt: 'The team at dinner after a release', span: 'row-span-1' },
  { src: '/images/meeting.jpeg', alt: 'Scoping a new build', span: 'row-span-2' },
  { src: '/images/training.jpeg', alt: 'A team training session', span: 'row-span-1' },
  { src: '/images/ceo.jpeg', alt: 'Bitsbuffer leadership at work', span: 'row-span-1' },
  { src: '/images/strategy-ceo-hr.jpeg', alt: 'Leadership and HR in a strategy session', span: 'col-span-2 row-span-1' },
  { src: '/images/working.webp', alt: 'Heads down on a client build', span: 'row-span-1' },
  { src: '/images/promotion.jpeg', alt: 'The team marking a promotion', span: 'row-span-1' },
];

export default function AboutGallerySection() {
  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="Life at the studio">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-3">Life at the studio</h2>
        <p className="text-text-secondary mb-10 max-w-2xl">
          No stock photography. This is the actual studio, the actual team, and the actual work, on an
          ordinary week at the studio.
        </p>

        <div className="grid grid-flow-dense grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[170px] gap-3">
          {PHOTOS.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 60}
              variant="fade-scale"
              className={`relative rounded-xl overflow-hidden border border-border ${photo.span}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
