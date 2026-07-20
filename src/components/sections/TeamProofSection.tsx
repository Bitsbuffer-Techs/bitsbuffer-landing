import RotatingImage from '@/components/ui/RotatingImage';
import CornerDots from '@/components/ui/CornerDots';

// Card image sets, 2026-07-08: each card cycles through a few real studio
// photos instead of showing one static frame. Different interval per card
// (5200ms / 6600ms / 7400ms, no shared short common multiple) so they
// drift out of phase and change one at a time, not all three together.
const CARD_A = [
  { src: '/images/ceo-working.jpg', alt: 'Bitsbuffer leadership at work in the studio' },
  { src: '/images/office1.jpeg', alt: 'The Bitsbuffer studio office' },
  { src: '/images/meeting-2.jpeg', alt: 'The Bitsbuffer team in a working session' },
  { src: '/images/celebration.jpeg', alt: 'The Bitsbuffer team celebrating a project milestone' },
];

const CARD_B = [
  { src: '/images/meeting.jpeg', alt: 'The Bitsbuffer team in a working session' },
  { src: '/images/training.jpeg', alt: 'A Bitsbuffer team training session' },
  { src: '/images/strategy-ceo-hr.jpeg', alt: 'Bitsbuffer leadership in a strategy discussion' },
  { src: '/images/new1.jpeg', alt: 'The Bitsbuffer team at work' },
];

const CARD_C = [
  { src: '/images/working.webp', alt: 'A Bitsbuffer engineer at work' },
  { src: '/images/system.jpeg', alt: 'A Bitsbuffer engineering workstation' },
  { src: '/images/promotion.jpeg', alt: 'The Bitsbuffer team marking a promotion' },
  { src: '/images/training-2.jpeg', alt: 'A Bitsbuffer team training session' },
];

export default function TeamProofSection() {
  return (
    // bg-accent-dim/45, same light green wash as HeroSection, per feedback.
    <section className="section relative overflow-hidden bg-accent-dim/45" aria-label="Our team">
      {/* Continuing the alternating corner convention: DarkScaleSection
          right before this one used top-left/bottom-right, so this picks
          back up with top-right/bottom-left. */}
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <div className="container-site relative">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <div>
            {/* text-accent-bright to match the heading treatment used
                across every rebuilt section, badge removed, heading text
                shortened to "Our team" per feedback, the body paragraph
                below still carries the fuller "real studio, real office"
                framing so nothing is lost, just moved out of the headline. */}
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-4">Our team</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Bitsbuffer runs out of a working studio in Johar Town, Lahore. The same team that scopes
              your discovery call sits in these rooms every day, running the delivery discipline behind
              every project and behind Workflow Engine itself.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
              <div>
                <p className="text-xl font-black text-text-primary">21-50</p>
                <p className="text-xs text-text-muted">People on the team</p>
              </div>
              <div>
                <p className="text-xl font-black text-text-primary">1</p>
                <p className="text-xs text-text-muted">Studio, one delivery standard</p>
              </div>
              <div>
                <p className="text-xl font-black text-text-primary">10+</p>
                <p className="text-xs text-text-muted">Systems shipped together</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <RotatingImage
              images={CARD_A}
              intervalMs={5200}
              className="rounded-2xl border border-border row-span-2 aspect-[4/5]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <RotatingImage
              images={CARD_B}
              intervalMs={6600}
              className="rounded-2xl border border-border aspect-[4/3]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <RotatingImage
              images={CARD_C}
              intervalMs={7400}
              className="rounded-2xl border border-border aspect-[4/3]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
