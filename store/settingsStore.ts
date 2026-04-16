import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AppSettings } from '@/types';
import { zustandPersistStorage } from '@/utils/storage';

const defaultSettings: AppSettings = {
  username: 'my_account',
  theme: 'system',
  defaultStatus: 'draft',
  sortOrder: 'newest',
  onboardingComplete: false,
  recipeHintShown: false,
};

interface SettingsState {
  settings: AppSettings;
  updateSettings: (data: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (data) =>
        set((state) => ({
          settings: { ...state.settings, ...data },
        })),
    }),
    {
      name: 'settings',
      storage: zustandPersistStorage,
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
