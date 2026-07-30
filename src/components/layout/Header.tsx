'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ShoppingCart,
  Landmark,
  Sprout,
  Boxes,
  Stethoscope,
  Truck,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { domainPages } from '@/lib/domain-pages';

// Services dropdown added 2026-07-17 (Adnan's call, freeze override):
// mirrors the open/close/outside-click/Escape pattern from WF Engine's
// Header.tsx Products dropdown exactly, now that /services split into 8
// dedicated domain pages (src/app/services/[domain]/) instead of one
// generalist page. /services itself stays reachable via the dropdown
// panel's own "See how we work" link, same as WF Engine keeps its
// /modules-style umbrella one click away without a dedicated top-level
// nav item.
const ICONS = {
  ShoppingCart,
  Landmark,
  Sprout,
  Boxes,
  Stethoscope,
  Truck,
  GraduationCap,
  Building2,
} as const;

// Home and Services render explicitly in the JSX below (Services is a
// dropdown, not a plain link, so it can't live in this array) -- this
// list is just the plain links that come after them, in nav order:
// Home, Services, About, Blog, Careers.
const NAV_LINKS = [
  { label: 'About', href: '/about' },
  // Case Studies muted sitewide 2026-07-22 (Adnan): pages redirect to /,
  // links removed everywhere. Restore this entry to bring the nav link back.
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggleServices = useCallback(() => setServicesOpen((v) => !v), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="container-fluid flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={`${siteConfig.name} home`}>
          <Image
            src="/bitsbuffer-logo-dark.png"
            alt={siteConfig.name}
            width={140}
            height={36}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
          >
            Home
          </Link>

          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
              onClick={toggleServices}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {servicesOpen && (
              <div
                className="absolute top-full left-0 mt-3 w-[560px] max-w-[90vw] rounded-xl border border-border bg-surface shadow-lg py-3 z-50"
                role="menu"
              >
                <div className="grid grid-cols-2 gap-1 px-2">
                  {domainPages.map((d) => {
                    const Icon = ICONS[d.iconName];
                    return (
                      <Link
                        key={d.slug}
                        href={`/services/${d.slug}`}
                        role="menuitem"
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-raised transition-colors duration-150"
                        onClick={() => setServicesOpen(false)}
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-text-primary">{d.label}</span>
                          <span className="block text-xs text-text-muted truncate">{d.eyebrow}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2 border-t border-border-subtle px-4 pt-3">
                  <Link
                    href="/services"
                    className="text-sm font-semibold text-accent-bright hover:text-accent"
                    onClick={() => setServicesOpen(false)}
                  >
                    See how we work
                    <ArrowUpRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <a
            href={siteConfig.flagshipProduct.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
          >
            Explore Workflow Engine
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <Link href="/contact" className="btn-primary text-sm">
            Contact Us
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-text-primary"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="lg:hidden border-t border-border bg-bg px-5 py-4 space-y-3"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            className="block text-sm font-medium text-text-secondary py-1.5"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <div>
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-medium text-text-secondary py-1.5"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
            >
              Services
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {mobileServicesOpen && (
              <div className="pl-3 pt-1 pb-2 space-y-1">
                {domainPages.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/services/${d.slug}`}
                    className="block text-sm text-text-secondary py-1.5"
                    onClick={() => setOpen(false)}
                  >
                    {d.label}
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="block text-sm font-semibold text-accent-bright py-1.5"
                  onClick={() => setOpen(false)}
                >
                  See how we work
                </Link>
              </div>
            )}
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm font-medium text-text-secondary py-1.5"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href={siteConfig.flagshipProduct.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full justify-center mt-2"
          >
            Explore Workflow Engine
          </a>
          <Link href="/contact" className="btn-primary w-full justify-center">
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
}
