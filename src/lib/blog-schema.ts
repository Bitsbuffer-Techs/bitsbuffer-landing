import { z } from 'zod';

// Validates any BlogPost-shaped JSON before it's allowed into MongoDB --
// used by the admin API routes (create/update payloads) AND the
// content-drafts/ watcher (scripts/watch-drafts.ts), so a malformed file
// dropped into the inbox fails loudly (moved to content-drafts/rejected/
// with a reason) instead of corrupting a draft silently.

export const blogTableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

export const blogStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const blogSectionSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).min(1, 'Section needs at least one paragraph'),
  table: blogTableSchema.optional(),
  pullQuote: z.string().optional(),
  stat: blogStatSchema.optional(),
});

export const blogFAQSchema = z.object({
  q: z.string(),
  a: z.string(),
});

// Fields required to create a post. `status`/`source` are set by the
// server (create -> draft/admin), never trusted from the client payload.
export const blogPostInputSchema = z
  .object({
    slug: z
      .string()
      .min(3)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated, no spaces'),
    title: z.string().min(3),
    excerpt: z.string().min(10),
    category: z.string().min(2),
    publishedAt: z.string().min(4),
    updatedAt: z.string().optional(),
    readingTime: z.string().min(1),
    domain: z.string().optional(),
    content: z.array(z.string()).optional(),
    sections: z.array(blogSectionSchema).optional(),
    keyTakeaways: z.array(z.string()).optional(),
    faqs: z.array(blogFAQSchema).optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
  })
  .refine((data) => (data.sections && data.sections.length > 0) || (data.content && data.content.length > 0), {
    message: 'Post needs either sections or content (legacy flat format)',
  });

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;

// Partial version for PATCH/update -- every field optional, slug excluded
// (slug changes are a deliberate separate action, not a silent side effect
// of a general edit save, since it would break the post's existing URL).
export const blogPostUpdateSchema = blogPostInputSchema.innerType().omit({ slug: true }).partial();

export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
