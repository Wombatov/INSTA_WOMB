export const INSTAGRAM_LIMITS = {
  CAPTION_MAX: 2200,
  CAPTION_TRUNCATE: 125,
  HASHTAG_MAX: 30,
} as const;

export function countInstagramChars(text: string): number {
  return Array.from(text).length;
}

export function extractHashtags(text: string): string[] {
  const regex = /#[\w\u0400-\u04FF]+/g;
  return text.match(regex) ?? [];
}

export function getCaptionStatus(
  charCount: number
): 'ok' | 'warning' | 'danger' | 'error' {
  if (charCount <= 2000) return 'ok';
  if (charCount <= 2150) return 'warning';
  if (charCount <= 2200) return 'danger';
  return 'error';
}

export function getTruncatedCaption(text: string): {
  visible: string;
  hidden: string;
  isTruncated: boolean;
} {
  const chars = Array.from(text);
  if (chars.length <= INSTAGRAM_LIMITS.CAPTION_TRUNCATE) {
    return { visible: text, hidden: '', isTruncated: false };
  }
  return {
    visible: chars.slice(0, INSTAGRAM_LIMITS.CAPTION_TRUNCATE).join(''),
    hidden: chars.slice(INSTAGRAM_LIMITS.CAPTION_TRUNCATE).join(''),
    isTruncated: true,
  };
}
