export interface SelectionSpan {
  start: number;
  end: number;
}

export function insertFragmentAtSelection(
  base: string,
  selection: SelectionSpan,
  fragment: string
): { nextText: string; caret: number } {
  const safeStart = Math.max(0, Math.min(selection.start, base.length));
  const safeEnd = Math.max(safeStart, Math.min(selection.end, base.length));
  const nextText = base.slice(0, safeStart) + fragment + base.slice(safeEnd);
  const caret = safeStart + fragment.length;
  return { nextText, caret };
}
