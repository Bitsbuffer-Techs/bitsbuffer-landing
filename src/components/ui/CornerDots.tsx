import { buildDotWave } from '@/lib/dot-wave';

// Corner accent, rebuilt 2026-07-08: uses the exact same dot-wave
// generator as the hero (src/lib/dot-wave.ts), just a shorter/smaller
// instance, instead of the separate scattered-cluster pattern from the
// first pass, which didn't match and looked like a different design
// system. The generated pattern is naturally "dense right edge, bulges
// further left toward the bottom" — that's already the right shape for
// a bottom-right corner. For top-left, the same data is reused and the
// whole SVG is rotated 180deg, which flips it to "dense left edge,
// bulges further right toward the top" — no separate mirrored math
// needed, one generator, two placements.
const VIEW_W = 380;
const VIEW_H = 260;

const DOTS = buildDotWave({
  viewW: VIEW_W,
  viewH: VIEW_H,
  rows: 10,
  baseReach: 100,
  growReach: 250,
  rightBleed: 28,
  baseCount: 6,
  growCount: 5,
  dotScale: 0.6,
});

// Extended 2026-07-08 from the original two corners (top-left, bottom-right,
// used on FeaturedUpdatesSection) to all four, for SolutionsExplorerSection's
// "inverse order" placement (top-right, bottom-left). The base dot data is
// generated once as "dense right edge, bulges left toward the bottom" (built
// for a bottom-right anchor); every other corner reuses that same data and
// gets there with a pure CSS transform instead of separate math:
//   bottom-right: no transform            (anchor already matches)
//   top-left:     rotate(180deg)          (flips both axes)
//   top-right:    scaleY(-1)              (flips only vertically)
//   bottom-left:  scaleX(-1)              (flips only horizontally)
type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_CONFIG: Record<Corner, { position: string; transform?: string }> = {
  'bottom-right': { position: 'right-0 bottom-0' },
  'top-left': { position: 'left-0 top-0', transform: 'rotate(180deg)' },
  'top-right': { position: 'right-0 top-0', transform: 'scaleY(-1)' },
  'bottom-left': { position: 'left-0 bottom-0', transform: 'scaleX(-1)' },
};

export default function CornerDots({ corner, className = '' }: { corner: Corner; className?: string }) {
  const { position, transform } = CORNER_CONFIG[corner];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={`pointer-events-none absolute ${position} h-44 w-60 md:h-56 md:w-80 ${className}`}
      style={transform ? { transform } : undefined}
      aria-hidden="true"
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} className={d.fill} opacity={d.o} />
      ))}
    </svg>
  );
}
