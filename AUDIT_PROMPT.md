# Bitsbuffer Site Audit Prompt (paste into Claude Code)

Reusable prompt. Paste the block below into Claude Code with this repo open
(`bitsbuffer-landing`). Written to run against real tooling (`next build`,
Lighthouse, axe), not a read-through of the code, since a page can look fine
in source and still fail in a browser.

---

## Prompt

You are running a pre-launch audit on this Next.js site (Bitsbuffer's
marketing site, `bitsbuffer-landing`) across four categories: performance,
UI/UX, SEO, and accessibility. Benchmark it against the top 2% of B2B
SaaS/software-studio websites, not against average competitors. Pick 3 to 5
real, currently well-regarded sites in that tier yourself (well-known
examples: Linear, Stripe, Vercel, Framer, Attio) as your comparison bar for
performance budgets, motion quality, and information density. State which
sites you're benchmarking against before you start, so the comparison is
falsifiable.

Read `_System/skills/website-build-standards/SKILL.md` first if it exists in
this repo or a parent folder. It has this project's own design tokens,
component conventions, and a documented "silent failure" bug class (forms
that look fine in code but drop real submissions). Apply its pre-launch
checklist as your structure, extended with the actual tool runs below since
that skill file is written for a code read-through, not a runtime audit.

### 1. Performance

- Run `npm run build` and check the build output for route sizes and any
  warnings.
- Run `npm run start` against the production build, then run Lighthouse
  against the homepage and at least 3 other real routes (`npx lighthouse
  http://localhost:3000/<route> --output=json --output=html
  --output-path=./audit/lighthouse-<route>`, repeat per route). Report actual
  Core Web Vitals: LCP, CLS, INP/TBT, not just the composite score.
- Compare against a top-2% budget: LCP under 2.0s, CLS under 0.05, TBT under
  150ms on a throttled mobile profile. Flag every route that misses these,
  not just the worst one.
- Check for unnecessary `'use client'` on components with no state, hooks, or
  handlers, uncompressed source images over ~300KB, dead `preconnect`/script
  tags, and any timers or listeners not cleaned up on unmount.
- Note Pakistan's real network conditions (meaningful 4G share) as the
  reference environment, not just a US fiber connection.

### 2. Accessibility

- Run `npx @axe-core/cli http://localhost:3000/<route>` against every real
  route, not just the homepage. Report every violation with its WCAG
  criterion, not just a pass/fail count.
- Manually tab through each page (keyboard only, no mouse) and confirm every
  interactive element is a real focusable control with a visible
  `:focus-visible` state, not a `<div onClick>`.
- Confirm one `<h1>` per page, no skipped heading levels, real descriptive
  alt text on every image (not filenames or blank strings), and decorative
  icons marked `aria-hidden`.
- Target WCAG 2.2 AA as the floor. Call out anything that would also fail AAA
  where it's cheap to fix (contrast ratios in particular).

### 3. SEO

- Confirm a canonical tag on every route, including the homepage and every
  dynamic route (blog posts, case studies).
- Confirm structured data (schema.org JSON-LD) is present and consistent
  across every page in a category. Two of five case study pages with real
  schema and three without is a ranking regression on the three, not a style
  gap.
- Check meta descriptions are 150 to 160 characters, not truncated or empty.
- Check `robots.txt` and the sitemap actually agree with each other and with
  the real route list, no dead sitemap entries or orphaned pages.
- Check for cannibalizing content: two pages effectively targeting the same
  query.
- Also check GEO/AEO/AIO surfaces: `llms.txt` present and accurate, robots.txt
  explicitly allowing GPTBot/ClaudeBot/PerplexityBot/Google-Extended, FAQ
  content actually rendered as visible copy wrapped in `FAQPage` schema (not
  sitting unused in a data file), and facts consistent across `llms.txt`, the
  About page, and structured data.

### 4. UI/UX

- Walk every real page (not just the homepage) and assess against the
  benchmark sites named above: visual hierarchy, motion quality and restraint,
  information density, whether the primary CTA is unambiguous above the fold.
- Confirm forms and pricing pages are built on the same shared component
  classes as the rest of the site, not a one-off implementation.
- Flag any placeholder or unverified content sitting in a conversion-critical
  spot: testimonials without real names/companies/photos, truncated
  copy, "coming soon" states with no real timeline.
- Specifically re-test the contact form's honeypot field with browser
  autofill actually turned on, not just filled manually. This site has a
  documented history of a honeypot field colliding with autofill and
  silently rejecting real submissions.

### Output format

Produce a single markdown report, saved to `./audit/site-audit-<date>.md`,
structured as:

1. **Benchmark sites used**, one line each on why they represent top 2%.
2. **Scorecard**: a table, one row per route audited, one column per
   category (performance/accessibility/SEO/UI-UX), each cell a score out of
   10 plus the single biggest issue in that cell.
3. **Prioritized punch list**, ordered by impact divided by effort, highest
   leverage first. Each item: what's wrong, where (file and line if it's
   code), how to fix it, and whether it's a code defect you can just fix or
   a decision that needs a real person's call (final copy, real
   testimonials, business decisions). Do not guess on the decisions, flag
   them and stop.
4. **What could not be verified in this environment** (e.g., production SMTP,
   live autofill behavior in a real browser session, anything that needs a
   human walkthrough).

Do not mark anything "done" or "passing" without having actually run the
tool that proves it. A code read-through that looks correct is not evidence
a route performs, an accessibility check passes, or a form actually delivers
mail.

---

*Derived from `_System/skills/website-build-standards/SKILL.md`'s six-pass
audit and its documented silent-failure bug class, extended here with actual
Lighthouse/axe tool runs since this environment (Cowork sandbox) cannot run a
live Next.js server to execute them itself.*
