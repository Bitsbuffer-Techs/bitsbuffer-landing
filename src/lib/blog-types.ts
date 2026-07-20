import type { DomainSlug } from './domain-pages';

// Extracted from blog-posts.ts 2026-07-18 (Bitsbuffer blog admin panel
// build) so the Mongoose model, the admin API routes, and the public
// pages can all import the exact same shape without pulling in the old
// 20-post static array. blog-posts.ts re-exports these for backward
// compatibility with any file still importing types from there.
export interface BlogTable {
  headers: string[];
  rows: string[][];
}

export interface BlogStat {
  value: string;
  label: string;
}

export interface BlogSection {
  heading?: string; // H2; omit for the lede section before the first heading
  paragraphs: string[];
  table?: BlogTable;
  pullQuote?: string;
  stat?: BlogStat;
}

export interface BlogFAQ {
  q: string;
  a: string;
}

// 'draft' = visible only in /admin, never rendered on the public site.
// 'published' = live on /blog and /blog/[slug].
export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  // Present once the post exists in MongoDB (absent for the legacy static
  // array during the transition window). String form of the Mongo _id.
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  domain?: DomainSlug;
  content?: string[]; // legacy flat format
  sections?: BlogSection[]; // structured format, all admin-created posts use this
  keyTakeaways?: string[];
  faqs?: BlogFAQ[];
  ctaLabel?: string;
  ctaHref?: string;
  status?: BlogPostStatus;
}
