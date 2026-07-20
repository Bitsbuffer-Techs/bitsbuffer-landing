'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, ExternalLink, Trash2 } from 'lucide-react';
import { usePostsList, useSetPostStatus, useDeletePost } from '@/lib/admin-hooks';
import type { BlogPost } from '@/lib/blog-types';

type StatusFilter = 'all' | 'draft' | 'published';

function StatusBadge({ status }: { status?: string }) {
  const isPublished = status === 'published';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        isPublished ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  const setStatus = useSetPostStatus(post.id!);
  const deletePost = useDeletePost();

  return (
    <tr className="border-b border-border-subtle last:border-0">
      <td className="py-3 pl-4 pr-4">
        <Link href={`/admin/posts/${post.id}`} className="font-semibold text-text-primary hover:text-accent">
          {post.title}
        </Link>
        <p className="mt-0.5 text-xs text-text-muted">/{post.slug}</p>
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={post.status} />
      </td>
      <td className="py-3 pr-4 text-sm text-text-secondary">{post.category}</td>
      <td className="py-3 pr-4 text-sm text-text-secondary">{post.publishedAt}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/posts/${post.id}`}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent"
          >
            Edit
          </Link>
          <button
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate(post.status === 'published' ? 'draft' : 'published')}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          {post.status === 'published' && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border p-1.5 text-text-secondary hover:border-accent hover:text-accent"
              title="View live"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            disabled={deletePost.isPending}
            onClick={() => {
              if (confirm(`Delete "${post.title}"? This can't be undone.`)) {
                deletePost.mutate(post.id!);
              }
            }}
            className="rounded-lg border border-border p-1.5 text-red-500 hover:border-red-400 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const { data: posts, isLoading, isError, error, refetch, isFetching } = usePostsList();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => {
      const statusOk = filter === 'all' || p.status === filter;
      const searchOk =
        !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
      return statusOk && searchOk;
    });
  }, [posts, filter, search]);

  const draftCount = posts?.filter((p) => p.status === 'draft').length ?? 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">Posts</h1>
          <p className="text-sm text-text-muted">
            New drafts land here automatically from generated posts dropped into{' '}
            <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">content-drafts/</code> &mdash; no
            copy-paste needed. {draftCount > 0 && `${draftCount} awaiting review.`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border p-1">
          {(['all', 'draft', 'published'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                filter === f ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        {isLoading && <p className="p-6 text-sm text-text-muted">Loading posts...</p>}
        {isError && <p className="p-6 text-sm text-red-500">{(error as Error).message}</p>}
        {!isLoading && !isError && filtered.length === 0 && (
          <p className="p-6 text-sm text-text-muted">
            No posts {filter !== 'all' ? `with status "${filter}"` : ''} yet.
          </p>
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface-raised text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="py-3 pl-4 pr-4">Title</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="px-4">
              {filtered.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
