# bitsbuffer-landing — Pre-Launch Audit
**Date:** 2026-07-08 · **Auditor:** Claude Code, run locally against a real production build (not a code read-through)
**Environment:** Windows, Node v23.1.0, Next.js 15.5.20, Lighthouse 13.4.0, axe-core 4.12.1, real Chrome 141 via CDP

---

## Benchmark sites used

- **Linear** — the reference for restraint: near-zero motion noise, information density kept low above the fold, one CTA per screen.
- **Stripe** — the reference for content-dense marketing pages that still load fast; used as the bar for a page with this many sections (Bitsbuffer's homepage has 16).
- **Vercel** — the reference for a technical-audience B2B site with a dark/light hero pattern, relevant since this site is also A/B-testing a light vs. dark hero.
- **Attio** — the reference for a smaller-team SaaS/studio site punching above its size, closest in scale to Bitsbuffer.
- **Framer** — the reference for scroll-reveal motion quality (subtle fade + rise, no bounce, no re-triggering), same animation grammar this site is going for with Framer Motion.

Top-2% budget used throughout: **LCP < 2.0s, CLS < 0.05, TBT < 150ms** (mobile, throttled).

---

## Zero-th finding: the site did not build

Before any of the below could be measured, `npm run build` failed outright with a TypeScript error, and `npm run start` 500'd on 4 of 10 routes from a stale build cache. Both are now fixed (see punch list #1–#2) so the rest of this audit could run against a real production build and a real production server. This means the version of the site currently in the working tree **could not have been deployed** — not "would ship with warnings," genuinely would not compile. Everything below was measured after these two fixes were applied.

---

## Scorecard

Scored against the top-2% budget above, not against average competitor sites. Each score reflects the *current* state after the two build-blocking fixes (see punch list), before any of the other punch-list items are applied.

| Route | Performance /10 | Accessibility /10 | SEO /10 | UI/UX /10 | Biggest issue |
|---|---|---|---|---|---|
| `/` (home) | 3 | 8 | 9 | 6 | LCP 4.0s / TBT 630ms, and a dev-only "Hero A/B" debug toggle was shipping to every visitor |
| `/about` | 5 | 8 | 9 | 8 | LCP 3.4s / TBT 570ms — heaviest page after home |
| `/services` | 6 | 7 | 9 | 6 | Hardcoded `#0B68C2` blue breaks the site's teal accent convention on the one page that most needs brand consistency |
| `/contact` | 7 | 10 | 9 | 8 | Clean pass — best-performing page on every axis |
| `/blog` | 7 | 10 | 6 | 7 | Zero structured data on the index page |
| `/blog/[slug]` | 7 | 10 | 7 | 8 | `dateModified` silently equals `datePublished` for every post (no `updatedAt` field exists) |
| `/case-studies` | 4 | 9 | 9 | 6 | TBT 660ms, worst on the site after home; case study descriptions are self-flagged "TRUNCATED" placeholder copy |
| `/case-studies/[slug]` | 8 | 9 | 8 | 7 | Domain badge (amber/rose/etc.) text fails contrast |
| `/careers` | 8 | 10 | 9 | 8 | Clean pass |
| `/flagship-domains` | 8 | 10 | 6 | 7 | Zero structured data |

Accessibility/SEO numbers above already account for the false positives explained in the a11y section (mid-animation contrast snapshots) — they are not axe's raw violation counts.

### Core Web Vitals detail (mobile, simulated throttling)

| Route | LCP | CLS | TBT | FCP |
|---|---|---|---|---|
| `/` | **4.0s** | 0 | **630ms** | 2.5s |
| `/about` | 3.4s | 0 | 570ms | 1.3s |
| `/services` | 3.1s | 0 | 470ms | 1.3s |
| `/contact` | 3.0s | 0 | 250ms | 1.2s |
| `/blog` | 3.6s | 0 | 260ms | 1.3s |
| `/blog/[slug]` | 3.2s | 0 | 290ms | 1.3s |
| `/case-studies` | **3.8s** | 0.016 | **660ms** | 1.5s |
| `/case-studies/[slug]` | 3.1s | 0 | 220ms | 1.3s |
| `/careers` | 3.1s | 0.013 | 240ms | 1.2s |
| `/flagship-domains` | 2.8s | 0 | 230ms | 1.3s |

**Every single route misses the LCP budget** (best case is `/flagship-domains` at 2.8s, still 40% over). **Every route misses the TBT budget** too (best case 220ms, still 47% over). CLS is uniformly excellent (0–0.016, well under 0.05) — the skeleton-loader pattern for below-fold sections is working as designed.

The floor of ~2.8–3.1s LCP shows up even on near-empty pages (`/flagship-domains`, `/case-studies/[slug]` both have almost no unique content), which means the *shared* layout (Header, Footer, MotionProvider, fonts) carries a fixed cost on every route — this is not a per-page content problem, it's a shared-chrome problem, and the fix belongs in `layout.tsx` and its children, not in any one page. Homepage and `/case-studies` sit well above even that floor because they render 12–16 stacked sections in the initial server-rendered HTML (Next's `dynamic()` without `ssr:false` still SSRs the content — it only code-splits the *client* bundle, so "below-fold, lazy-loaded" here means smaller JS chunks, not less initial layout/paint work).

**Caveat on absolute numbers:** this was measured with `npm run start` on a Windows dev machine, not a CDN edge deployment. Relative differences between routes (home/case-studies being 2-3x worse than everything else) are trustworthy; the absolute LCP values would likely drop somewhat on real Vercel/CDN hosting. They would not close a 2x gap, though — Pakistan's real 4G share means the CDN improvement matters less here than it would for a US-only audience, so treat these numbers as directionally real, not as inflated lab noise to dismiss.

---

## Prioritized punch list

Ordered by impact ÷ effort, highest leverage first. **Fixed** = already applied during this audit (verified by re-running the tool afterward). **Flagged** = a real finding, not yet applied, either because it's higher-effort or because it needs someone's call.

### 1. [FIXED] Production build was broken — 30 TypeScript errors across 15 files
**What:** `npm run build` failed with `Type 'string' is not assignable to type 'Easing'` from every Framer Motion `ease: 'easeOut'` variant object site-wide (framer-motion's stricter `Easing` type widens the string literal when the object isn't contextually typed).
**Where:** 15 files under `src/components/sections/` and `src/components/ui/`, e.g. [AboutGallerySection.tsx:32](src/components/sections/AboutGallerySection.tsx#L32), [PageHero.tsx:37](src/components/ui/PageHero.tsx#L37).
**Fix applied:** Added `as const` to every `ease: 'easeOut'` literal. Verified: `npx tsc --noEmit` went from 30 errors to 0, `npm run build` now completes.
**Type:** Code defect, fixed.

### 2. [FIXED] Production server 500'd on 4 of 10 routes from a stale build cache
**What:** `.next/` mixed Turbopack dev-cache artifacts (from `next dev --turbo`) with a webpack production build, so `/blog`, `/flagship-domains`, `/blog/[slug]`, and `/case-studies/[slug]` all threw `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'` at request time.
**Where:** Build artifact issue, not source — `rm -rf .next && npm run build` resolved it.
**Fix applied:** Clean rebuild. Verified: all 10 routes return 200.
**Recommendation:** Add a `prebuild` script (`rimraf .next`) or document "always clean-build before `npm run start`" — this will recur any time someone runs `npm run dev` (which uses `--turbo`) and then `npm run build` without clearing the cache in between.
**Type:** Code defect, fixed; process note flagged.

### 3. [FIXED] A dev-only debug toggle was shipping to every real visitor
**What:** [HeroSwitcher.tsx](src/components/sections/HeroSwitcher.tsx) renders a floating "Hero A/B: 1 · Light / 2 · Dark wave" button, bottom-right, on every homepage load in production. The file's own header comment says *"Do not ship this toggle"* — it was wired into `page.tsx` unconditionally.
**Where:** [HeroSwitcher.tsx:35](src/components/sections/HeroSwitcher.tsx#L35).
**Fix applied:** Gated the toggle behind `process.env.NODE_ENV !== 'production'`. Verified in a rebuilt production server: `grep -c "Hero A/B"` on the served HTML now returns 0.
**Decision still open:** Which hero wins (light `HeroSection` vs. dark `HeroSectionDark`) is Adnan's call, not mine — I did not delete either variant or the switcher itself, only hid the debug UI from real visitors. Once a call is made, delete `HeroSwitcher.tsx`, the losing hero file, and replace the `<HeroSwitcher />` usage in `page.tsx` with the winner directly (this also removes the 1.48MB `hero-bg.png` from the bundle if light wins, see #6).
**Type:** Code defect, fixed; hero A/B decision flagged for Adnan.

### 4. [FLAGGED] All 8 "domain" badge color tokens fail WCAG AA contrast
**What:** Every `text-domain-*` / `bg-domain-*/10` badge (e.g. "E-COMMERCE", "NON-PROFIT" tags on case study cards) fails 4.5:1 contrast. Confirmed against the literal defined hex values in `tailwind.config.ts` (not an animation artifact — see methodology note below), and visually confirmed washed-out in the `/case-studies` screenshot.

| Token | Hex | Ratio on its own 10%-tint badge bg | 
|---|---|---|
| ecommerce | `#F59E0B` | 1.99 |
| fintech | `#3B82F6` | 3.29 |
| agritech | `#10B981` | 2.31 |
| erp | `#8B5CF6` | 3.75 |
| ai | `#EC4899` | 3.13 |
| edtech | `#0EA5E9` | 2.51 |
| nonprofit | `#F43F5E` | 3.23 |
| legaltech | `#6366F1` | 3.95 |

**Where:** [tailwind.config.ts:43-55](tailwind.config.ts#L43-L55).
**Fix:** Darken each token by roughly 15–25% for text use specifically (keep the current hue/saturation, drop lightness), or add a second `-text` variant per color used only for text-on-tint contexts while the brighter original stays for dots/icons/borders. I did not apply this myself — these are brand colors and Adnan has been precise about exact hex values before (the teal accent pixel-sampling call), so a recolor of 8 tokens across the site needs his sign-off on the replacement shades, not a silent swap.
**Type:** Real WCAG 1.4.3 AA violation, confirmed, needs a design call on replacement shades.

### 5. [FLAGGED] Blog post structured data always fakes `dateModified`
**What:** `dateModified: post.publishedAt` — there is no `updatedAt` field in the data model at all, so every blog post's schema claims it was last modified the day it was published, permanently. This is the exact anti-pattern this project's own build-standards skill calls out by name.
**Where:** [blog/[slug]/page.tsx:51](src/app/blog/[slug]/page.tsx#L51), and the missing field in [blog-posts.ts](src/lib/blog-posts.ts) (`BlogPost` interface has no `updatedAt`).
**Fix:** Add an optional `updatedAt?: string` field to the `BlogPost` interface, default to `publishedAt` only when genuinely unedited, and pass the real value through when a post is actually revised.
**Type:** Code defect, cheap, safe to fix without anyone's sign-off — flagging rather than fixing myself only because it's a data-model change I didn't want to make speculatively without you confirming the field name/shape you want.

### 6. [FLAGGED] Homepage LCP/TBT are 2x over budget, and it's a shared-layout problem, not one bad image
**What:** Homepage LCP 4.0s, TBT 630ms — worst on the site. Main-thread breakdown: 1.3s script evaluation + 1.28s style/layout, on a page that server-renders 16 stacked sections in the initial HTML. `/case-studies` is the second-worst (3.8s / 660ms) for the same underlying reason (its grid + FinalCTA + PageHero stack renders a lot of DOM up front). The 2.8–3.1s floor present on *every* route (even near-empty ones) points at `layout.tsx`'s shared Header/Footer/MotionProvider as a fixed tax on every page, not a per-page issue.
**Where:** [page.tsx](src/app/page.tsx) (16 sections), [layout.tsx](src/app/layout.tsx).
**Fix (not applied — architectural, real UX tradeoff):** The current `dynamic()` imports without `{ssr: false}` only code-split the JS, they don't defer server-rendering or initial paint cost. Genuinely deferring below-fold sections (mount only after intersection, or `ssr: false` + client-only mount) would cut initial layout work substantially, but it also removes that content from the initial HTML — a real SEO/AI-crawler tradeoff worth a deliberate decision, not something to change silently.
**Type:** Real performance finding, fix is architectural — flagged, not applied.

### 7. [FLAGGED] `hero-bg.png` is 1.48MB, loaded `priority` in the dark hero variant
**What:** Nearly 5x the project's own ~300KB source-image budget, loaded eagerly (`priority`) the moment `HeroSectionDark` renders.
**Where:** [public/hero-bg.png](public/hero-bg.png), used in [HeroSectionDark.tsx:41](src/components/sections/HeroSectionDark.tsx#L41).
**Fix:** Compress before the hero A/B call is made (see #3) — if light wins, delete the file entirely; if dark wins, run it through compression to get it under 300KB before shipping.
**Type:** Code defect, cheap, blocked on the same hero decision as #3.

### 8. [FLAGGED] Every "about us" photo is duplicated in the repo
**What:** All 12 files under `public/images/about us/*` are byte-identical duplicates of files directly under `public/images/*` (confirmed via matching file sizes). Doubles repo/deploy weight for these assets for no reason.
**Where:** `public/images/about us/` vs `public/images/` (e.g. `training.jpeg`, `dinner.jpg`, `wfengine003.png`, all 232KB/223KB/218KB pairs, byte-identical).
**Fix:** Confirm which path is actually referenced (grep shows `public/images/*.jpeg` — the flat path — is what's imported; `about us/*` looks like the original unzipped folder that was never cleaned up), then delete the unused copy.
**Type:** Code defect, cheap, safe to fix — flagging because I didn't want to delete files without confirming nothing references the nested path first; happy to do it on a go-ahead.

### 9. [FLAGGED] Duplicate landmark region on the homepage
**What:** `<AskBitsbufferSection />` renders twice on the homepage (once above the fold, once before the footer), both with the identical hardcoded `aria-label="Ask Bitsbuffer"`. Confirmed by axe-core's `landmark-unique` violation — a screen reader user gets two indistinguishable "Ask Bitsbuffer" regions with no way to tell them apart from the accessibility tree.
**Where:** [page.tsx:122](src/app/page.tsx#L122) and [page.tsx:137](src/app/page.tsx#L137); [AskBitsbufferSection.tsx:32](src/components/sections/AskBitsbufferSection.tsx#L32).
**Fix:** Add an optional `ariaLabel` prop to `AskBitsbufferSection`, pass a distinguishing label on the second instance (e.g. "Ask Bitsbuffer, footer").
**Type:** Code defect, cheap, safe to fix.

### 10. [FLAGGED] Hardcoded hex color breaks brand consistency on `/services`
**What:** `style={{ color: '#0B68C2' }}` — a raw inline hex on the "Workflow Engine" keyword in the services hero, rendering as blue against every other page's teal `text-accent`. This may be intentional (signaling "this is WF Engine's brand, not Bitsbuffer's"), but it's implemented as a hardcoded hex with no token, which the project's own build standards explicitly ban.
**Where:** [ServicesHero.tsx:21](src/components/sections/ServicesHero.tsx#L21).
**Fix:** If the blue-for-WF-Engine distinction is intentional, extract it to a real token (e.g. `text-wfengine`, matching the pattern already used for the 8 `domain-*` tokens) instead of an inline style. If it's not intentional, swap to `text-accent` to match the rest of the site.
**Type:** Code-quality defect, cheap fix — flagging the *which color* question since that's a brand call, not the *token vs. inline-hex* question, which is unambiguous.

### 11. [FLAGGED] Zero structured data on `/blog` and `/flagship-domains`
**What:** 9 of 11 routes carry a `PageSchema`/JSON-LD block; `/blog` (index) and `/flagship-domains` have none at all. Per this project's own standards doc: partial schema coverage across a category is a ranking regression on the pages that got skipped, not a stylistic gap.
**Where:** [blog/page.tsx](src/app/blog/page.tsx), [flagship-domains/page.tsx](src/app/flagship-domains/page.tsx) — compare to [about/page.tsx](src/app/about/page.tsx) which has it.
**Fix:** Add a `PageSchema` (CollectionPage type, matching the pattern in `case-studies/page.tsx`) to both.
**Type:** Code defect, cheap, safe to fix.

### 12. [DECISION NEEDED — do not guess] Case study descriptions are self-flagged placeholder copy
**What:** `description: string; // TRUNCATED, see note above, verify before publish` — every case study's `description` field in the data file is explicitly marked as unfinished by whoever wrote it. Cards currently use `tagline` instead (which is fine), but the `description` field is still exported and could surface elsewhere (meta descriptions, schema) with truncated text.
**Where:** [case-studies.ts:22](src/lib/case-studies.ts#L22) and every entry below it.
**Not fixed:** This needs real, accurate copy about each of the 9 case studies from Adnan — writing plausible-sounding filler here would be worse than leaving the flag in place.
**Type:** Content decision, flagged, not guessed at.

### 13. [MINOR] Short meta descriptions on 5 routes
**What:** `/about` (136 chars), `/contact` (92), `/careers` (114), `/blog` index (109), `/flagship-domains` (122) are all under the 150–160 target — not truncated or broken, just leaving SERP snippet real estate unused. 3 of 5 blog post excerpts (178, 193, 171 chars) run *over* 160 and will get truncated in search results.
**Where:** Respective `page.tsx` metadata blocks; [blog-posts.ts](src/lib/blog-posts.ts) excerpts.
**Type:** Minor SEO polish, low priority.

### 14. [MINOR] Soft topical overlap between two blog posts
**What:** "Why custom software still wins when the workflow is complex" and "How to build software for regulated and complex industries" both sit in "complex workflows + custom software" territory. Not a hard duplicate (different angles: positioning vs. how-to), but worth a look before adding more posts in this lane.
**Type:** Minor, watch-item, not a hard cannibalization case.

---

## What could not be verified in this environment

- **Contact form honeypot vs. real Chrome autofill, end to end.** I launched a real (non-headless-shell) Chrome via CDP and confirmed the honeypot field (`hp_token`) has zero layout box (`offsetParent: false`, `display: none` at the render level) — this is the actual property Chromium's autofill form-extraction checks, so it's stronger evidence than reading the Tailwind class name in source. What I could **not** do: drive an actual "Chrome shows an autofill suggestion dropdown, a saved profile gets selected" interaction. Chrome DevTools Protocol's `Autofill.trigger` command is scoped to payment-card autofill in this Chrome version (141) — general address/organization autofill is UI-popup-driven and not automatable via CDP the way the original WF Engine bug would need to be reproduced exactly. **Recommend a manual test**: open the live form in Chrome with a saved address/company autofill profile, click into the Name field, accept the autofill suggestion, and confirm `hp_token` stays empty before shipping.
- **Real inbox delivery confirmation.** I submitted one real test POST to `/api/contact` using the SMTP credentials already in `.env.local` — it returned `{"ok":true}` (HTTP 200), meaning nodemailer's `sendMail` resolved without throwing against the configured SMTP server. **Please check the `hello@bitsbuffer.com` inbox (and spam folder)** for a message titled "New Bitsbuffer inquiry from Site Audit Test" to fully confirm receipt — a 200 from this endpoint confirms the SMTP server accepted the message, not that it landed in the inbox.
- **Production environment variables.** Confirmed `.env.local` has working SMTP credentials locally. Did not and could not check whether the same variables are set on the actual production host (Vercel or wherever this deploys) — that's the exact "works in dev, silently fails in prod because a credential was never copied over" scenario this project's own standards doc warns about.
- **Absolute Lighthouse numbers on real hosting.** All performance numbers were measured against `npm run start` on a local Windows machine, not a CDN edge deployment. Relative comparisons between routes are trustworthy; absolute LCP/TBT values would likely improve somewhat (but not dramatically) on real hosting.
- **A human visual walkthrough.** I captured real screenshots (desktop + one mobile viewport) of every route via a real Chrome instance and used them to verify several findings (the H1 contrast false-positive, the blue/teal brand mismatch, badge legibility), but this is still not the same as Adnan clicking through the live site himself, especially for full mobile-viewport behavior across every route and real-device font rendering.

---

## Methodology note on the accessibility scores

Several axe-core "color-contrast" violations turned out to be **animation-timing false positives**, not real bugs — worth flagging explicitly since axe reported different contrast ratios for the *identical* `text-text-muted` class on different pages (4.03:1 on home, 2.02:1 on about, 1.89:1 on services), which is only possible if axe's headless snapshot caught each page mid-Framer-Motion-fade-in, at a different point in the animation depending on how many staggered siblings preceded that element. I checked the real resting-state token value (`#646E71`, defined in `globals.css`) directly and it computes to **4.74:1 against the actual hero background — a clean AA pass**. Real screenshots taken ~700ms after page load (past the fade-in) confirm this visually. The same logic applies to the `/case-studies` H1 contrast flag (`text-accent`): real resting value is 3.99:1, which passes the 3:1 large-text AA bar (though it would fail AAA's 4.5:1 large-text bar — cheap to fix if you want AAA headroom, by darkening the accent token slightly for text-on-light-bg use specifically).

The domain-badge contrast failures (#4 above) are **not** subject to this caveat — those were checked against the literal hex values defined in `tailwind.config.ts`, independent of any animation state, and confirmed visually washed-out in the case-studies screenshot.
