import { NextResponse } from 'next/server';
import { listAllPostsAdmin, createDraftPost, slugExists } from '@/lib/db/admin-post-repo';
import { blogPostInputSchema } from '@/lib/blog-schema';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const posts = await listAllPostsAdmin();
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[api/admin/posts GET]', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

// Manual creation fallback (the normal path is the content-drafts/
// watcher, scripts/watch-drafts.ts, auto-importing generated posts as
// drafts). Kept so a post can still be created by hand from the admin UI
// if needed.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = blogPostInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    if (await slugExists(parsed.data.slug)) {
      return NextResponse.json({ error: `A post with slug "${parsed.data.slug}" already exists` }, { status: 409 });
    }
    const post = await createDraftPost(parsed.data, 'admin');
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/posts POST]', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
