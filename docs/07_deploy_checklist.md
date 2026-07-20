# 07 — Deploy Checklist

Deployment itself is Adnan's call, per the sweetHeart skill. This is the
runway to get there, in order. Nothing in this list has been done on a live
host — it's all local/pre-deploy verification.

## Before touching a server

1. **Run the real build.** On the actual Windows dev machine (not a sandbox
   with mismatched native binaries): `pnpm install` (fresh, to be sure),
   then `pnpm build`. Must exit with zero errors. This has not been verified
   yet — see `06_audit_report.md` Gate 1.
2. **Add `eslint.config.mjs`** (missing entirely right now — `pnpm lint`
   currently fails to even find a config) and run `pnpm lint` clean.
3. **Decide the canonical host** — `www.bitsbuffer.com` or apex
   `bitsbuffer.com` — then add `middleware.ts` with the 308 redirect the
   other way. `robots.txt`/`sitemap.xml` already assume `www`, so that's the
   likely answer, but confirm before writing it.
4. **Run Lighthouse CLI** against the production build (`pnpm build && pnpm
   start`, then Lighthouse with mobile emulation + 4G throttling). Target:
   95+ on Performance, SEO, Accessibility, Best Practices. Log the scores
   plus LCP/INP/CLS here once run.
5. **Run axe-core CLI** on every route. Target: zero critical/serious
   violations. Pair with a manual keyboard tab-through — they catch
   different bugs.
6. **Screenshot QA** at 390px and 1440px, every route, reviewed by eye.
7. **Send one real test submission** through the contact form to the real
   inbox (`hr@bitsbuffer.com` or whichever `siteConfig.contact.email` is)
   and confirm it lands. The code looks correct (honeypot, try/catch,
   real logging all present) but this has not been proven end-to-end.
8. **Decide the open housekeeping items** from `06_audit_report.md`:
   `Feedback JV.docx` in `public/images/` (delete, move, or leave — your
   call), and confirm whether there's really a second unused component
   beyond `QuickStartBarSection.tsx` (only found one via static analysis).
9. **Drop in the remaining 30 industry images** for SolutionsExplorerSection
   (Agri-tech, Enterprise/ERP, Healthcare, Logistics, EdTech, Real Estate —
   5 scenarios each) — you're sourcing these yourself. Briefs are in
   `PENDING_IMAGES.md`. Once they land, ping me and I'll wire them in and
   optimize/rename them like the FinTech/E-commerce batches.

## On the deploy server (Hostinger, per the WF Engine lesson)

- **Build on the server's own OS.** Never zip a Windows-built `.next` and
  ship it — this caused live chunk-404s on WF Engine. Either build on the
  server directly, or in a CI environment matching its OS/architecture.
- Confirm production env vars are set on the live host: `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NEXT_PUBLIC_SITE_URL`.
  Contact form returns a 503 gracefully if any SMTP var is missing, so a
  misconfigured env won't crash the site, but the form will silently stop
  working — check it after every deploy.
- After deploy, schedule a fresh Semrush crawl to verify: no duplicate-host
  indexing (once middleware ships), structured data valid, no 403s on any
  resource.
- **Content freshness note:** AI engines weight pages with a `dateModified`
  inside the last 90 days for time-sensitive queries. None of this site's
  pages currently track that in a way I could verify this pass — worth a
  quarterly review cadence once live.

## What's already solid (no action needed)

`llms.txt`, `robots.txt` (GPTBot/ClaudeBot/PerplexityBot/Google-Extended all
allowed), `sitemap.xml`, Organization schema, canonical tags, `metadataBase`,
OG images via `next/og`, fonts via `next/font` (zero external font
requests), `next/image` with AVIF/WebP, below-fold sections lazy-loaded via
`next/dynamic`, contact form's silent-failure protections, `tsconfig.json`
strict mode. 25.4MB of dead image weight and one dead component already
removed from the repo this pass.
