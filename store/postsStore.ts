import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type { Post, SortOrder } from '@/types';
import {
  countInstagramChars,
  extractHashtags,
} from '@/utils/instagramLimits';
import { generatePostTitle } from '@/utils/textFormatter';
import { zustandPersistStorage } from '@/utils/storage';

import { useSettingsStore } from './settingsStore';

/** Чистая фильтрация/сортировка для UI — не использовать как zustand-селектор (новый массив каждый раз). */
export function computeFilteredPosts(
  posts: Post[],
  searchQuery: string,
  sortOrder: SortOrder
): Post[] {
  const q = searchQuery.trim().toLowerCase();
  let list = posts.filter((post) => {
    if (!q) {
      return true;
    }
    return (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q)
    );
  });

  list = [...list];
  switch (sortOrder) {
    case 'newest':
      list.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      break;
    case 'oldest':
      list.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      break;
    case 'alphabetical':
      list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
      break;
  }
  return list;
}

function dedupeHashtagsInOrder(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }
  return result;
}

function buildPostFromContent(content: string, status: Post['status']): Post {
  const now = new Date().toISOString();
  const hashtags = dedupeHashtagsInOrder(extractHashtags(content));
  const post: Post = {
    id: uuidv4(),
    title: generatePostTitle(content),
    content,
    hashtags,
    status,
    tags: [],
    charCount: countInstagramChars(content),
    hashtagCount: hashtags.length,
    createdAt: now,
    updatedAt: now,
  };
  if (status === 'published') {
    post.publishedAt = now;
  }
  return post;
}

interface PostsState {
  posts: Post[];
  searchQuery: string;
  sortOrder: SortOrder;
  createPost: (content: string) => Post;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  markAsPublished: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  filteredPosts: () => Post[];
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      searchQuery: '',
      sortOrder: 'newest',

      createPost: (content) => {
        const defaultStatus = useSettingsStore.getState().settings.defaultStatus;
        const post = buildPostFromContent(content, defaultStatus);
        set((state) => ({ posts: [post, ...state.posts] }));
        return post;
      },

      updatePost: (id, data) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== id) {
              return post;
            }
            const merged: Post = { ...post, ...data };
            merged.updatedAt = new Date().toISOString();
            if (data.content !== undefined) {
              const hashtags = dedupeHashtagsInOrder(
                extractHashtags(merged.content)
              );
              merged.charCount = countInstagramChars(merged.content);
              merged.hashtags = hashtags;
              merged.hashtagCount = hashtags.length;
              merged.title = generatePostTitle(merged.content);
            }
            if (
              merged.status === 'published' &&
              post.status !== 'published' &&
              !merged.publishedAt
            ) {
              merged.publishedAt = new Date().toISOString();
            }
            return merged;
          }),
        }));
      },

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),

      markAsPublished: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  status: 'published' as const,
                  publishedAt: post.publishedAt ?? now,
                  updatedAt: now,
                }
              : post
          ),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSortOrder: (order) => set({ sortOrder: order }),

      filteredPosts: () => {
        const { posts, searchQuery, sortOrder } = get();
        return computeFilteredPosts(posts, searchQuery, sortOrder);
      },
    }),
    {
      name: 'posts',
      storage: zustandPersistStorage,
      partialize: (state) => ({
        posts: state.posts,
        searchQuery: state.searchQuery,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
