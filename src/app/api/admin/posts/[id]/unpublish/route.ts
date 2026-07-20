import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { setPostStatus } from '@/lib/db/admin-post-repo';

export const runtime = 'nodejs';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const post = await setPostStatus(id, 'draft');
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    if (post.domain) revalidatePath(`/services/${post.domain}`);
    revalidatePath('/');

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[api/admin/posts/[id]/unpublish]', err);
    return NextResponse.json({ error: 'Failed to unpublish post' }, { status: 500 });
  }
}
