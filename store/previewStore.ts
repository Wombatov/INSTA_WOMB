import { create } from 'zustand';

interface PreviewState {
  draftCaption: string;
  setDraftCaption: (text: string) => void;
  clearDraft: () => void;
  /** Одноразовый текст для экрана «Новый» после применения шаблона */
  pendingEditorText: string | null;
  setPendingEditorText: (text: string | null) => void;
  takePendingEditorText: () => string | null;
  /** Пост уже создан из шаблона — «Сохранить» в редакторе делает update, не второй create */
  templateDraftPostId: string | null;
  setTemplateDraftPostId: (id: string | null) => void;
}

export const usePreviewStore = create<PreviewState>((set, get) => ({
  draftCaption: '',
  setDraftCaption: (text) => set({ draftCaption: text }),
  clearDraft: () => set({ draftCaption: '' }),
  pendingEditorText: null,
  setPendingEditorText: (text) => set({ pendingEditorText: text }),
  takePendingEditorText: () => {
    const t = get().pendingEditorText;
    if (t != null) {
      set({ pendingEditorText: null });
    }
    return t;
  },
  templateDraftPostId: null,
  setTemplateDraftPostId: (id) => set({ templateDraftPostId: id }),
}));
