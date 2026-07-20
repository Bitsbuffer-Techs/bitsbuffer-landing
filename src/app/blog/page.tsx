import type { Metadata } from 'next';
import { getAllPublishedPosts } from '@/lib/db/blog-repo';
import { siteConfig } from '@/lib/site-config';
import PageSchema from '@/components/seo/PageSchema';
import PageHero from '@/components/ui/PageHero';
import BlogGridSection from '@/components/sections/BlogGridSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

// Rebuilt 2026-07-08 to match the convention established across the
// homepage and /services rebuild: PageHero instead of a badge + plain H1,
// the grid gets corner dots and a scroll-reveal stagger (see
// BlogGridSection.tsx, split out so this file can stay a server component
// and keep exporting `metadata`), and FinalCTASection replaces the old
// one-off inline CTA card so this page ends the same way every other
// rebuilt page does.
export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on software strategy, product delivery, and the systems that help modern teams operate with clarity, from a studio that ships production code.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

// Revalidates on a 5-minute fallback timer; the admin panel's
// publish/unpublish/edit routes also call revalidatePath directly for an
// instant update, this is just the safety net.
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getAllPublishedPosts();

  return (
    <main>
      <PageSchema
        title="Blog"
        description="Insights on software strategy, product delivery, and the systems that help modern teams operate with clarity, from a studio that ships production code."
        url={`${siteConfig.url}/blog`}
        type="CollectionPage"
      />
      <PageHero
        ariaLabel="Bitsbuffer blog"
        breadcrumbItems={[{ label: 'Home', href: '' }, { label: 'Blog', href: '/blog' }]}
        heading={
          <>
            Practical thinking on <span className="text-accent">software, operations,</span> and product
            delivery.
          </>
        }
        subtext="We write about the decisions that matter most when teams are building software that needs to work in the real world, not just in a demo."
      />
      <BlogGridSection posts={posts} />
      <FinalCTASection />
    </main>
  );
}
