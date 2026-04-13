import { useMemo } from 'react';

import {
  countInstagramChars,
  extractHashtags,
  getCaptionStatus,
  INSTAGRAM_LIMITS,
} from '@/utils/instagramLimits';

export type CaptionCharStatus = ReturnType<typeof getCaptionStatus>;

export interface CharCounterResult {
  charCount: number;
  hashtagCount: number;
  status: CaptionCharStatus;
  truncatedAt: number | null;
  isOverLimit: boolean;
  remaining: number;
}

function uniqueHashtagCount(text: string): number {
  const tags = extractHashtags(text);
  return new Set(tags).size;
}

export function useCharCounter(text: string): CharCounterResult {
  return useMemo(() => {
    const charCount = countInstagramChars(text);
    const hashtagCount = uniqueHashtagCount(text);
    const status = getCaptionStatus(charCount);
    const truncatedAt =
      charCount > INSTAGRAM_LIMITS.CAPTION_TRUNCATE
        ? INSTAGRAM_LIMITS.CAPTION_TRUNCATE
        : null;
    const isOverLimit = charCount > INSTAGRAM_LIMITS.CAPTION_MAX;
    const remaining = INSTAGRAM_LIMITS.CAPTION_MAX - charCount;

    return {
      charCount,
      hashtagCount,
      status,
      truncatedAt,
      isOverLimit,
      remaining,
    };
  }, [text]);
}
