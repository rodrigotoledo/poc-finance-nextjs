import rawMessages from '@/messages/pt-BR.json';

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function getAt(root: unknown, path: string[]): unknown {
  let cur: unknown = root;
  for (const key of path) {
    if (!isRecord(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

export function tUI(key: string): string {
  // Backward-compatible helper: all UI strings live in one place now.
  // Prefer using next-intl `useTUI()` in client components.
  // This keeps current call sites working while we migrate.
  const v = getAt(rawMessages, ['ui', ...key.split('.')]);
  return typeof v === 'string' ? v : key;
}

