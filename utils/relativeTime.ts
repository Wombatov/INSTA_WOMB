const MONTHS_RU = [
  'янв.',
  'фев.',
  'мар.',
  'апр.',
  'мая',
  'июн.',
  'июл.',
  'авг.',
  'сен.',
  'окт.',
  'нояб.',
  'дек.',
] as const;

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Короткая относительная дата для карточки поста (на основе ISO-строки).
 */
export function formatRelativePostDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) {
    return 'Сейчас';
  }
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) {
    return 'только что';
  }
  if (diffMin < 60) {
    return `${diffMin} мин. назад`;
  }
  if (diffHour < 24) {
    return `${diffHour} ч. назад`;
  }

  const dayDiff = Math.floor(
    (startOfLocalDay(now) - startOfLocalDay(date)) / 86400000
  );

  if (dayDiff === 0) {
    return 'Сегодня';
  }
  if (dayDiff === 1) {
    return 'Вчера';
  }
  if (dayDiff < 7) {
    return `${dayDiff} дн. назад`;
  }

  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;
}
