'use client';

import { Boxes, ShoppingCart, Landmark, Network, Sprout, Scale } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';
import Reveal from '@/components/ui/Reveal';

// Rewritten 2026-07-08 from a feature-bullet list to benefit-led copy, same
// "sell the outcome, not the module list" rule applied to TransformWorkSection
// earlier today. Each card leads with what changes for the client, the body
// explains how, features are implied rather than itemized. Icon collision
// fixed along the way: the old version used Boxes for both "Custom product
// development" and "ERP and operations software", Network replaces it on
// the ERP card.
const SERVICES = [
  {
    title: 'Custom product development',
    benefit: 'A product that survives real users, not a prototype that only impresses in a demo.',
    body: 'Scoped through discovery first, then built and audited the same way we run Workflow Engine internally. What ships is production-grade from day one, not a proof of concept you rebuild later.',
    Icon: Boxes,
  },
  {
    title: 'E-commerce platforms',
    benefit: 'Checkout that holds up on your busiest day, not just in a staging environment.',
    body: 'Catalog, checkout, inventory, and fulfillment built to move together, so a sale on the site matches what is actually in stock, and a traffic spike does not turn into a support queue.',
    Icon: ShoppingCart,
  },
  {
    title: 'Fintech and regulated products',
    benefit: 'Numbers a regulator, an auditor, and your own team all trust at the same time.',
    body: 'Reporting, compliance workflows, and customer-facing financial tools built to be auditable from day one, not patched for compliance after the fact.',
    Icon: Landmark,
  },
  {
    title: 'ERP and operations software',
    benefit: 'One system your operations team trusts, instead of five spreadsheets reconciled by hand.',
    body: 'Order, inventory, finance, and reporting connected to the same core system, so a change in one place shows up everywhere else the same day, not at month end.',
    Icon: Network,
  },
  {
    title: 'Agri-tech and field software',
    benefit: 'Software your field team actually opens, not one built for an office that never leaves the building.',
    body: 'Mobile-first workflows for the people doing the work, with visibility back to the office that does not depend on someone remembering to file a report.',
    Icon: Sprout,
  },
  {
    title: 'Legal-tech and AI tooling',
    benefit: 'Automation your team trusts enough to actually rely on, not a chatbot bolted onto the homepage.',
    body: 'Structured data, workflow automation, and AI-assisted operations built into how the tool works, not stapled on as a marketing feature.',
    Icon: Scale,
  },
];

export default function ServicesOfferingsSection() {
  return (
    <section
      className="section relative overflow-hidden border-y border-border-subtle bg-surface-raised"
      aria-label="What we build"
    >
      {/* First real corner-dot section on this page (ServicesHero uses the
          dot-wave instead), starts the alternation at top-left/bottom-right
          so the rest of the page's sections can alternate against it. */}
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-accent-bright mb-3">
            Six practice areas, one delivery standard.
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Different domain, same discipline. Every build below is scoped, shipped, and audited the
            same way, regardless of which one your project falls under.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="h-full">
              <div className="card h-full">
                <span className="w-11 h-11 rounded-lg gloss-accent text-white flex items-center justify-center mb-4">
                  <s.Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm font-semibold text-accent-bright mb-2">{s.benefit}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
