"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import CornerDots from '@/components/ui/CornerDots';

// Honeypot field renamed from "website" to "hp_token" 2026-07-08. The
// original WF Engine demo form had a honeypot named "website" that Chrome
// autofill matched by field name and silently filled in for real users,
// rejecting genuine submissions with no visible error. This form already
// hides the field with display:none (Tailwind's `hidden`, safer than the
// old off-screen-position trick), but the field name itself was still the
// exact trigger word that caused the original bug. Renaming it to
// something with no autofill-heuristic meaning removes that risk instead
// of relying on display:none alone to hold.
const initialForm = {
  name: '',
  email: '',
  company: '',
  message: '',
  hp_token: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingField, setMissingField] = useState<string | null>(null);

  // Prefills the message field when arriving from the "Ask Bitsbuffer"
  // band (?q=...), plain window.location read on mount instead of
  // useSearchParams so this doesn't need a Suspense boundary upstream.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      setForm((current) => ({ ...current, message: q }));
    }
  }, []);

  const missingRequired = useMemo(() => {
    if (!form.name.trim()) return 'name';
    if (!form.email.trim()) return 'email';
    if (!form.message.trim()) return 'message';
    return null;
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setMessage('');
    setMissingField(null);

    if (missingRequired) {
      setMissingField(missingRequired);
      setStatus('error');
      setMessage(`Please complete the ${missingRequired} field before submitting.`);
      return;
    }

    if (form.hp_token.trim()) {
      setStatus('error');
      setMessage('Your submission was blocked because the form was filled out unexpectedly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to send your message right now.');
      }

      setStatus('success');
      setMessage('Thanks. Your message has been sent. We will be in touch shortly.');
      setForm(initialForm);
    } catch (error) {
      console.error('Contact form submission failed', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="Contact form">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-4">Get in touch</h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 hover:text-text-primary">
              <Mail className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.email}</span>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 hover:text-text-primary">
              <Phone className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{siteConfig.contact.address}</span>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-text-secondary">
            We generally reply within a few business days. If you are ready to start a project, include the scope, timeline, and business context.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-text-secondary">
              <span className="mb-2 block text-text-primary">Name</span>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
            <label className="text-sm text-text-secondary">
              <span className="mb-2 block text-text-primary">Email</span>
              <input
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>
          </div>

          <label className="text-sm text-text-secondary block">
            <span className="mb-2 block text-text-primary">Company</span>
            <input
              className="form-input"
              name="company"
              value={form.company}
              onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
              placeholder="Your company"
              autoComplete="organization"
            />
          </label>

          <label className="text-sm text-text-secondary block">
            <span className="mb-2 block text-text-primary">Message</span>
            <textarea
              className="form-input min-h-32"
              name="message"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              placeholder="Tell us what you are building and what support you need."
            />
          </label>

          {/* Honeypot: hidden via display:none (Tailwind's `hidden`), a
              name with no autofill-heuristic meaning, tabIndex -1, and
              autoComplete off, four independent reasons a real browser or
              real user should never touch this field. */}
          <input
            className="hidden"
            name="hp_token"
            value={form.hp_token}
            onChange={(event) => setForm((current) => ({ ...current, hp_token: event.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {status !== 'idle' && (
            <div className={`flex items-start gap-2 rounded-lg border px-3 py-3 text-sm ${status === 'success' ? 'border-success/40 bg-success/10 text-success' : 'border-error/40 bg-error/10 text-error'}`}>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{message}</span>
            </div>
          )}

          {missingField && (
            <p className="text-sm text-error">Please complete the {missingField} field before submitting.</p>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
