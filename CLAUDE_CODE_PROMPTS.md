# Bitsbuffer Website Rebuild: Prompt Series for Claude Code

This project (`C:\cowork\bitsbuffer-landing\`) has been scaffolded by Bubby
(Cowork) but not fully built, Bubby's code sandbox was down for most of this
session, so config files, design tokens, layout, and the homepage exist, but
the rest needs a real terminal, dependency install, and a build check, which
Claude Code has and Bubby did not.

Run these prompts in order, in this project's folder. Each one is scoped to
finish cleanly before starting the next. Do not skip the audit at the end.

## Before you start, read these two files

1. `C:\cowork\_System\skills\website-build-standards\SKILL.md`, the actual
   rulebook: design tokens, performance, accessibility, SEO, GEO/AEO/AIO, the
   silent-failure bug class, and the 6-pass audit structure. Every prompt
   below assumes this has been read.
2. `src/lib/site-config.ts` and `src/lib/case-studies.ts` in this project,
   the real content already gathered for this rebuild.

## The brief, in short

Bitsbuffer is a Pakistan-based custom software studio. Workflow Engine
(wfengine.com) is its flagship product and gets top billing on this site.
Custom development is a real, still-active secondary service with its own
conversion path, not a footnote. Ten real projects exist as case studies
(see `case-studies.ts`), plus one generalized, unnamed credibility line for
confidential client work, never use the word media for that line, never name
that client. Blockchain is dropped from all positioning. This is a rebuild,
not a from-scratch site, reuse the real case study content, replace the
decorative weight (animated starfield background, glow-on-every-card) with
the restrained dark design system already defined in `globals.css` and
`tailwind.config.ts`.

---

## Prompt 1: Get it running

"Move the existing brand assets into `public/`: `logo (1).png`,
`bitsbuffer-dark-logo (2).png`, and everything in `images/` (including
extracting `about us.zip` if it hasn't been opened yet, check what's inside
and move anything usable into `public/images/`). Then run `npm install` and
`npm run dev`, confirm the homepage actually renders with no console errors,
and fix anything broken before moving to the next prompt. Flag if
`logo (1).png` really is blank/broken as it appeared when previewed earlier,
versus just a white-on-transparent version that needs a dark background to
show correctly."

## Prompt 2: Services page

"Build `/services`, the custom development services page. This is a real,
working secondary conversion path, not a footnote, per the brief. Cover the
domains Bitsbuffer actually works in (e-commerce, fintech, ERP, agri-tech,
legal-tech, AI tooling), and end with a real contact CTA. Use the shared
`.card`, `.btn-primary`, `.section` classes already defined, do not invent
new ad hoc styles."

## Prompt 3: Flagship Domains page

"Build `/flagship-domains`, generic capability cards by sector (the old
site's version of this page already had a good pattern: e-commerce,
fintech, agritech, ERP, AI agents, edtech). Recreate that pattern using the
current design tokens, and add one generic card for the confidential
publishing-house work using the exact line in `generalizedCredibility` from
`case-studies.ts`, no client name, no use of the word media."

## Prompt 4: Case studies pages

"Build `/case-studies` (index, grid of all entries in `case-studies.ts`) and
`/case-studies/[slug]` (individual project pages). Important: every
description in `case-studies.ts` is truncated, it was captured off the old
site's preview cards and cuts off mid-sentence with an ellipsis. Before
finalizing copy, check the old codebase (`Next-website-main.zip`, already
extracted once this session, or re-extract if needed) for each project's
full detail page and pull the complete, untruncated text. Do not publish a
sentence that stops mid-word. Add real project schema (CreativeWork or
Product, whichever fits better per project) to each individual page."

## Prompt 5: About, Careers, Contact

"Build `/about` (the company story, custom dev roots, why Workflow Engine
exists and is now the flagship, distinct from WF Engine's own voice per the
two-voice decision), `/careers` (real, even if simple, team is 21 to 50
people), and `/contact` (a working contact form).

The contact form is the one place to be most careful. Apply every lesson
from the WF Engine demo form incident directly, do not rediscover these the
hard way:
- No honeypot field that can collide with browser autofill, if a honeypot is
  used, test it with autofill genuinely turned on before trusting it.
- Wrap the server-side send call in try/catch with real `console.error`
  logging, an uncaught throw must never become a bare 500 with no trail.
- Any SMTP credential in `.env.local` must be sanity-checked for accidental
  whitespace (Gmail App Passwords display with spaces for readability, the
  literal password has none).
- If a submit button can be disabled by incomplete required fields, show
  which field is missing, never leave it silently unresponsive.
- Send a real test message through the finished form and confirm it actually
  arrives, do not consider this step done until a real email lands in
  `hello@bitsbuffer.com`."

## Prompt 6: SEO and GEO/AEO/AIO pass

"Add `next-sitemap` config and a real `robots.txt` that explicitly allows
GPTBot, ClaudeBot, PerplexityBot, and Google-Extended. Add an `llms.txt`
covering what Bitsbuffer does, the case studies, and a pointer to Workflow
Engine as the flagship product. Confirm every route has its own canonical
tag, metadata is not just inherited from the root layout by accident. Add
Organization schema (already started in `layout.tsx`) and per-page schema
where it's missing."

## Prompt 7: Performance pass

"Audit every component for unnecessary `'use client'`, anything static with
no state or handlers should be a server component. Compress every image
under `public/` to a reasonable size before shipping, none of the old site's
uncompressed assets should carry over as-is. Confirm below-the-fold sections
use `next/dynamic` with sized skeletons where it makes sense. Remove the old
site's animated starfield canvas and per-card gradient glow entirely, they
should not exist anywhere in this codebase, that decorative weight is
exactly what this rebuild exists to fix."

## Prompt 8: Final 6-pass audit

"Run the same 6-pass audit structure documented in
`website-build-standards/SKILL.md`, code quality, CSS and tokens,
performance, SEO, GEO/AEO/AIO, UI/UX, against this finished site. Report
findings ordered by impact divided by effort, and separate anything that's a
real code defect from anything that's a decision only Adnan can make (final
copy approval, whether Love Anew should be named or generalized, real
testimonial attribution). Do not guess on the decisions, flag them."

---

## Already decided by Adnan, no need to re-ask

- Love Anew is confirmed to run under its real name, not generalized.
- The bitsbuffer.com 403 is a confirmed hosting problem, unrelated to this
  rebuild. Worth checking hosting/DNS config separately, but it does not
  block or change anything in this build.
