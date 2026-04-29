'use client';

import { AmountsChart } from '@/components/dashboard/amounts-chart';
import { CreditOpsChart } from '@/components/dashboard/credit-ops-chart';
import { ReceivablesChart } from '@/components/dashboard/receivables-chart';
import { useServerEvents } from '@/hooks/use-server-events';
import { fetchJson } from '@/lib/api/fetch-json';
import { t } from '@/lib/i18n/status';
import { tUI } from '@/lib/i18n/ui';
import { normalizeDashboardStats } from '@/lib/dashboard/normalize-dashboard-stats';
import type { DashboardStats } from '@/lib/types/rails-entities';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';

const ENTITIES = [
  'originators',
  'receivables',
  'credit_operations',
  'regulatory_gaps',
  'imports',
  'funds',
];

function formatBRL(cents: number) {
  if (!Number.isFinite(cents)) {
    return tUI('common.emDash');
  }
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Card({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

function StatusBadges({ by_status }: { by_status: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(by_status).map(([status, count]) => (
        <span key={status} className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(status)}`}>
          {t(status)}: <strong>{count}</strong>
        </span>
      ))}
    </div>
  );
}

export function StatsCards({ initialData }: { initialData: DashboardStats }) {
  useServerEvents(ENTITIES);

  const normalizedInitialData = useMemo(
    () => normalizeDashboardStats(initialData as unknown),
    [initialData],
  );

  const { data: s = normalizedInitialData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => normalizeDashboardStats(await fetchJson<unknown>(`/api/v2/dashboard`)),
    initialData: normalizedInitialData,
    refetchInterval: 1_500,
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card label={tUI('dashboard.cards.originators')} value={s.originators.total} />
        <Card
          label={tUI('dashboard.cards.receivables')}
          value={s.receivables.total}
          sub={`${formatBRL(s.receivables.total_amount_cents)} ${tUI('dashboard.cards.receivablesInPortfolio')}`}
        />
        <Card
          label={tUI('dashboard.cards.creditOperations')}
          value={s.credit_operations.total}
          sub={`${formatBRL(s.credit_operations.total_funded_cents)} ${tUI('dashboard.cards.creditOperationsFinanced')}`}
        />
        <Card
          label={tUI('dashboard.cards.regulatoryGaps')}
          value={s.regulatory_gaps.total}
          sub={tUI('dashboard.cards.gapsOpen').replace('{count}', String(s.regulatory_gaps.open))}
        />
        <Card
          label={tUI('dashboard.cards.funds')}
          value={s.funds.total}
          sub={tUI('dashboard.cards.fundsRegisteredApi')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{tUI('dashboard.receivablesByStatus')}</p>
          <StatusBadges by_status={s.receivables.by_status} />
        </div>
        <CreditOpsChart by_status={s.credit_operations.by_status} avg_rate={s.credit_operations.avg_rate} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReceivablesChart by_status={s.receivables.by_status} />
        <AmountsChart
          receivablesAmount={s.receivables.total_amount_cents}
          creditOpsAmount={s.credit_operations.total_funded_cents}
        />
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {tUI('dashboard.summary.title')}
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{tUI('dashboard.summary.activeOriginators')}</span>
              <span className="font-medium">{s.originators.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{tUI('dashboard.summary.regulatoryGaps')}</span>
              <span className="font-medium">{s.regulatory_gaps.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{tUI('dashboard.summary.avgRate')}</span>
              <span className="font-medium">
                {s.credit_operations.avg_rate != null
                  ? `${s.credit_operations.avg_rate.toFixed(4)}%`
                  : tUI('common.emDash')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {(s.imports.pending > 0 || s.imports.processing > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-900/20">
          <span className="font-medium text-amber-800 dark:text-amber-300">
            {tUI('dashboard.importsProgress.title')}{' '}
          </span>
          <span className="text-amber-700 dark:text-amber-400">
            {tUI('dashboard.importsProgress.line')
              .replace('{processing}', String(s.imports.processing))
              .replace('{pending}', String(s.imports.pending))
              .replace('{completed}', String(s.imports.completed))
              .replace('{failed}', String(s.imports.failed))}
          </span>
        </div>
      )}

      {s.imports.failed > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-900/20">
          <span className="font-medium text-red-800 dark:text-red-300">
            {tUI('dashboard.imports.failedTitle')}:{' '}
          </span>
          <span className="text-red-700 dark:text-red-400">
            {tUI('dashboard.imports.failedBody').replace('{count}', String(s.imports.failed))}
            {' '}
            <Link href="/imports" className="font-medium underline underline-offset-2 hover:opacity-90">
              {tUI('dashboard.imports.failedCta')}
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
