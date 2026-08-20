import { BlogPost } from '../types';
import postsData from './posts.json';

// Nieuwste eerst. posts.json is de bron van waarheid en wordt uitgebreid
// door de dagelijkse geplande taak; volgorde hier is puur voor weergave.
export const allPosts: BlogPost[] = [...(postsData as BlogPost[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): { prev: BlogPost; next: BlogPost } {
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const total = allPosts.length;
  return {
    prev: allPosts[(idx - 1 + total) % total],
    next: allPosts[(idx + 1) % total],
  };
}
