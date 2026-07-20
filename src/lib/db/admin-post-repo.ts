// See blog-repo.ts for why `server-only` isn't used here -- same reason.
import type { BlogPostInput, BlogPostUpdateInput } from '@/lib/blog-schema';
import { connectToDatabase } from './mongoose';
import { Post, type PostLean } from './models/Post';
import { toBlogPost } from './blog-repo';

// Admin CRUD path (draft + published, every status) -- only ever called
// from /api/admin/* routes, which sit behind the session-cookie middleware
// (src/middleware.ts). Never import this file from a public page.

export async function listAllPostsAdmin() {
  await connectToDatabase();
  const docs = await Post.find({}).sort({ createdAt: -1 }).lean<PostLean[]>();
  return docs.map(toBlogPost);
}

export async function getPostByIdAdmin(id: string) {
  await connectToDatabase();
  const doc = await Post.findById(id).lean<PostLean | null>();
  return doc ? toBlogPost(doc) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  await connectToDatabase();
  const doc = await Post.exists({ slug });
  return Boolean(doc);
}

export async function createDraftPost(input: BlogPostInput, source: 'migrated' | 'admin' = 'admin') {
  await connectToDatabase();
  const doc = await Post.create({
    ...input,
    status: 'draft',
    source,
  });
  return toBlogPost(doc.toObject() as unknown as PostLean);
}

export async function createPublishedPost(input: BlogPostInput, source: 'migrated' | 'admin' = 'migrated') {
  await connectToDatabase();
  const doc = await Post.create({
    ...input,
    status: 'published',
    source,
  });
  return toBlogPost(doc.toObject() as unknown as PostLean);
}

export async function updatePost(id: string, input: BlogPostUpdateInput) {
  await connectToDatabase();
  const doc = await Post.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean<
    PostLean | null
  >();
  return doc ? toBlogPost(doc) : null;
}

export async function setPostStatus(id: string, status: 'draft' | 'published') {
  await connectToDatabase();
  const update: Record<string, unknown> = { status };
  // Stamp publishedAt with today's date the first time a post goes live,
  // if the draft never had a real publishedAt set (matches how the
  // blog-writing skill's frontmatter works: publishedAt is the go-live
  // date, not the draft-creation date).
  if (status === 'published') {
    const existing = await Post.findById(id).select('publishedAt').lean<{ publishedAt?: string } | null>();
    if (!existing?.publishedAt) {
      update.publishedAt = new Date().toISOString().slice(0, 10);
    }
  }
  const doc = await Post.findByIdAndUpdate(id, { $set: update }, { new: true }).lean<PostLean | null>();
  return doc ? toBlogPost(doc) : null;
}

export async function deletePost(id: string) {
  await connectToDatabase();
  await Post.findByIdAndDelete(id);
}
