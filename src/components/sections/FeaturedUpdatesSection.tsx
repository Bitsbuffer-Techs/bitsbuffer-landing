import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getAllPublishedPosts } from '@/lib/db/blog-repo';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Cover images removed 2026-07-16 (remediation pass, Adnan's call): matches
// the text-first WF Engine blog convention, see BlogGridSection.tsx.

export default async function FeaturedUpdatesSection() {
  const posts = await getAllPublishedPosts();
  const latest = posts.slice(0, 3);

  return (
    <section className="section relative overflow-hidden" aria-label="Latest from Bitsbuffer">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <div>
            {/* Not using the shared .section-title class here: its text
                color is declared after Tailwind's utility layer in
                globals.css, so a color utility added on top of it would
                lose the cascade (same issue hit earlier with .badge).
                Same size/weight/tracking as section-title, just with the
                dark teal color swapped in directly. */}
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
              Discover what&apos;s happening at Bitsbuffer
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-accent-bright hover:text-accent">
            View all updates
            <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100}>
              <Link
                href={`/blog/${post.slug}`}
                className="rounded-xl border border-border bg-surface overflow-hidden block hover:border-accent/40 transition-colors h-full flex flex-col"
              >
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent-bright mb-2">
                    {post.category}
                  </p>
                  <h3 className="text-sm font-bold text-text-primary leading-snug mb-3">{post.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted pt-4 mt-4 border-t border-border-subtle">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
