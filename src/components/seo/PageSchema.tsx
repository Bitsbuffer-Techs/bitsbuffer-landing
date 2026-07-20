import { siteConfig } from '@/lib/site-config';

type PageSchemaProps = {
  title: string;
  description: string;
  url: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage';
};

export default function PageSchema({ title, description, url, type = 'WebPage' }: PageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
