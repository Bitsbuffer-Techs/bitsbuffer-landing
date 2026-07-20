import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, Landmark, Sparkles, Sprout, ShoppingCart, GraduationCap } from 'lucide-react';
import { generalizedCredibility } from '@/lib/case-studies';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Flagship Domains',
  description: 'Bitsbuffer builds production software across e-commerce, fintech, agritech, ERP, AI agents, edtech, and confidential publishing work for real clients.',
  alternates: {
    canonical: `${siteConfig.url}/flagship-domains`,
  },
};

const domains = [
  {
    title: 'E-commerce',
    description: 'Product discovery, cart and checkout flows, operations, and platform integrations.',
    icon: ShoppingCart,
  },
  {
    title: 'Fintech',
    description: 'Cash flow tools, reporting, compliance workflows, and customer-facing financial experiences.',
    icon: Landmark,
  },
  {
    title: 'Agritech',
    description: 'Field operations, supply chains, data capture, and practical tools for distributed teams.',
    icon: Sprout,
  },
  {
    title: 'ERP',
    description: 'Order, inventory, finance, and operational systems tailored to the way a business runs.',
    icon: Boxes,
  },
  {
    title: 'AI agents',
    description: 'Automation layers, internal copilots, knowledge workflows, and AI-assisted operations.',
    icon: Sparkles,
  },
  {
    title: 'Edtech',
    description: 'Learning platforms, internal enablement tools, and structured digital experiences for education.',
    icon: GraduationCap,
  },
  {
    title: 'Confidential publishing work',
    description: generalizedCredibility,
    icon: Sparkles,
  },
] as const;

export default function FlagshipDomainsPage() {
  return (
    <main>
      <PageSchema
        title="Flagship Domains"
        description="Bitsbuffer builds production software across e-commerce, fintech, agritech, ERP, AI agents, edtech, and confidential publishing work for real clients."
        url={`${siteConfig.url}/flagship-domains`}
        type="CollectionPage"
      />
      <section className="section pt-10">
        <div className="container-site max-w-3xl">
          <div className="mb-4">
            <Breadcrumb
              items={[{ label: 'Home', href: '' }, { label: 'Flagship Domains', href: '/flagship-domains' }]}
            />
          </div>
          <span className="badge mb-5">Flagship domains</span>
          <h1 className="section-title mb-5">Capability cards built around the sectors we know best.</h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            We apply the same product discipline across commerce, finance, operations, and emerging AI-driven services.
          </p>
        </div>
      </section>

      <section className="section border-y border-border-subtle bg-surface">
        <div className="container-site grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <article key={domain.title} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">{domain.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">{domain.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="container-site card lg:p-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">Need a product or platform in one of these spaces?</h2>
          <p className="text-text-secondary max-w-2xl mb-6">
            We build for real operating environments, with the product thinking and delivery discipline to make it work.
          </p>
          <Link href="/contact" className="btn-primary">
            Talk to us
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
