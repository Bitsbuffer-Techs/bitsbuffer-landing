import { X, Check } from 'lucide-react';

// Rebuilt dark 2026-07-08: the light version's background dots (even after
// fixing the stretched-ellipse bug) still read as "not professional" per
// feedback. Replaced entirely with the same treatment AskBitsbufferSection
// already uses and Adnan approved there: a deep teal diagonal gradient
// (brand ink tokens, not an arbitrary dark color) plus a faint CSS
// radial-gradient dot grid, no generated SVG dot-wave at all. Every text
// and border color below had to move off the light-theme tokens
// (text-primary/text-secondary/border/surface, all tuned for a white
// background) onto the white/opacity scale AskBitsbufferSection and
// HeroSectionDark already established for dark bands on this otherwise
// light site: text-white for primary content, white/70 for body copy,
// white/10-15 for borders and hairlines, white/5 for raised surfaces.
interface Row {
  number: string;
  problem: string;
  problemDetail: string;
  fix: string;
  fixDetail: string;
  metric: string;
}

const ROWS: Row[] = [
  {
    number: '01',
    problem: 'Template logic forced onto your workflow',
    problemDetail: 'You adapt your process to fit their boilerplate, not the other way round.',
    fix: 'Architecture built around your actual workflow',
    fixDetail: 'Discovery comes first. The system fits how your team already operates.',
    metric: '10+ systems shipped this way',
  },
  {
    number: '02',
    problem: 'Handoff, then silence',
    problemDetail: 'The build ships, the contractor moves on, bugs surface in production with no owner.',
    fix: 'Delivery includes evolution',
    fixDetail: 'We stay the operating partner, not just the vendor who disappears at launch.',
    metric: 'Ongoing support model',
  },
  {
    number: '03',
    problem: 'Quality found out the hard way',
    problemDetail: 'Issues like broken forms or silent failures surface only after real users hit them.',
    fix: '6-pass audit before every launch',
    fixDetail: 'Code quality, performance, accessibility, SEO, AI visibility, and UX, checked before go-live.',
    metric: 'Standard on every build',
  },
  {
    number: '04',
    problem: 'One developer holds all the context',
    problemDetail: 'Ask a question after the invoice is paid and the answer depends on someone remembering, not on documentation.',
    fix: 'Documented handoff, not tribal knowledge',
    fixDetail: 'Architecture decisions and setup steps written down as we go, not reconstructed after something breaks.',
    metric: 'Documented on every build',
  },
  {
    number: '05',
    problem: 'Scope creeps until the budget breaks',
    problemDetail: 'A vague brief turns into endless small asks, and the invoice grows with no line anyone agreed to upfront.',
    fix: 'Fixed scope, phased delivery',
    fixDetail: 'Discovery sets what ships in phase one before a line of code is written, changes go through a real change order.',
    metric: 'Discovery-first, every project',
  },
];

// "Industries served" corrected from 4 to 8, 2026-07-08: it was left over
// from before SolutionsExplorerSection was expanded earlier today, 4
// industries to 8. Catching it here so the two sections don't contradict
// each other on the same page.
const BOTTOM_STATS = [
  { value: '8', label: 'Industries served' },
  { value: '10+', label: 'Systems launched' },
  { value: '6', label: 'Audit passes per site' },
  { value: '1', label: 'Studio, one delivery standard' },
];

export default function ProblemSolutionSection() {
  return (
    <section className="relative overflow-hidden bg-ink" aria-label="Why generic dev shops cost more">
      {/* Same deep teal diagonal gradient as AskBitsbufferSection, brand
          ink tokens, not an arbitrary dark color. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--color-ink-rgb)) 0%, rgb(var(--color-ink-soft-rgb)) 55%, rgb(29 82 90) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Same faint dot texture as AskBitsbufferSection, cheap CSS, no
          generated SVG. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="section container-site relative">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Generic dev shops are costing you more than you realise.
          </h2>
        </div>

        {/* Mobile: stacked cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {ROWS.map((row) => (
            <div key={row.number} className="rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 bg-error/10 border-b border-white/10">
                <div className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{row.problem}</p>
                    <p className="text-xs text-white/65 leading-relaxed">{row.problemDetail}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-success/10">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{row.fix}</p>
                    <p className="text-xs text-white/65 leading-relaxed mb-2">{row.fixDetail}</p>
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
                      {row.metric}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: comparison table */}
        <div className="hidden sm:block rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_1fr] bg-white/5 border-b border-white/10">
            <div className="border-r border-white/10" />
            <div className="flex items-center gap-2 px-5 py-3.5 border-r border-white/10">
              <X className="w-4 h-4 text-error" aria-hidden="true" />
              <span className="text-sm font-bold text-white">Typical agency or freelancer</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3.5">
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
              <span className="text-sm font-bold text-white">With Bitsbuffer</span>
            </div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.number}
              className={`grid grid-cols-[60px_1fr_1fr] ${i < ROWS.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="flex items-start justify-center pt-4 border-r border-white/10">
                <span className="text-[11px] font-black text-white/35">{row.number}</span>
              </div>
              <div className="px-5 py-4 border-r border-white/10 bg-error/[0.06]">
                <p className="text-sm font-bold text-white mb-1">{row.problem}</p>
                <p className="text-xs text-white/65 leading-relaxed">{row.problemDetail}</p>
              </div>
              <div className="px-5 py-4 bg-success/[0.08]">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-white">{row.fix}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success flex-shrink-0">
                    {row.metric}
                  </span>
                </div>
                <p className="text-xs text-white/65 leading-relaxed">{row.fixDetail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-5 bg-white/10 rounded-2xl overflow-hidden">
          {BOTTOM_STATS.map((s) => (
            <div key={s.label} className="bg-ink-soft px-4 py-4 text-center">
              <p className="text-xl font-black tracking-tight text-white">{s.value}</p>
              <p className="text-[11px] text-white/55 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
