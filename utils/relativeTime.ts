const MONTHS_SHORT_RU = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
] as const;

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function daysAgoPhrase(dayDiff: number): string {
  const n = dayDiff;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) {
    return `${n} дней назад`;
  }
  if (mod10 === 1) {
    return `${n} день назад`;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${n} дня назад`;
  }
  return `${n} дней назад`;
}

/**
 * Короткая относительная дата для карточки поста (на основе ISO-строки):
 * «сегодня», «вчера», «3 дня назад», «15 янв» и т.д.
 */
export function formatRelativePostDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) {
    return 'сейчас';
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
    return 'сегодня';
  }
  if (dayDiff === 1) {
    return 'вчера';
  }
  if (dayDiff < 7) {
    return daysAgoPhrase(dayDiff);
  }

  return `${date.getDate()} ${MONTHS_SHORT_RU[date.getMonth()]}`;
}
