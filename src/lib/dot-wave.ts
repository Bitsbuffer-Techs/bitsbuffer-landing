// Shared dot-wave generator, extracted 2026-07-08 from HeroSection.tsx so
// the hero and any smaller decorative accents (e.g. CornerDots.tsx) use
// the exact same pattern instead of two different-looking dot systems.
// Horizontal bands, each band's left edge pushed further left the lower
// it sits, on a sine-eased curve rather than a straight diagonal, so the
// boundary reads as the edge of one large incomplete circle. Fixed math,
// no Math.random, identical on server and client.
//
// Rendered as plain circles (r = radius). Briefly tried rounded squares
// to echo the logo mark, reverted same day, circles read better here.
export type Dot = { x: number; y: number; r: number; o: number; fill: string; dust: boolean };

export type DotWaveOptions = {
  viewW: number;
  viewH: number;
  rows: number;
  baseReach: number; // how far left the top row reaches, distance from the right edge
  growReach: number; // extra leftward reach gained by the bottom row
  rightBleed: number; // how far past the right edge dots extend, feels continuous off-canvas
  baseCount: number;
  growCount: number;
  dotScale?: number; // multiplies the size formula, 1 = hero scale
};

// Math.sin/cos are not guaranteed bit-identical across JS engine builds
// (the spec allows implementation-defined precision on transcendental
// functions), so a value computed at module scope during server rendering
// can differ from the browser's recomputation in the last decimal place.
// That's enough for React to flag a hydration mismatch even though nothing
// is visually different. Rounding every computed field to a fixed
// precision (well beyond what's visible on an SVG dot) collapses both
// sides back to an identical value.
const round = (n: number) => Math.round(n * 1000) / 1000;

export function buildDotWave(opts: DotWaveOptions): Dot[] {
  const { viewW, viewH, rows, baseReach, growReach, rightBleed, baseCount, growCount, dotScale = 1 } = opts;
  const dots: Dot[] = [];

  for (let row = 0; row < rows; row++) {
    const t = rows === 1 ? 0 : row / (rows - 1); // 0 at top, 1 at bottom
    const y = t * viewH;
    const curveT = Math.sin((t * Math.PI) / 2); // eased, circular-feeling profile
    const leftBound = viewW - (baseReach + curveT * growReach);
    const rightEdge = viewW + rightBleed;
    const count = Math.max(2, baseCount + Math.round(curveT * growCount));

    for (let i = 0; i < count; i++) {
      const u = count === 1 ? 1 : i / (count - 1); // 0 at leftBound, 1 at right edge
      const x = leftBound + u * (rightEdge - leftBound);
      const jitter = ((row * 7 + i * 13) % 5) / 5; // deterministic pseudo-variation, not random
      const size = (2.4 + u * 7.2 + jitter * 1.4) * dotScale;
      const o = Math.max(0.08, Math.min(0.85, 0.12 + u * 0.58 + jitter * 0.08));

      dots.push({
        x: round(x),
        y: round(y),
        r: round(size),
        o: round(o),
        fill: (row + i) % 2 === 0 ? 'fill-accent' : 'fill-accent-bright',
        dust: (row + i) % 3 === 0, // only a third animate, keeps it cheap
      });
    }
  }
  return dots;
}
