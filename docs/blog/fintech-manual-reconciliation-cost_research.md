# Research note — "The real cost of manual reconciliation in fintech"

Pilot post for the new `blog-writing` skill (`_System/skills/blog-writing/
SKILL.md`), domain: fintech. Written 2026-07-17.

## 1A. Keyword lock
Primary (directional, Semrush units still exhausted, see `docs/
10_domain_pages_research.md`): "fintech reconciliation automation" /
"manual reconciliation cost". Long-tail: "audit trail fintech compliance",
"reconciliation errors financial reporting". PAA-adjacent question this
post answers: "how much does manual reconciliation actually cost a
fintech team, and when is it worth automating."

## 1B/1C. Live data hunt + EEAT gate
- **AICPA 2025 Practice Economics Survey**: bank reconciliation is the
  single largest consumer of non-advisory staff hours in firms offering
  bookkeeping, averaging 11.3 hours per client per month; fully loaded
  staff accountant cost ~$45/hour. **EEAT: pass** — named professional
  body, dated survey.
- **FINRA 2026 Annual Regulatory Oversight Report** (released Dec 2025):
  reconfirms consolidated audit trail (CAT), third-party vendor
  management, and financial responsibility rules as perennial focus
  areas. **EEAT: pass** — the actual US regulator, dated.
- **SEC Rule 17a-4 / SOX Section 404**: records must be stored
  non-rewriteable/non-erasable; auditors look for cryptographic integrity
  or write-protected storage that makes tampering detectable. **EEAT:
  pass** — primary regulatory text.
- **Rejected**: a "78% of transaction matching is rule-based, 99.6% vs
  94.2% accuracy" figure appeared in aggregated vendor-blog search
  results with no clearly named primary source. Per the skill's EEAT
  gate, dropped rather than cited as fact.
- **No verifiable attributable quote found** in this research pass. Per
  skill rule 1D ("if no verifiable quote exists, drop the quote block
  entirely rather than fake one"), this post ships without an AUTHORITY
  quote block. This is the skill working as designed, not a shortcut.

## 1D. Fallback / localization
AICPA/FINRA/SEC sources are US-specific. Localized explicitly in the post:
presented as the general scale of the problem (any team doing manual
reconciliation, any market), not a claim that Bitsbuffer has built
SEC/FINRA-specific compliance systems, which hasn't been verified. Where
the post references Bitsbuffer's own experience, it stays scoped to what's
real: TradeLink360, a cross-border trade finance and payments platform
(case-studies.ts).

## 1E. First-hand element
TradeLink360's real, already-documented scope (case-studies.ts tagline:
"Comprehensive Cross-Border Trade Finance & Payment Platform") is the
anchor. No invented client conversation used, since none is verified for
this specific topic.

## 1F. Content gap check
None of the 5 existing Bitsbuffer posts touch fintech, reconciliation, or
compliance. No duplicate risk.

## 1G. Audience map
Reader: a finance lead or founder at a fintech/payments company doing
reconciliation by hand or in spreadsheets, worried about both the labor
cost and the audit-trail risk. Belief challenged: "reconciliation is just
an accounting chore, not a compliance risk." Fear: an audit or regulator
review surfacing a gap they didn't know existed.

## QC gate
Length target 1,200-1,800 words. Trust signals: 3 sourced stats (AICPA,
FINRA, SEC), 1 first-hand anchor (TradeLink360), honest "what NOT to
automate" section, no fabricated quote. Interlinking: down to
`/services/fintech`, sideways to `why-custom-software-still-wins`
(topically adjacent: complexity/custom-fit argument), up via the new
"From the blog" card on the fintech domain page.
