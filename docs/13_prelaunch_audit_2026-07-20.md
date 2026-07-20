# 13 — Pre-Launch Site-Wide Audit, 2026-07-20

Quick static audit against the top-2% target (sweetHeart v4.1 gates + website-build-standards 6-pass). Code-level only. Lighthouse, axe-core, and form sends need Adnan's machine.

## Verdict: NOT go-live yet

Code quality is strong. What blocks launch is unverified gates, not broken code. Two real SEO defects found, one new.

## Blockers, ordered by impact over effort

| # | Finding | Type | Status |
|---|---|---|---|
| 1 | **All 20 blog posts were missing from the sitemap.** Blog moved to Mongo, `next-sitemap` never saw those routes. | Code defect | **FIXED.** `src/app/server-sitemap.xml/route.ts` serves them from Mongo at request time, added as a second `Sitemap:` line in robots.txt |
| 2 | 5 rebuilt legacy posts not applied in Mongo. | Adnan action | **DONE (Adnan confirmed 2026-07-20, shipped).** Worth one spot-check on `/blog` live next time it's open, but treating as resolved per Adnan |
| 3 | Em dash in the reconciliation post stat label. Lives in Mongo (admin) and in `src/lib/blog-posts.ts:59`. | Known, 1-line | **FIXED both copies.** Static file fixed by Bubby, Mongo/admin copy fixed by Adnan |
| 4 | Canonical-host redirect missing. robots/sitemap declared `www.` but nothing enforced it. Same bug class flagged 49 pages on WF Engine. | Decision + code | **FIXED, apex chosen.** `siteConfig.url`, `next-sitemap.config.js`, `robots.txt`, `llms.txt` all switched to `https://bitsbuffer.com`. `middleware.ts` now 308-redirects any `www.bitsbuffer.com` request (any path, any method) to apex, matcher broadened site-wide. **Needs Adnan to confirm apex has its own DNS A/ALIAS record and SSL cert at the deploy host** — a redirect to a host with no valid cert just trades one failure for a worse one. Unverifiable from sandbox |
| 5 | Production Lighthouse never run. Best number so far is Performance 62 on `next dev`. Target is 100 x4 on `pnpm build && pnpm start`. axe-core and real CWV also unrun. | Adnan machine | **Still open.** Run against production build. Dev signs are good: LCP 0.8s, CLS 0, Agentic 3/3 |
| 6 | Both mail forms untested live. | Adnan action | **DONE (Adnan confirmed 2026-07-20).** Mail arriving from both /contact and /careers, silent-failure risk closed |

## Quick wins, non-blocking

| # | Finding | Fix |
|---|---|---|
| 7 | ~20MB of unreferenced original images in `public/images/agritech/`, `healtech/`, `edtech/` (spaced, typo'd filenames, up to 6.3MB each). Zero references in src, all superseded by compressed kebab-case versions. Publicly servable dead weight. | Delete the 3 subfolders |
| 8 | `public/images/Feedback JV.docx` was publicly servable. | **FIXED.** Moved to `docs/private-assets/`, outside the public web root, content untouched |
| 9 | "highest-leverage" in the routing blog post. | **FIXED**, both static and Mongo copies (Adnan) |
| 10 | Stray root files + ugly active-logo filename. | **FIXED.** Deleted 3 dead duplicates (`logo (1).png`, `logo.jpeg` at repo root, `logo (1).png` in `public/`, all zero references). Renamed the real logo `bitsbuffer-dark-logo (2).png` → `bitsbuffer-logo-dark.png`, updated all 4 references (`layout.tsx` schema, `Footer.tsx`, `Header.tsx`, `FinalCTASection.tsx`), verified zero remaining old-name refs |

## Verified clean this pass

- Canonicals on every route including homepage and both dynamic route families, all built from `site-config.ts` single source of truth
- robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended; llms.txt spec-clean; Agentic Browsing 3/3 held across two runs
- FAQPage schema wired to visible copy on home, services, all 8 domain pages, and blog posts
- Article schema uses real `dateModified` (`updatedAt` fallback to `publishedAt`), dates in `<time dateTime>`
- No `<div onClick>` anywhere; decorative icons `aria-hidden` with empty alt; every `outline-none` has a `focus:border-accent` replacement beside it
- Below-fold sections lazy-loaded via dynamic import; next/image with AVIF/WebP; all in-use page images at or under 320KB
- Admin: robots disallow + layout noindex + session middleware, excluded from sitemap
- Forms code: 4-field budget held, honeypot renamed away from autofill-colliding "website", 503 when SMTP unconfigured

## Top-2% gate score (16-gate frame)

Passing on static evidence: schema/AI surface, SEO structure (minus #1 and #4), code hygiene, conversion form code, accessibility patterns. Unverifiable from sandbox: Lighthouse 100x4, axe-core, CWV, live forms, Semrush re-check. **No top-2% claim is honest until the production-build numbers exist.**

## Launch path — what's actually left

Resolved: sitemap (#1), legacy posts shipped (#2), em dash both copies (#3), apex host redirect (#4, DNS+SSL confirmed live by Adnan), dead images (#7), Feedback JV.docx relocated (#8), banned word both copies (#9), stray logo files cleaned + renamed (#10), mail forms confirmed live (#6).

**Still open before go-live:**

1. **Production build verification** (#5): `pnpm build && pnpm start` on Adnan's machine, then Lighthouse x3 median (target 100 across all four categories, LCP <1.8s, CLS <0.05), axe-core, real Core Web Vitals. Confirmed sandbox cannot run this (`next build` doesn't complete in this environment, hit the same wall the first pass did) — this has to happen on Adnan's machine. Everything scored so far is `next dev`, not the real number.
2. **Semrush audit**: deferred by Adnan's own call, will run against the live domain after deploy rather than against a local/tunneled build.
3. **Real human walkthrough**: tab through every page in an actual browser, confirm production env vars (SMTP, API keys) are set on the live host, not just locally.
4. Then go live.
