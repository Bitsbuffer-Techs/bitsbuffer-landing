import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';

// Rebuilt 2026-07-08, same convention as the rest of the site: PageHero
// instead of a badge + plain H1. No stats row here, a contact page's one
// job is the form below, not more numbers to read first.
export const metadata: Metadata = {
  title: 'Contact Bitsbuffer',
  description: 'Talk to Bitsbuffer about custom software, a Workflow Engine partnership, or a production build you need scoped, delivered, and supported after launch.',
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main>
      <PageSchema
        title="Contact Bitsbuffer"
        description="Contact Bitsbuffer about custom software, product delivery, or Workflow Engine partnerships."
        url={`${siteConfig.url}/contact`}
        type="ContactPage"
      />
      <PageHero
        ariaLabel="Contact Bitsbuffer"
        breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'Contact', href: '/contact' }]}
        heading={<>Tell us what you are <span className="text-accent">building.</span></>}
        subtext="Whether you need a custom platform, a refined product experience, or a long-term delivery partner, we would love to hear from you."
      />
      <ContactForm />
    </main>
  );
}
