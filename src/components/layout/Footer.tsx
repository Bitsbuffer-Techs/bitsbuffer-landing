import Link from 'next/link';
import Image from 'next/image';
import type { JSX } from 'react';
import { siteConfig } from '@/lib/site-config';

// ─── SOCIAL ICONS ────────────────────────────────────────────────────────
// Inline SVGs, not lucide-react (lucide does not ship brand/social logos).
// Same set as wf-engine-landing's Footer.tsx, kept visually identical
// across both Bitsbuffer properties.
type IconProps = { className?: string };

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.6h2.55l.38-2.96H13.5V8.55c0-.86.24-1.44 1.47-1.44h1.56V4.46A20.9 20.9 0 0 0 14.3 4.3c-2.24 0-3.78 1.37-3.78 3.87v2.16H8v2.96h2.52V21h2.98Z" />
  </svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 8.35a3.65 3.65 0 1 0 0 7.3 3.65 3.65 0 0 0 0-7.3Zm0 6.02a2.37 2.37 0 1 1 0-4.74 2.37 2.37 0 0 1 0 4.74Zm4.66-6.17a.85.85 0 1 1-1.7 0 .85.85 0 0 1 1.7 0ZM20 7.02a4.97 4.97 0 0 0-4.98-4.98H8.98A4.97 4.97 0 0 0 4 7.02v6.04A4.97 4.97 0 0 0 8.98 18h6.04A4.97 4.97 0 0 0 20 13.06V7.02Zm-1.53 6.04a3.45 3.45 0 0 1-3.45 3.45H8.98a3.45 3.45 0 0 1-3.45-3.45V7.02a3.45 3.45 0 0 1 3.45-3.45h6.04a3.45 3.45 0 0 1 3.45 3.45v6.04Z" />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M13.9 10.4 21 3h-2l-6.2 6.4L7.6 3H2l7.4 10.4L2 21h2l6.6-6.8L15.9 21h5.6l-7.6-10.6Zm-2.3 2.4-.8-1.1L4.7 4.4h2.4l4.9 6.8.8 1.1 6.4 8.9h-2.4l-5.2-7.3Z" />
  </svg>
);

const TikTokIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.05c-.6-.6-.98-1.4-1.06-2.3H12.9v13.3c0 1.4-1.13 2.55-2.55 2.55a2.55 2.55 0 0 1 0-5.1c.24 0 .48.04.7.1v-2.75a5.3 5.3 0 0 0-.7-.05 5.3 5.3 0 1 0 5.3 5.3V8.9a7.5 7.5 0 0 0 4.35 1.4V7.55c-1.1 0-2.15-.4-2.9-1.05-.15-.13-.3-.28-.5-.45Z" />
  </svg>
);

const PinterestIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.35 2 11.7c0 4.1 2.6 7.6 6.24 9-.08-.76-.16-1.94.03-2.77.18-.75 1.15-4.78 1.15-4.78s-.3-.58-.3-1.44c0-1.35.8-2.36 1.8-2.36.85 0 1.26.62 1.26 1.36 0 .83-.55 2.07-.83 3.22-.24.97.5 1.76 1.48 1.76 1.78 0 3.15-1.83 3.15-4.48 0-2.34-1.72-3.98-4.18-3.98-2.84 0-4.5 2.06-4.5 4.2 0 .83.33 1.72.74 2.2a.29.29 0 0 1 .07.28c-.08.32-.25 1-.29 1.14-.04.19-.15.23-.35.14-1.3-.6-2.1-2.47-2.1-3.98 0-3.24 2.4-6.22 6.9-6.22 3.62 0 6.44 2.5 6.44 5.85 0 3.5-2.24 6.3-5.34 6.3-1.04 0-2.02-.53-2.36-1.16l-.64 2.39c-.23.85-.86 1.9-1.28 2.55A10 10 0 0 0 12 21.7c5.52 0 10-4.35 10-9.7S17.52 2 12 2Z" />
  </svg>
);

const YouTubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M23.5 7.2a3.02 3.02 0 0 0-2.13-2.14C19.44 4.5 12 4.5 12 4.5s-7.44 0-9.37.56A3.02 3.02 0 0 0 .5 7.2 31.6 31.6 0 0 0 0 13a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.13 2.14C4.56 21.5 12 21.5 12 21.5s7.44 0 9.37-.56A3.02 3.02 0 0 0 23.5 18.8 31.6 31.6 0 0 0 24 13a31.6 31.6 0 0 0-.5-5.8ZM9.75 16.5v-7l6 3.5-6 3.5Z" />
  </svg>
);

// Handles/URLs confirmed by Adnan 2026-07-20. YouTube URL not given yet
// (message was cut off), left '' so it renders dimmed/unclickable rather
// than a guessed or dead link, same convention as wf-engine-landing.
const socialLinks: { label: string; href: string; Icon: (p: IconProps) => JSX.Element }[] = [
  { label: 'Facebook',  href: 'https://www.facebook.com/bitsbuffer',    Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/bitsbuffer/',  Icon: InstagramIcon },
  { label: 'X',         href: 'https://x.com/bits_buffer',              Icon: XIcon },
  { label: 'Pinterest', href: 'https://www.pinterest.com/BitsBuffer/',  Icon: PinterestIcon },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@bits_buffer',    Icon: TikTokIcon },
  { label: 'YouTube',   href: '',                                      Icon: YouTubeIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="container-site py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/bitsbuffer-logo-dark.png"
            alt={siteConfig.name}
            width={130}
            height={34}
            className="h-6 w-auto"
          />
          <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-xs">
            Custom software studio. Home of Workflow Engine.
          </p>

          {/* Social icons — 5 of 6 live (Adnan, 2026-07-20), same pattern
              as wf-engine-landing's Footer.tsx. YouTube pending a URL. */}
          <div className="flex items-center gap-2.5 mt-4">
            {socialLinks.map(({ label, href, Icon }) => {
              const live = href.length > 0;
              const iconEl = (
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-150
                              ${live
                                ? 'border-accent/25 bg-accent/[0.07] text-text-secondary hover:text-accent hover:border-accent/50 hover:bg-accent/[0.12]'
                                : 'border-border/50 text-text-muted/30 cursor-not-allowed'
                              }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
              return live ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                >
                  {iconEl}
                </a>
              ) : (
                <span key={label} aria-hidden="true" title={`${label}, coming soon`}>
                  {iconEl}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-text-secondary hover:text-text-primary">About</Link></li>
            <li><Link href="/careers" className="text-text-secondary hover:text-text-primary">Careers</Link></li>
            <li><Link href="/blog" className="text-text-secondary hover:text-text-primary">Blog</Link></li>
            <li><Link href="/contact" className="text-text-secondary hover:text-text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            Work
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="text-text-secondary hover:text-text-primary">Custom Development</Link></li>
            <li>
              <a
                href={siteConfig.flagshipProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary"
              >
                Workflow Engine
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>{siteConfig.contact.address}</li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-text-primary">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-text-primary">
                {siteConfig.contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-site py-5 text-xs text-text-muted">
          Copyright {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
