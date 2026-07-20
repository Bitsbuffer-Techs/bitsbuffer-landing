'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// Fade-up-on-scroll, built 2026-07-08 to replace the CSS-only
// animation-timeline: view() attempt (globals.css .animate-on-scroll),
// which wasn't visibly firing on FeaturedUpdatesSection. That's the
// second time that CSS API hasn't panned out this session (also tried
// and dropped on the hero), likely compounded here by the section being
// lazy-loaded via next/dynamic — the scroll-derived timeline can be out
// of sync with when the element actually mounts. This version is a
// plain IntersectionObserver: fires once when the element enters the
// viewport, then disconnects, so there's no ongoing per-frame cost.
// Cheaper than a scroll listener (the browser only calls back on
// threshold crossings, not on every scroll tick) and works regardless
// of browser support or load timing.
export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade-up',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: 'fade-up' | 'fade-scale';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenState = variant === 'fade-scale' ? 'opacity-0 scale-95' : 'opacity-0 translate-y-5';
  const shownState = variant === 'fade-scale' ? 'opacity-100 scale-100' : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${shown ? shownState : hiddenState} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
