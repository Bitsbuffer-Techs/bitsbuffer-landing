'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Added 2026-07-08 for TeamProofSection's three photo cards: each card now
// cycles its own small set of images instead of showing one static photo.
// Intervals are deliberately different per card (passed in by the caller)
// so the three never land in sync, one card crossfades while the other two
// sit still, then a different one changes next, reads as an organic
// rotating gallery instead of a synchronized slideshow. No Math.random
// involved, the "not the same pattern" feeling comes purely from the three
// interval lengths not sharing a short common multiple, deterministic and
// SSR-safe.
type Slide = { src: string; alt: string };

export default function RotatingImage({
  images,
  intervalMs,
  className = '',
  sizes,
}: {
  images: Slide[];
  intervalMs: number;
  className?: string;
  sizes?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  const current = images[index];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div key={current.src} className="absolute inset-0 animate-fade-in-slow">
        <Image src={current.src} alt={current.alt} fill className="object-cover" sizes={sizes} />
      </div>
    </div>
  );
}
