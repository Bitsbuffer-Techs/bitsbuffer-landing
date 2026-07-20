import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostByIdAdmin, updatePost, deletePost } from '@/lib/db/admin-post-repo';
import { blogPostUpdateSchema } from '@/lib/blog-schema';

export const runtime = 'nodejs';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const post = await getPostByIdAdmin(id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[api/admin/posts/[id] GET]', err);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = blogPostUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const post = await updatePost(id, parsed.data);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Only a published post's edit needs to bust the live pages -- a
    // draft edit has nothing public to invalidate.
    if (post.status === 'published') {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
      if (post.domain) revalidatePath(`/services/${post.domain}`);
      revalidatePath('/');
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[api/admin/posts/[id] PATCH]', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const post = await getPostByIdAdmin(id);
    await deletePost(id);
    if (post?.status === 'published') {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
      if (post.domain) revalidatePath(`/services/${post.domain}`);
      revalidatePath('/');
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/admin/posts/[id] DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
