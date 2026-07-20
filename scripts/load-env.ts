/**
 * Loads .env.local for standalone scripts (migrate-blog-posts.ts,
 * watch-drafts.ts) run outside Next.js via tsx.
 *
 * `import 'dotenv/config'` (what these scripts used until 2026-07-18) only
 * loads a file literally named `.env` -- this project only has
 * `.env.local` (Next.js's own convention), so every env var it sets
 * (MONGODB_URI, ADMIN_EMAIL, etc.) silently came back undefined. Next.js
 * itself never had this problem since it loads .env.local automatically;
 * only these two standalone scripts needed the fix.
 */
import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(__dirname, '..', '.env.local') });
