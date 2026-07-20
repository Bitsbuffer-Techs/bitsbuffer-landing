// Real project data carried over from the existing bitsbuffer.com codebase
// (Next-website-main.zip, reviewed 2026-07-06) plus decisions made during
// intake. Descriptions below are truncated exactly as captured off the live
// portfolio cards, each one cuts off mid-sentence with "...". Pull the full
// copy from each project's own "Explore Project" detail page in the old
// codebase before this ships, do not publish a sentence that stops mid-word.
//
// WellYou (the HR management platform previously listed here) is deliberately
// excluded. It is now WF Engine's HRMS module, and every future module ships
// under the Workflow Engine name, not Bitsbuffer's, per the flagship decision.
//
// Love Anew is listed under its real name, confirmed by Adnan 2026-07-06.
// It was already public under that name in the existing codebase.

export type Domain = 'ecommerce' | 'fintech' | 'agritech' | 'erp' | 'ai' | 'edtech' | 'nonprofit' | 'legaltech';

export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  domain: Domain;
  description: string; // TRUNCATED, see note above, verify before publish
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'quick-wrap-gifts',
    name: 'Quick Wrap Gifts',
    tagline: 'Elevating Gift-Giving Through Technology',
    domain: 'ecommerce',
    description:
      "Quick Wrap Gifts is a modern e-commerce platform that redefines the art of gifting by combining curated gift selections with professional wrapping services. Designed to transform every present into a memorable experience, the app makes finding, selecting...",
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'mutishop',
    name: 'Mutishop',
    tagline: 'Personalized E-Commerce Experience with Advanced Features',
    domain: 'ecommerce',
    description:
      'Mutishop is a dynamic e-commerce platform developed using React and NestJS, backed by a robust SQL database and integrated payment gateways. Designed to deliver a hyper-personalized shopping experience, Mutishop combines intelligent auto-suggestion...',
    stack: ['React', 'NestJS', 'SQL', 'Payment Gateway Integration'],
  },
  {
    slug: 'sikhaid-global',
    name: 'Sikhaid Global',
    tagline: 'Charity & Record Management Web App',
    domain: 'nonprofit',
    description:
      'Sikhaid Global is a purpose-built web application designed to streamline and empower charity organizations in their mission to serve communities. Crafted with a focus on efficiency, transparency, and ease of use, Sikhaid Global offers a comprehensive...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'prize-erp',
    name: 'Prize ERP',
    tagline: 'Focused Order, Invoice, Sales & Revenue Management',
    domain: 'erp',
    description:
      'A specialized enterprise resource planning platform designed to streamline and optimize the financial and sales operations of Internet Service Providers. Unlike broad ERP solutions, this system focuses intensely on managing orders...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'seo-dashboard',
    name: 'SEO Dashboard',
    tagline: 'Integrated with Airtable, Streamlined SEO Data Management & Automation',
    domain: 'ai',
    description:
      "A user-friendly platform seamlessly integrated with Airtable to help businesses and SEO teams efficiently manage, track, and optimize their SEO efforts, combining Airtable's intuitive database and collaboration capabilities...",
    stack: ['Next.js', 'Node.js', 'Airtable API'],
  },
  {
    slug: 'smart-list',
    name: 'Smart List',
    tagline: 'Deal Comparison & Wholesale Price Intelligence Platform',
    domain: 'ecommerce',
    description:
      'A price comparison and deal aggregation platform designed to empower buyers by connecting directly with multiple wholesalers and suppliers, changing how users discover the best deals by automatically comparing listings...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'tradelink360',
    name: 'TradeLink360',
    tagline: 'Comprehensive Cross-Border Trade Finance & Payment Platform',
    domain: 'fintech',
    description:
      'An advanced B2B digital platform designed to revolutionize international trade finance and cross-border payments, seamlessly integrating trade finance tools with real-time payment capabilities...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'kissan-connect',
    name: 'Kissan Connect',
    tagline: 'Empowering Farmers with Smart Agriculture Solutions',
    domain: 'agritech',
    description:
      'A tailor-made agri-tech platform designed specifically to meet the unique needs of smallholder and marginal farmers. Recognizing that many farmers have limited literacy and access to modern resources, Kissan Connect delivers simple...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    slug: 'love-anew',
    name: 'Love Anew',
    tagline: 'Intelligent Asset Division & Divorce Financial Planning',
    domain: 'legaltech',
    description:
      'A sophisticated web application designed to bring clarity, transparency, and fairness to the complex process of asset division during divorce. Tailored specifically for the diverse legal scenarios across different U.S. states...',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'REST API'],
  },
];

// Generic, unnamed credibility line for work under an active confidentiality
// commitment. Never name the client, never use the word "media". This is a
// trust signal, not a case study card, do not give it its own page.
export const generalizedCredibility =
  "We've also built and maintained enterprise software for some of Europe's leading publishing houses under long-term client agreements we can't name publicly.";

// Moved here from FeaturedProjectsSection 2026-07-08 so the /case-studies
// grid can share the exact same domain labels/colors instead of
// redeclaring them. Tailwind's JIT compiler cannot resolve template-literal
// class names like `bg-domain-${domain}/10` at build time, so every domain
// gets its complete class pair spelled out here, not composed at runtime.
export const DOMAIN_LABEL: Record<Domain, string> = {
  ecommerce: 'E-commerce',
  fintech: 'FinTech',
  agritech: 'Agri-tech',
  erp: 'ERP',
  ai: 'AI',
  edtech: 'EdTech',
  nonprofit: 'Non-profit',
  legaltech: 'LegalTech',
};

// `text` uses the darkened `-text` token variant (tailwind.config.ts), not
// the base domain color -- the base color fails WCAG AA contrast against
// its own 10%-tint badge background for all 8 domains (confirmed in the
// 2026-07-08 audit). Base color stays reserved for dots/icons/borders.
export const DOMAIN_STYLES: Record<Domain, { bg: string; text: string }> = {
  ecommerce: { bg: 'bg-domain-ecommerce/10', text: 'text-domain-ecommerce-text' },
  fintech: { bg: 'bg-domain-fintech/10', text: 'text-domain-fintech-text' },
  agritech: { bg: 'bg-domain-agritech/10', text: 'text-domain-agritech-text' },
  erp: { bg: 'bg-domain-erp/10', text: 'text-domain-erp-text' },
  ai: { bg: 'bg-domain-ai/10', text: 'text-domain-ai-text' },
  edtech: { bg: 'bg-domain-edtech/10', text: 'text-domain-edtech-text' },
  nonprofit: { bg: 'bg-domain-nonprofit/10', text: 'text-domain-nonprofit-text' },
  legaltech: { bg: 'bg-domain-legaltech/10', text: 'text-domain-legaltech-text' },
};

// Full-opacity variant of the same domain colors, reserved for icon badges
// only (never text, see the WCAG note above). Added 2026-07-17 for the
// /case-studies card header graphic: a branded icon-on-gradient treatment
// instead of a photo, since none of these projects have a real screenshot
// on file and this page's whole premise is "real, named, shipped work,"
// the same reasoning that got stock photos pulled off the blog earlier.
// Spelled out per-domain for the same Tailwind-JIT reason as DOMAIN_STYLES.
export const DOMAIN_SOLID: Record<Domain, string> = {
  ecommerce: 'bg-domain-ecommerce',
  fintech: 'bg-domain-fintech',
  agritech: 'bg-domain-agritech',
  erp: 'bg-domain-erp',
  ai: 'bg-domain-ai',
  edtech: 'bg-domain-edtech',
  nonprofit: 'bg-domain-nonprofit',
  legaltech: 'bg-domain-legaltech',
};

// Icon per domain for the same card header graphic, ecommerce/fintech/
// agritech/erp/edtech reuse the exact icons already used on the matching
// /services/[domain] pages (ShoppingCart, Landmark, Sprout, Boxes,
// GraduationCap) so a visitor sees the same domain mark in both places.
// ai/nonprofit/legaltech have no matching services domain page (case
// studies and service domains are two different lists, see the Domain
// type above), given their own best-fit icon instead.
export const DOMAIN_ICON: Record<
  Domain,
  'ShoppingCart' | 'Landmark' | 'Sprout' | 'Boxes' | 'Sparkles' | 'GraduationCap' | 'HeartHandshake' | 'Scale'
> = {
  ecommerce: 'ShoppingCart',
  fintech: 'Landmark',
  agritech: 'Sprout',
  erp: 'Boxes',
  ai: 'Sparkles',
  edtech: 'GraduationCap',
  nonprofit: 'HeartHandshake',
  legaltech: 'Scale',
};
