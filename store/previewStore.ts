import { create } from 'zustand';

interface PreviewState {
  draftCaption: string;
  setDraftCaption: (text: string) => void;
  clearDraft: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  draftCaption: '',
  setDraftCaption: (text) => set({ draftCaption: text }),
  clearDraft: () => set({ draftCaption: '' }),
}));
