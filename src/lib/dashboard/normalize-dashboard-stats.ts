import type { DashboardStats } from '@/lib/types/rails-entities';

/** Garante inteiro finito (contagens, centavos). JSON às vezes devolve string (ex.: BigDecimal no Rails). */
function toFiniteInt(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
  }
  return fallback;
}

/** Taxa média e outros decimais: número finito ou null. */
function toFiniteNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeStatusCounts(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const result: Record<string, number> = {};
  for (const [status, count] of Object.entries(value as Record<string, unknown>)) {
    result[status] = toFiniteInt(count, 0);
  }
  return result;
}

/**
 * Converte a resposta crua do Nest/Rails em números tipados para gráficos (Recharts) e formatação BRL.
 */
export function normalizeDashboardStats(raw: unknown): DashboardStats {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Dashboard: resposta JSON inválida ou vazia.');
  }

  const root = raw as Record<string, unknown>;
  const originators = root.originators as Record<string, unknown> | undefined;
  const receivables = root.receivables as Record<string, unknown> | undefined;
  const creditOperations = root.credit_operations as Record<string, unknown> | undefined;
  const regulatoryGaps = root.regulatory_gaps as Record<string, unknown> | undefined;
  const imports = root.imports as Record<string, unknown> | undefined;
  const funds = root.funds as Record<string, unknown> | undefined;

  return {
    originators: {
      total: toFiniteInt(originators?.total, 0),
    },
    receivables: {
      total: toFiniteInt(receivables?.total, 0),
      total_amount_cents: toFiniteInt(receivables?.total_amount_cents, 0),
      by_status: normalizeStatusCounts(receivables?.by_status),
    },
    credit_operations: {
      total: toFiniteInt(creditOperations?.total, 0),
      total_funded_cents: toFiniteInt(creditOperations?.total_funded_cents, 0),
      avg_rate: toFiniteNumberOrNull(creditOperations?.avg_rate),
      by_status: normalizeStatusCounts(creditOperations?.by_status),
    },
    regulatory_gaps: {
      total: toFiniteInt(regulatoryGaps?.total, 0),
      open: toFiniteInt(regulatoryGaps?.open, 0),
    },
    imports: {
      total: toFiniteInt(imports?.total, 0),
      pending: toFiniteInt(imports?.pending, 0),
      processing: toFiniteInt(imports?.processing, 0),
      completed: toFiniteInt(imports?.completed, 0),
      failed: toFiniteInt(imports?.failed, 0),
    },
    funds: {
      total: toFiniteInt(funds?.total, 0),
      by_status: normalizeStatusCounts(funds?.by_status),
    },
  };
}
