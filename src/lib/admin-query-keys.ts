// Central query-key factory (dev-lead module 02: "Query keys are a
// schema" -- ad-hoc string keys are exactly what caused stale-cache bugs
// elsewhere in the codebase's history). Only one resource so far (posts),
// structured to extend cleanly if the admin panel grows.

export const queryKeys = {
  posts: {
    all: ['admin', 'posts'] as const,
    list: () => [...queryKeys.posts.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
  },
};
