# 12 — Blog Admin Panel: Setup & Verification

Built 2026-07-18. Scope: `/admin` dashboard backed by MongoDB, single-user
login, structured post editor, and a `content-drafts/` watcher that
auto-imports posts generated in Cowork chat as drafts (no copy-paste).

Verified in this build session: `npx tsc --noEmit` and `npx eslint` both
pass clean on every new/changed file. A full `next build` + live-MongoDB
run could not be completed inside the Cowork sandbox (no local MongoDB
there, and the sandbox's native SWC binary crashes under its restricted
environment — both are sandbox limitations, not code issues). Run the
steps below on your own machine to confirm end-to-end.

## 1. Prerequisites

- MongoDB running locally. If you don't have it yet: install MongoDB
  Community Server, or run `docker run -d -p 27017:27017 --name bitsbuffer-mongo mongo`.
- Node 20+ (project already assumes this).

## 2. Install & configure

```bash
cd bitsbuffer-landing
npm install
```

`.env.local` already has `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`,
and `SESSION_SECRET` filled in (added 2026-07-18). Admin login is
**adnan.softech@gmail.com** with the password you gave in chat. To change
the password later:

```bash
npm run hash-password -- "your-new-password"
# paste the printed ADMIN_PASSWORD_HASH line into .env.local
```

## 3. Migrate the 20 existing posts

```bash
npm run migrate:blog-posts
```

Expect: `Migrated: 20. Skipped: 0. Failed: 0.` Safe to re-run (skips posts
already in MongoDB by slug).

## 4. Run it

```bash
npm run dev
```

This starts Next.js **and** the `content-drafts/` watcher together (see
`package.json`'s `dev` script, via `concurrently`). Two things to check:

1. Visit `http://localhost:3000/blog` — should show the same 20 posts as
   before migration (now served from MongoDB instead of the static file).
2. Visit `http://localhost:3000/admin` — redirects to `/admin/login`. Log
   in. You should see all 20 posts listed as `published`.

## 5. Test the no-copy-paste draft flow

Ask me (Claude, in Cowork chat) to write a blog post via the blog-writing
skill as normal. I'll drop the finished post as JSON directly into
`bitsbuffer-landing/content-drafts/`. Within a couple of seconds (while
`npm run dev` is running), it should:

- Disappear from `content-drafts/` and reappear in `content-drafts/imported/`
- Show up in `/admin` with status `draft`
- Print a line in your terminal like `[watch-drafts] Imported "..." as a draft`

Open it in `/admin`, review/edit, then click **Publish**. It should appear
on `/blog` immediately (no rebuild needed — the publish action calls
Next.js's `revalidatePath` directly).

If a dropped file gets rejected (bad JSON or fails schema validation),
check `content-drafts/rejected/<file>.error.txt` for exactly what failed.

## 6. Production build check

```bash
npm run build
```

This is the one step that couldn't be verified in the sandbox at all.
Watch for the "Collecting page data" step — it connects to MongoDB to
pre-render `/`, `/blog`, and `/services/[domain]` (all have
`export const revalidate = 300`, so Next.js pre-renders them once at
build time as the initial cached version). If MongoDB isn't reachable at
build time, this step fails — MongoDB needs to be running wherever you
build (local machine now, DigitalOcean CI later).

## What changed, file by file

- `src/lib/blog-types.ts` — BlogPost/BlogSection/etc. types (moved out of
  `blog-posts.ts`)
- `src/lib/blog-schema.ts` — Zod validation for post JSON (used by admin
  API routes and the watcher)
- `src/lib/db/mongoose.ts`, `src/lib/db/models/Post.ts` — connection +
  Mongoose schema
- `src/lib/db/blog-repo.ts` — public read path (published posts only)
- `src/lib/db/admin-post-repo.ts` — admin CRUD (all statuses)
- `src/lib/auth/*` — password hashing, session cookie (jose), rate limit
- `src/middleware.ts` — gates `/admin/*` and `/api/admin/*`
- `src/app/admin/**` — login page, dashboard, post editor
- `src/app/api/admin/**` — auth + posts API routes
- `scripts/watch-drafts.ts` — the no-copy-paste auto-import watcher
- `scripts/migrate-blog-posts.ts` — one-time migration
- `scripts/hash-password.ts` — password-change utility
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`,
  `src/app/services/[domain]/page.tsx`,
  `src/components/sections/FeaturedUpdatesSection.tsx`,
  `src/app/page.tsx` — switched from the static `blogPosts` array to
  MongoDB
- `src/lib/blog-posts.ts` — the old 20-post array stays as an offline
  backup only; no live page imports it anymore

## Known follow-ups (not blocking)

- No image/cover-image support in the admin editor — matches the
  no-cover-image site convention, not an oversight.
- Slug editing isn't exposed in the UI (deliberate: changing a live post's
  slug breaks its URL). If a slug is genuinely wrong, delete and recreate.
- Rate limiting on `/api/admin/auth/login` is in-memory (resets on server
  restart) — fine for a single admin user, would need Redis if this ever
  became multi-instance.
