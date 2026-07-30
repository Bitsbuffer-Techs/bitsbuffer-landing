'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import CornerDots from '@/components/ui/CornerDots';

// Rebuilt 2026-07-17, Adnan's call: this section used to mix three
// unrelated things under one "services and modules" banner -- Workflow
// Engine (a real product), Icon Media Manager (an unfinished internal
// tool with no page of its own to land on), and Sikh Aid Global (a
// client whose real proof already lives at /case-studies/sikhaid-global,
// not a service Bitsbuffer sells). It also sat directly under
// SolutionsExplorerSection, another tab-plus-card-grid section, so the
// two read as one bloated double section to anyone scrolling past.
//
// Narrowed to one subject: Workflow Engine, one module per tab, every
// card now links out to wfengine.com instead of dead-ending at the
// generic /services hub. Custom development and the 8 industry domains
// stay owned by SolutionsExplorerSection above and the /services hub,
// not duplicated here.
//
// Honesty flag: HRMS, Finance, and CRM restate module claims that were
// already live in this file before this rebuild (Live/Live/Coming).
// "Social Media" is new -- added at Adnan's explicit direction, not
// something previously documented as a Workflow Engine module in
// CLAUDE.md or site-config.ts. Marked "Coming" and kept deliberately
// generic rather than inventing feature specifics. Adnan should confirm
// or expand this copy once the module's real scope is decided.
type FilterKey = 'hrms' | 'socialmedia' | 'crm' | 'finance';

interface Tool {
  key: string;
  name: string;
  body: string;
  badge: 'Live' | 'Coming';
}

const TOOLS: Record<FilterKey, Tool[]> = {
  hrms: [
    {
      key: 'attendance',
      name: 'Attendance tracking',
      body: 'Daily in and out times tracked per employee, with leave status visible on the same calendar.',
      badge: 'Live',
    },
    {
      key: 'payroll',
      name: 'Payroll',
      body: 'Payroll runs calculated from the same attendance data, not a second spreadsheet reconciled by hand.',
      badge: 'Live',
    },
    {
      key: 'team-calendar',
      name: 'Team calendar',
      body: 'One calendar for personal leave and team attendance side by side, not two systems that disagree.',
      badge: 'Live',
    },
    {
      key: 'employee-records',
      name: 'Employee records',
      body: 'Employee profiles and role history in one place instead of scattered across HR folders.',
      badge: 'Live',
    },
  ],
  finance: [
    {
      key: 'invoicing',
      name: 'Invoicing',
      body: 'Invoices generated and tracked against the same records HRMS and CRM already run on.',
      badge: 'Live',
    },
    {
      key: 'expenses',
      name: 'Expense tracking',
      body: 'Expenses logged and categorized without a separate spreadsheet to reconcile at month end.',
      badge: 'Live',
    },
    {
      key: 'revenue',
      name: 'Revenue tracking',
      body: 'Revenue tracked as it is billed and collected, on the same workflow engine as every other module.',
      badge: 'Live',
    },
  ],
  crm: [
    {
      key: 'contacts',
      name: 'Contacts',
      body: 'Contacts and account history in one place instead of a shared spreadsheet everyone edits differently.',
      badge: 'Coming',
    },
    {
      key: 'pipeline',
      name: 'Pipeline tracking',
      body: 'Deals tracked stage by stage, built for teams who outgrew a spreadsheet pipeline.',
      badge: 'Coming',
    },
    {
      key: 'deal-stages',
      name: 'Deal stages',
      body: 'Custom stages that match how your team actually sells, not a generic default funnel.',
      badge: 'Coming',
    },
  ],
  socialmedia: [
    {
      key: 'sm-scheduling',
      name: 'Scheduling',
      body: 'Content scheduled from the same platform running payroll and pipeline, instead of a separate tool.',
      badge: 'Coming',
    },
    {
      key: 'sm-queue',
      name: 'One queue, every channel',
      body: 'A single publishing queue planned for Workflow Engine’s social media module. Scope is still being defined.',
      badge: 'Coming',
    },
  ],
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'hrms', label: 'HRMS' },
  { key: 'socialmedia', label: 'Social Media' },
  { key: 'crm', label: 'CRM' },
  { key: 'finance', label: 'Finance' },
];

// Per-module deep links into the real Workflow Engine site (2026-07-23,
// Adnan's call) -- every card used to link to the same wfengine.com
// homepage regardless of which tab was active, both here and in the
// removed per-tool "Explore the module" links (see below). Confirmed
// against wfengine-landing/newWfengine/src/app/modules/*: all four pages
// (hrms, finance, crm, social-media) already exist on the real site.
const MODULE_PATHS: Record<FilterKey, string> = {
  hrms: '/modules/hrms',
  socialmedia: '/modules/social-media',
  crm: '/modules/crm',
  finance: '/modules/finance',
};

// Real photography for all four cards. CRM and Finance both show a
// device/dashboard screen, not people -- HRMS originally matched that
// with a generic HR-tech icon graphic, then briefly swapped to a real
// team photo (2026-07-23), which broke the visual consistency with the
// other three tabs. Reset to the same style as CRM/Finance: a real
// payroll-dashboard screen (reused from SolutionsExplorerSection's ERP
// tab), not a people photo.
const FEATURED: Record<FilterKey, { body: string; image: string; alt: string }> = {
  hrms: {
    body: 'The module running Bitsbuffer’s own people operations today: attendance, payroll, and team calendars for a 21 to 50 person team.',
    image: '/images/erp-hr-payroll.jpg',
    alt: 'Someone reviewing a payroll dashboard with employee records on a tablet',
  },
  socialmedia: {
    body: 'A planned Workflow Engine module for scheduling and publishing content from the same platform as HRMS, CRM, and Finance. Scope and launch timing are still being defined.',
    image: '/images/social-media.jpg',
    alt: 'Facebook, Instagram, TikTok, YouTube, and LinkedIn platform icons',
  },
  crm: {
    body: 'Contacts and sales pipeline, built for teams who outgrew a spreadsheet, on the same engine as every other module.',
    image: '/images/realestate-listings-crm.jpg',
    alt: 'An office team working at desks with a laptop showing a tracked product spreadsheet in the foreground',
  },
  finance: {
    body: 'Invoicing, expenses, and revenue tracking built on the same workflow engine as HRMS, so the numbers never need reconciling between two systems.',
    image: '/images/realestate-reporting-valuation.jpg',
    alt: 'A laptop screen showing a revenue and subscriptions reporting dashboard with charts',
  },
};

export default function ServiceToolsSection() {
  const [filter, setFilter] = useState<FilterKey>('hrms');
  const activeLabel = FILTERS.find((f) => f.key === filter)?.label ?? '';
  const featured = FEATURED[filter];
  const tools = TOOLS[filter];

  return (
    <section className="section relative overflow-hidden" aria-label="Workflow Engine modules">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright">
            One {siteConfig.flagshipProduct.name}, built for every operation you run
          </h2>
          <a
            href={siteConfig.flagshipProduct.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent-bright hover:text-accent"
          >
            Visit {siteConfig.flagshipProduct.name}
            <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
          </a>
        </div>

        <div
          className="grid gap-2 mb-10"
          style={{ gridTemplateColumns: `repeat(${FILTERS.length}, minmax(0, 1fr))` }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`w-full px-3 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-center transition-colors truncate ${
                filter === f.key
                  ? 'gloss-accent text-white'
                  : 'border border-border text-text-secondary hover:text-text-primary'
              }`}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div
          key={filter}
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 animate-tab-in"
        >
              <div className="rounded-2xl border border-border shadow-lg overflow-hidden bg-surface-raised flex flex-col">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-56 flex-shrink-0">
                  <Image
                    src={featured.image}
                    alt={featured.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {siteConfig.flagshipProduct.name} solution in {activeLabel}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{featured.body}</p>
                  <a
                    href={`${siteConfig.flagshipProduct.url}${MODULE_PATHS[filter]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent-bright hover:text-accent"
                  >
                    Explore {activeLabel} on {siteConfig.flagshipProduct.name}
                    <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* No per-card link here on purpose (2026-07-23, Adnan's call):
                  every one of these used to repeat the same "Explore the
                  module" link to the same wfengine.com homepage, four times
                  per tab -- redundant with the section's own top-level
                  "Visit Workflow Engine" link and the featured card's
                  module-specific one just above. Two links per tab (one
                  site-wide, one module-specific) is enough. */}
              <div className="grid sm:grid-cols-2 gap-5">
                {tools.map((tool) => (
                  <div key={tool.key} className="card flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-sm font-bold text-text-primary">{tool.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent-bright flex-shrink-0">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1">{tool.body}</p>
                  </div>
                ))}
              </div>
        </div>
      </div>
    </section>
  );
}
