import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type { HashtagSet } from '@/types';
import { zustandPersistStorage } from '@/utils/storage';

interface HashtagsState {
  sets: HashtagSet[];
  createSet: (name: string, hashtags: string[]) => void;
  updateSet: (id: string, data: Partial<HashtagSet>) => void;
  deleteSet: (id: string) => void;
}

export const useHashtagsStore = create<HashtagsState>()(
  persist(
    (set) => ({
      sets: [],
      createSet: (name, hashtags) =>
        set((state) => ({
          sets: [
            {
              id: uuidv4(),
              name,
              hashtags,
              createdAt: new Date().toISOString(),
            },
            ...state.sets,
          ],
        })),
      updateSet: (id, data) =>
        set((state) => ({
          sets: state.sets.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      deleteSet: (id) =>
        set((state) => ({
          sets: state.sets.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'hashtag_sets',
      storage: zustandPersistStorage,
      partialize: (state) => ({ sets: state.sets }),
    }
  )
);
