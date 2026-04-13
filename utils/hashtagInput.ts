import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

/** Символы в теле хэштега (латиница, цифры, _, кириллица) — согласовано с extractHashtags. */
const TAG_BODY = /^[\w\u0400-\u04FF]+$/;

/**
 * Разбирает строку с хэштегами через пробел или запятую.
 * Нормализует к виду `#tag`, убирает дубликаты (без учёта регистра), не более лимита Instagram.
 */
export function parseHashtagInput(raw: string): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();
  const parts = raw.split(/[\s,]+/u).filter((p) => p.length > 0);

  for (const part of parts) {
    if (normalized.length >= INSTAGRAM_LIMITS.HASHTAG_MAX) {
      break;
    }
    let t = part.trim();
    if (t.length === 0) {
      continue;
    }
    if (!t.startsWith('#')) {
      t = `#${t}`;
    }
    const body = t.slice(1);
    if (body.length === 0 || !TAG_BODY.test(body)) {
      continue;
    }
    const dedupeKey = body.toLowerCase();
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);
    normalized.push(t);
  }

  return normalized;
}
