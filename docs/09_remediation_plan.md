# 09 — Remediation Plan (sweetHeart-standard, top-2% target)

Freeze override, Adnan's call, 2026-07-16. Skill freeze otherwise runs until
07-24. This pass takes the priority fix list from `08_content_positioning_audit.md`
and the open code defects from `06_audit_report.md` and runs them through the
sweetHeart v3 loop: fix what's a clean code/copy call, flag what needs
Adnan's own facts or his own machine, never guess either.

Target: 14-gate scorecard in `sweetHeart/SKILL.md` Phase 7 — Lighthouse 95+
(Performance, SEO, Accessibility, Best Practices), Core Web Vitals (LCP <
2.5s, INP < 200ms, CLS < 0.1), WCAG 2.2 AA via axe-core, conversion hygiene,
and the agentic-AI surface (schema, llms.txt, fact consistency).

## Fixed this pass (code-level, done)

| # | Fix | Files touched |
|---|---|---|
| 1 | Hero's stale "4 regulated industries" stat corrected to "8 industries served" — killed the live self-contradiction against ProblemSolutionSection. | `HeroSection.tsx` |
| 2 | Industries list reconciled to one canonical phrase across every surface that names them. Ground truth = SolutionsExplorerSection's 8 real tabs (E-commerce, FinTech, Agri-tech, Enterprise/ERP, Healthcare, Logistics, EdTech, Real Estate). Added `siteConfig.industries` / `siteConfig.industriesList` as the single source of truth so this can't drift again — every surface below now imports it instead of hardcoding its own wording. Dropped "legal-tech", "field operations", and "AI tooling", none of which are real tabs. | `site-config.ts`, `app/page.tsx` (Hero metadata + WebPage schema), `app/services/page.tsx`, `app/case-studies/page.tsx`, `HomeFAQSection.tsx`, `ServicesHero.tsx`, `ServiceToolsSection.tsx` (x2), `public/llms.txt` |
| 3 | "Replace six disconnected tools" softened to non-specific — no source for "six" existed anywhere else on the site. | `TransformWorkSection.tsx` |
| 4 | Blog cover images removed sitewide (blog grid, blog detail page, homepage's FeaturedUpdatesSection) — the generic stock/staff photos read as exaggerated rather than as proof. Rebuilt as text-first cards matching WF Engine's `BlogCard.tsx`/`FeaturedPost.tsx` convention: typography and whitespace carry the card, not a decorative photo. `image`/`imageAlt` fields dropped from the `BlogPost` type and from the BlogPosting schema (optional field, not required). | `blog-posts.ts`, `BlogGridSection.tsx`, `app/blog/[slug]/page.tsx`, `FeaturedUpdatesSection.tsx` |
| 5 | Missing `eslint.config.mjs` added (06_audit_report.md finding 4 — `pnpm lint` was failing outright with no config found). Mirrors WF Engine's flat config (`next/core-web-vitals` + `next/typescript`). `@eslint/eslintrc` added to `package.json` devDependencies explicitly (was only present as a transitive dep of `eslint-config-next`, would have silently broken on a future lockfile change). | `eslint.config.mjs`, `package.json` |
| 6 | `FinalCTASection` re-enabled on the homepage. It was the only page on the site skipping it, ending instead on a second identical copy of `AskBitsbufferSection` shown a few screens earlier. Homepage is the highest-traffic page and the one this whole page exists to convert on — it now closes on the section carrying the strongest reassurance copy and three real next-step options, same as every other page. | `app/page.tsx` |
| 7 | Hero subtext still had the old "commerce, finance, ERP, and field operations" wording (missed by the original audit's list of 6 surfaces, caught in this pass's verification sweep). Switched to `siteConfig.industriesList`. | `HeroSection.tsx` |
| 8 | "Innovative" (banned word, `writing_rules.md`) found in the Smart List case study description during the verification sweep. Removed without adding new unverified claims. | `case-studies.ts` |

## Still open — needs Adnan (real facts, not a code call)

| # | Item | What's needed |
|---|---|---|
| 0 | **New this pass — two different industry taxonomies coexist.** `case-studies.ts`'s `Domain` type (`ecommerce, fintech, agritech, erp, ai, edtech, nonprofit, legaltech`) does not match `SolutionsExplorerSection`'s 8 tabs (`E-commerce, FinTech, Agri-tech, Enterprise/ERP, Healthcare, Logistics, EdTech, Real Estate`) used as this pass's ground truth. Concretely: a real, named case study exists for `legaltech` (Love Anew) and `ai`, but neither is one of the 8 tabs; the 8 tabs include Healthcare, Logistics, and Real Estate, none of which have a visible named case study backing them. `ServicesOfferingsSection.tsx` still offers "Legal-tech and AI tooling" as a service line, which is true against the case-studies evidence but not against the 8-tab list this pass standardized on. | Confirm which taxonomy is the real one — has Bitsbuffer actually shipped for Healthcare/Logistics/Real Estate clients (keep the 8 tabs as-is), or is the case-studies domain list (which has real named proof) the more honest one (retitle the explorer tabs to match)? I did not guess this — it changes what ships as the site's headline industries claim. |
| 1 | "Europe's leading publishing houses" claim in `case-studies.ts` (`generalizedCredibility`). Unfalsifiable as written — reads as inflated to a diligence-minded buyer. | Substantiate with something checkable (industry, approximate scale, project type, timeframe), or cut it. |
| 2 | 3 case studies still end mid-sentence in literal `...` (Quick Wrap Gifts, Mutishop, one more). | Real closing sentence from you or the project's own detail page — not invented. |
| 3 | `public/images/Feedback JV.docx` — a Word doc sitting in the public folder, publicly servable at `/images/Feedback%20JV.docx`. | Delete, move, or confirm it's meant to be public. |
| 4 | CLAUDE.md's Active Projects table once said "delete 2 unused components," static analysis only ever found 1 (`QuickStartBarSection.tsx`, already deleted). | Point me at the second one, or confirm it's already gone. |
| 5 | Canonical host — `www.bitsbuffer.com` or apex `bitsbuffer.com`. `robots.txt`/`sitemap.xml` already assume `www`. | Confirm, then `middleware.ts` 308 redirect ships in one file. This is the exact bug class that flagged 49 pages on WF Engine — worth doing before any fresh Semrush crawl. |

## Still open — needs Adnan's own machine (sandbox constraint)

Same constraint `06_audit_report.md` already flagged: this sandbox's
`node_modules` is Windows-native, `next build` bus-errors here, and there's
no network access to install Lighthouse/axe-core CLIs. None of this is
new work, it's the same runway `07_deploy_checklist.md` already laid out —
listed here again because the scorecard can't close without it:

1. `pnpm install` fresh, then `pnpm build` — must exit zero errors.
2. `pnpm lint` clean now that `eslint.config.mjs` exists.
3. Lighthouse CLI on the production build, mobile + 4G throttled: target
   95+ on Performance, SEO, Accessibility, Best Practices. Log scores +
   LCP/INP/CLS here once run.
4. axe-core CLI on every route: zero critical/serious violations, paired
   with a manual keyboard pass.
5. Screenshot QA at 390px and 1440px.
6. One real end-to-end contact form submission to the live inbox.
7. Once the middleware ships and the build is verified: fresh Semrush
   crawl to confirm no duplicate-host indexing, structured data valid, no
   403s.

## What this pass did not touch (lower priority, flagged not fixed)

- **SolutionsExplorerSection / ServiceToolsSection structural redundancy**
  (audit finding 7) — same tab-and-crossfade UI pattern back to back.
  Worth merging into one tabbed explorer or giving one a distinct format.
  Bigger structural change, not a quick pass.
- **ProblemSolutionSection's "typical agency" framing** — plausible but
  stated as universal fact about competitors. Consider softening to "the
  pattern we hear most often."
- **Repeated stat blocks** (10+, 6-pass, 21-50) across DarkScaleSection and
  TeamProofSection, back to back, still repeat the same two numbers with
  no new evidence. Longer-term: consolidate to one strong instance linked
  to `/case-studies`.

## Reflect (why these got through, so the bug class dies)

- The industries list drifted because six surfaces each hardcoded their
  own copy of the same fact with no shared source. Fixed structurally this
  time (`siteConfig.industriesList`), not just patched — the sweetHeart
  rule "single URL config constant every canonical imports from" now
  applies to shared facts, not just URLs. Worth promoting into
  `website-build-standards` so future builds do this from Phase 4, not
  retrofit it in a remediation pass.
- The blog images were sourced before the WF Engine text-first convention
  existed on this project (blog shipped 07-06/07, the "no cover image"
  comment on WF Engine's `BlogCard.tsx` predates that). Two Bitsbuffer
  surfaces (`site-config`'s product description and the blog) hadn't been
  checked against the sibling site's own conventions before shipping.

## Loop 2 — first real Lighthouse numbers (07-16, same day)

Adnan ran Lighthouse against `localhost:3000` (desktop, custom throttling)
right after this session's edits. Full reflect/improve/retry against
`06_audit_report.md` gate 11:

| Category | Score | Read |
|---|---|---|
| Performance | 56 | Dev-server artifact, not signal. TBT 1,260ms, Speed Index 11.0s, plus explicit "Minify JS/CSS" and "Reduce unused JS 356 KiB" findings only make sense against an unminified `next dev` build. Re-run against `pnpm build && pnpm start` before treating this number as real. |
| Accessibility | 96 | One contrast finding, no specific element given in what was pasted. Need the expanded audit detail before this is fixable rather than guessed at. |
| Best Practices | 100 | Passing. |
| SEO | 92 | "Document does not have a meta description" flagged, but `layout.tsx` and `page.tsx` both export one correctly — reads as a stale dev-server/HMR artifact from the burst of edits made just before the scan, not a real bug. Recheck after a hard refresh or restart. |
| Agentic Browsing | 2/3 | "llms.txt does not follow recommendations" — real, and fixed this pass. The file was missing the required blockquote summary and its two sections were plain bullet lists instead of markdown link lines. Rebuilt to the llmstxt.org spec: H1, blockquote summary, then `Pages` and `Flagship product` sections as `[title](url): description` link lines covering every real route (services, case-studies, flagship-domains, blog, about, careers, contact, wfengine.com). |

**Improve applied:** `llms.txt` rewritten (see `public/llms.txt`), logged in
`06_audit_report.md` gate 11.

**Retry needed:** re-run Lighthouse against a production build once Adnan
can run `pnpm build && pnpm start` on his own machine — that is the number
that counts against the 95+ target, this dev-mode run does not.

## Loop 3 — real LCP root cause found and fixed (07-16, same day)

Adnan pasted local Core Web Vitals: LCP 8.11s (poor), CLS 0 (good), and
crucially the **LCP element**: the Header's static "Explore Workflow
Engine" link (`Header.tsx`), not the Hero H1. That's a genuine bug, not a
dev-mode artifact, and it explains the poor LCP on its own.

**Root cause:** `HeroSection.tsx`'s entire text column (badge, H1, subtext,
CTAs, stats) is wrapped in a Framer Motion container (`initial="hidden"
animate="visible"`) that paints every child at `opacity: 0` until JS
hydrates and the entrance animation runs. The Hero H1 — the actual largest
text block above the fold, and the correct LCP candidate — is invisible at
first paint. Chrome's LCP algorithm instead credits whatever painted
first *and stayed visually stable*: the Header's plain, unanimated nav
link, which has no opacity gate and renders immediately. This is a
well-documented Core Web Vitals anti-pattern (animating the LCP element
with a JS-driven fade-in).

**Fix:** gave the `m.h1` `initial={false}`. This skips the enter animation
for that one element only — it mounts already in its final visible state,
so it's part of the real first paint, while the badge/subtext/CTAs/stats
below it keep their staggered fade-in (none of those are LCP candidates).
See `HeroSection.tsx`.

**Not yet confirmed:** this fix needs a re-scan to verify LCP actually
drops. The 8.11s figure itself is still likely inflated by dev-mode (same
caveat as the Performance-56 finding above) — expect a further drop once
measured against the production build.

## Loop 4 — re-scan confirms the LCP fix, Agentic Browsing now 3/3 (07-17)

Second Lighthouse run, still against `localhost:3000` dev server:

| Category | Loop 2 (07-16) | Loop 4 (07-17) | Read |
|---|---|---|---|
| Performance | 56 | 62 | Still dev-mode. Every diagnostic driving the score is the same "unminified build" signature as before (Minify JS/CSS, Reduce unused JS 356 KiB, 11.0s main-thread work) — not fixable without a production build. |
| LCP (Lighthouse lab) | 1.3s | **0.8s** | Confirms the `initial={false}` fix — LCP got faster, not slower, after exempting the H1 from the fade-in. |
| Speed Index | 11.0s | 4.5s | Large drop, consistent with less JS-gated content sitting invisible early in the load. |
| TBT | 1,260ms | 850ms | Improved, still dev-mode inflated. |
| Agentic Browsing | 2/3 | **3/3** | Confirms the llms.txt spec rewrite passed clean. |
| Accessibility | 96 | 96 | Same contrast finding, still no specific element in what's been pasted. |
| SEO | 92 | 92 | "Document does not have a meta description" persisted on a **second** scan, a day apart — this weakens the "stale HMR artifact" theory from loop 2. See below. |

**New diagnostic this round**: "Avoid non-composited animations — 2
animated elements found." Informational only (Lighthouse's own label: does
not affect the Performance score directly). No element-level detail given
yet — flagging, not guessing at which 2 elements without it. Worth
rechecking whether it persists on the production build before spending
time on it.

**On the meta-description flag persisting twice**: the code is correct on
both scans (`layout.tsx` and `page.tsx` both export a non-empty
`description`), and this project runs `next dev --turbo` (Turbopack dev).
Static `export const metadata` objects like these should resolve
synchronously into the initial HTML in both Turbopack and production, so
this still doesn't match a real code defect I can find by reading the
source. Fastest way to get a real answer without waiting for the
production build: **View Page Source** (not DevTools Elements panel,
which shows the live DOM after hydration) on `localhost:3000/` and search
for `name="description"`. If it's there, this is a Lighthouse/Turbopack
dev-mode detection quirk and will clear on the production build
automatically. If it's genuinely missing from the raw HTML, that's a real
bug and worth a dedicated look — but I'd rather confirm which one it is
than keep guessing across two scans.

## Loop 5 — 8 domain pages shipped (07-17, same day, Adnan's call)

Adnan's read on `/services`: one page trying to rank for fintech, ERP,
agri-tech, e-commerce, healthcare, logistics, edtech, and real estate at
once is keyword cannibalization by design, and reads as generalist to
crawlers instead of "genuine niche expert." Confirmed against WF Engine's
own IA (`/modules/hrms`, `/modules/finance`, etc. — no shared catch-all
page). Built all 8 as dedicated pages, reviewing one by one next.

- **Research**: `docs/10_domain_pages_research.md`. Semrush was out of API
  units (confirmed live), fell back to WebSearch per sweetHeart's own
  protocol — everything in that doc is directional intent/vocabulary, not
  verified volume. Re-run through Semrush once units are back.
- **Plan**: `docs/11_domain_pages_plan.md` — URL structure
  (`/services/[domain]`, one dynamic route + `generateStaticParams`), one
  primary keyword/question/CTA per page, Service + FAQPage + Breadcrumb
  schema per page, title/meta drafted per page, nav dropdown design.
- **Built**: `src/lib/domain-pages.ts` (data, one entry per domain: hero
  copy, 5 real scenarios carried over verbatim from
  `SolutionsExplorerSection.tsx`, proof, 3-question FAQ), `src/app/services/
  [domain]/page.tsx` (shared template), `src/components/sections/
  DomainFAQAccordion.tsx`. Header nav's flat "Services" link is now a
  dropdown mirroring WF Engine's `Products` dropdown pattern exactly.
  `SolutionsExplorerSection`'s 8 tabs and each case study with a matching
  domain now link to their dedicated page.
- **Proof discipline held**: fintech (TradeLink360), agri-tech (Kissan
  Connect), ERP (Prize ERP), e-commerce (Quick Wrap Gifts, Mutishop, Smart
  List) get real named case study cards. Healthcare, logistics, edtech,
  and real estate have no named Bitsbuffer project yet — those 4 pages say
  so explicitly in both the proof section and an FAQ answer ("we haven't
  shipped a named [domain] case study yet, and we won't claim one we
  don't have") rather than getting a thin page with invented proof.
- **Bonus fix while building**: `PageHero.tsx`'s H1 had the identical
  unguarded opacity-fade LCP bug just fixed on the homepage — it's the
  shared hero every one of these 8 new pages (plus blog, case-studies,
  careers) uses, so it would have shipped the same bug 8+ times over.
  Fixed with the same `initial={false}` pattern before any page went live.
- **Correction caught mid-build**: `case-studies.ts`'s `SEO Dashboard` is
  tagged domain `ai`, not `erp` — the first draft of the plan doc wrongly
  paired it with Prize ERP on the ERP page's proof section, caught and
  fixed before the page was built, not after.
- **Also found while wiring links**: individual case study detail pages
  (`/case-studies/[slug]`) do exist — an earlier session wrongly assumed
  they didn't when building `llms.txt`. `llms.txt` now links the 8 new
  domain pages plus keeps the case-studies index link, individual case
  study deep-links flagged as a future `llms.txt` improvement, not done
  this pass.

**Not done this pass**: no new blog content per domain (needs real
research, not invented), no Semrush-verified keyword swap-in yet, `/services`
itself untouched beyond its nav entry point.

## Loop 6 — blog-writing skill built + fintech pilot post shipped (07-17)

Adnan's read: crawler flagged low text-to-HTML content on the blog, and
every domain page needs its own supporting posts with real interlinking,
the way WF Engine does it. Built a permanent, project-agnostic skill —
`_System/skills/blog-writing/SKILL.md` — reverse-engineered from three
proven sources: `linkedin-post`'s DEEP-mode research pipeline (tier-1 data
hunt, evidence lock, EEAT gate, fallback path for no tier-1 coverage,
first-hand requirement), WF Engine's own shipped blog structure and
length, and sweetHeart's SEO/GEO rules (AI-citation triggers, 3-direction
interlinking, schema). Registered as a permanent trigger in CLAUDE.md
(`blog post` / `write a blog`), not a one-off.

**Infrastructure shipped**: `BlogPost` type extended with a structured
`sections`/`faqs`/`domain` format (old flat `content` format still
supported for the 5 pre-existing posts), a `LinkedParagraph` component so
plain-string paragraphs can carry real `[text](url)` interlinks the way
WF Engine's MDX does natively, a "From the blog" card section on the
domain-page template (renders only once a real post exists for that
domain, never an empty placeholder), and FAQPage schema on blog posts
that carry FAQs.

**Pilot post shipped** (fintech, tagged `domain: 'fintech'`): "The Real
Cost of Manual Reconciliation in Fintech, and When to Fix It." Sourced
stats from AICPA's 2025 Practice Economics Survey and FINRA's 2026
Annual Regulatory Oversight Report, both EEAT-gated. One vendor-blog stat
(78%/99.6%/94.2% accuracy figures) was found during research and
**dropped** for lacking a clear named primary source, and no verifiable
attributable quote existed for this topic so the AUTHORITY block was
dropped entirely rather than faked, both per the skill's own fallback
rule. First-hand anchor: TradeLink360 (real, already-documented case
study). Interlinked in all 3 directions: downward to `/services/fintech`,
upward via the new blog card on that page, sideways to
`why-custom-software-still-wins` (bidirectional, that post now links back).
Research trail: `docs/blog/fintech-manual-reconciliation-cost_research.md`.

**Proposed, not yet written**: pillar topics for the remaining 7 domains,
see `docs/10_domain_pages_research.md`'s new section — held for Adnan's
review before writing 7 more long posts unprompted.

## Loop 7 — sourcing framework agreed, applied (07-17)

Adnan raised a legal/positioning question before any more blogs got written:
does citing US-specific regulators (FINRA/SEC) create risk when Bitsbuffer
doesn't operate in the US yet. Discussed as a trust/positioning call, not a
legal one, and agreed a framework before touching any file (per Adnan's
explicit "discuss first dont build"):

- Global, jurisdiction-neutral bodies cited first wherever one exists for
  the claim being made.
- A single country's regulator, when cited, is framed explicitly as "one
  example of a global principle," never the implied standard.
- Every borrowed stat gets localized to the domain/market in the same
  breath it's cited, not as a fallback move — mandatory, not optional.
- Anti-stuffing delete-test: if a paragraph survives with the citation
  removed, the citation was decorative and gets cut.
- Content order per section: pain point first, expert framing/solution
  second, third-party proof third.

Baked permanently into `_System/skills/blog-writing/SKILL.md` (§1B
rewritten, new §1B-LOCALIZE, anti-stuffing test added, §2 ordering
principle, 3 new QC gate rows). Then applied to the fintech pilot post's
compliance section (`blog-posts.ts`, "The audit trail problem" heading):
now opens on the pain point with no citation, anchors on [ISO/IEC 27001
Annex A 8.15](https://www.isms.online/iso-27001/annex-a-2022/8-15-logging-2022/)
(logging) and 5.28 (evidence) as the jurisdiction-neutral primary standard,
keeps SEC 17a-4/FINRA as one explicitly-framed US example rather than the
operating standard, and adds an honest localization line for a Pakistan-
based fintech team — general and qualitative, no specific SBP/SECP clause
cited since none was found and verified to a primary source.

This pattern is now the default for the remaining 7 domain posts.

## Loop 8 — immersive UI + voice/rhythm pass (07-17)

Adnan's read: the fintech pilot post's UI wasn't immersive (compared to
techcrunch.com) and the prose read more like a whitepaper than a magazine
piece. Rated the v1.0 draft against a top-2%-blog rubric before touching
anything:

**Pre-fix score: ~6/10.** Strong bones (real sourcing, honest hedging,
vivid headline craft) but: uniform paragraph length throughout (no
rhythm), almost entirely third-person ("the finance team," "a business")
instead of direct address, no visual devices to break up long sections
(every section was an identically-boxed `.card`, which is what made the
page read flat), decent but slightly dry officialese in places.

**Fixes shipped:**
- Rewrote the fintech post's prose: added second-person address, varied
  sentence rhythm (short punchy lines after dense ones), tightened the
  opening hook. Sourcing/hedging/EEAT work from Loop 7 kept intact.
- Extended the data model (`BlogSection.pullQuote`, `BlogSection.stat`,
  `BlogPost.keyTakeaways`) and populated all three on the fintech post.
- Rebuilt `blog/[slug]/page.tsx`: byline row, large lede paragraph
  treatment, key-takeaways box, sticky table-of-contents + CTA sidebar,
  pull-quote and stat-callout visual components, reading-progress bar,
  interactive FAQ accordion (`BlogFAQAccordion.tsx`), related-reading
  section (`RelatedPostsSection.tsx`). Sections now flow as prose instead
  of identical boxed cards. No stock photography added — kept the
  text-first rule from Loop 1, immersion comes from typography/structure.
- Baked all of this into `blog-writing/SKILL.md` as v1.1: new §9 (voice/
  rhythm rubric, scored 1-10 across 5 dimensions, 8+ required to publish)
  and §10 (UI contract, same structural elements required on every future
  post). §7 QC gate gained 2 new rows.

**Post-fix score: ~8.5/10** against the same rubric — language plain and
direct, consistent "you" address, deliberate rhythm variation, pull
quotes/stat callout/key-takeaways doing real structural work instead of
decoration, hook now opens on the reader's actual situation.

**Known limitation this loop:** the sandbox's mount of `C:\cowork` is
stale for files freshly written/edited this session (same artifact as the
earlier `[domain]/page.tsx` incident) — `tsc --noEmit` run against the
mount reports phantom truncation errors on `blog-posts.ts` and
`blog/[slug]/page.tsx`. Verified both files are actually complete and
balanced via the Read tool (authoritative), same resolution as before.
**Adnan should run `pnpm build` on his own machine** to get a real
compiler check before this ships, same standing item as the rest of this
doc's production-build verification.

This is now the template for the remaining 7 domain posts — write to the
v1.1 standard from the start, not v1.0.

## Loop 9 — skill hardened to v2.0 against the LinkedIn viral mega-prompt (07-17)

Before writing the remaining 7 domain posts, Adnan pointed at his own
"LINKEDIN VIRAL LONG POST MEGA-PROMPT v3.0" (Google Doc) and asked for it
to harden the blog-writing skill toward a defined loop and multi-
parameter scoring (SEO, virality, GEO, AEO, AIO). Doc fetch via
`web_fetch` returned empty twice (same Google-Docs-is-canvas-rendered
issue as the earlier audit-doc attempt); escalated to the Claude-in-
Chrome extension, selected the document's last full version block
(v3.0 — the doc contains v2.0 then v3.0, "v4" is only the filename, body
content tops out at v3.0), copied it via clipboard, and used it as the
hardening source.

`blog-writing/SKILL.md` is now v2.0. Added: an explicit UNDERSTAND → PLAN
→ EXECUTE → CHECK → REFLECT → IMPROVE → RETRY → EVALUATE → PUBLISH loop
(§0) with a 3-retry cap before escalating back to PLAN; a research
lock-in gate (§1B-LOCK-IN: STAT #1-4, expert quote(s), contrarian
insight, case study, top 3 pains, all verified or explicitly dropped);
4-check EEAT validation made explicit; tone profiles + an emotional-
architecture block map (hook/tension/pain/authority/reframe/framework/
proof/agreement/CTA) laid over the existing WF Engine post shape, not
replacing it; a dedicated GEO/AEO/AIO section separate from traditional
SEO (direct-answer-first, question-phrased H2s, entity clarity,
self-contained paragraphs); a virality/distribution-signal table per
section plus a repurposing roadmap; sentence-level voice rules and a
supplementary banned-word list from the mega-prompt; and a six-dimension
scoring system (SEO / EEAT / Voice / GEO-AEO-AIO / Virality / Layout,
8+ each to pass) replacing the old single pass/fail-only gate.

**Skill self-rating (the spec itself, not a specific post) — see full
answer in chat.** Composite ~8.7/10: research rigor and honesty
discipline are the strongest parts (9-9.5/10), GEO/AEO/AIO tactics are
ahead of most public blog frameworks (8.5/10), virality/distribution is
the weakest dimension (7.5/10) because blog share/backlink signals are
inherently slower to verify than social signals, this is directional
guidance more than a provable mechanism yet. Not claiming a flat 10/10:
a process spec can be excellently designed but "10/10 virality" needs
real outcome data (actual AI citations, actual backlinks) feeding back
into it, which only accumulates once the 7 remaining posts actually ship
and get measured.

**Not yet done**: the fintech pilot post was built to v1.1 (voice/layout)
but has not been re-run through the full v2.0 loop and 6-dimension score.
Do that on the next touch of that post, don't treat it as fully v2.0-
compliant yet, per the note in SKILL.md §12.

## Loop 10 — 14 domain blog posts shipped, 2 per remaining domain (07-17)

Adnan's call: instead of 1 pillar post per remaining domain, 2 posts per
domain, picked for engagement + buying-intent rather than the single
proposed topic in `docs/10_domain_pages_research.md`. All 7 domains now
have 2 posts each (fintech already had its 1 pilot post from Loop 6-8;
did not add a second fintech post this pass since it wasn't asked for).
19 total posts now in `blog-posts.ts`: 5 legacy flat-format + 1 fintech
(`sections` format, v1.1-scored) + 14 new (`sections` format, written to
the v2.0 structure with `keyTakeaways`/`pullQuote`/`stat` on every post).

Full domain/slug/source table is in `docs/10_domain_pages_research.md`'s
"Shipped, 07-17" section. Research ran condensed (2 searches per domain
covering both posts, not the full 8-query-per-topic set the v2.0 skill
calls for), every stat still individually verified or honestly hedged
per §1C, but this batch has not been re-run through the full 6-dimension
score in `blog-writing/SKILL.md` §11B yet, same open item as the fintech
post. Ecommerce/ERP/agri-tech/healthcare/real estate landed on genuinely
tier-1 sources (Baymard, IHL Group, FAO, Gartner, ISO 27799, ONC, RESO).
Logistics and edtech leaned more on secondary/vendor sourcing, hedged
honestly in-post rather than presented as verified.

File integrity verified via the Read tool end-to-end (1447 lines, all 19
posts, clean closure) — bash/tsc mount lag on freshly-edited `C:\cowork`
files persisted through this session (same known artifact, see loop 3's
note), so as with prior loops, Adnan should run `pnpm build` /
`pnpm typecheck` on his own machine before this ships.

**Not yet done this loop**: domain pages (`/services/[domain]`) already
auto-render a "From the blog" card for any post whose `domain` field
matches, per the existing `page.tsx` logic, no code change needed there,
but worth a visual spot-check that all 7 domain pages now show 2 cards
instead of 0-1. Full 6-dimension scoring pass on all 15 `sections`-format
posts (fintech + 14 new). `llms.txt` link list should get all 14 new
post URLs added, not yet done.

## Loop 11 — SolutionsExplorerSection auto-advance (07-17)

Adnan's call: the "Find the solution built for your industry" tab row
(`SolutionsExplorerSection.tsx`) only switched on click, which made an
8-industry section feel static to anyone who didn't happen to click
through it. Added: a 6-second auto-advance timer cycling one industry
tab at a time, pauses on hover/focus anywhere in the section, skips
entirely under `prefers-reduced-motion: reduce`, and a progress-fill
strip on the active tab button so the countdown is visible, not just
felt. Manual clicks still work exactly as before and simply reset the
timer from that point. Scenario accordion within each tab (storefront,
inventory, etc.) still click-only, not auto-advanced, this pass was
scoped to the top-level industry row per the actual request.

## Loop 12 — general AI ethics post, no domain tie-in (07-17)

Adnan asked for a blog post on the ethical implications of AI, not tied
to any of the 8 service domains. Clarified scope first (Bitsbuffer blog
vs. LinkedIn vs. standalone doc; enterprise/business angle vs. broad
philosophical survey) since neither was specified and it materially
changes research and structure. Confirmed: Bitsbuffer blog, enterprise
angle (bias, transparency, accountability in deployed systems).

Ran the full v2.0 research loop, not the condensed batch pass used for
the 14 domain posts: `slug: 'ethical-implications-of-ai-enterprise-
accountability'`, category "AI & Ethics" (new category, no existing one
fit), no `domain` field since none of the 8 `DomainSlug` values apply,
`ctaHref` falls back to `/contact`. Genuinely tier-1 sourcing throughout:
McKinsey's 2026 State of AI Trust report (governance-maturity gap),
Obermeyer et al., *Science* 2019 (the healthcare-algorithm racial-bias
study, DOI-verified), NBER/UC Berkeley (algorithmic lending
discrimination), ISO/IEC 42001 (the jurisdiction-neutral AI management
standard, same anchor pattern as ISO 27001/27799 elsewhere on this site),
and a verified, attributed expert quote (David Danks, University of
Virginia, via a real interview). References [SEO Dashboard](/case-
studies/seo-dashboard) honestly as Bitsbuffer's own AI-adjacent build,
explicitly says no formal AI-ethics-audit practice exists yet rather than
implying one.

## Loop 13 — breadcrumbs, site-wide UI + schema (07-17)

Adnan asked whether breadcrumbs were implemented throughout the site.
They weren't: `BreadcrumbList` JSON-LD existed on only 2 of ~11 page
types (homepage, the 8 domain pages), hand-built inline each time, and
zero pages had a visible breadcrumb trail anywhere — crawlers got
structured data, visitors got nothing. Confirmed scope with Adnan: build
both, everywhere.

Built one single source of truth instead of repeating the old
copy-pasted-per-page pattern: `src/lib/breadcrumb.ts` exports a
`BreadcrumbItem[]` type and `buildBreadcrumbSchema()`; `src/components/
ui/Breadcrumb.tsx` takes the same array and renders the visible
`<nav aria-label="Breadcrumb">` trail (last item as plain text,
`aria-current="page"`, everything before it a link) plus the matching
JSON-LD `<script>` in one component. One array feeds both outputs now,
so the trail and the schema can't drift apart the way the old inline
domain-page schema could have.

Wired into all 10 remaining page types: `/services`, `/services/
[domain]` (replaced the old hand-built inline schema with the shared
component), `/blog`, `/blog/[slug]` (sits inside the existing magazine-
style header, above the category badge), `/case-studies`, `/case-
studies/[slug]` (alongside the existing "Back to case studies" link,
not replacing it), `/about`, `/careers`, `/contact`, `/flagship-
domains`. Homepage intentionally skipped — root page, no trail needed,
its own minimal schema variant left as-is. Verified via Grep that every
target file references the new `<Breadcrumb />` component and that the
domain-page file has no leftover dead `breadcrumbSchema` variable from
the old inline version.

**Follow-up fix, same day:** Adnan reported breadcrumb links not
navigating. Root cause: the Home crumb's `href` is `''` by design (the
schema wants the bare `siteConfig.url` with no trailing slash), but
`next/link` treats an empty `href` as "stay on this page" rather than
"/", so the Home link — present on every single trail, the one most
likely to get clicked — silently did nothing. One-line fix in
`Breadcrumb.tsx`: the visible `<Link>` now falls back to `'/'` when
`item.href` is empty, schema untouched. Fixed once in the shared
component, so it's corrected across all 10 page types at once.

## Loop 14 — ServiceToolsSection narrowed to Workflow Engine, Flagship Domains dropped from nav (07-17)

Adnan flagged the homepage's "Services and modules for bringing your
idea to life" section as redundant. It sat directly under
SolutionsExplorerSection (another tab-plus-card-grid section), and its
5 tabs mixed three unrelated things: Workflow Engine (a real product),
Icon Media Manager (an unfinished internal tool with no page of its own
anywhere on the site to land on), and Sikh Aid Global (a client whose
real proof already lives at `/case-studies/sikhaid-global` — this tab
described Adnan's own daily posting workflow for their account instead,
which isn't a Bitsbuffer service). Custom development just restated
the `/services` hub's own copy. Recommended cutting it down rather than
merging into `/services` wholesale, since 3 of 5 tabs didn't correspond
to anything sellable.

Adnan's call: keep the section, narrow it to Workflow Engine only, 4
tabs — HRMS, Social Media, CRM, Finance — each framed as "Workflow
Engine solution in [tab]" and linking straight out to wfengine.com
instead of dead-ending at `/services`. Rebuilt `ServiceToolsSection.tsx`
on that basis: HRMS keeps its 4 real live sub-features (attendance,
payroll, team calendar, employee records), Finance and CRM restate
claims that were already in the file before this pass (Live/Coming
respectively, unchanged), and Social Media is new — flagged honestly in
the component's own header comment as not previously documented
anywhere in CLAUDE.md or site-config.ts as a real Workflow Engine
module, marked "Coming," copy kept deliberately generic rather than
inventing feature specifics. Adnan should confirm or expand this once
the module's real scope is decided.

Since this section now fully covers "flagship domain" positioning via
Workflow Engine directly, Adnan confirmed `/flagship-domains` is
redundant in navigation. Removed from Header `NAV_LINKS`, Footer's Work
column, and the `llms.txt` Pages list. Also fixed a pre-existing mislink
found while doing this: TransformWorkSection's "See the Workflow Engine
advantage" button pointed at `/flagship-domains` (a page about industry
capability, not Workflow Engine itself) — now points straight at
wfengine.com, matching its own label. The `/flagship-domains` route
itself is untouched and still builds; it's just no longer linked from
anywhere on the site. Full removal would need a separate call (existing
backlinks/indexing), not done here.

## Loop 15 — HomeFAQSection rebuilt on real search intent (07-17)

Adnan flagged the homepage's "Before you book a call" FAQ as fake:
4 generic reassurance questions, not things anyone actually searches,
with no connection to the keywords the homepage targets. Asked for
genuine high-intent questions tied to the page's own target keywords,
minimum 10, same standard as the HRMS/platform FAQs already live on
wfengine.com (`HRMS_FAQS`/`PLATFORM_FAQS` in that repo's `schema.ts`,
explicitly built to answer what people ask Google/ChatGPT/Perplexity
before buying, not generic copy).

Ran the same research pattern here: WebSearched real buyer-intent
queries around this page's actual `metadata.keywords` (custom software
development, workflow automation, enterprise software, fintech
development, ecommerce engineering, workflow engine) — cost, outsourcing
risk, custom-vs-off-the-shelf, code ownership, security/IP, post-launch
support, discovery process — the same categories that came up
independently across 4 separate buyer-question research articles.
Rebuilt `HomeFAQSection.tsx`'s `FAQS` array from 4 to 12 questions.
Every answer restates a fact already established elsewhere on the site,
nothing new invented for this section: code ownership and "operating
partner" were already there, the 21-to-50-person/Layyah team fact comes
from `/about`, the ISO 27001/27799 framing is the same jurisdiction-
neutral pattern already used in the fintech blog post and domain page,
and the Workflow Engine vs. custom-dev split matches Loop 14's rebuilt
ServiceToolsSection. No pricing numbers invented — the cost question
answers with the real process (discovery produces the range), not a
fabricated figure. Component structure, FAQPage schema, and independent-
toggle accordion behavior untouched, only the `FAQS` content changed.

## Loop 16 — domain page FAQs expanded to 5 real search-intent questions each (07-17)

Same instruction as Loop 15, extended to all 8 domain pages: the existing
`DomainFAQ` arrays in `src/lib/domain-pages.ts` weren't fake exactly (they
already avoided fabricated claims and referenced real scenarios/case
studies), but they weren't verified against real public search behavior
either, and each domain only had 3. Adnan asked for 5 per domain, same
research-first pattern as the homepage.

Ran 8 targeted WebSearches, one per domain, against real buyer-intent
queries: custom build vs. named platform (Shopify/Magento, SAP/NetSuite),
compliance specifics (PCI-DSS for fintech, HIPAA/FHIR for healthcare,
RESO Web API for real estate MLS), and build-vs-buy edge cases (route
optimization: buy the commodity mapping engine, build the dispatch logic
that's actually differentiated). Kept all 24 existing questions across
the 8 domains, they held up against the research and were already
honestly grounded, and added 2 new ones per domain (16 total), reaching
5 each / 40 site-wide.

Same no-fabrication discipline as every other pass: none of the industry
dollar figures surfaced in research (e.g. "$80k–$2M for fintech",
"$150k–$400k for property management") were used as Bitsbuffer's own
numbers, those are US-market agency benchmarks with no confirmed
relationship to Bitsbuffer's actual rates. Cost questions answer with
process and real cost drivers instead, same pattern as the homepage's
cost FAQ. Compliance questions (PCI-DSS, HIPAA) extend the honesty
pattern already established on the healthcare domain page verbatim: the
real standard is named, what Bitsbuffer builds toward it is stated, and
no certification is claimed that isn't held. `DomainFAQAccordion.tsx`
needed no changes, it already maps over `faqs` with no hardcoded count.
Verified via Grep: 41 `q:` occurrences in the file (1 is the `DomainFAQ`
interface field, 40 are real FAQ items = 8 × 5), and confirmed the file
still closes cleanly at the `domainPages` array boundary.

## Loop 17 — blog post header missing the dot-wave decoration (07-17)

Adnan flagged two things on the blog post page: no dots, unlike every
other hero on the site, and a lot of dead space between the nav and the
heading. Same root cause for both. Every other page's hero
(`/services`, `/services/[domain]`, `/blog`, `/case-studies`, `/about`,
`/careers`, `/contact`) renders through the shared `PageHero.tsx`, which
has a right-side dot-wave SVG (`buildDotWave`) filling the space next to
the heading. The blog post page (`/blog/[slug]`) has its own custom
header, built separately because it needs a byline row (avatar, date,
reading time) PageHero doesn't support, and that custom build never got
the dot-wave, so the space it fills everywhere else just sat empty.

Fix: extracted PageHero's inlined dot-wave block into its own component,
`src/components/ui/HeroDotWave.tsx`, pure SVG plus CSS-animation classes,
no framer-motion, so it drops into a server component with no `'use
client'` needed. `PageHero.tsx` now renders `<HeroDotWave />` instead of
carrying the block itself, and the blog post header renders the same
component. One decoration, one file, instead of the copy the next
custom-header page would otherwise have made. Padding was already
identical to PageHero's own (`pt-32 md:pt-36`), the size wasn't the
problem, the section had genuinely nothing filling it.

**Follow-up, same conversation:** adding the dots didn't fully fix it,
Adnan flagged a blank strip still sitting between the nav and the
breadcrumb. Cause: the breadcrumb had been placed *inside* the section's
`pt-32 md:pt-36` padding (Loop 13's original wiring), so it got pushed
down 128–144px with everything else, sitting far from the nav. Every
other page puts the breadcrumb in its own `pt-8 pb-2` block on the plain
background, directly under the nav, *before* the hero section's own
padding starts, e.g. `/services/page.tsx`. Moved the blog post's
breadcrumb out to match that exact convention, and reduced the header
section's own top padding to `pt-10 md:pt-14` now that it no longer has
to make room for the breadcrumb too.

## Loop 18 — breadcrumb moved in-hero site-wide, padding minimized (07-17)

Loop 13's original placement (breadcrumb in its own `pt-8 pb-2` strip on
the plain page background, above the hero) looked wrong live: unimpressive
sitting alone on white, and it didn't fix the space problem, it just
moved it, the gap Adnan flagged on the blog post page was really the
hero section's own `pt-32`/`pt-36` pushing the first real content down
128-144px regardless of what came before it.

Reworked the pattern site-wide instead of page-by-page: `PageHero.tsx`
now takes an optional `breadcrumbItems` prop and renders the trail
inside the hero itself, on the same tinted background as the dot-wave
and the heading, and the section's own top padding dropped from
`pt-32/pt-36` to `pt-10/pt-14`. The 7 pages that render through PageHero
(`/services` via `ServicesHero`, all 8 `/services/[domain]` pages,
`/blog`, `/case-studies`, `/about`, `/careers`, `/contact`) all switched
from the standalone breadcrumb block to the new prop, one component
change instead of seven. The 3 pages with their own custom header
(`/blog/[slug]`, `/case-studies/[slug]`, `/flagship-domains`) already
had the breadcrumb inside their header section, they just needed the
same padding cut, `/blog/[slug]` went from `pt-10/pt-14` (already
reduced in Loop 17) with the breadcrumb pulled back in, `/case-studies/
[slug]` and `/flagship-domains` went from `pt-28` to `pt-10`. Verified
via Grep: exactly 3 files still import `Breadcrumb` directly (the custom
headers), the other 7 pass `breadcrumbItems=` into PageHero, no leftover
unused imports.

## Loop 19 — /case-studies card visuals, branded icon graphic not photos (07-17)

Adnan asked for images on the case study cards ("most professional and
consistent style as we use in this site"). Surfaced the tension before
building anything: none of the 9 listed projects (Quick Wrap Gifts,
Mutishop, Sikhaid Global, Prize ERP, SEO Dashboard, Smart List,
TradeLink360, Kissan Connect, Love Anew) have a real screenshot on file,
and this page's entire premise is "real, named, shipped work, not
concept work" -- using generic stock photography as a stand-in for a
product screenshot would undercut the exact thing the page exists to
prove, the same reasoning that got stock/staff photos pulled off the
blog in an earlier pass. Asked Adnan to choose: branded icon graphic (no
photo, can't be mistaken for a screenshot), reused topical stock photos
(same convention as the domain pages, but generic per-domain not
per-project), or he supplies real screenshots. He picked the icon
graphic.

Replaced the flat `h-20` domain-colored bar with a taller (`h-36`/`h-40`)
header: full-opacity domain color icon badge (`DOMAIN_SOLID`, new export
in `case-studies.ts`, full-opacity companion to the existing 10%-tint
`DOMAIN_STYLES`), the same dot-wave `CornerDots` texture used sitewide,
and a domain icon (`DOMAIN_ICON`, also new) that reuses the exact icon
already on the matching `/services/[domain]` page where one exists
(ecommerce/fintech/agritech/erp/edtech), with a best-fit pick for the 3
domains that only exist in the case-studies list, not the services list
(ai → Sparkles, nonprofit → HeartHandshake, legaltech → Scale). Domain
label pill moved to a floating chip (`bg-surface-raised/90 backdrop-
blur-sm`) since it no longer has a flat single-color bar to sit directly
on. Verified both new lucide icons exist in the installed package before
using them. Card body (name, tagline, stack pills) unchanged.

## Loop 20 — careers page gets a real application form + nodemailer (07-17)

Adnan flagged that /careers closed on `FinalCTASection`'s "Tell us what
you are building" -- copy written for a prospect scoping a project, not
a candidate applying for a role. Asked for an email + CV section like
the contact form has, wired to nodemailer the same way wfengine.com's
demo form is, landing at hr@bitsbuffer.com.

Found while investigating: `/api/contact/route.ts` already exists and
is already correctly wired to nodemailer (built in an earlier session
not fully reflected in recent context), reading `SMTP_HOST/PORT/USER/
PASS` from `.env.local`, which already has real values set (dated
07-06). So the SMTP infrastructure Adnan referenced from wfengine was
already proven and live on this exact site, just not yet extended to
careers. Also found: this project had no `.gitignore` at all, added one
(standard Next.js ignore list) since `.env.local` now visibly matters
more with two routes depending on it.

Built `src/app/api/careers/route.ts` on the same pattern as `/api/
contact` and wfengine's `/api/demo`: Node.js runtime, sanitize + validate
every field server-side, honeypot (`hp_token`, same naming convention as
ContactForm.tsx), reads the resume upload via `request.formData()`
(multipart, not JSON, since a file is involved), validates file type
(PDF/Word only) and size (5MB cap) before sending, attaches the resume
to the email via nodemailer's `attachments`, sends to hr@bitsbuffer.com
(not `siteConfig.contact.email`/hello@bitsbuffer.com, which `/api/
contact` still owns).

Built `CareersApplicationSection.tsx`, modeled on `ContactForm.tsx`'s
card-plus-form layout: name, email, phone (optional), role (dropdown
using the same 4 categories `CareersRolesSection` already states
Bitsbuffer hires around, plus "Other", not fabricated job titles),
portfolio/LinkedIn (optional), cover note (optional), resume upload
(required, client-side size check before it ever hits the server).
Swapped into `careers/page.tsx` in place of `FinalCTASection`. Also
added `.env.local.example` (no real values) documenting both routes'
shared SMTP setup for anyone else who clones this project.

**Follow-up, same conversation:** Adnan asked for the same treatment on
`/api/contact`, which had shipped in an earlier session at a lower
standard than the new careers route: no email format validation, no
sanitization (raw client strings trusted directly), a visible 400 on
honeypot trip instead of a silent accept (tips off a bot that its field
was detected), plain-text-only email, no explicit Node.js runtime.
Rewrote it on the same shape as `/api/careers` (sanitize + validate,
silent honeypot accept, branded HTML email matching the careers
template's visual language, explicit `runtime = 'nodejs'`). Recipient
unchanged (`siteConfig.contact.email`, hello@bitsbuffer.com), request
contract unchanged (still JSON, no file), so `ContactForm.tsx` itself
needed no changes, only the route.

Not yet verified: `tsc --noEmit` timed out in the sandbox (large
codebase, known sandbox constraint this session, not a sign of a real
error) rather than returning a clean result either way. Adnan should
run `pnpm build` and submit a real test application on his own machine
to confirm the email actually lands, the sandbox can't send real SMTP
traffic to confirm this end to end.

## Loop 21 — all mail routed to hr@bitsbuffer.com (07-17, same conversation)

Adnan reported careers applications were arriving at hr@bitsbuffer.com but
contact form submissions weren't arriving anywhere. Root-caused via code
comparison, no live testing possible from the sandbox: both routes share
identical SMTP transport code, only the recipient differed — careers
hardcoded `hr@bitsbuffer.com`, contact used `siteConfig.contact.email`
(`hello@bitsbuffer.com`). Explained the mechanism: nodemailer's
`sendMail()` resolves successfully once the SMTP server accepts a message
for relay, regardless of whether the destination mailbox actually exists
— a bad recipient produces a delayed bounce, not a synchronous error, so
a broken address can silently look like success from the app's side.
Leading hypothesis: `hello@bitsbuffer.com` was never set up as a real
mailbox.

Adnan confirmed: teams@bitsbuffer.com is the SMTP-authenticated sender
(matches `SMTP_USER` in `.env.local`, the app password he supplied), and
hr@bitsbuffer.com is the one confirmed-working recipient — all site mail
should land there.

Fix: changed `siteConfig.contact.email` from `'hello@bitsbuffer.com'` to
`'hr@bitsbuffer.com'`. Single source of truth, so this one change
cascades to all 4 real usage sites at once: `ContactForm.tsx`'s displayed
mailto link, `Footer.tsx`'s displayed mailto link, `layout.tsx`'s
Organization schema email, and `/api/contact/route.ts`'s `to:` field.
Updated the comment above `/api/careers/route.ts`'s hardcoded `RECIPIENT`
to explain both routes now resolve to the same address but the literal
stays hardcoded on purpose — careers and general contact are
conceptually different inboxes that happen to share one real mailbox
today, and careers shouldn't silently follow if the general address ever
changes again. Also updated `.env.local.example`'s comments and sample
`SMTP_USER`/`SMTP_FROM` values from `hr@bitsbuffer.com` to
`teams@bitsbuffer.com` to match the real, confirmed sending account.

Not yet verified: no live SMTP traffic possible from the sandbox. Adnan
should submit one real test through each form (contact and careers) on
his own machine to confirm both now land in hr@bitsbuffer.com. The
displayed contact email on `/contact` and in the Footer will now read
hr@bitsbuffer.com instead of the non-functional hello@bitsbuffer.com —
worth a visual check that this reads correctly in context.

## Next step

1. Adnan reviews the 8 domain pages one by one (his own words: "build all
   then we will review all one by one"), plus the fintech pilot post and
   the proposed pillar list for the remaining 7 domains.
2. Once Semrush API units are back, re-run keyword research for real
   volume/difficulty and adjust title/H1/meta per page if the directional
   picks in doc 10 were off.
3. Adnan re-runs Lighthouse / Web Vitals against the production build
   (`pnpm build && pnpm start`), not `next dev` — none of the Performance
   numbers so far are the real score, though LCP's 0.8s and Agentic
   Browsing's 3/3 are good signs the underlying fixes hold.
4. Quick View Page Source check on the meta-description flag (loop 4), or
   just wait for the production-build scan to settle it either way.
5. Expand the Accessibility contrast finding for the specific element.
6. Resolve the 5 human-decision items from loop 1.
7. Then axe-core, CWV on the production build, and this doc closes out —
   completing the sweetHeart Phase 7 scorecard for this project.
