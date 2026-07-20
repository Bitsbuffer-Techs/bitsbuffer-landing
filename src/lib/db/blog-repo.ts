// Not using the `server-only` package here (tried, reverted 2026-07-18):
// it throws unconditionally when required outside Next.js's own webpack
// build, which breaks scripts/migrate-blog-posts.ts and
// scripts/watch-drafts.ts (both run via tsx, not through Next). Real
// protection against a client-component import isn't needed anyway --
// this file is only ever imported from Server Components (page.tsx
// files), which Next never bundles into client JS regardless.
import type { DomainSlug } from '@/lib/domain-pages';
import type { BlogPost } from '@/lib/blog-types';
import { connectToDatabase } from './mongoose';
import { Post, type PostLean } from './models/Post';

// Public-site read path only (published posts). Admin CRUD lives in
// admin-post-repo.ts -- kept separate so this file, the one imported by
// every public page, never accidentally exposes a write path.

export function toBlogPost(doc: PostLean): BlogPost {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    publishedAt: doc.publishedAt,
    updatedAt: doc.updatedAt,
    readingTime: doc.readingTime,
    domain: doc.domain as DomainSlug | undefined,
    content: doc.content,
    sections: doc.sections,
    keyTakeaways: doc.keyTakeaways,
    faqs: doc.faqs,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
    status: doc.status,
  };
}

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  await connectToDatabase();
  const docs = await Post.find({ status: 'published' }).sort({ publishedAt: -1 }).lean<PostLean[]>();
  return docs.map(toBlogPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  await connectToDatabase();
  const doc = await Post.findOne({ slug, status: 'published' }).lean<PostLean | null>();
  return doc ? toBlogPost(doc) : null;
}

export async function getPublishedPostsByDomain(domain: DomainSlug): Promise<BlogPost[]> {
  await connectToDatabase();
  const docs = await Post.find({ domain, status: 'published' })
    .sort({ publishedAt: -1 })
    .lean<PostLean[]>();
  return docs.map(toBlogPost);
}
