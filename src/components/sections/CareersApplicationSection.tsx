'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Paperclip } from 'lucide-react';
import CornerDots from '@/components/ui/CornerDots';

// Replaces FinalCTASection on /careers, 2026-07-17, Adnan's call: closing
// a careers page on "Tell us what you are building" (FinalCTASection's
// copy, written for prospects with a project to scope) made no sense for
// a candidate here to apply for a role, not start a build. Modeled on
// ContactForm.tsx's own card-plus-form layout and honeypot pattern
// (hp_token, not "website", see that file's header comment for why),
// posts to /api/careers as multipart/form-data since a resume file is
// involved, not JSON like the contact form.
const ROLE_OPTIONS = [
  'Product engineer',
  'Full-stack developer',
  'Designer or product thinker',
  'Delivery or operations specialist',
  'Other',
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export default function CareersApplicationSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [hpToken, setHpToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setStatus('error');
      setStatusMessage('Resume file is too large. Max size is 5MB.');
      event.target.value = '';
      setResume(null);
      return;
    }
    setResume(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setStatusMessage('');

    if (!name.trim() || !email.trim() || !role.trim()) {
      setStatus('error');
      setStatusMessage('Please complete your name, email, and the role you are interested in.');
      return;
    }
    if (!resume) {
      setStatus('error');
      setStatusMessage('Please attach your resume.');
      return;
    }
    if (hpToken.trim()) {
      setStatus('error');
      setStatusMessage('Your submission was blocked because the form was filled out unexpectedly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('name', name);
      formData.set('email', email);
      formData.set('phone', phone);
      formData.set('role', role);
      formData.set('portfolio', portfolio);
      formData.set('message', message);
      formData.set('resume', resume);
      formData.set('hp_token', hpToken);

      // No Content-Type header set manually -- the browser generates the
      // correct multipart boundary itself when the fetch body is a
      // FormData instance, setting it by hand breaks the boundary.
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to submit your application right now.');
      }

      setStatus('success');
      setStatusMessage('Thanks, your application has been sent. We will be in touch if it is a fit.');
      setName('');
      setEmail('');
      setPhone('');
      setRole('');
      setPortfolio('');
      setMessage('');
      setResume(null);
      setHpToken('');
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Careers application submission failed', error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Unable to submit your application right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section relative overflow-hidden border-y border-border-subtle bg-surface" aria-label="Apply to Bitsbuffer">
      <CornerDots corner="top-left" />
      <CornerDots corner="bottom-right" />

      <div className="container-site relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-4">Apply for a role</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Send your resume and a short note on what you would bring to the team. We hire around real project
            need, see the roles above, so tell us honestly where you fit, even if nothing is posted right now.
          </p>
          <div className="mt-6 space-y-4 text-sm text-text-secondary">
            <a href="mailto:hr@bitsbuffer.com" className="flex items-center gap-3 hover:text-text-primary">
              <Mail className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
              <span>hr@bitsbuffer.com</span>
            </a>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-text-secondary">
            We review every application and reply within a few business days if it is a fit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-text-secondary">
              <span className="mb-2 block text-text-primary">Name</span>
              <input
                className="form-input"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-text-secondary">
              <span className="mb-2 block text-text-primary">Phone (optional)</span>
              <input
                className="form-input"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+92 300 1234567"
                autoComplete="tel"
              />
            </label>
            <label className="text-sm text-text-secondary">
              <span className="mb-2 block text-text-primary">Role interested in</span>
              <select
                className="form-input"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="">Select a role</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-sm text-text-secondary block">
            <span className="mb-2 block text-text-primary">Portfolio or LinkedIn (optional)</span>
            <input
              className="form-input"
              name="portfolio"
              type="url"
              value={portfolio}
              onChange={(event) => setPortfolio(event.target.value)}
              placeholder="https://"
              autoComplete="url"
            />
          </label>

          <label className="text-sm text-text-secondary block">
            <span className="mb-2 block text-text-primary">Cover note (optional)</span>
            <textarea
              className="form-input min-h-28"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What would you bring to the team?"
            />
          </label>

          <label className="text-sm text-text-secondary block">
            <span className="mb-2 block text-text-primary">Resume</span>
            <div className="flex items-center gap-3">
              <label
                htmlFor="resume-upload"
                className="btn-secondary cursor-pointer whitespace-nowrap"
              >
                <Paperclip className="h-4 w-4" aria-hidden="true" />
                Choose file
              </label>
              <span className="text-sm text-text-muted truncate">
                {resume ? resume.name : 'PDF or Word, up to 5MB'}
              </span>
            </div>
            <input
              id="resume-upload"
              className="hidden"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </label>

          {/* Honeypot: hidden via display:none (Tailwind's `hidden`), a
              name with no autofill-heuristic meaning, tabIndex -1, and
              autoComplete off, same as ContactForm.tsx. */}
          <input
            className="hidden"
            name="hp_token"
            value={hpToken}
            onChange={(event) => setHpToken(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {status !== 'idle' && (
            <div
              className={`flex items-start gap-2 rounded-lg border px-3 py-3 text-sm ${
                status === 'success' ? 'border-success/40 bg-success/10 text-success' : 'border-error/40 bg-error/10 text-error'
              }`}
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Submit application'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
