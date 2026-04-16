import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { BUILT_IN_RECIPES } from '@/constants/builtInRecipes';
import type { Recipe, RecipeCategory } from '@/types';
import { createId } from '@/utils/createId';
import { zustandPersistStorage } from '@/utils/storage';

export type RecipeFilter = RecipeCategory | 'all' | 'mine';

interface RecipesState {
  userRecipes: Recipe[];
  /** Дополнительные использования встроенных рецептов (не персистится). */
  builtInUsageCounts: Record<string, number>;
  getAllRecipes: () => Recipe[];
  incrementUsage: (id: string) => void;
  createUserRecipe: (data: {
    name: string;
    emoji: string;
    category: RecipeCategory;
    description: string;
    content: string;
    tags: string[];
  }) => Recipe;
  deleteUserRecipe: (id: string) => void;
  filterByCategory: (category: RecipeFilter) => Recipe[];
}

function mergeBuiltInList(counts: Record<string, number>): Recipe[] {
  return BUILT_IN_RECIPES.map((r) => ({
    ...r,
    usageCount: r.usageCount + (counts[r.id] ?? 0),
  }));
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      userRecipes: [],
      builtInUsageCounts: {},

      getAllRecipes: () => {
        const { userRecipes, builtInUsageCounts } = get();
        const built = mergeBuiltInList(builtInUsageCounts);
        const userSorted = [...userRecipes].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return [...built, ...userSorted];
      },

      incrementUsage: (id) => {
        const built = BUILT_IN_RECIPES.find((r) => r.id === id);
        if (built) {
          set((state) => ({
            builtInUsageCounts: {
              ...state.builtInUsageCounts,
              [id]: (state.builtInUsageCounts[id] ?? 0) + 1,
            },
          }));
          return;
        }
        set((state) => ({
          userRecipes: state.userRecipes.map((r) =>
            r.id === id ? { ...r, usageCount: r.usageCount + 1 } : r
          ),
        }));
      },

      createUserRecipe: (data) => {
        const recipe: Recipe = {
          id: createId(),
          name: data.name.trim(),
          emoji: data.emoji,
          category: data.category,
          description: data.description.trim(),
          content: data.content,
          tags: data.tags,
          isBuiltIn: false,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          userRecipes: [recipe, ...state.userRecipes],
        }));
        return recipe;
      },

      deleteUserRecipe: (id) =>
        set((state) => ({
          userRecipes: state.userRecipes.filter((r) => r.id !== id),
        })),

      filterByCategory: (category) => {
        const all = get().getAllRecipes();
        if (category === 'all') {
          return all;
        }
        if (category === 'mine') {
          return all.filter((r) => !r.isBuiltIn);
        }
        return all.filter((r) => r.category === category);
      },
    }),
    {
      name: 'captioncraft-recipes',
      storage: zustandPersistStorage,
      partialize: (state) => ({ userRecipes: state.userRecipes }),
    }
  )
);
