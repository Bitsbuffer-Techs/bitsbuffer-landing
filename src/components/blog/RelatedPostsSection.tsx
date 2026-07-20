import Link from 'next/link';
import type { BlogPost } from '@/lib/blog-posts';

// Immersive-blog pass, 2026-07-17: every article page now ends with 2-3
// related posts instead of dropping straight to the CTA band, so a reader
// who finishes one piece has somewhere to go next (part of the 3-direction
// interlinking rule in blog-writing/SKILL.md section 4 -- this is the
// sideways link, made visible in the UI instead of only living inline in
// body copy). Selection: same domain first, same category next, most
// recent as a last-resort fill, capped at 3, current post always excluded.
export default function RelatedPostsSection({
  currentSlug,
  domain,
  category,
  posts,
}: {
  currentSlug: string;
  domain?: string;
  category: string;
  posts: BlogPost[];
}) {
  const pool = posts.filter((p) => p.slug !== currentSlug);
  const sameDomain = domain ? pool.filter((p) => p.domain === domain) : [];
  const sameCategory = pool.filter((p) => p.category === category && !sameDomain.includes(p));
  const rest = pool.filter((p) => !sameDomain.includes(p) && !sameCategory.includes(p));
  const related = [...sameDomain, ...sameCategory, ...rest].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-border-subtle bg-surface" aria-label="Related reading">
      <div className="container-site py-14">
        <h2 className="text-xl font-black tracking-tight text-text-primary mb-6">Keep reading</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-xl border border-border bg-surface-raised p-5 block hover:border-accent/40 transition-colors h-full flex flex-col"
            >
              <span className="inline-flex self-start text-[10px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-full bg-accent/10 text-accent-bright mb-3">
                {post.category}
              </span>
              <h3 className="text-base font-bold text-text-primary mb-2 leading-snug">{post.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
              <span className="text-xs text-text-muted pt-3 border-t border-border-subtle">{post.readingTime}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
