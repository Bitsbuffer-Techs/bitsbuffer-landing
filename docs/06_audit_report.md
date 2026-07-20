# 06 — Audit Report

Bitsbuffer landing (`C:\cowork\bitsbuffer-landing\`), audited 2026-07-16 against
the sweetHeart v3 14-gate scorecard. This project predates the sweetHeart
pipeline (built 07-06 onward), so there is no 01–05 doc trail — this audit
retrofits 06 and 07 only, scoped to code health, housekeeping, and
ship-readiness. Image sourcing for the 30 remaining SolutionsExplorerSection
slots was paused mid-session at Adnan's call: he is sourcing them himself and
will drop the files in, same cadence as the FinTech/E-commerce batches.

## Tooling constraint (read this first)

`next build` could not run in the audit sandbox — `Bus error (core dumped)`,
a native-binary/platform mismatch (this project's `node_modules` was
installed on the real Windows dev machine; the sandbox is Linux, and the
sandbox also has no network access to reinstall for Linux or fetch
Lighthouse/axe-core CLIs). This is exactly the class of problem the skill's
Hostinger deploy lesson already warns about: **build on the machine you're
shipping from, never trust a build artifact or a build result from a
different OS.**

Substituted where possible: Adnan's own `pnpm dev` server was already running
on `localhost:3000` on his machine, so the live app was checked directly via
browser automation (console errors, network requests, page titles) across
`/`, `/services`, `/contact`, `/about`. Result: **zero console errors, zero
failed requests, all 200/304** on every route checked. This confirms the app
runs and renders correctly, but it is a dev-mode check, not a production
`next build` + Lighthouse + axe-core pass — those still need to run for real,
see Gates 1, 11, 12, 13 below.

## Findings (code-level, fixed this pass)

| # | Finding | Severity | Resolution |
|---|---|---|---|
| 1 | 13 orphaned/duplicate original images sitting in `public/images/`, zero references anywhere in `src/` (superseded by their optimized `kebab-case` replacements from the 07-10 image module work). One was 14MB alone. | Housekeeping | Deleted. ~25.4MB reclaimed. See list below. |
| 2 | `QuickStartBarSection.tsx` — dead component, not imported anywhere. Its own successor's code comment confirms it was replaced by `AskBitsbufferSection` and never removed. | Housekeeping | Deleted. |
| 3 | `middleware.ts` does not exist — no www→apex canonical-host redirect. `robots.txt`/`sitemap.xml` declare `https://www.bitsbuffer.com` but nothing enforces that as the single canonical host. | **Open — code defect** | Not fixed this pass (needs a host decision from Adnan: www or apex canonical, then a one-file middleware). This is the exact bug class that flagged 49 pages on WF Engine. |
| 4 | No `eslint.config.mjs` anywhere in the project — `pnpm lint` fails outright ("couldn't find configuration file") rather than surfacing real violations. | **Open — code defect** | Not fixed this pass; needs the config file added, then a real lint pass run. |
| 5 | `api/contact/route.ts` always sends `from: smtpUser`, ignoring the `SMTP_FROM` env var that's already defined in `.env.local`. | Minor/cosmetic | Not fixed — flagged only, doesn't block anything. |
| 6 | Organization schema and page metadata reference `bitsbuffer-dark-logo%20(2).png` — the file resolves fine, but the filename (space + "(2)") reads as an un-renamed duplicate-download artifact for a production asset. | Minor/cosmetic | Flagged, not renamed (renaming means updating every reference; low priority). |
| 7 | `public/images/Feedback JV.docx` — a Word document sitting in the public images folder, which means it is publicly servable at `/images/Feedback%20JV.docx` on the live site. | **Open — human decision** | Not deleted, content unknown. Flagged for Adnan. |
| 8 | CLAUDE.md's Active Projects table says "delete 2 unused components." Static analysis (full import graph across `src/app` + dynamic imports) found only 1 dead component (#2 above). | **Open — human decision** | Flagged. Either the second one was already resolved, or point me at which component Adnan meant. |

### Images deleted (confirmed zero references before deletion)
`ceo working.png`, `custom sotware1.jpg`, `custom softeware2.jpg`,
`social media.jpg`, `Storefront & checkout.png`, `Inventory & fulfillment.png`,
`Payments & reconciliation.png`, `Accounts & loyalty.png`,
`Returns & support.png`, `Compliance & reporting.webp`,
`Lending & underwriting.jpg`, `Reconciliation & ledger.jpg` (14MB),
`Risk management in fintech.png`.

## Scorecard

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Clean build | **Not verified** | `next build` couldn't run in this sandbox (platform mismatch). `next dev` verified clean (0 console errors, 0 failed requests) across 4 routes. **Adnan needs to run `pnpm build` on his own machine before deploy.** |
| 2 | Audit clean | Partial | Housekeeping fixed. 2 open code defects (middleware, eslint config), see findings 3–4. |
| 3 | Keyword coverage | Not applicable this pass | No `02_research.md` exists (project predates sweetHeart). Out of scope for a code/asset audit. |
| 4 | WIIFM copy | Not re-verified | Spot-checked SolutionsExplorerSection bodies — already outcome-framed, not description-framed. Full copy re-audit not run this pass. |
| 5 | Schema + AI surface | Partial | `llms.txt` rewritten to the llmstxt.org spec 07-16, confirmed clean by Lighthouse's Agentic Browsing category (2/3 → 3/3 across the two runs). `robots.txt` (GPTBot/ClaudeBot/PerplexityBot/Google-Extended allowed), `sitemap.xml`, Organization schema, canonical tag, `metadataBase` all present and correct. Missing: middleware host redirect (finding #3). |
| 6 | Forms proven | Code-reviewed, not live-tested | Honeypot (4 independent protections), try/catch with real logging, credential trimming, 503 when unconfigured — all present in `route.ts` and `ContactForm.tsx`. Did not trigger a real send (needs Adnan's go-ahead — sending email is not something I do without explicit permission). |
| 7 | Performance | Partial | `next/image` with `sizes`, AVIF/WebP formats configured, below-fold sections all lazy-loaded via `next/dynamic` (10 of them). No Lighthouse run — sandbox constraint. 25.4MB of dead image weight removed from the repo. |
| 8 | Accessibility | Partial | Code-level: labeled inputs, `aria-hidden` on decorative icons, focus states in Tailwind classes. No axe-core run, no full keyboard pass — sandbox constraint. |
| 9 | Docs complete | Partial | Only 06 and 07 exist (retrofitted this pass). 01–05 don't exist for this project. |
| 10 | Human decisions | Listed | See findings #3 (host), #4 (lint config priority), #7 (Feedback JV.docx), #8 (second unused component), plus image sourcing (Adnan's doing this himself) and SMTP live test. |
| 11 | Lighthouse | **2 runs, 07-16 → 07-17, dev server — still not the qualifying pass** | Run 1 (07-16): Performance 56, Accessibility 96, Best Practices 100, SEO 92, Agentic Browsing 2/3. Run 2 (07-17, after fixes): Performance 62, same Accessibility/Best Practices/SEO, **Agentic Browsing 3/3** (llms.txt rewrite confirmed clean). LCP improved 1.3s → 0.8s and Speed Index 11.0s → 4.5s between runs, consistent with the Hero H1 `initial={false}` fix (see gate 13). Performance itself is still dev-mode: TBT 850-1,260ms, "Minify JS/CSS", "Reduce unused JS 356 KiB" all point at an unminified `next dev --turbo` server, not the production build the 95+ target is scoped to. **Needs a re-run against `pnpm build && pnpm start`.** SEO's "missing meta description" flag persisted on both scans despite correct code (`layout.tsx`/`page.tsx` both export one) — see `docs/09_remediation_plan.md` loop 4 for the View Page Source check that will settle whether it's a Turbopack dev-mode detection quirk or a real bug. Accessibility's contrast finding still needs the specific failing element, not given in either scan. |
| 12 | axe-core | **Not run** | Same sandbox constraint — needs Adnan's machine or the deploy host. |
| 13 | Core Web Vitals | **Partial (dev server only), real LCP bug found, fixed, and confirmed improving** | Run 1: FCP 1.0s, LCP 1.3s, CLS 0, plus a separate local Web Vitals reading of LCP 8.11s (poor) with the LCP element identified as the Header's static "Explore Workflow Engine" link, not the Hero H1 — root cause was `HeroSection.tsx`'s text column fading in via Framer Motion from `opacity: 0`, a known Core Web Vitals anti-pattern. Fixed: `m.h1` given `initial={false}`. Run 2 (07-17, post-fix): FCP 0.7s, **LCP 0.8s**, CLS 0, Speed Index 11.0s → 4.5s — confirms the fix is working in the right direction. Still dev-mode numbers, needs confirmation against the production build. New diagnostic this run: "Avoid non-composited animations, 2 animated elements found" — informational only, no element-level detail given yet, flagged not guessed at. |
| 14 | Conversion hygiene | Spot-checked | Contact form: exactly 4 fields, matches the budget. Single-CTA-per-page not verified site-wide this pass, only on `/contact`. |

## Bottom line

Real, verifiable code and housekeeping work is done: 13 dead images and 1
dead component removed (~25.4MB), the live dev server is clean across every
route checked, the contact form and schema/metadata setup are solid. What
did **not** happen, and needs to before this counts as "ready to go live":
a real `pnpm build` + `pnpm lint` run with the missing eslint config added,
a middleware host-redirect decision, and the actual Lighthouse/axe-core/CWV
numbers — none of which this sandbox could produce. See `07_deploy_checklist.md`
for exactly what to run and where.
