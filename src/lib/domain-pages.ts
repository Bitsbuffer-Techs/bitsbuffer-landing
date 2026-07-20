// Source of truth for the 8 domain pages (src/app/services/[domain]/).
// Built 2026-07-17, Adnan's call: split the one generalist /services page
// into one page per industry so each can target its own primary keyword,
// its own visitor question, and its own proof, instead of one page trying
// to rank for fintech, ERP, agri-tech, and five other categories at once.
// See docs/10_domain_pages_research.md (directional keyword research,
// Semrush units were exhausted) and docs/11_domain_pages_plan.md (the
// page plan this file implements).
//
// The 5 scenarios per domain are carried over verbatim from
// SolutionsExplorerSection.tsx -- same real, audit-cleared WIIFM copy,
// not reinvented. Proof case studies only cite real, shipped, named
// projects from case-studies.ts; domains without one (healthcare,
// logistics, real estate) get honest capability language instead, never
// a fabricated claim.

export type DomainSlug =
  | 'ecommerce'
  | 'fintech'
  | 'agritech'
  | 'erp'
  | 'healthcare'
  | 'logistics'
  | 'edtech'
  | 'realestate';

export interface DomainScenario {
  key: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

export interface DomainFAQ {
  q: string;
  a: string;
}

export interface DomainProofCaseStudy {
  kind: 'case-study';
  slugs: string[]; // slugs into case-studies.ts
}

export interface DomainProofCapability {
  kind: 'capability';
  statement: string; // honest, no fabricated claim
}

export interface DomainPage {
  slug: DomainSlug;
  label: string; // matches SolutionsExplorerSection tab label exactly
  iconName: 'ShoppingCart' | 'Landmark' | 'Sprout' | 'Boxes' | 'Stethoscope' | 'Truck' | 'GraduationCap' | 'Building2';
  eyebrow: string;
  title: string; // <60 chars, matches <title>
  metaDescription: string; // 150-160 chars
  h1: string;
  answerBlock: string; // 40-60 words, answer-first
  subtext: string;
  scenarios: DomainScenario[];
  proof: DomainProofCaseStudy | DomainProofCapability;
  faqs: DomainFAQ[];
}

export const domainPages: DomainPage[] = [
  {
    slug: 'ecommerce',
    label: 'E-commerce',
    iconName: 'ShoppingCart',
    eyebrow: 'Custom e-commerce development',
    title: 'Custom E-Commerce Software Development | Bitsbuffer',
    metaDescription:
      'Storefront, checkout, inventory, and fulfillment systems built to hold up under real order volume. Custom e-commerce software from Bitsbuffer.',
    h1: 'Custom e-commerce software built for real order volume, not a demo cart',
    answerBlock:
      'Bitsbuffer builds storefront, checkout, inventory, and fulfillment systems scoped around how your store actually sells, not a generic template. Stock levels sync across every channel in real time, so a traffic spike does not turn into an oversold product or a support queue.',
    subtext:
      'Off-the-shelf platforms are fast to start but rarely fit a store with real complexity. We build the parts that need to be exact.',
    scenarios: [
      {
        key: 'storefront',
        title: 'Storefront & checkout',
        body: 'Storefronts, checkout, and fulfillment systems designed to hold up under real order volume, not a demo cart.',
        image: '/images/ecommerce-storefront-checkout.jpg',
        alt: 'Checkout and payment screen for an e-commerce store, shown on laptop and phone',
      },
      {
        key: 'inventory',
        title: 'Inventory & fulfillment',
        body: 'Stock levels synced across every sales channel in real time, so nothing sells out on the site while it is still sitting in the warehouse.',
        image: '/images/ecommerce-inventory-fulfillment.jpg',
        alt: 'Warehouse barcode scan next to an inventory dashboard showing stock synced across sales channels',
      },
      {
        key: 'payments',
        title: 'Payments & reconciliation',
        body: 'Gateway integrations and settlement reports that match what landed in the bank, not what the dashboard estimates.',
        image: '/images/ecommerce-payments-reconciliation.jpg',
        alt: 'Payment reconciliation dashboard showing settled and matched transactions',
      },
      {
        key: 'accounts',
        title: 'Accounts & loyalty',
        body: 'Customer accounts, saved carts, and loyalty points that stay accurate across web, app, and in-store, so a reward earned in one channel works in every other one.',
        image: '/images/ecommerce-accounts-loyalty.jpg',
        alt: 'Customer account app showing loyalty points balance and available rewards',
      },
      {
        key: 'returns',
        title: 'Returns & support',
        body: 'Return and refund workflows tied to inventory and payments, so a processed refund updates stock and the ledger at the same time, not three separate tickets later.',
        image: '/images/ecommerce-returns-support.jpg',
        alt: 'Returns and support dashboard next to a packed return box with shipping label',
      },
    ],
    proof: { kind: 'case-study', slugs: ['quick-wrap-gifts', 'mutishop', 'smart-list'] },
    faqs: [
      {
        q: 'Do you build on an existing platform or from scratch?',
        a: 'Both, depending on what the business actually needs. Some teams need a fully custom storefront and checkout; others need custom inventory or fulfillment logic layered onto a platform they already run. We scope this in discovery, not before.',
      },
      {
        q: 'What happens to my inventory data during a busy sales period?',
        a: "Stock levels sync across every channel in real time, so a traffic spike doesn't oversell what's actually in the warehouse. This is one of the five things we build for every e-commerce project, see the scenarios above.",
      },
      {
        q: 'Can you integrate with our existing payment gateway?',
        a: 'Yes. Gateway integration and settlement reporting that matches what actually lands in the bank is standard scope, not an add-on.',
      },
      {
        q: 'How is custom checkout different from building on Shopify or Magento?',
        a: "Shopify and Magento are the right call for most standard stores, they launch fast and do not need a developer for everyday changes. Custom stops being optional once inventory, fulfillment, or checkout logic has to match how the business actually operates, not a template's assumptions. Discovery is where we tell you honestly which one you need.",
      },
      {
        q: 'Can you migrate us off Shopify or WooCommerce onto a custom platform?',
        a: 'Yes. Migration is scoped like any other build: what data moves (products, orders, customer accounts), what integrations get rebuilt versus kept, and a cutover plan that does not take the store offline mid-migration.',
      },
    ],
  },
  {
    slug: 'fintech',
    label: 'FinTech',
    iconName: 'Landmark',
    eyebrow: 'Custom fintech software development',
    title: 'Custom Fintech Software Development | Bitsbuffer',
    metaDescription:
      'Payments, compliance, lending, and reconciliation systems built to be auditable from day one. Custom fintech software from Bitsbuffer.',
    h1: 'Custom fintech software built to be auditable from day one',
    answerBlock:
      'Bitsbuffer builds payments, compliance, lending, and reconciliation systems with the audit trail built in from the start, not patched on after a regulator asks for it. Reporting, risk flagging, and reconciliation run off live transaction data, not a monthly manual review.',
    subtext:
      'Fintech buying cycles are long and the stakes are real. We treat security and correctness as engineering requirements, not marketing language.',
    scenarios: [
      {
        key: 'trade-finance',
        title: 'Payments & trade finance',
        body: 'Trade finance, payments, and reporting systems built to be auditable from day one, not patched for compliance later.',
        image: '/images/fintech.jpg',
        alt: 'Completing a mobile card payment next to a laptop, representing a fintech payments flow',
      },
      {
        key: 'compliance',
        title: 'Compliance & reporting',
        body: 'Statutory reports generated straight from live transaction data, with an audit trail that holds up when a regulator asks for it.',
        image: '/images/fintech-compliance-reporting.jpg',
        alt: 'Audit trail and statutory report dashboard with ledger-style rows',
      },
      {
        key: 'risk',
        title: 'Risk & fraud monitoring',
        body: 'Rules-based flagging on transaction patterns, built to catch what a monthly manual review would miss until it was too late.',
        image: '/images/fintech-risk-fraud-monitoring-v2.jpg',
        alt: 'Fraud-flagging dashboard showing a transaction-pattern chart with alerts',
      },
      {
        key: 'lending',
        title: 'Lending & underwriting',
        body: 'Loan origination and underwriting rules that pull applicant data automatically, cutting the manual document chase most lenders still run by hand.',
        image: '/images/fintech-lending-underwriting.jpg',
        alt: 'Loan application and underwriting dashboard on screen',
      },
      {
        key: 'reconciliation',
        title: 'Reconciliation & ledger',
        body: 'A single ledger that reconciles across accounts and partners overnight, so finance starts the day with numbers that already match instead of chasing a mismatch.',
        image: '/images/fintech-reconciliation-ledger-v2.jpg',
        alt: 'Ledger and accounting dashboard with matched line items',
      },
    ],
    proof: { kind: 'case-study', slugs: ['tradelink360'] },
    faqs: [
      {
        q: 'How do you handle compliance and audit requirements?',
        a: 'Statutory reports are generated straight from live transaction data, with an audit trail that holds up when a regulator asks for it, built in from day one, not patched on after a compliance review flags a gap.',
      },
      {
        q: 'Can you build fraud or risk monitoring into an existing system?',
        a: 'Yes, rules-based flagging on transaction patterns is one of the five things we build for fintech clients, see the scenarios above.',
      },
      {
        q: 'Do you have fintech experience specifically, or just general software?',
        a: 'TradeLink360, a cross-border trade finance and payments platform, is a real shipped project, see our case studies. We scope every fintech engagement through discovery first, the same way.',
      },
      {
        q: 'Is the software PCI-DSS compliant if it touches card data?',
        a: "PCI-DSS applies to any system that stores, processes, or transmits card data, and the scope gets defined in discovery based on what your system actually touches. We build the audit-trail and access-control foundation PCI-DSS expects from day one, but we do not hold a PCI-DSS certification ourselves, that is assessed by your payment processor or a QSA against the live system, not something a vendor can hand you upfront.",
      },
      {
        q: 'How much does custom fintech software cost?',
        a: "Fintech cost swings more than almost anything else we build, mainly on compliance scope and how many systems it has to reconcile against, not a fixed feature list. We don't quote a number before discovery, for exactly that reason.",
      },
    ],
  },
  {
    slug: 'agritech',
    label: 'Agri-tech',
    iconName: 'Sprout',
    eyebrow: 'Agri-tech software development',
    title: 'Agri-Tech Software Development | Bitsbuffer',
    metaDescription:
      'Field operations, dairy management, yield monitoring, and harvest-season logistics software built for the field, not just the office. Bitsbuffer.',
    h1: 'Agri-tech software built for the field, not just the office',
    answerBlock:
      'Bitsbuffer builds field operations, dairy management, yield monitoring, and advisory software designed for the people using it in the field. Data is logged per field or per animal, not per farm, so a decision is based on this week, not last season.',
    subtext:
      'Software that only works from an office desk does not get adopted in the field. We build for the person holding the phone in the field first.',
    scenarios: [
      {
        key: 'field-ops',
        title: 'Field operations',
        body: 'Built for the people using it in the field, not just the office looking at a dashboard.',
        image: '/images/agritech-field-operations.jpg',
        alt: 'Field worker in a high-visibility vest checking a tablet in a crop field, with data overlay icons showing connected field operations',
      },
      {
        key: 'dairy',
        title: 'Dairy farm management',
        body: 'Individual animal records, feeding schedules, and milk yield tracked per tag, not per herd, so a health issue shows up before it costs a full day’s yield.',
        image: '/images/agritech-dairy-farm-management.jpg',
        alt: 'Row of tagged dairy cattle feeding in a barn, each animal individually ear-tagged for tracking',
      },
      {
        key: 'yield',
        title: 'Yield & resource monitoring',
        body: 'Water, fertilizer, and yield data logged per field, not per farm, so decisions are made on this season, not last year’s average.',
        image: '/images/agritech-yield-resource-monitoring.jpg',
        alt: 'Farmers with a tractor and seeding equipment in a field at dusk, representing field-level resource monitoring',
      },
      {
        key: 'procurement',
        title: 'Procurement & logistics',
        body: 'Procurement and delivery scheduling built around harvest timing, not a generic supply chain template that ignores the season.',
        image: '/images/agritech-procurement-logistics.jpg',
        alt: 'Tractor pulling seeding and input equipment across a field, representing harvest-season logistics planning',
      },
      {
        key: 'advisory',
        title: 'Weather & advisory',
        body: 'Weather and soil data folded into a single advisory feed, so a field decision is based on this week’s conditions, not a report from last month.',
        image: '/images/agritech-weather-advisory.jpg',
        alt: 'Hand holding a phone showing a Smart Farm weather and soil advisory app, with a field weather station in the background',
      },
    ],
    proof: { kind: 'case-study', slugs: ['kissan-connect'] },
    faqs: [
      {
        q: 'Does this work for farmers without reliable internet or literacy with software?',
        a: 'Kissan Connect, one of our shipped projects, was built specifically for smallholder and marginal farmers with limited literacy and resource access. Simple, field-first design is the starting point, not an afterthought.',
      },
      {
        q: 'Can you track data per field or per animal, not just per farm?',
        a: 'Yes. Field-level yield and resource data, and per-tag dairy animal records, are two of the five things we build, see the scenarios above.',
      },
      {
        q: 'Do you build the advisory or weather layer too?',
        a: 'Yes, weather and soil data folded into a single advisory feed is part of the standard scope, not a separate product.',
      },
      {
        q: 'How long does agritech software take to build?',
        a: 'It depends on how many field-level systems are in scope, dairy, yield, procurement, advisory, or a combination. Discovery maps that before a date gets set, the same process as every domain we build for.',
      },
      {
        q: 'Can this integrate with weather stations, soil sensors, or field IoT equipment?',
        a: 'Yes. Folding weather and soil data into one advisory feed already assumes external sensor or API integration, which specific hardware or provider you use gets confirmed in discovery.',
      },
    ],
  },
  {
    slug: 'erp',
    label: 'Enterprise / ERP',
    iconName: 'Boxes',
    eyebrow: 'Custom ERP software development',
    title: 'Custom ERP Software Development | Bitsbuffer',
    metaDescription:
      'Order, inventory, finance, and reporting connected to one system built around how your business actually works. Custom ERP from Bitsbuffer.',
    h1: 'Custom ERP built around how your business actually works',
    answerBlock:
      'Bitsbuffer builds order, revenue, procurement, and HR/payroll systems connected to one core, so a change in one place shows up everywhere else the same day, not at month end. Approval chains and permission levels match how the business is structured, not a generic role template.',
    subtext:
      'Packaged ERP assumes a generic workflow. We build the version that matches how your business is actually structured.',
    scenarios: [
      {
        key: 'order-revenue',
        title: 'Order & revenue management',
        body: 'Order, invoice, and revenue management built to grow with the business instead of blocking it.',
        image: '/images/erp-order-revenue-management.jpg',
        alt: 'Order and revenue management dashboard showing invoices and revenue tracking connected to one ERP core',
      },
      {
        key: 'multi-entity',
        title: 'Multi-entity operations',
        body: 'One system across branches or subsidiaries instead of the same spreadsheet copied five times and reconciled by hand at month end.',
        image: '/images/erp-multi-entity-operations.jpg',
        alt: 'Multi-entity operations view showing branches or subsidiaries connected under one ERP system',
      },
      {
        key: 'controls',
        title: 'Reporting & controls',
        body: 'Approval chains and permission levels that match how the business is structured, not a generic role template.',
        image: '/images/erp-reporting-controls.jpg',
        alt: 'Reporting and controls screen showing approval chains and permission levels matched to the business structure',
      },
      {
        key: 'procurement-erp',
        title: 'Procurement',
        body: 'Purchase requests, approvals, and vendor records in one system, so a purchase order does not depend on someone remembering to update a spreadsheet.',
        image: '/images/erp-procurement.jpg',
        alt: 'Procurement workflow showing purchase requests, approvals, and vendor records in one system',
      },
      {
        key: 'hr-payroll',
        title: 'HR & payroll',
        body: 'Payroll, attendance, and HR records connected to the same core system as finance, so a headcount change reflects in the budget the same day, not at month end.',
        image: '/images/erp-hr-payroll.jpg',
        alt: 'HR and payroll records connected to the same ERP core as finance and attendance',
      },
    ],
    proof: { kind: 'case-study', slugs: ['prize-erp'] },
    faqs: [
      {
        q: 'We already have an ERP, can you extend it instead of replacing it?',
        a: 'Often, yes. A lot of ERP work is closing a specific gap, like procurement or multi-entity reporting, rather than a full replacement. We scope this in discovery before recommending either path.',
      },
      {
        q: 'How is this different from buying an off-the-shelf ERP?',
        a: 'Packaged ERP assumes a generic role template and a generic workflow. Custom ERP is built around how your business is actually structured, approval chains and permission levels included, see the scenarios above.',
      },
      {
        q: 'Do you have real ERP projects to point to?',
        a: 'Prize ERP is a real shipped project, an order, invoice, sales, and revenue management platform built for internet service providers. See our case studies.',
      },
      {
        q: 'How does custom ERP compare in cost to SAP or NetSuite?',
        a: 'Packaged platforms charge for modules and users whether or not you use them, and the implementation is scoped to their template, not yours. Custom ERP cost is scoped only to the modules you actually need, order and revenue, procurement, HR and payroll, whichever apply, so the real comparison depends entirely on your footprint. Discovery is where that turns into actual numbers instead of a generic pricing page.',
      },
      {
        q: 'Can you migrate our data from Excel or a legacy ERP?',
        a: 'Yes. Data migration is scoped as part of the same discovery process: what data moves, what gets cleaned up along the way, and a cutover plan that does not stop the business mid-migration.',
      },
    ],
  },
  {
    slug: 'healthcare',
    label: 'Healthcare',
    iconName: 'Stethoscope',
    eyebrow: 'Healthcare software development',
    title: 'Healthcare Software Development | Bitsbuffer',
    metaDescription:
      'Patient records, scheduling, billing, and telehealth systems designed around real clinical workflows. Custom healthcare software from Bitsbuffer.',
    h1: 'Healthcare software designed around real clinical workflows',
    answerBlock:
      'Bitsbuffer builds patient records, scheduling, billing, and telehealth systems designed to follow a person across visits and providers instead of living in whichever system a department happens to use. Access logs and audit trails are built in from day one, not bolted on later.',
    subtext:
      "We're upfront about what we have and haven't shipped in this domain yet, and we scope compliance honestly rather than claim certifications we don't hold.",
    scenarios: [
      {
        key: 'records',
        title: 'Patient records',
        body: 'Patient records that follow a person across visits and providers, instead of living in whichever system the last department happened to use.',
        image: '/images/healthcare-patient-records.jpg',
        alt: 'Clinician reviewing a patient chart on screen alongside a printed patient file, generic EHR layout with no real patient data',
      },
      {
        key: 'scheduling',
        title: 'Scheduling',
        body: 'Appointment scheduling that accounts for provider availability, room capacity, and equipment in one view, so double-booking stops being a daily fire drill.',
        image: '/images/healthcare-scheduling.jpg',
        alt: 'Clinician with a stethoscope tapping a calendar planner overlay above a laptop, representing appointment scheduling',
      },
      {
        key: 'billing',
        title: 'Billing & claims',
        body: 'Claims submitted with the coding and documentation a payer asks for, cutting the rejection and resubmission cycle most clinics live with.',
        image: '/images/healthcare-billing-claims.jpg',
        alt: 'Close-up of a medical billing statement next to a stethoscope and calculator on a desk',
      },
      {
        key: 'compliance-health',
        title: 'Compliance',
        body: 'Access logs and audit trails built in from day one, not bolted on after the first compliance review flags a gap.',
        image: '/images/healthcare-compliance.jpg',
        alt: 'Clinician checking a patient pulse at a desk with a laptop, representing clinical data handling and compliance',
      },
      {
        key: 'telehealth',
        title: 'Telehealth',
        body: 'Video visits, e-prescriptions, and follow-up notes in the same workflow as an in-person visit, so remote care does not mean a separate, disconnected system.',
        image: '/images/healthcare-telehealth.jpg',
        alt: 'Phone showing a telemedicine app login screen on a desk with glasses and a prescription bottle',
      },
    ],
    proof: {
      kind: 'capability',
      statement:
        "We haven't shipped a named healthcare case study yet, and we won't claim one we don't have. What we do bring: the same discovery-first process behind every named case study in our other domains, and access logs and audit trails treated as a design requirement from day one, not a compliance patch applied after the fact.",
    },
    faqs: [
      {
        q: 'Do you have healthcare compliance certifications?',
        a: "We don't hold a formal healthcare compliance certification today, and we won't claim one we don't have. What we do build in from day one: access logs and audit trails as part of the system design, not bolted on after a review flags a gap. If your project needs a specific certification path, we scope that honestly in discovery before committing to timeline or cost.",
      },
      {
        q: 'Can patient records follow someone across providers or departments?',
        a: "That's the specific problem we design for, records that don't live in whichever system the last department happened to use. See the scenarios above.",
      },
      {
        q: 'Do you build telehealth into the same workflow as in-person visits?',
        a: 'Yes, video visits, e-prescriptions, and follow-up notes in the same workflow as an in-person visit is part of the standard scope.',
      },
      {
        q: 'Is the software HIPAA compliant?',
        a: "We build the access-log and audit-trail foundation the HIPAA Security Rule expects, encryption, unique user IDs, minimum-necessary access, into every healthcare build from day one. We don't hold a HIPAA certification ourselves, no vendor does, HIPAA compliance is assessed against your specific deployment and Business Associate Agreement, not a certificate a vendor can hand you. We scope that honestly in discovery.",
      },
      {
        q: 'Can the system connect to Epic, Cerner, or our existing EHR?',
        a: 'Interoperability is scoped around HL7 and FHIR, the standard most EHRs including Epic and Cerner expose an API against. Whether that means a full FHIR integration or a narrower data exchange depends on what your existing EHR actually supports, confirmed in discovery.',
      },
    ],
  },
  {
    slug: 'logistics',
    label: 'Logistics',
    iconName: 'Truck',
    eyebrow: 'Logistics software development',
    title: 'Logistics Software Development | Bitsbuffer',
    metaDescription:
      'Fleet tracking, warehouse management, route optimization, and carrier billing systems built around how freight actually moves. Bitsbuffer.',
    h1: 'Logistics software built around how freight actually moves',
    answerBlock:
      'Bitsbuffer builds fleet tracking, warehouse management, route optimization, and carrier billing systems matched to your actual operation, not a generic template that fights your floor plan or route pattern. A delay shows up in dispatch before a customer has to call and ask.',
    subtext:
      "We're upfront about what we have and haven't shipped in this domain yet, and we scope every engagement through the same discovery-first process regardless.",
    scenarios: [
      {
        key: 'fleet',
        title: 'Fleet tracking',
        body: 'Live vehicle location and status feeding into dispatch, so a delay shows up before a customer has to call and ask where their shipment is.',
        image: '/images/dinner.jpg',
        alt: 'Bitsbuffer team reviewing a fleet tracking dashboard',
      },
      {
        key: 'warehouse',
        title: 'Warehouse management',
        body: 'Pick, pack, and putaway workflows matched to how the warehouse moves, not a generic layout that fights the floor plan.',
        image: '/images/office1.jpeg',
        alt: 'Bitsbuffer team discussing a warehouse management system',
      },
      {
        key: 'routing',
        title: 'Route optimization',
        body: 'Delivery routes recalculated against real traffic and order windows, not a fixed plan set the night before and never revisited.',
        image: '/images/new1.jpeg',
        alt: 'Bitsbuffer team reviewing route optimization software',
      },
      {
        key: 'customs',
        title: 'Customs & documentation',
        body: 'Customs paperwork generated from the same shipment data used for tracking, so a document error does not hold a shipment at the border.',
        image: '/images/working.webp',
        alt: 'Bitsbuffer team reviewing customs documentation workflow',
      },
      {
        key: 'carrier-billing',
        title: 'Carrier billing',
        body: 'Carrier invoices checked against the agreed rate and actual weight automatically, catching the overcharges most teams only find during a manual audit.',
        image: '/images/meeting.jpeg',
        alt: 'Bitsbuffer team reviewing carrier billing reconciliation',
      },
    ],
    proof: {
      kind: 'capability',
      statement:
        "We haven't shipped a named logistics case study yet, and we won't claim one we don't have. What we do bring: the same discovery-first process behind every named case study in our other domains, applied to how your fleet, warehouse, or route network actually runs.",
    },
    faqs: [
      {
        q: 'Can this replace our current fleet tracking spreadsheet or generic tool?',
        a: 'Yes, live vehicle location and status feeding straight into dispatch is one of the five things we build, so a delay shows up before a customer has to call and ask. See the scenarios above.',
      },
      {
        q: 'Do you build warehouse-specific workflows, or a generic template?',
        a: "Pick, pack, and putaway workflows matched to how your specific warehouse floor plan moves, not a generic layout that fights it.",
      },
      {
        q: 'Have you shipped a named logistics project?',
        a: "Not yet under a named case study, and we won't claim one we haven't shipped. We scope every logistics engagement through the same discovery-first process as our named case studies in other domains, and we're upfront about that when a decision depends on it.",
      },
      {
        q: 'Should we build route optimization ourselves or buy it?',
        a: "Honestly, buy the mapping and routing engine itself, that part is commoditized and mature providers already do it well. What's worth building custom is the layer on top: dispatch logic, driver scoring, and how routing decisions plug into your specific fleet and warehouse operations. We'll tell you which parts are which in discovery, not sell you a rebuild of something you should just buy.",
      },
      {
        q: 'Can this integrate with our existing GPS or telematics hardware?',
        a: "Yes. Fleet tracking is built to pull from whatever GPS or telematics hardware you already have installed, not a proprietary device we require you to buy. Which provider you're on gets confirmed in discovery.",
      },
    ],
  },
  {
    slug: 'edtech',
    label: 'EdTech',
    iconName: 'GraduationCap',
    eyebrow: 'EdTech software development',
    title: 'EdTech Software Development | Bitsbuffer',
    metaDescription:
      'Course delivery, enrollment, grading, and parent portal systems built for how an institution actually teaches. Custom edtech from Bitsbuffer.',
    h1: 'EdTech software built for how an institution actually teaches',
    answerBlock:
      'Bitsbuffer builds course delivery, enrollment, grading, and parent portal systems around how your institution actually teaches, not a generic learning management shell. Attendance, grading, and fees roll up automatically instead of a spreadsheet rebuilt by hand every term.',
    subtext:
      "We're upfront about what we have and haven't shipped in this domain yet, and we scope every engagement through the same discovery-first process regardless.",
    scenarios: [
      {
        key: 'course-delivery',
        title: 'Course delivery',
        body: 'Course content, assignments, and grading in one platform built for how an institution teaches, not a generic learning management shell.',
        image: '/images/edtech-course-delivery.jpg',
        alt: 'Online education digital graphic representing a course delivery platform',
      },
      {
        key: 'admissions',
        title: 'Enrollment & admissions',
        body: 'Applications, document checks, and enrollment decisions tracked in one pipeline, so a file does not stall because it is sitting in someone’s inbox.',
        image: '/images/edtech-enrollment-admissions.jpg',
        alt: 'Person filling out a digital application form on a laptop',
      },
      {
        key: 'assessment',
        title: 'Grading & assessment',
        body: 'Grading and assessment data that rolls up into transcripts and reports automatically, instead of a spreadsheet rebuilt by hand every term.',
        image: '/images/edtech-grading-assessment.jpg',
        alt: 'Student working through a math assessment worksheet',
      },
      {
        key: 'parent-portal',
        title: 'Parent & guardian portal',
        body: 'A single portal for grades, attendance, and fees, so a parent gets one answer instead of three different logins.',
        image: '/images/edtech-parent-guardian-portal.jpg',
        alt: 'Parent and child sitting together with a laptop, representing a parent and guardian portal',
      },
      {
        key: 'attendance',
        title: 'Attendance',
        body: 'Attendance captured at the point it happens and synced to reporting in real time, replacing the paper sheet that gets entered a week late.',
        image: '/images/edtech-attendance.jpg',
        alt: 'Hand scanning a fingerprint on a digital attendance check-in device',
      },
    ],
    proof: {
      kind: 'capability',
      statement:
        "We haven't shipped a named edtech case study yet, and we won't claim one we don't have. What we do bring: the same discovery-first process behind every named case study in our other domains, applied to how your institution actually runs a term.",
    },
    faqs: [
      {
        q: "Is this a generic LMS, or built around our institution's actual process?",
        a: 'Built around how your institution teaches, not a generic learning management shell. Course content, assignments, and grading in one platform is the starting scope, see the scenarios above.',
      },
      {
        q: 'Can parents or guardians get a single view instead of multiple logins?',
        a: 'Yes, a single portal for grades, attendance, and fees is one of the five things we build.',
      },
      {
        q: 'Have you shipped a named edtech project?',
        a: "Not yet under a named case study, and we won't claim one we haven't shipped. We're upfront about that in discovery if it affects your decision.",
      },
      {
        q: 'Do you support SCORM, xAPI, or LTI for course content?',
        a: "Yes. Which standard makes sense depends on what you're building: SCORM is still the most common for existing course packages, xAPI or cmi5 tracks richer data for a new build, and LTI is what's needed to plug into another institution's existing LMS. We confirm which one your content and integrations actually need in discovery, not default to whichever is easiest for us.",
      },
      {
        q: 'Can one platform serve multiple schools or campuses?',
        a: 'Yes, multi-tenant is standard scope once more than one institution or campus needs its own data, branding, and admin access on the same platform, rather than a separate deployment per school.',
      },
    ],
  },
  {
    slug: 'realestate',
    label: 'Real Estate',
    iconName: 'Building2',
    eyebrow: 'Real estate software development',
    title: 'Real Estate Software Development | Bitsbuffer',
    metaDescription:
      'Listings, lease management, maintenance requests, and rent reconciliation systems built around how a brokerage actually sells. Bitsbuffer.',
    h1: 'Real estate software built around how a brokerage actually sells',
    answerBlock:
      'Bitsbuffer builds listings/CRM, lease management, maintenance request, and rent reconciliation systems matched to how your brokerage or portfolio actually operates. Rent and escrow reconcile against lease terms automatically, closing the gap between what is owed and what gets recorded.',
    subtext:
      "We're upfront about what we have and haven't shipped in this domain yet, and we scope every engagement through the same discovery-first process regardless.",
    scenarios: [
      {
        key: 'listings-crm',
        title: 'Listings & CRM',
        body: 'Listings, leads, and follow-ups tracked in one CRM built around how a brokerage sells, not a generic sales pipeline template.',
        image: '/images/realestate-listings-crm.jpg',
        alt: 'Real estate CRM screen showing listings, leads, and follow-ups tracked in one pipeline',
      },
      {
        key: 'lease-management',
        title: 'Lease management',
        body: 'Lease terms, renewals, and rent schedules tracked automatically, so a renewal date does not get missed because it was written on a calendar somewhere else.',
        image: '/images/realestate-lease-management.jpg',
        alt: 'Lease management screen showing lease terms, renewals, and rent schedules tracked automatically',
      },
      {
        key: 'maintenance',
        title: 'Maintenance requests',
        body: 'Maintenance requests routed to the right vendor with a status a tenant can actually check, instead of a phone call and a guess.',
        image: '/images/realestate-maintenance-requests.jpg',
        alt: 'Maintenance request workflow showing a request routed to a vendor with a status a tenant can check',
      },
      {
        key: 'escrow',
        title: 'Payments & escrow',
        body: 'Rent collection and escrow accounts reconciled against the lease terms automatically, closing the gap between what is owed and what gets recorded.',
        image: '/images/realestate-payments-escrow.jpg',
        alt: 'Rent and escrow payments screen showing collections reconciled against lease terms',
      },
      {
        key: 'valuation',
        title: 'Reporting & valuation',
        body: 'Portfolio performance and valuation reports pulled from live occupancy and rent data, not a snapshot that is already out of date by the time it is presented.',
        image: '/images/realestate-reporting-valuation.jpg',
        alt: 'Portfolio valuation report pulled from live occupancy and rent data',
      },
    ],
    proof: {
      kind: 'capability',
      statement:
        "We haven't shipped a named real estate case study yet, and we won't claim one we don't have. What we do bring: the same discovery-first process behind every named case study in our other domains, applied to how your brokerage or portfolio actually runs.",
    },
    faqs: [
      {
        q: 'Do you integrate with MLS or existing listing feeds?',
        a: 'MLS and listing integration is scoped per project based on which feed or provider you already use, we confirm this in discovery before committing to an approach.',
      },
      {
        q: 'Can tenants check maintenance request status instead of calling?',
        a: 'Yes, requests routed to the right vendor with a status a tenant can actually check is one of the five things we build, see the scenarios above.',
      },
      {
        q: 'Have you shipped a named real estate project?',
        a: "Not yet under a named case study, and we won't claim one we haven't shipped. We're upfront about that in discovery if it affects your decision.",
      },
      {
        q: 'Do you support the RESO Web API for MLS data?',
        a: 'Yes, RESO Web API is the current MLS data standard we would build against. Which specific MLS or feed provider you are connected to gets confirmed in discovery, since regional MLS setups vary.',
      },
      {
        q: 'How much does custom property management software cost compared to buying a platform?',
        a: 'Off-the-shelf property management tools work fine until lease terms, CAM reconciliation, or your specific MLS integration stop fitting their template, that is usually where the real cost of the "cheaper" platform shows up, in manual workarounds every month, not the subscription price. We scope the actual comparison in discovery once we know what your portfolio needs custom.',
      },
    ],
  },
];

export function getDomainPage(slug: string): DomainPage | undefined {
  return domainPages.find((d) => d.slug === slug);
}
