# 08 — Content & Positioning Audit

Section-by-section audit of the homepage (and where relevant, /services,
since several sections and claims are shared), benchmarked against
enterprise B2B leaders (Microsoft Azure's product marketing pattern,
Systems Limited's positioning as a Pakistani systems integrator) and
scored against sweetHeart's own rules: every claim must be true against
the actual product, no geography-exclusive framing without cause, fact
consistency across every surface, one primary message per section.

This is not the code audit (`06_audit_report.md`). This is copy, claims,
and structure. Read in full before making changes — several findings
below connect to each other.

## Direct answer to the question asked

**Yes to both.** There is one outright unverifiable claim, one factual
self-contradiction live on the homepage right now, and a real pattern of
repeating the same four numbers across five different sections instead of
proving them once and moving on. None of it is dishonest in the
"invented a feature" sense sweetHeart guards hardest against, but several
things read as inflated the way marketing copy inflates when nobody
re-reads the whole page in one sitting.

---

## Cross-cutting findings (read these first, they explain several section verdicts below)

### 1. Industries served: five different answers on five different surfaces — **critical**

| Surface | What it says |
|---|---|
| `site-config.ts` (`siteConfig.description`) | "e-commerce, fintech, ERP, and legal-tech" |
| `page.tsx` (Hero metadata + WebPage schema) | "commerce, finance, ERP, and field operations" |
| `HomeFAQSection` | "commerce, fintech, ERP, and beyond" |
| `services/page.tsx` metadata | "commerce, fintech, ERP, and field operations" |
| `public/llms.txt` | "e-commerce, fintech, ERP, agri-tech, legal-tech, and AI tooling" |
| `SolutionsExplorerSection` (the actual tabs a visitor clicks) | E-commerce, FinTech, Agri-tech, Enterprise/ERP, Healthcare, Logistics, EdTech, Real Estate — 8 named industries |

"Legal-tech" appears in two of these and is not one of the 8 real tabs.
"Field operations" appears in three of these and is not one of the 8 real
tabs either. No two of the six surfaces above use the same wording. A
visitor who reads the meta description, then scrolls to the industry
tabs, then reads the FAQ, sees three different lists of what Bitsbuffer
does. This is precisely the "fact consistency across llms.txt, About,
schema, and page copy" gate sweetHeart's Phase 4 requires, and it fails.

**Fix:** pick one canonical list (the 8 real tabs are the ground truth
since they're the only one backed by actual on-page content), update
`site-config.ts`, the Hero metadata, the WebPage schema, `services/page.tsx`
metadata, `HomeFAQSection`, and `llms.txt` to match it word for word.

### 2. The same four numbers, five sections, zero proof link — **high**

| Number | Appears in |
|---|---|
| "10+ [production] systems" | Hero, ProblemSolution (row 1 + bottom stat), DarkScale, TeamProof — **4 sections** |
| "6-pass audit" | Hero, ProblemSolution (row 3 + bottom stat), ServiceToolsSection card, QualityAuditSection (which is entirely about this) — **4 sections** |
| "21-50 people" | DarkScale, TeamProof — **2 sections, back to back** |
| "8 industries served" / "4 regulated industries served" | ProblemSolution says 8, Hero still says 4 — **contradicts itself**, see below |
| "1 studio, one delivery standard" | ProblemSolution, TeamProof — **2 sections** |

DarkScaleSection and TeamProofSection sit next to each other in the page
flow and both close with a 3-stat strip repeating "10+" and "21-50."
That's the same information shown twice with no new evidence between the
two showings. Azure and Systems Limited state a scale claim once, usually
paired with a named client logo or a certification badge, and don't repeat
it as a floating number in unrelated sections. Here, none of the five
placements link to the case studies that would actually back "10+" up —
**the homepage never links to `/case-studies` from any of the five
stat-bearing sections.** The number is asserted five times and proven zero
times on the page itself.

Worth noting in Bitsbuffer's favor: `case-studies.ts` genuinely lists 10
named projects, so "10+" is not invented. But nothing on the homepage
shows that math or links to it, so a skeptical visitor has no way to
check it without already knowing to look elsewhere.

### 3. Hero still says "4 regulated industries served" — **critical, live contradiction**

`ProblemSolutionSection.tsx` carries this comment, dated 2026-07-08:

> "Industries served" corrected from 4 to 8: it was left over from before
> SolutionsExplorerSection was expanded... Catching it here so the two
> sections don't contradict each other on the same page.

The fix was applied to `ProblemSolutionSection` only. **`HeroSection.tsx`
still has the old stat**: `{ value: '4', label: 'Regulated industries served' }`,
sitting in the first thing a visitor reads, directly contradicted by the
"8" a few screens later in `ProblemSolutionSection`. This is the exact bug
the comment says it was trying to prevent, and it's still live. This is
the single most concrete, fixable finding in this audit — a two-line
change.

### 4. The primary trust mechanism is "we use it on ourselves," repeated four times — **medium**

ServiceToolsSection ("HRMS... running Bitsbuffer's own people operations
today"), TransformWorkSection ("proven on our own operations first"),
DarkScaleSection ("the same stack we use to run Workflow Engine
ourselves"), and QualityAuditSection ("the same checklist we run before
shipping Workflow Engine") all use the identical rhetorical move: trust
this because we trust it. It's a legitimate proof point once. Four times,
it starts reading as the only proof point, because it is — no client
logos, no named third-party validation, and no testimonials appear
anywhere in the homepage's 12 sections. Azure leans on named enterprise
customers and analyst recognition; Systems Limited leans on certifications
and named clients. Self-use is a real credential for a small studio, but
it can't be the whole credibility system, and right now on this page,
it is.

### 5. One unverifiable claim, shared with /services — **high**

`case-studies.ts`, the `generalizedCredibility` string shown on
`/services` and `/case-studies`:

> "We've also built and maintained enterprise software for some of
> Europe's leading publishing houses under long-term client agreements
> we can't name publicly."

This is the one claim in the whole audit that reads as genuinely
inflated rather than just repeated. It's specific enough to sound
impressive ("Europe's leading publishing houses") and vague enough to be
unfalsifiable (can't name them). Sweetheart's rule is "every claim must
be true against the actual product... verify claims against source
before writing them." I can't verify this one, and neither can a visitor,
which is exactly the problem: an enterprise buyer doing diligence treats
an unfalsifiable claim as a red flag, not a credibility booster. Either
this is true and needs at minimum an anonymized specific (industry,
approximate scale, project type, timeframe), or it should come out.

### 6. Case study copy still cuts off mid-word — **high, content bug**

`case-studies.ts` carries its own warning comment: "Pull the full copy
from each project's own detail page... do not publish a sentence that
stops mid-word." 3 of the 10 case studies still end in literal `...`
mid-sentence (Quick Wrap Gifts: "the app makes finding, selecting..."
Mutishop: "combines intelligent auto-suggestion..." and one more). This
was flagged before this shipped and wasn't fixed. It reads as
unfinished/unprofessional exactly where a buyer is checking credibility.

### 7. Two structurally identical sections, back to back — **medium, structural redundancy**

`SolutionsExplorerSection` and `ServiceToolsSection` render one after the
other and use the exact same UI pattern: a row of pill tabs, an
accordion/card list on the left, an image panel on the right that
crossfades on tab change. Different content (industries vs. products),
identical shape, no visual or structural variation between them. A
visitor scrolling past experiences the same interaction twice in a row.
Enterprise sites deliberately vary section format (grid, then table, then
carousel, then plain text) partly so the page doesn't read as one long
component demo. Worth either merging these two into one tabbed module
(industries and products as two facets of one explorer) or giving one of
them a visually distinct format.

### 8. AskBitsbufferSection appears twice, identical, on the same page — **low-medium**

Same component, same three prompts, same copy, once near the top (after
TrustBandSection) and again at the very bottom (`ariaLabel="Ask
Bitsbuffer, footer"`) right before the Footer. Not wrong exactly — repeating
a low-commitment CTA at the bottom of a long page is a reasonable pattern —
but it's literally the same widget, not a variant, and it's competing with
the real closer described in finding 9.

### 9. FinalCTASection ships on every page except the homepage — **medium, likely oversight**

`FinalCTASection` closes `/about`, `/blog`, `/careers`, `/case-studies`,
and `/services`. On the homepage it's imported, dynamically loaded, and
then commented out: `{/* <FinalCTASection /> */}`. No comment explains
why. The homepage — the page that gets the most traffic and the one this
whole page exists to convert on — is the one page that skips the
section carrying the strongest reassurance copy on the entire site ("No
credit card, no sales deck, no long-term lock-in... You own the code when
the project ships") and three distinct next-step options. Instead the
homepage ends on the second copy of the small inline "Ask Bitsbuffer"
prompt. This looks like a leftover from an earlier layout pass, not a
deliberate choice, and it's worth either re-enabling it or documenting
why it's intentionally off.

---

## Section-by-section verdicts

| # | Section | Verdict | Why |
|---|---|---|---|
| 1 | HeroSection | **Fix, then keep** | Strong, benefit-led H1, honest CTA pairing (own contact form + real external product, no fake urgency). Contains the stale "4 industries" stat, finding 3. |
| 2 | TrustBandSection | Keep | Low-risk marquee of process words, no claims to verify, cheap and honest. |
| 3 | AskBitsbufferSection (top) | Keep | Good, low-friction CTA. Explicitly built to be *more* honest than the Azure pattern it's adapted from (own code comment confirms no fake AI backend implied). |
| 4 | FeaturedUpdatesSection | Keep | Simple, honest, links to real posts. Only 6 posts exist total, "latest 3 + view all" is proportionate, not oversold. |
| 5 | SolutionsExplorerSection | **Trim or merge** | Good content, real WIIFM copy per scenario. Structurally redundant with ServiceToolsSection right below it, finding 7. Also the only place the real 8-industry list lives, which finding 1 depends on. |
| 6 | ServiceToolsSection | **Trim or merge** | Best claim hygiene on the page: Live/Coming/In progress badges used honestly, nothing overstated. Same structural redundancy issue as #5. |
| 7 | ProblemSolutionSection | **Rewrite the "typical agency" framing** | Correctly fixed the industries stat (finding 3's fix source). The generic-agency-vs-us comparison table paints all competitors with one negative brush, standard but somewhat exaggerated marketing rhetoric — every complaint listed is plausible but stated as universal fact about "typical agencies." Consider softening to "the pattern we hear most often" framing rather than flat assertion. |
| 8 | TransformWorkSection | **Verify one number** | "Replace six disconnected tools" — no source for "six" found anywhere else on the site. Either point to where that number comes from or make it non-specific ("the disconnected tools" / "several tools"). |
| 9 | DarkScaleSection | **Trim** | Real tech stack, honestly listed (including "Coming"-stage items like CRM not implied as done). Repeats stats covered in finding 2 and 4. |
| 10 | TeamProofSection | **Trim** | Genuine, human, real studio photos. Repeats the same two stats DarkScaleSection just showed, one section earlier. |
| 11 | QualityAuditSection | Keep | Clear, specific, not oversold (each pass description is concrete and checkable). The "6-pass audit" concept itself is fine, it's the four *other* places it's repeated that are the problem, not this section. |
| 12 | HomeFAQSection | Keep | Honest answers, especially "you own the code, no lock-in" and "we stay as operating partner." No exaggeration found here. |
| 13 | AskBitsbufferSection (footer) | **Reconsider** | See finding 8 and 9 together: replacing this with the disabled FinalCTASection, or keeping both but differentiating them, is worth a real decision rather than the current default. |

---

## Benchmark notes (Azure / Systems Limited pattern, for calibration)

Both reference sites share three habits this page doesn't fully have yet:

1. **State the scale claim once, prove it immediately.** A number sits
   next to the thing that proves it (a logo, a link, a certification
   badge), not floating alone in four unrelated sections.
2. **Third-party proof outweighs self-proof.** Named clients, analyst
   mentions, or certifications carry more weight than "we use it
   ourselves," which is a supporting point, not the main one.
3. **Section format varies deliberately.** Tabs, then a table, then a
   logo grid, then plain narrative, so no two consecutive sections feel
   like the same component with different words in it.

Bitsbuffer's page is closer on point 3 than the other two right now (most
sections do look visually distinct except the pair in finding 7). Points
1 and 2 are the real gap versus these benchmarks, not because the studio
lacks real proof (10 named case studies exist), but because that proof
never makes it onto the homepage itself.

---

## Priority order if fixing

1. Hero's "4 industries" stat → "8" (2-minute fix, kills a live contradiction).
2. Reconcile the industries/verticals wording across `site-config.ts`,
   Hero metadata, WebPage schema, `services/page.tsx` metadata,
   `HomeFAQSection`, and `llms.txt` to one list.
3. Decide on the "Europe's leading publishing houses" line: substantiate
   with something checkable, or cut it.
4. Finish the 3 truncated case study descriptions.
5. Decide on the homepage's ending: re-enable `FinalCTASection`, or make
   a documented call to keep the footer `AskBitsbufferSection` instead.
6. Source or soften "six disconnected tools" in TransformWorkSection.
7. Longer-term: consolidate the repeated stat blocks (finding 2) down to
   one strong instance with a link to `/case-studies`, and either merge or
   visually differentiate SolutionsExplorerSection and ServiceToolsSection.
