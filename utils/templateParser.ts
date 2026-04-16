export function highlightPlaceholders(
  text: string
): Array<{ text: string; isPlaceholder: boolean }> {
  const parts: Array<{ text: string; isPlaceholder: boolean }> = [];
  const regex = /(\[[^\]]+\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isPlaceholder: false });
    }
    parts.push({ text: match[0], isPlaceholder: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isPlaceholder: false });
  }
  return parts;
}
