import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Custom Software Studio Behind Workflow Engine | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `Custom Software Studio Behind Workflow Engine | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name}, custom software studio and the team behind Workflow Engine`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Custom Software Studio Behind Workflow Engine | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  applicationName: siteConfig.name,
  category: 'Software Development',
  other: {
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Pakistan',
    'ai-content-declaration': 'human-authored',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

// Organization schema. Bitsbuffer is the studio, Workflow Engine is the
// flagship product it makes, linked via sameAs/makesOffer rather than
// merged into one schema block, they are two distinct things now.
// @type is both Organization and LocalBusiness (2026-08-06 fix) -- valid
// per schema.org (LocalBusiness is a subtype of Organization), and this
// node already has everything LocalBusiness needs (real address, real
// contact point), so this is one accurate node satisfying both checks
// rather than a second, duplicate schema block.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: `${siteConfig.url}/bitsbuffer-logo-dark.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    areaServed: 'PK',
    availableLanguage: ['English', 'Urdu'],
  },
  // Two addresses since 2026-07-20, same order and values as the WF
  // Engine site's Organization schema: Lahore primary, Layyah secondary.
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '1st Floor, 876A, Q Block, Johar Town',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54782',
      addressCountry: 'PK',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'House No. 776, Street No. 1, Employees Colony',
      addressLocality: 'Layyah',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
  ],
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'SoftwareApplication',
      name: siteConfig.flagshipProduct.name,
      url: siteConfig.flagshipProduct.url,
    },
  },
  // Social profiles confirmed live by Adnan 2026-07-20. YouTube left out
  // until a real URL exists, matching Footer.tsx's socialLinks config,
  // an unclaimed/guessed URL here would actively hurt AI-answer-engine
  // trust rather than help it (see website-build-standards GEO section).
  sameAs: [
    siteConfig.flagshipProduct.url,
    'https://www.facebook.com/bitsbuffer',
    'https://www.instagram.com/bitsbuffer/',
    'https://x.com/bits_buffer',
    'https://www.pinterest.com/BitsBuffer/',
    'https://www.tiktok.com/@bits_buffer',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="bg-bg text-text-primary font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
