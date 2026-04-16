export type SortOrder = 'newest' | 'oldest' | 'draftsFirst';

export interface Post {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  status: 'draft' | 'published';
  tags: string[];
  charCount: number;
  hashtagCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface HashtagSet {
  id: string;
  name: string;
  hashtags: string[];
  createdAt: string;
}

export type RecipeCategory =
  | 'announce'
  | 'story'
  | 'sale'
  | 'engage'
  | 'edu'
  | 'personal'
  | 'custom';

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: RecipeCategory;
  description: string;
  content: string;
  tags: string[];
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: string;
}

export interface AppSettings {
  username: string;
  avatarUri?: string;
  theme: 'light' | 'dark' | 'system';
  defaultStatus: 'draft' | 'published';
  sortOrder: SortOrder;
  onboardingComplete: boolean;
  /** Показан ли тултип у маркера обрезки (125 символов) в редакторе */
  truncationMarkerTooltipSeen?: boolean;
  /** Показан ли баннер-подсказка на экране применения рецепта */
  recipeHintShown?: boolean;
}
