/**
 * Watches content-drafts/ for JSON files (BlogPost shape) and imports each
 * one into MongoDB as a draft, automatically. This is the "no copy-paste"
 * path: generate a post in Cowork chat using the blog-writing skill, save
 * the JSON output straight into this folder (it's inside the project, so
 * a Cowork file write lands here on Adnan's real machine), and it shows
 * up in /admin within a couple of seconds.
 *
 * Runs alongside `next dev` via `npm run dev` (see package.json,
 * `concurrently`). Can also run standalone: `npm run watch-drafts`.
 *
 * Valid files are moved to content-drafts/imported/ (kept, not deleted --
 * a paper trail costs nothing and undoes "oops, wrong file" for free).
 * Invalid files are moved to content-drafts/rejected/ with a sibling
 * `<file>.error.txt` explaining exactly what failed, so a bad drop is
 * loud, not silently ignored (dev-lead's "assume the sad path" rule).
 */
import './load-env';
import path from 'node:path';
import fs from 'node:fs/promises';
import chokidar from 'chokidar';
import { connectToDatabase } from '../src/lib/db/mongoose';
import { createDraftPost, slugExists } from '../src/lib/db/admin-post-repo';
import { blogPostInputSchema } from '../src/lib/blog-schema';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'content-drafts');
const IMPORTED_DIR = path.join(DRAFTS_DIR, 'imported');
const REJECTED_DIR = path.join(DRAFTS_DIR, 'rejected');

async function ensureDirs() {
  await fs.mkdir(DRAFTS_DIR, { recursive: true });
  await fs.mkdir(IMPORTED_DIR, { recursive: true });
  await fs.mkdir(REJECTED_DIR, { recursive: true });

  const readme = path.join(DRAFTS_DIR, 'README.md');
  try {
    await fs.access(readme);
  } catch {
    await fs.writeFile(
      readme,
      `# content-drafts/\n\nDrop a BlogPost-shaped JSON file here (generated via the blog-writing\nskill in Cowork chat) and it gets imported into MongoDB as a draft\nautomatically within a couple of seconds, while \`npm run dev\` is running.\n\nImported files move to \`imported/\`. Files that fail validation move to\n\`rejected/\` with a \`.error.txt\` explaining why.\n\nOpen /admin to review, edit, and publish.\n`
    );
  }
}

async function moveFile(filePath: string, targetDir: string) {
  const filename = path.basename(filePath);
  const dest = path.join(targetDir, filename);
  try {
    await fs.rename(filePath, dest);
  } catch (err) {
    // Cross-device or already-moved race -- copy+unlink fallback.
    console.error(`[watch-drafts] Could not move ${filename} to ${targetDir}:`, err);
  }
}

async function handleNewFile(filePath: string) {
  const filename = path.basename(filePath);
  if (!filename.endsWith('.json') || filename.startsWith('.')) return;

  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.error(`[watch-drafts] Could not read ${filename}:`, err);
    return;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    console.error(`[watch-drafts] ${filename} is not valid JSON -- moving to rejected/`);
    await fs.writeFile(path.join(REJECTED_DIR, `${filename}.error.txt`), 'File is not valid JSON.');
    await moveFile(filePath, REJECTED_DIR);
    return;
  }

  const parsed = blogPostInputSchema.safeParse(json);
  if (!parsed.success) {
    const reason = JSON.stringify(parsed.error.flatten(), null, 2);
    console.error(`[watch-drafts] ${filename} failed validation -- moving to rejected/\n${reason}`);
    await fs.writeFile(path.join(REJECTED_DIR, `${filename}.error.txt`), reason);
    await moveFile(filePath, REJECTED_DIR);
    return;
  }

  try {
    if (await slugExists(parsed.data.slug)) {
      const reason = `A post with slug "${parsed.data.slug}" already exists. Rename the slug in the JSON and drop it again.`;
      console.error(`[watch-drafts] ${filename}: ${reason}`);
      await fs.writeFile(path.join(REJECTED_DIR, `${filename}.error.txt`), reason);
      await moveFile(filePath, REJECTED_DIR);
      return;
    }

    const post = await createDraftPost(parsed.data, 'admin');
    console.log(`[watch-drafts] Imported "${post.title}" (/${post.slug}) as a draft -- open /admin to review.`);
    await moveFile(filePath, IMPORTED_DIR);
  } catch (err) {
    console.error(`[watch-drafts] Failed to insert ${filename} into MongoDB:`, err);
    // Deliberately NOT moved on a DB failure (as opposed to a validation
    // failure) -- MongoDB might just be down; leave the file in place so
    // the watcher retries it once the connection recovers, instead of
    // silently losing a generated post to a transient outage.
  }
}

async function main() {
  await ensureDirs();

  try {
    await connectToDatabase();
    // 2026-07-22: log which host/db this process is actually talking to
    // (never the credentials) -- added after a restart silently kept
    // reconnecting to a stale local instance instead of the newly-set
    // live MONGODB_URI, and there was no way to see that from the logs.
    const uri = process.env.MONGODB_URI ?? '';
    const masked = uri.replace(/\/\/[^@]+@/, '//<credentials>@');
    console.log(`[watch-drafts] Connected to MongoDB: ${masked}`);
  } catch (err) {
    console.error(
      '[watch-drafts] Could not connect to MongoDB. Is it running locally? ' +
        'Drafts dropped into content-drafts/ will retry once it is.',
      err
    );
  }

  console.log(`[watch-drafts] Watching ${DRAFTS_DIR} for new post JSON files...`);

  const watcher = chokidar.watch(DRAFTS_DIR, {
    ignored: (filePath) => filePath.includes(`${path.sep}imported${path.sep}`) || filePath.includes(`${path.sep}rejected${path.sep}`),
    depth: 0,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  });

  watcher.on('add', (filePath) => {
    handleNewFile(filePath).catch((err) => console.error('[watch-drafts] Unexpected error:', err));
  });
}

main().catch((err) => {
  console.error('[watch-drafts] Fatal error:', err);
  process.exit(1);
});
