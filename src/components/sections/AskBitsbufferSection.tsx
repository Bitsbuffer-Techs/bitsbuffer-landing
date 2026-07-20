'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';

// Same three honest prompts the old QuickStartBarSection used, carried
// over rather than invented fresh, they already tested well as real
// questions prospects ask before a discovery call.
const PROMPTS = [
  'How much does a custom build cost?',
  'Can you fix a workflow we already built?',
  'What does the discovery call cover?',
];

// Adapted from the Azure "Ask Microsoft" banner (2026-07-08), same layout
// idea, deliberately different promise: Azure's copy implies an AI answers
// on the spot, Bitsbuffer has no AI backend behind this, so the copy and
// behavior both stay honest, this routes to the real contact form with the
// question pre-filled, a person reads and replies, same as the rest of the
// site's "real person, no forms first" framing.
export default function AskBitsbufferSection({ ariaLabel = 'Ask Bitsbuffer' }: { ariaLabel?: string }) {
  const router = useRouter();
  const [question, setQuestion] = useState('');

  const goToContact = (text: string) => {
    const q = text.trim();
    router.push(q ? `/contact?q=${encodeURIComponent(q)}` : '/contact');
  };

  return (
    <section className="relative overflow-hidden bg-ink" aria-label={ariaLabel}>
      {/* Deep teal gradient, brand-derived (same hue as the accent token,
          just pushed dark), not an arbitrary dark color. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--color-ink-rgb)) 0%, rgb(var(--color-ink-soft-rgb)) 55%, rgb(29 82 90) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Faint dot texture, echoes Azure's banner texture, cheap CSS,
          no image asset. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="container-fluid relative grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="gloss-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Ask Bitsbuffer
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Tell us what you are building. A real person reads and answers, no forms to fill out first.
          </p>
        </div>

        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              goToContact(question);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-white to-[#f4f6f6] py-2 pl-5 pr-2 shadow-lg"
          >
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What are you building?"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              aria-label="Ask Bitsbuffer a question"
            />
            <button
              type="submit"
              className="gloss-accent flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
              aria-label="Send your question"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => goToContact(prompt)}
                className="rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-medium text-white/85 transition-colors duration-150 hover:border-white/50 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
