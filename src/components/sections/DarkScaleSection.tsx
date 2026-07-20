import Image from 'next/image';
import { Blocks, Bot, Layers, type LucideIcon } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';

// Rebuilt as an integration grid 2026-07-08, was a flat row of text pills.
// Each entry gets an icon tile, optional `icon` field for a real logo mark
// once those assets exist. Until then, `short` renders as the fallback:
// a two-letter mark in the tile instead of a blank box, so the layout
// already looks finished and swapping in real icons later is a one-line
// change per item, not a redesign. Expanded twice the same day: first
// pass added Node.js and JavaScript underneath the frameworks that
// already implied them, plus Blockchain and AI automation. Second pass
// added Anthropic Claude API, n8n, and Google APIs, pulled straight from
// CLAUDE.md's confirmed tech stack (not invented), plus React and GitHub
// Actions, both real and previously unlisted despite Next.js and the CI
// pipeline depending on them.
// Real brand marks added 2026-07-20, generated from the official
// simple-icons package (public/icons/stack/*.svg), each with its
// authentic brand color baked in as the SVG fill (Next.js flipped to
// white because its black mark disappears on the dark tile). Bull,
// Blockchain, and AI automation have no official brand mark, so they
// render lucide icons instead of a fake logo: Layers (queue), Blocks,
// and Bot. The `short` two-letter fallback stays for any future entry
// added without an asset.
const STACK: { name: string; short: string; icon?: string; lucide?: LucideIcon }[] = [
  { name: 'Next.js', short: 'N.', icon: '/icons/stack/nextjs.svg' },
  { name: 'React', short: 'Rx', icon: '/icons/stack/react.svg' },
  { name: 'NestJS', short: 'Ns', icon: '/icons/stack/nestjs.svg' },
  { name: 'Node.js', short: 'No', icon: '/icons/stack/nodejs.svg' },
  { name: 'JavaScript', short: 'Js', icon: '/icons/stack/javascript.svg' },
  { name: 'TypeScript', short: 'Ts', icon: '/icons/stack/typescript.svg' },
  { name: 'MongoDB', short: 'Mo', icon: '/icons/stack/mongodb.svg' },
  { name: 'Redis', short: 'Re', icon: '/icons/stack/redis.svg' },
  { name: 'Bull queues', short: 'Bq', lucide: Layers },
  { name: 'Docker', short: 'Dk', icon: '/icons/stack/docker.svg' },
  { name: 'Tailwind / shadcn', short: 'Tw', icon: '/icons/stack/tailwindcss.svg' },
  { name: 'Anthropic Claude API', short: 'Cl', icon: '/icons/stack/claude.svg' },
  { name: 'n8n', short: 'n8', icon: '/icons/stack/n8n.svg' },
  { name: 'Google APIs', short: 'Gg', icon: '/icons/stack/google.svg' },
  { name: 'GitHub Actions', short: 'Gh', icon: '/icons/stack/githubactions.svg' },
  { name: 'Blockchain', short: 'Bc', lucide: Blocks },
  { name: 'AI automation', short: 'Ai', lucide: Bot },
];

const STATS = [
  { value: '10+', label: 'Systems in production' },
  { value: '21-50', label: 'People on the team' },
  { value: '99.9%', label: 'Workflow Engine uptime target' },
];

export default function DarkScaleSection() {
  return (
    <section className="section relative overflow-hidden bg-bg border-y border-border-subtle" aria-label="Engineered to scale">
      {/* Continuing the alternating corner convention: TransformWorkSection
          right before this one used top-right/bottom-left, so this picks
          back up with top-left/bottom-right. */}
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      {/* container-fluid instead of container-site, same reasoning as
          Header/Hero: 17 tiles need the extra width to actually spread
          out, container-site's narrower cap was squeezing them into a
          tighter block than the section had room for. Heading and intro
          copy keep their own max-w-2xl/max-w-xl caps for readable line
          length, only the tile grid uses the fuller width. */}
      <div className="container-fluid relative text-center">
        {/* text-accent-bright to match the heading treatment used across
            every rebuilt section today, not the shared .section-title
            class: its color is declared after Tailwind's utility layer in
            globals.css, so a color utility on top of it would lose the
            cascade. Badge removed per feedback. */}
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright max-w-2xl mx-auto mb-4">
          Infrastructure built to support production systems, not demos.
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-10">
          The same stack we use to run Workflow Engine ourselves, applied to every client build.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 mb-12">
          {STACK.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-dim/60 text-sm font-black tracking-tight text-accent-bright">
                {tech.icon ? (
                  <Image src={tech.icon} alt="" width={20} height={20} aria-hidden="true" />
                ) : tech.lucide ? (
                  <tech.lucide className="h-5 w-5" aria-hidden="true" />
                ) : (
                  tech.short
                )}
              </span>
              <span className="text-xs font-semibold text-text-secondary text-center leading-tight">{tech.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-8 border-t border-border-subtle">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-accent">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
