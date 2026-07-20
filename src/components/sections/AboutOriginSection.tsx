// Built 2026-07-08 for the /about rebuild. Dark band, same treatment as
// ProblemSolutionSection and AskBitsbufferSection (ink gradient + faint
// dot texture, no CornerDots on dark sections, that convention is
// consistent everywhere else it's used). Content is the real origin
// story already established in this codebase: custom dev work came
// first and never stopped, Workflow Engine grew out of rebuilding the
// same HR and operations systems for different clients. Nothing here is
// invented, it restates facts already in site-config.ts, CLAUDE.md, and
// the flagship-domains page in narrative form instead of two flat cards.
const UNCHANGED = [
  'The same 21 to 50 person team scopes and builds every project.',
  'The same six-pass standard applies whether it is a client build or our own product.',
  'The same Lahore studio is where the work actually happens.',
];

const DIFFERENT = [
  'Workflow Engine now ships under its own name and its own product voice.',
  'Client work and platform work run on separate roadmaps.',
  'The studio supports two things at once instead of one.',
];

export default function AboutOriginSection() {
  return (
    <section className="relative overflow-hidden bg-ink" aria-label="Where Bitsbuffer came from">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--color-ink-rgb)) 0%, rgb(var(--color-ink-soft-rgb)) 55%, rgb(29 82 90) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="section container-site relative">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 max-w-2xl">
          Built by developers who kept shipping after the client project ended.
        </h2>
        <p className="text-white/70 leading-relaxed max-w-2xl mb-4">
          Bitsbuffer started as a studio that takes on custom software for other companies. E-commerce
          platforms, fintech tools, ERP systems, agri-tech products. That work never stopped. It is still
          most of what we build today.
        </p>
        <p className="text-white/70 leading-relaxed max-w-2xl mb-12">
          Workflow Engine came out of a different pattern. We kept rebuilding the same HR and operations
          systems for different clients, so we built one platform instead of starting over each time. It
          is now the flagship product, but the studio behind it is the same one that answers your
          discovery call.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-white/50 mb-4">
              What did not change
            </p>
            <ul className="space-y-3">
              {UNCHANGED.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-white/80 leading-relaxed">
                  <span className="text-accent-bright flex-shrink-0">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-white/50 mb-4">
              What is different now
            </p>
            <ul className="space-y-3">
              {DIFFERENT.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-white/80 leading-relaxed">
                  <span className="text-accent-bright flex-shrink-0">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
