import type { Metadata } from 'next';

// Applies to the whole /admin subtree (login + dashboard + editor):
// never indexed, never in the sitemap (see next-sitemap.config.js's
// exclude list), internal tool only.
export const metadata: Metadata = {
  title: 'Bitsbuffer Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
