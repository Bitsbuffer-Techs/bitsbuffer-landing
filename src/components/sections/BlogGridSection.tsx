'use client';

import Link from 'next/link';
import type { BlogPost } from '@/lib/blog-posts';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Extracted 2026-07-08 so /blog's page.tsx can stay a server component
// (it needs to keep exporting `metadata`, which breaks the moment a page
// file is marked 'use client') while the scroll-reveal grid still gets
// Framer Motion. Corner dots start the alternation at top-left/bottom-right
// since PageHero uses the dot-wave, not CornerDots, this is the first real
// corner-dot section on the page.
//
// Cover images removed 2026-07-16 (remediation pass, Adnan's call): the
// stock/staff photos read as exaggerated marketing rather than proof.
// Matches the WF Engine BlogCard convention, typography and whitespace
// carry the card, not a decorative photo standing in for real content.
export default function BlogGridSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="Latest articles">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative grid gap-6 lg:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 80}>
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-xl border border-border bg-surface-raised overflow-hidden block hover:border-accent/40 transition-colors h-full flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-flex self-start text-[11px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-accent/10 text-accent-bright mb-3">
                  {post.category}
                </span>
                <h2 className="text-xl font-bold text-text-primary mb-3">{post.title}</h2>
                <p className="text-sm leading-relaxed text-text-secondary mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-text-muted pt-4 border-t border-border-subtle">
                  <span>{post.publishedAt}</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
