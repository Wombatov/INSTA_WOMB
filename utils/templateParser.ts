const PLACEHOLDER_RE = /\{\{\s*([^}]+?)\s*\}\}/g;

/**
 * Все уникальные имена `{{переменная}}` в порядке первого появления.
 */
export function extractVariables(content: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER_RE.source, 'g');
  while ((match = re.exec(content)) !== null) {
    const name = match[1].trim();
    if (name.length === 0 || seen.has(name)) {
      continue;
    }
    seen.add(name);
    out.push(name);
  }
  return out;
}

/**
 * Подставляет значения; отсутствующий ключ → пустая строка.
 */
export function applyVariables(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_full, raw: string) => {
    const key = String(raw).trim();
    return values[key] ?? '';
  });
}
