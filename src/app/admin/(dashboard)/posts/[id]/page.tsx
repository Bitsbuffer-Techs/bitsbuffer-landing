'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { usePost, useUpdatePost, useSetPostStatus, useDeletePost } from '@/lib/admin-hooks';
import { domainPages } from '@/lib/domain-pages';
import type { BlogPostUpdateInput } from '@/lib/blog-schema';

// Form uses flattened text fields for anything that's an array of strings
// in the real schema (paragraphs, table rows) -- editing "one paragraph
// per blank line" in a textarea is how a human actually edits prose;
// forcing a dynamic list of single-line inputs per paragraph would be far
// more clicks for no real benefit. Converted back to the real BlogSection
// shape in toApiPayload() right before the PATCH request.

interface SectionFormValues {
  heading: string;
  paragraphsText: string;
  pullQuote: string;
  statValue: string;
  statLabel: string;
  tableHeadersText: string;
  tableRowsText: string;
}

interface FaqFormValues {
  q: string;
  a: string;
}

interface PostFormValues {
  title: string;
  excerpt: string;
  category: string;
  domain: string;
  publishedAt: string;
  readingTime: string;
  ctaLabel: string;
  ctaHref: string;
  keyTakeaways: { value: string }[];
  sections: SectionFormValues[];
  faqs: FaqFormValues[];
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function toApiPayload(values: PostFormValues): BlogPostUpdateInput {
  const sections = values.sections.map((s) => {
    const headers = s.tableHeadersText
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    const rows = s.tableRowsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(',').map((cell) => cell.trim()));

    return {
      heading: s.heading.trim() || undefined,
      paragraphs: splitParagraphs(s.paragraphsText),
      pullQuote: s.pullQuote.trim() || undefined,
      stat: s.statValue.trim() && s.statLabel.trim() ? { value: s.statValue.trim(), label: s.statLabel.trim() } : undefined,
      table: headers.length > 0 && rows.length > 0 ? { headers, rows } : undefined,
    };
  });

  return {
    title: values.title.trim(),
    excerpt: values.excerpt.trim(),
    category: values.category.trim(),
    domain: values.domain || undefined,
    publishedAt: values.publishedAt.trim(),
    readingTime: values.readingTime.trim(),
    ctaLabel: values.ctaLabel.trim() || undefined,
    ctaHref: values.ctaHref.trim() || undefined,
    keyTakeaways: values.keyTakeaways.map((k) => k.value.trim()).filter(Boolean),
    sections,
    faqs: values.faqs.filter((f) => f.q.trim() && f.a.trim()).map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
  };
}

const emptySection: SectionFormValues = {
  heading: '',
  paragraphsText: '',
  pullQuote: '',
  statValue: '',
  statLabel: '',
  tableHeadersText: '',
  tableRowsText: '',
};

function inputClass() {
  return 'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent';
}

function labelClass() {
  return 'mb-1 block text-xs font-bold uppercase tracking-wide text-text-muted';
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading, isError, error } = usePost(id);
  const updatePost = useUpdatePost(id);
  const setStatus = useSetPostStatus(id);
  const deletePost = useDeletePost();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      excerpt: '',
      category: '',
      domain: '',
      publishedAt: '',
      readingTime: '',
      ctaLabel: '',
      ctaHref: '',
      keyTakeaways: [],
      sections: [],
      faqs: [],
    },
  });

  const sectionsArray = useFieldArray({ control, name: 'sections' });
  const takeawaysArray = useFieldArray({ control, name: 'keyTakeaways' });
  const faqsArray = useFieldArray({ control, name: 'faqs' });

  useEffect(() => {
    if (!post) return;
    reset({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      domain: post.domain ?? '',
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      ctaLabel: post.ctaLabel ?? '',
      ctaHref: post.ctaHref ?? '',
      keyTakeaways: (post.keyTakeaways ?? []).map((value) => ({ value })),
      sections: (post.sections ?? []).map((s) => ({
        heading: s.heading ?? '',
        paragraphsText: s.paragraphs.join('\n\n'),
        pullQuote: s.pullQuote ?? '',
        statValue: s.stat?.value ?? '',
        statLabel: s.stat?.label ?? '',
        tableHeadersText: s.table?.headers.join(', ') ?? '',
        tableRowsText: s.table?.rows.map((r) => r.join(', ')).join('\n') ?? '',
      })),
      faqs: post.faqs ?? [],
    });
  }, [post, reset]);

  const onSubmit = handleSubmit((values) => {
    updatePost.mutate(toApiPayload(values));
  });

  if (isLoading) return <p className="text-sm text-text-muted">Loading...</p>;
  if (isError || !post) return <p className="text-sm text-red-500">{(error as Error)?.message ?? 'Post not found'}</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
              post.status === 'published' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
            }`}
          >
            {post.status}
          </span>
          <button
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate(post.status === 'published' ? 'draft' : 'published')}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <button
            disabled={deletePost.isPending}
            onClick={() => {
              if (confirm(`Delete "${post.title}"? This can't be undone.`)) {
                deletePost.mutate(post.id!, { onSuccess: () => router.push('/admin') });
              }
            }}
            className="rounded-lg border border-border p-1.5 text-red-500 hover:border-red-400 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="mb-6 text-xs text-text-muted">
        /{post.slug} &mdash; slug is fixed once created (changing it would break the post&apos;s existing URL)
      </p>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* ── Metadata ─────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-text-muted">Metadata</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass()}>Title</label>
              <input {...register('title', { required: true })} className={inputClass()} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass()}>Excerpt</label>
              <textarea {...register('excerpt', { required: true })} rows={2} className={inputClass()} />
            </div>
            <div>
              <label className={labelClass()}>Category</label>
              <input {...register('category', { required: true })} className={inputClass()} />
            </div>
            <div>
              <label className={labelClass()}>Domain</label>
              <select {...register('domain')} className={inputClass()}>
                <option value="">None</option>
                {domainPages.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass()}>Published date</label>
              <input {...register('publishedAt', { required: true })} placeholder="YYYY-MM-DD" className={inputClass()} />
            </div>
            <div>
              <label className={labelClass()}>Reading time</label>
              <input {...register('readingTime', { required: true })} placeholder="7 min read" className={inputClass()} />
            </div>
            <div>
              <label className={labelClass()}>CTA label</label>
              <input {...register('ctaLabel')} className={inputClass()} />
            </div>
            <div>
              <label className={labelClass()}>CTA link</label>
              <input {...register('ctaHref')} placeholder="/services/fintech" className={inputClass()} />
            </div>
          </div>
        </section>

        {/* ── Key takeaways ────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-text-muted">Key takeaways</h2>
            <button
              type="button"
              onClick={() => takeawaysArray.append({ value: '' })}
              className="flex items-center gap-1 text-xs font-semibold text-accent-bright hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {takeawaysArray.fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <input {...register(`keyTakeaways.${i}.value` as const)} className={inputClass()} />
                <button type="button" onClick={() => takeawaysArray.remove(i)} className="p-1.5 text-red-500 hover:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {takeawaysArray.fields.length === 0 && <p className="text-sm text-text-muted">No key takeaways yet.</p>}
          </div>
        </section>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-text-muted">Sections</h2>
            <button
              type="button"
              onClick={() => sectionsArray.append(emptySection)}
              className="flex items-center gap-1 text-xs font-semibold text-accent-bright hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Add section
            </button>
          </div>
          <div className="space-y-6">
            {sectionsArray.fields.map((field, i) => (
              <div key={field.id} className="rounded-lg border border-border-subtle p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-text-muted">Section {i + 1}{i === 0 ? ' (lede -- heading optional)' : ''}</p>
                  <button type="button" onClick={() => sectionsArray.remove(i)} className="p-1 text-red-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass()}>Heading (H2)</label>
                    <input {...register(`sections.${i}.heading` as const)} className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass()}>Paragraphs (separate with a blank line)</label>
                    <textarea {...register(`sections.${i}.paragraphsText` as const)} rows={6} className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass()}>Pull quote (optional)</label>
                    <input {...register(`sections.${i}.pullQuote` as const)} className={inputClass()} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass()}>Stat value (optional)</label>
                      <input {...register(`sections.${i}.statValue` as const)} placeholder="~$500/mo" className={inputClass()} />
                    </div>
                    <div>
                      <label className={labelClass()}>Stat label (optional)</label>
                      <input {...register(`sections.${i}.statLabel` as const)} className={inputClass()} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass()}>Table headers (optional, comma-separated)</label>
                    <input {...register(`sections.${i}.tableHeadersText` as const)} className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass()}>Table rows (optional, one row per line, comma-separated cells)</label>
                    <textarea {...register(`sections.${i}.tableRowsText` as const)} rows={3} className={inputClass()} />
                  </div>
                </div>
              </div>
            ))}
            {sectionsArray.fields.length === 0 && <p className="text-sm text-text-muted">No sections yet.</p>}
          </div>
        </section>

        {/* ── FAQs ──────────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-text-muted">FAQs</h2>
            <button
              type="button"
              onClick={() => faqsArray.append({ q: '', a: '' })}
              className="flex items-center gap-1 text-xs font-semibold text-accent-bright hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqsArray.fields.map((field, i) => (
              <div key={field.id} className="rounded-lg border border-border-subtle p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-text-muted">FAQ {i + 1}</p>
                  <button type="button" onClick={() => faqsArray.remove(i)} className="p-1 text-red-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <input {...register(`faqs.${i}.q` as const)} placeholder="Question" className={inputClass()} />
                  <textarea {...register(`faqs.${i}.a` as const)} placeholder="Answer" rows={2} className={inputClass()} />
                </div>
              </div>
            ))}
            {faqsArray.fields.length === 0 && <p className="text-sm text-text-muted">No FAQs yet.</p>}
          </div>
        </section>

        <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg">
          <button
            type="submit"
            disabled={updatePost.isPending || !isDirty}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {updatePost.isPending ? 'Saving...' : 'Save changes'}
          </button>
          {isDirty && <span className="text-xs text-text-muted">Unsaved changes</span>}
        </div>
      </form>
    </div>
  );
}
