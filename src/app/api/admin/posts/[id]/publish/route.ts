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
    const post = await setPostStatus(id, 'published');
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Instant reflect on the live site instead of waiting for ISR's
    // fallback revalidate window -- ties directly to "posts should
    // publish to the same live site with our formatting standard."
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    if (post.domain) revalidatePath(`/services/${post.domain}`);
    revalidatePath('/');

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[api/admin/posts/[id]/publish]', err);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
