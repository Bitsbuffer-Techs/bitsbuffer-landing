// Running marquee, moved to directly below the hero and rebuilt as a loop
// 2026-07-08 to match the same technique used on the WF Engine site's
// "Trusted industries" band. Only 4 real items here (a process, not a
// long industry list), so the array is repeated enough times to fill a
// wide screen and loop smoothly rather than looking sparse.
const TRUST_ITEMS = [
  'Discovery-led scoping',
  'Phased delivery',
  'Field-tested operations',
  'Post-launch evolution',
];

const MARQUEE_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

// Chip bg reuses the exact same wash as the light hero's background
// (bg-accent-dim/45, see HeroSection.tsx) so this band visually echoes
// the hero instead of introducing a third surface tone.
function DisciplineChip({ label }: { label: string }) {
  return (
    <span className="inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-accent-dim/45 px-5 py-2 text-sm font-semibold text-text-primary">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-bright" />
      {label}
    </span>
  );
}

export default function TrustBandSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-border-subtle bg-surface-raised py-6"
      aria-label="Delivery discipline"
    >
      <div className="relative">
        <div className="flex w-max animate-marquee-left gap-3" aria-hidden="true">
          {MARQUEE_ITEMS.map((label, i) => (
            <DisciplineChip key={i} label={label} />
          ))}
        </div>
        {/* Screen-reader-only real list, the marquee row above is
            aria-hidden and duplicated purely for the visual loop. */}
        <span className="sr-only">{TRUST_ITEMS.join(', ')}</span>
      </div>

      {/* Edge fade masks so chips don't clip abruptly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-raised to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-raised to-transparent md:w-24" />
    </section>
  );
}
