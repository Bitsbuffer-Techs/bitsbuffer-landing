'use client';

import { useEffect, useState } from 'react';

// Immersive-blog pass, 2026-07-17: thin fixed progress bar under the
// header, filled as the reader scrolls through the article body. Pure
// scroll-listener + rAF throttle, no layout dependency, cheap. Header is
// sticky top-0 h-16 z-50 (Header.tsx) and opaque, so this sits at top-16
// (its bottom edge) instead of top-0 -- otherwise it would render
// permanently hidden behind the nav bar.
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 top-16 z-40 h-[3px] w-full bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
