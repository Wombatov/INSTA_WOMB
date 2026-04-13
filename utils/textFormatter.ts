const TITLE_CHAR_MAX = 50;

export function generatePostTitle(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return '';
  }
  const chars = Array.from(trimmed);
  if (chars.length <= TITLE_CHAR_MAX) {
    return trimmed;
  }
  return `${chars.slice(0, TITLE_CHAR_MAX).join('').trimEnd()}…`;
}

export function formatHashtags(hashtags: string[]): string {
  return hashtags
    .map((tag) => {
      const t = tag.trim();
      if (t.length === 0) {
        return '';
      }
      return t.startsWith('#') ? t : `#${t}`;
    })
    .filter((tag) => tag.length > 0)
    .join(' ');
}
