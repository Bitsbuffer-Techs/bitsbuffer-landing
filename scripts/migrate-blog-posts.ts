/**
 * One-time migration: moves the 20 posts hardcoded in src/lib/blog-posts.ts
 * into MongoDB as status: 'published', source: 'migrated'. Run once after
 * setting MONGODB_URI in .env.local:
 *
 *   npm run migrate:blog-posts
 *
 * Idempotent -- safe to re-run. Posts whose slug already exists in Mongo
 * are skipped, not duplicated, so re-running after a partial failure just
 * picks up where it left off.
 */
import './load-env';
import { connectToDatabase } from '../src/lib/db/mongoose';
import { createPublishedPost, slugExists } from '../src/lib/db/admin-post-repo';
import { blogPostInputSchema } from '../src/lib/blog-schema';
import { blogPosts } from '../src/lib/blog-posts';

async function main() {
  await connectToDatabase();
  console.log(`[migrate] Connected. ${blogPosts.length} posts found in blog-posts.ts.`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of blogPosts) {
    if (await slugExists(post.slug)) {
      console.log(`[migrate] Skipping "${post.slug}" -- already in MongoDB.`);
      skipped += 1;
      continue;
    }

    const parsed = blogPostInputSchema.safeParse(post);
    if (!parsed.success) {
      console.error(`[migrate] "${post.slug}" failed validation, not migrated:`, parsed.error.flatten());
      failed += 1;
      continue;
    }

    await createPublishedPost(parsed.data, 'migrated');
    console.log(`[migrate] Migrated "${post.slug}".`);
    migrated += 1;
  }

  console.log(`\n[migrate] Done. Migrated: ${migrated}. Skipped (already existed): ${skipped}. Failed: ${failed}.`);
  if (failed > 0) {
    console.log('[migrate] Fix the failing posts in blog-posts.ts (or the schema) and re-run -- this script is safe to re-run.');
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[migrate] Fatal error:', err);
  process.exit(1);
});
