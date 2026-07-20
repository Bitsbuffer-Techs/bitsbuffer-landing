/**
 * One-shot: completes the 5 legacy posts (flat `content` era) with full
 * structured `sections`, `keyTakeaways`, `faqs`, CTA, readingTime and
 * updatedAt. Reads scripts/legacy-updates/*.json (each file: { slug,
 * ...BlogPostUpdateInput }), validates against blogPostUpdateSchema, and
 * updates the matching Mongo post by slug.
 *
 * Run (with MongoDB running locally):
 *   npx tsx scripts/complete-legacy-posts.ts
 *
 * Idempotent -- re-running just re-applies the same content. The legacy
 * flat `content` field is left in place as a fallback record; the public
 * page prefers `sections` (length-checked since the 07-19 fix).
 */
import './load-env';
import path from 'node:path';
import fs from 'node:fs/promises';
import { connectToDatabase } from '../src/lib/db/mongoose';
import { Post } from '../src/lib/db/models/Post';
import { blogPostUpdateSchema } from '../src/lib/blog-schema';

const UPDATES_DIR = path.join(__dirname, 'legacy-updates');

async function main() {
  await connectToDatabase();
  const files = (await fs.readdir(UPDATES_DIR)).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('[complete-legacy] No JSON files in scripts/legacy-updates/. Nothing to do.');
    process.exit(0);
  }

  let ok = 0;
  let failed = 0;

  for (const file of files.sort()) {
    const raw = await fs.readFile(path.join(UPDATES_DIR, file), 'utf-8');
    let json: Record<string, unknown>;
    try {
      json = JSON.parse(raw);
    } catch {
      console.error(`[complete-legacy] ${file}: not valid JSON, skipped.`);
      failed += 1;
      continue;
    }

    const { slug, ...update } = json as { slug?: string } & Record<string, unknown>;
    if (!slug) {
      console.error(`[complete-legacy] ${file}: missing "slug", skipped.`);
      failed += 1;
      continue;
    }

    const parsed = blogPostUpdateSchema.safeParse(update);
    if (!parsed.success) {
      console.error(`[complete-legacy] ${file}: failed validation, skipped.`);
      console.error(JSON.stringify(parsed.error.flatten(), null, 2));
      failed += 1;
      continue;
    }

    const doc = await Post.findOneAndUpdate({ slug }, { $set: parsed.data }, { new: true });
    if (!doc) {
      console.error(`[complete-legacy] ${file}: no post with slug "${slug}" in MongoDB, skipped.`);
      failed += 1;
      continue;
    }

    const s = doc.sections?.length ?? 0;
    const t = doc.keyTakeaways?.length ?? 0;
    const f = doc.faqs?.length ?? 0;
    console.log(`[complete-legacy] Updated "${slug}": ${s} sections, ${t} takeaways, ${f} FAQs.`);
    ok += 1;
  }

  console.log(`\n[complete-legacy] Done. Updated: ${ok}. Failed/skipped: ${failed}.`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[complete-legacy] Fatal error:', err);
  process.exit(1);
});
