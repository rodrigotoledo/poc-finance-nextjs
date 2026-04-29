import rawMessages from '@/messages/en.json';

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

function getEntityLabel(path: string[]): string | undefined {
  const v = getAt(rawMessages, ['entity', ...path]);
  return typeof v === 'string' ? v : undefined;
}

function getEntityMap(path: string[]): Record<string, string> {
  const v = getAt(rawMessages, ['entity', ...path]);
  if (!isRecord(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === 'string') out[k] = val;
  }
  return out;
}

// Backward-compatible exports (used by forms/selects).
// They are still centralized (sourced from a single messages file).
export const receivableStatus = getEntityMap(['receivable', 'status']);
export const creditOperationStatus = getEntityMap(['creditOperation', 'status']);
export const regulatoryGapStatus = getEntityMap(['regulatoryGap', 'status']);
export const regulatoryGapSeverity = getEntityMap(['regulatoryGap', 'severity']);
export const importStatus = getEntityMap(['import', 'status']);
export const fundStatus = getEntityMap(['fund', 'status']);
export const investmentRiskRiskType = getEntityMap(['investmentRisk', 'riskType']);

function emDashFromMessages(): string {
  const v = getAt(rawMessages, ['ui', 'common', 'emDash']);
  return typeof v === 'string' ? v : '—';
}

/** Traduz qualquer label do sistema, com fallback para o valor original. */
export function t(value: string | null | undefined): string {
  if (value == null || value === '') return emDashFromMessages();
  return (
    getEntityLabel(['receivable', 'status', value]) ??
    getEntityLabel(['creditOperation', 'status', value]) ??
    getEntityLabel(['regulatoryGap', 'status', value]) ??
    getEntityLabel(['regulatoryGap', 'severity', value]) ??
    getEntityLabel(['import', 'status', value]) ??
    getEntityLabel(['fund', 'status', value]) ??
    getEntityLabel(['investmentRisk', 'riskType', value]) ??
    value
  );
}
