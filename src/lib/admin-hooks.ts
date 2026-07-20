import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './admin-query-keys';
import type { BlogPost } from './blog-types';
import type { BlogPostUpdateInput } from './blog-schema';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export function usePostsList() {
  return useQuery({
    queryKey: queryKeys.posts.list(),
    queryFn: () => fetchJson<{ posts: BlogPost[] }>('/api/admin/posts').then((d) => d.posts),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => fetchJson<{ post: BlogPost }>(`/api/admin/posts/${id}`).then((d) => d.post),
    enabled: Boolean(id),
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BlogPostUpdateInput) =>
      fetchJson<{ post: BlogPost }>(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }).then((d) => d.post),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
      queryClient.setQueryData(queryKeys.posts.detail(id), post);
      toast.success('Saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSetPostStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: 'published' | 'draft') =>
      fetchJson<{ post: BlogPost }>(`/api/admin/posts/${id}/${status === 'published' ? 'publish' : 'unpublish'}`, {
        method: 'POST',
      }).then((d) => d.post),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
      queryClient.setQueryData(queryKeys.posts.detail(id), post);
      toast.success(post.status === 'published' ? 'Published to the live site' : 'Moved back to draft');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson<{ ok: true }>(`/api/admin/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
      toast.success('Deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
