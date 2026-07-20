'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Landmark,
  Sprout,
  Boxes,
  Stethoscope,
  Truck,
  GraduationCap,
  Building2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Rebuilt 2026-07-08 to match the tab + accordion + crossfading-image
// pattern from the Azure reference video Adnan captured: top-level pill
// tabs pick an industry, each industry has several scenarios in an
// accordion (one open at a time), a sliding highlight bar marks which
// scenario is active, and the image on the right crossfades to match.
// Real photos reused from public/images/ as placeholders, swap for real
// per-scenario photography whenever Adnan has it, nothing else needs to
// change.
//
// Expanded same day per feedback: 4 industries -> 8, 3 scenarios -> 5.
// The tab row moved from a centered flex-wrap cluster to an 8-column grid
// so it spans the same full width as the accordion/image grid below it
// instead of reading as a smaller, disconnected element floating above a
// wider one. Corner dots added in the inverse placement from
// FeaturedUpdatesSection (that section uses top-left/bottom-right, this
// one uses top-right/bottom-left) so the two sections don't feel like a
// copy-paste of each other.
type Scenario = {
  key: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const TABS: { key: string; label: string; Icon: typeof ShoppingCart; scenarios: Scenario[] }[] = [
  {
    key: 'ecommerce',
    label: 'E-commerce',
    Icon: ShoppingCart,
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
  },
  {
    key: 'fintech',
    label: 'FinTech',
    Icon: Landmark,
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
  },
  {
    key: 'agritech',
    label: 'Agri-tech',
    Icon: Sprout,
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
  },
  {
    key: 'erp',
    label: 'Enterprise / ERP',
    Icon: Boxes,
    scenarios: [
      {
        key: 'order-revenue',
        title: 'Order & revenue management',
        body: 'Order, invoice, and revenue management built to grow with the business instead of blocking it.',
        image: '/images/working.webp',
        alt: 'Bitsbuffer leadership reviewing an ERP project',
      },
      {
        key: 'multi-entity',
        title: 'Multi-entity operations',
        body: 'One system across branches or subsidiaries instead of the same spreadsheet copied five times and reconciled by hand at month end.',
        image: '/images/meeting.jpeg',
        alt: 'Bitsbuffer team celebrating an ERP project milestone',
      },
      {
        key: 'controls',
        title: 'Reporting & controls',
        body: 'Approval chains and permission levels that match how the business is structured, not a generic role template.',
        image: '/images/meeting-2.jpeg',
        alt: 'Bitsbuffer leadership reviewing reporting controls',
      },
      {
        key: 'procurement-erp',
        title: 'Procurement',
        body: 'Purchase requests, approvals, and vendor records in one system, so a purchase order does not depend on someone remembering to update a spreadsheet.',
        image: '/images/strategy-ceo-hr.jpeg',
        alt: 'Bitsbuffer team reviewing a procurement workflow',
      },
      {
        key: 'hr-payroll',
        title: 'HR & payroll',
        body: 'Payroll, attendance, and HR records connected to the same core system as finance, so a headcount change reflects in the budget the same day, not at month end.',
        image: '/images/system.jpeg',
        alt: 'Bitsbuffer team discussing HR and payroll integration',
      },
    ],
  },
  {
    key: 'healthcare',
    label: 'Healthcare',
    Icon: Stethoscope,
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
  },
  {
    key: 'logistics',
    label: 'Logistics',
    Icon: Truck,
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
  },
  {
    key: 'edtech',
    label: 'EdTech',
    Icon: GraduationCap,
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
  },
  {
    key: 'realestate',
    label: 'Real Estate',
    Icon: Building2,
    scenarios: [
      {
        key: 'listings-crm',
        title: 'Listings & CRM',
        body: 'Listings, leads, and follow-ups tracked in one CRM built around how a brokerage sells, not a generic sales pipeline template.',
        image: '/images/ceo.jpeg',
        alt: 'Bitsbuffer team reviewing a real estate CRM',
      },
      {
        key: 'lease-management',
        title: 'Lease management',
        body: 'Lease terms, renewals, and rent schedules tracked automatically, so a renewal date does not get missed because it was written on a calendar somewhere else.',
        image: '/images/celebration.jpeg',
        alt: 'Bitsbuffer team discussing a lease management system',
      },
      {
        key: 'maintenance',
        title: 'Maintenance requests',
        body: 'Maintenance requests routed to the right vendor with a status a tenant can actually check, instead of a phone call and a guess.',
        image: '/images/promotion.jpeg',
        alt: 'Bitsbuffer team reviewing a maintenance request workflow',
      },
      {
        key: 'escrow',
        title: 'Payments & escrow',
        body: 'Rent collection and escrow accounts reconciled against the lease terms automatically, closing the gap between what is owed and what gets recorded.',
        image: '/images/dinner.jpg',
        alt: 'Bitsbuffer team reviewing a rent and escrow payments system',
      },
      {
        key: 'valuation',
        title: 'Reporting & valuation',
        body: 'Portfolio performance and valuation reports pulled from live occupancy and rent data, not a snapshot that is already out of date by the time it is presented.',
        image: '/images/office1.jpeg',
        alt: 'Bitsbuffer team reviewing a portfolio valuation report',
      },
    ],
  },
];

export default function SolutionsExplorerSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  // Sliding scenario cursor, replaces Framer Motion's layoutId FLIP
  // animation (2026-07-18 perf pass: framer-motion removed sitewide, this
  // was the one component that pulled in the full domMax projection
  // engine, ~30kb + real runtime cost, for a single sliding bar). One
  // persistent cursor div, positioned via plain offsetTop/offsetHeight
  // measurement and a CSS transition, gets the same cross-row slide with
  // no animation library at all.
  const [cursorRect, setCursorRect] = useState({ top: 0, height: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tab = TABS[activeTab];
  const scenario = tab.scenarios[activeScenario];

  useEffect(() => {
    const row = rowRefs.current[activeScenario];
    if (!row) return;
    setCursorRect({ top: row.offsetTop, height: row.offsetHeight });
    // Re-measure once the accordion-panel's own 0.25s expand transition
    // (globals.css) has settled, since the row's real height only reaches
    // its final value at the end of that transition, not the moment this
    // effect first runs.
    const id = setTimeout(() => {
      setCursorRect({ top: row.offsetTop, height: row.offsetHeight });
    }, 260);
    return () => clearTimeout(id);
  }, [activeScenario, tab]);

  const selectTab = (i: number) => {
    setActiveTab(i);
    setActiveScenario(0);
  };

  return (
    <section
      className="section relative overflow-hidden border-y border-border-subtle bg-surface-raised"
      aria-label="Solutions by industry"
    >
      {/* Inverse placement from FeaturedUpdatesSection (top-left/bottom-right)
          so back-to-back sections with the same accent don't read as a
          repeated copy-paste corner. */}
      <CornerDots corner="top-right" />
      <CornerDots corner="bottom-left" />

      <Reveal className="container-site relative">
        {/* Same flex justify-between convention as FeaturedUpdatesSection
            and ServiceToolsSection: heading on one side, "View all X" link
            on the other, instead of the centered/stacked heading tried
            first here. Links to /services since this section is the
            industry-facing view into the same offer ServiceToolsSection
            lists by product. */}
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-3">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
            Find the solution built for your industry
          </h2>
          <Link href="/services" className="text-sm font-semibold text-accent-bright hover:text-accent">
            View all services
            <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 8 tabs in a grid instead of a centered flex-wrap cluster, so the
            row spans the same full width as the accordion/image grid below
            it rather than sitting above it as a narrower, floating group. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-10">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => selectTab(i)}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-center transition-colors overflow-hidden ${
                activeTab === i
                  ? 'gloss-accent text-white'
                  : 'border border-border text-text-secondary hover:text-text-primary'
              }`}
              aria-pressed={activeTab === i}
            >
              <t.Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* items-stretch (grid default) so the image column matches
            whatever height 5 accordion rows + one expanded body produce,
            instead of the image locking to its own fixed aspect ratio and
            the two columns ending at different heights. */}
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          {/* Scenario accordion, one open at a time. The sliding cursor is
              one persistent div positioned via offsetTop/offsetHeight
              measurement (see the effect above) with a CSS transition, so
              it slides between rows instead of just appearing in a new
              spot -- same visual result as Framer Motion's layoutId, no
              animation library.
              Positioned via `transform` (translateY + scaleY on a fixed
              1px-tall element), not `top`/`height` -- those two are layout
              properties, so animating them forces the browser to recompute
              layout on every frame of the 300ms transition. That was firing
              on every page load (the mount effect below sets cursorRect
              once immediately, then again after the accordion's expand
              transition settles), landing squarely in Lighthouse's trace
              window and showing up as both "non-composited animation" and
              part of "forced reflow". `transform` is compositor-only, no
              layout recalculation either way. */}
          <div ref={listRef} className="relative">
            <div
              className="absolute left-0 top-0 h-px w-[3px] bg-accent transition-transform duration-300 ease-out"
              style={{ transform: `translateY(${cursorRect.top}px) scaleY(${cursorRect.height})`, transformOrigin: 'top left' }}
              aria-hidden="true"
            />
            {tab.scenarios.map((s, i) => {
              const isActive = activeScenario === i;
              return (
                <div
                  key={s.key}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="border-b border-border-subtle"
                >
                  <button
                    type="button"
                    onClick={() => setActiveScenario(i)}
                    className="flex w-full items-center justify-between gap-4 py-4 pl-5 pr-2 text-left"
                    aria-expanded={isActive}
                  >
                    <span className={`font-semibold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {s.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-text-muted transition-transform duration-200 ${
                        isActive ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div className={`accordion-panel ${isActive ? 'is-open' : ''}`}>
                    <div>
                      <p className="pb-4 pl-5 pr-4 text-sm text-text-secondary leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Per-tab deep link added 2026-07-17: each of the 8 industries
                now has its own dedicated page (src/app/services/[domain]/)
                with its own keyword, FAQ, and proof, not just a shared
                "View all services" link at the top of this section. */}
            <Link
              href={`/services/${tab.key}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright hover:text-accent"
            >
              See full {tab.label} solutions
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Image crossfades to match whichever scenario is active, whether
              that changed because of a scenario click or a tab switch
              (selectTab resets activeScenario to 0). aspect-[16/10] is the
              mobile fallback (columns stack, so there's no sibling height to
              match); at lg+ it switches to h-full so the image stretches to
              the accordion column's real height instead of locking to its
              own ratio and leaving the two columns visually uneven. */}
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px] rounded-2xl overflow-hidden border border-border shadow-lg">
            <div key={scenario.image + scenario.key} className="absolute inset-0 animate-tab-in">
              <Image
                src={scenario.image}
                alt={scenario.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
