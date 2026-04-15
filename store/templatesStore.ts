import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PostTemplate } from '@/types';
import { createId } from '@/utils/createId';
import { extractVariables } from '@/utils/templateParser';
import { zustandPersistStorage } from '@/utils/storage';

interface TemplatesState {
  templates: PostTemplate[];
  createTemplate: (name: string, content: string) => PostTemplate;
  updateTemplate: (id: string, data: Partial<Pick<PostTemplate, 'name' | 'content'>>) => void;
  deleteTemplate: (id: string) => void;
}

function buildTemplate(name: string, content: string): PostTemplate {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: name.trim(),
    content,
    variables: extractVariables(content),
    createdAt: now,
  };
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set) => ({
      templates: [],

      createTemplate: (name, content) => {
        const template = buildTemplate(name, content);
        set((state) => ({
          templates: [template, ...state.templates],
        }));
        return template;
      },

      updateTemplate: (id, data) =>
        set((state) => ({
          templates: state.templates.map((item) => {
            if (item.id !== id) {
              return item;
            }
            const nextContent = data.content ?? item.content;
            const merged: PostTemplate = {
              ...item,
              ...data,
              content: nextContent,
              variables: extractVariables(nextContent),
            };
            return merged;
          }),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'post_templates',
      storage: zustandPersistStorage,
      partialize: (state) => ({ templates: state.templates }),
    }
  )
);
