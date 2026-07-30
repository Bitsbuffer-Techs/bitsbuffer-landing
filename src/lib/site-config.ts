// Single source of truth for the site's canonical URL, per website-build-
// standards: "pick one source of truth for the site's URL and import it
// everywhere a canonical, Open Graph, or schema URL is built." The old
// site hardcoded this in at least two places, which is exactly how these
// drift out of sync.

export const siteConfig = {
  name: 'Bitsbuffer',
  // Apex is the canonical host as of 2026-07-20 (Adnan's call, docs/13
  // pre-launch audit). middleware.ts enforces this by 308-redirecting any
  // www.bitsbuffer.com request to the apex host, so both this constant and
  // the actual served URL always agree.
  url: 'https://bitsbuffer.com',
  description:
    'Bitsbuffer is a Pakistan-based software studio building custom software across e-commerce, fintech, ERP, agri-tech, healthcare, logistics, edtech, and real estate, and the studio behind Workflow Engine.',
  // Canonical industries list. Ground truth is SolutionsExplorerSection's
  // 8 real tabs, the only surface backed by actual on-page content. Every
  // other surface that names industries (Hero metadata, WebPage schema,
  // services metadata, HomeFAQSection, case-studies, llms.txt) imports
  // industriesList so the list can't drift out of sync again. See
  // docs/08_content_positioning_audit.md finding 1: five surfaces used to
  // give five different answers, two of them ("legal-tech", "field
  // operations") named categories that don't exist as real tabs.
  industries: [
    'E-commerce',
    'FinTech',
    'Agri-tech',
    'Enterprise / ERP',
    'Healthcare',
    'Logistics',
    'EdTech',
    'Real Estate',
  ] as const,
  industriesList:
    'e-commerce, fintech, ERP, agri-tech, healthcare, logistics, edtech, and real estate',
  contact: {
    // hello@bitsbuffer.com is now a real, monitored mailbox again as of
    // 2026-07-30 (Adnan) -- back to being the general contact address and
    // /api/contact's recipient. hr@bitsbuffer.com stays the careers-only
    // address (hardcoded separately in /api/careers/route.ts, not read
    // from here on purpose, see that file's own comment). Single source
    // of truth for the general address, so this one change updates the
    // displayed mailto link on /contact and the Footer, the Organization
    // schema in layout.tsx, and /api/contact's recipient, all at once.
    email: 'hello@bitsbuffer.com',
    // CC'd on both /api/contact and /api/careers submissions (Adnan,
    // 2026-07-30), on top of whichever address is the primary recipient.
    cc: 'adnan.khan@bitsbuffer.com',
    // Updated 2026-07-23 (Adnan): Lahore landline, +92 country code with
    // the trunk 0 dropped per standard international format.
    phone: '+92 42 32487796',
    // Lahore is the primary address as of 2026-07-20 (Adnan's call),
    // matching the WF Engine site's schema exactly (same building, same
    // postal code). Layyah remains the secondary office in the
    // Organization schema in layout.tsx.
    address: '1st Floor, 876A, Q Block, Johar Town, Lahore, Pakistan',
  },
  // WF Engine is the flagship product. Every future module Bitsbuffer
  // builds ships under this name, not under Bitsbuffer's own name.
  flagshipProduct: {
    name: 'Workflow Engine',
    url: 'https://wfengine.com',
  },
} as const;
