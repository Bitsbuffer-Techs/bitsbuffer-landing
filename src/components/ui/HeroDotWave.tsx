import type { CSSProperties } from 'react';
import { buildDotWave } from '@/lib/dot-wave';

const DOT_VIEW_W = 640;
const DOT_VIEW_H = 720;

const DOTS = buildDotWave({
  viewW: DOT_VIEW_W,
  viewH: DOT_VIEW_H,
  rows: 18,
  baseReach: 160,
  growReach: 400,
  rightBleed: 45,
  baseCount: 9,
  growCount: 7,
});

// Extracted 2026-07-17 from PageHero.tsx, which had this exact block
// inlined. The blog post page's article header needed the same right-side
// dot-wave every other hero on the site has (services, case studies,
// careers, about, contact, all 8 domain pages, all via PageHero), but it
// can't use PageHero itself, it needs a byline row PageHero doesn't
// support. Rather than copy-paste the SVG block into a second file, it's
// a component now, both PageHero and the blog post header render this.
// Pure SVG + CSS-animation classes (`bit-dust`, defined in globals.css),
// no framer-motion, so it renders fine in a server component.
export default function HeroDotWave() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block" aria-hidden="true">
      <svg
        viewBox={`0 0 ${DOT_VIEW_W} ${DOT_VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            className={`${d.fill} ${d.dust ? 'bit-dust' : ''}`}
            style={
              d.dust
                ? ({
                    '--base-o': d.o,
                    '--dur': `${5 + (i % 7)}s`,
                    '--delay': `${-((i % 11) + (i % 3) * 0.5)}s`,
                  } as CSSProperties)
                : { opacity: d.o }
            }
          />
        ))}
      </svg>
    </div>
  );
}
