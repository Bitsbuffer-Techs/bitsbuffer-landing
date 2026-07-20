# 11 — Domain Pages Site Plan

## Architecture

- **Route**: `src/app/services/[domain]/page.tsx`, one dynamic route with
  `generateStaticParams()` returning all 8 slugs (SSG, matches
  `website-build-standards`: marketing pages always SSG/ISR). Single
  template, not 8 separate folders, because the section structure is
  identical across domains (hero, answer block, 5 real scenarios, proof,
  FAQ, CTA) and the content that differs is entirely data, not layout —
  DRY over WF Engine's 8-separate-folders pattern, same crawlable-URL
  outcome.
- **Slugs** (match `SolutionsExplorerSection.tsx`'s existing tab keys, zero
  translation needed between the two): `ecommerce`, `fintech`, `agritech`,
  `erp`, `healthcare`, `logistics`, `edtech`, `realestate`.
- **`/services` stays** as the general "how we work" hub (process, 6-pass
  audit, platform overview, FAQ about engagement model) — it is not
  domain-specific content and doesn't compete keyword-wise with the new
  pages. This mirrors real agency IA more than WF Engine's dropdown-only
  pattern, since `/services` carries real non-domain content WF Engine's
  dropdown never needed a hub for.
- **Data source**: `src/lib/domain-pages.ts`, new file, imports nothing
  from `SolutionsExplorerSection.tsx` (that stays a client component) but
  duplicates its 5 real scenarios per domain verbatim — same audited copy,
  no reinvention, single place both the homepage tabs and the dedicated
  pages read from going forward would be a further improvement, flagged
  as a follow-up refactor, not blocking this pass.

## Per-page structure (all 8 identical shape, different data)

1. Hero: eyebrow (category term) + H1 (keyword + domain named explicitly)
   + 40-60 word answer-first block (visitor question answered immediately,
   not buried) + subtext (pain contrast, trust proof) + CTA.
2. "What we build" — the 5 real scenarios from `SolutionsExplorerSection`
   for that domain, as cards, each already WIIFM-framed and audit-cleared.
3. Proof section — real named case study card where one exists (fintech,
   agri-tech, ERP, e-commerce), or an honest "how we approach it" block
   with zero fabricated claims for the 3 without one yet (healthcare,
   logistics, real estate). Never a fake client name, never an invented
   certification.
4. FAQ — 3 domain-specific questions, visible copy + FAQPage schema, both
   always (per sweetHeart's own "written-but-never-wired FAQ is the most
   common gap" rule).
5. FinalCTASection, same as every other page.

## Schema per page

- `Service` schema (`serviceType` = domain, `provider` = Organization,
  `areaServed`, `url`).
- `FAQPage` schema from the same 3 Q&As rendered as visible copy.
- `BreadcrumbList`: Home → Services → [Domain].
- Canonical tag, own title (<60 chars) and meta description (150-160
  chars) per page, drafted below, not retrofitted.

## Title / meta / FAQ per domain

### E-commerce (`/services/ecommerce`)
- Title: "Custom E-Commerce Software Development | Bitsbuffer"
- Meta: "Storefront, checkout, inventory, and fulfillment systems built to hold up under real order volume. Custom e-commerce software from Bitsbuffer."
- FAQ:
  1. Do you build on an existing platform or from scratch? — "Both, depending on what the business actually needs. Some teams need a fully custom storefront and checkout; others need custom inventory or fulfillment logic layered onto a platform they already run. We scope this in discovery, not before."
  2. What happens to my inventory data during a busy sales period? — "Stock levels sync across every channel in real time, so a traffic spike doesn't oversell what's actually in the warehouse. This is one of the five things we build for every e-commerce project, see the scenarios above."
  3. Can you integrate with our existing payment gateway? — "Yes. Gateway integration and settlement reporting that matches what actually lands in the bank is standard scope, not an add-on."

### FinTech (`/services/fintech`)
- Title: "Custom Fintech Software Development | Bitsbuffer"
- Meta: "Payments, compliance, lending, and reconciliation systems built to be auditable from day one. Custom fintech software from Bitsbuffer."
- FAQ:
  1. How do you handle compliance and audit requirements? — "Statutory reports are generated straight from live transaction data, with an audit trail that holds up when a regulator asks for it, built in from day one, not patched on after a compliance review flags a gap."
  2. Can you build fraud or risk monitoring into an existing system? — "Yes, rules-based flagging on transaction patterns is one of the five things we build for fintech clients, see the scenarios above."
  3. Do you have fintech experience specifically, or just general software? — "TradeLink360, a cross-border trade finance and payments platform, is a real shipped project, see our case studies. We scope every fintech engagement through discovery first, the same way."

### Agri-tech (`/services/agritech`)
- Title: "Agri-Tech Software Development | Bitsbuffer"
- Meta: "Field operations, dairy management, yield monitoring, and harvest-season logistics software built for the field, not just the office. Bitsbuffer."
- FAQ:
  1. Does this work for farmers without reliable internet or literacy with software? — "Kissan Connect, one of our shipped projects, was built specifically for smallholder and marginal farmers with limited literacy and resource access. Simple, field-first design is the starting point, not an afterthought."
  2. Can you track data per field or per animal, not just per farm? — "Yes. Field-level yield and resource data, and per-tag dairy animal records, are two of the five things we build, see the scenarios above."
  3. Do you build the advisory or weather layer too? — "Yes, weather and soil data folded into a single advisory feed is part of the standard scope, not a separate product."

### Enterprise / ERP (`/services/erp`)
- Title: "Custom ERP Software Development | Bitsbuffer"
- Meta: "Order, inventory, finance, and reporting connected to one system built around how your business actually works. Custom ERP from Bitsbuffer."
- FAQ:
  1. We already have an ERP, can you extend it instead of replacing it? — "Often, yes. A lot of ERP work is closing a specific gap, like procurement or multi-entity reporting, rather than a full replacement. We scope this in discovery before recommending either path."
  2. How is this different from buying an off-the-shelf ERP? — "Packaged ERP assumes a generic role template and a generic workflow. Custom ERP is built around how your business is actually structured, approval chains and permission levels included, see the scenarios above."
  3. Do you have real ERP projects to point to? — "Prize ERP and SEO Dashboard are both real shipped projects, see our case studies."

### Healthcare (`/services/healthcare`)
- Title: "Healthcare Software Development | Bitsbuffer"
- Meta: "Patient records, scheduling, billing, and telehealth systems designed around real clinical workflows. Custom healthcare software from Bitsbuffer."
- FAQ:
  1. Do you have healthcare compliance certifications? — "We don't hold a formal healthcare compliance certification today, and we won't claim one we don't have. What we do build in from day one: access logs and audit trails as part of the system design, not bolted on after a review flags a gap. If your project needs a specific certification path, we scope that honestly in discovery before committing to timeline or cost."
  2. Can patient records follow someone across providers or departments? — "That's the specific problem we design for, records that don't live in whichever system the last department happened to use. See the scenarios above."
  3. Do you build telehealth into the same workflow as in-person visits? — "Yes, video visits, e-prescriptions, and follow-up notes in the same workflow as an in-person visit is part of the standard scope."

### Logistics (`/services/logistics`)
- Title: "Logistics Software Development | Bitsbuffer"
- Meta: "Fleet tracking, warehouse management, route optimization, and carrier billing systems built around how freight actually moves. Bitsbuffer."
- FAQ:
  1. Can this replace our current fleet tracking spreadsheet or generic tool? — "Yes, live vehicle location and status feeding straight into dispatch is one of the five things we build, so a delay shows up before a customer has to call and ask. See the scenarios above."
  2. Do you build warehouse-specific workflows, or a generic template? — "Pick, pack, and putaway workflows matched to how your specific warehouse floor plan moves, not a generic layout that fights it."
  3. Have you shipped a named logistics project? — "Not yet under a named case study, and we won't claim one we haven't shipped. We scope every logistics engagement through the same discovery-first process as our named case studies in other domains, and we're upfront about that when a decision depends on it."

### EdTech (`/services/edtech`)
- Title: "EdTech Software Development | Bitsbuffer"
- Meta: "Course delivery, enrollment, grading, and parent portal systems built for how an institution actually teaches. Custom edtech from Bitsbuffer."
- FAQ:
  1. Is this a generic LMS, or built around our institution's actual process? — "Built around how your institution teaches, not a generic learning management shell. Course content, assignments, and grading in one platform is the starting scope, see the scenarios above."
  2. Can parents or guardians get a single view instead of multiple logins? — "Yes, a single portal for grades, attendance, and fees is one of the five things we build."
  3. Have you shipped a named edtech project? — "Not yet under a named case study, and we won't claim one we haven't shipped. We're upfront about that in discovery if it affects your decision."

### Real Estate (`/services/realestate`)
- Title: "Real Estate Software Development | Bitsbuffer"
- Meta: "Listings, lease management, maintenance requests, and rent reconciliation systems built around how a brokerage actually sells. Bitsbuffer."
- FAQ:
  1. Do you integrate with MLS or existing listing feeds? — "MLS and listing integration is scoped per project based on which feed or provider you already use, we confirm this in discovery before committing to an approach."
  2. Can tenants check maintenance request status instead of calling? — "Yes, requests routed to the right vendor with a status a tenant can actually check is one of the five things we build, see the scenarios above."
  3. Have you shipped a named real estate project? — "Not yet under a named case study, and we won't claim one we haven't shipped. We're upfront about that in discovery if it affects your decision."

## Nav

`Header.tsx`'s flat "Services" link becomes a dropdown, mirroring WF
Engine's `Header.tsx` `Products` dropdown component pattern exactly (same
open/close/outside-click/Escape logic, same icon + label + one-line desc
per item). Dropdown items: the 8 domain pages, each using its
`SolutionsExplorerSection` icon. Dropdown itself links nowhere on its own;
`/services` stays reachable via the mobile menu's section header link and
a "See how we work" link inside the dropdown panel, matching WF Engine's
own pattern of keeping the umbrella page one click away without giving it
its own top-level dropdown item.

## Internal link map

- `SolutionsExplorerSection.tsx` (homepage): each of the 8 tabs' content
  currently has no per-tab link, only one shared "View all services" link
  to `/services`. Add a per-tab "See [domain] solutions" link to the
  matching `/services/[domain]` page.
- Case studies with a domain: link back to their matching domain page from
  `/case-studies` (TradeLink360 → fintech, Kissan Connect → agritech,
  Prize ERP → erp, Quick Wrap Gifts + Mutishop + Smart List → ecommerce).
  Correction from the first draft of this doc: `SEO Dashboard` is tagged
  domain `ai` in `case-studies.ts` (an Airtable-integrated SEO data tool),
  not `erp` — it does not belong on the ERP proof section, only Prize ERP
  does.
- Blog: none of the current 5 posts are domain-specific, so no forced
  links added this pass — flagged as a content gap, each domain page
  should eventually get its own blog pillar per sweetHeart Phase 2/3, not
  invented here without real research behind it.

## What this pass does not do

- Does not touch Semrush-verified volume (units exhausted, see doc 10).
- Does not write new blog content per domain (flagged as follow-up).
- Does not change `/services`'s own content, only its nav entry point.
