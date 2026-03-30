'use client';

import { useServerEvents } from '@/hooks/use-server-events';
import { fetchNestJson } from '@/lib/api/fetch-nest';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import type { DashboardStats } from '@/lib/types/rails-entities';
import { t } from '@/lib/i18n/status';
import { tUI } from '@/lib/i18n/ui';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const ENTITIES = ['originators', 'receivables', 'credit_operations', 'regulatory_gaps', 'imports'];

function formatBRL(cents: number) {
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

  const { data: s = initialData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchNestJson<DashboardStats>(`/dashboard`),
    initialData,
    refetchInterval: 1_500,
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Originadores" value={s.originators.total} />
        <Card
          label="Recebíveis"
          value={s.receivables.total}
          sub={formatBRL(s.receivables.total_amount_cents) + ' em carteira'}
        />
        <Card
          label="Op. de Crédito"
          value={s.credit_operations.total}
          sub={formatBRL(s.credit_operations.total_funded_cents) + ' financiados'}
        />
        <Card
          label="Gaps Regulatórios"
          value={s.regulatory_gaps.total}
          sub={`${s.regulatory_gaps.open} abertos`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{tUI('dashboard.receivablesByStatus')}</p>
          <StatusBadges by_status={s.receivables.by_status} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{tUI('dashboard.creditOpsByStatus')}</p>
          <StatusBadges by_status={s.credit_operations.by_status} />
          <p className="mt-2 text-xs text-zinc-400">{tUI('dashboard.avgRate')}: {s.credit_operations.avg_rate}%</p>
        </div>
      </div>

      {(s.imports.pending > 0 || s.imports.processing > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-900/20">
          <span className="font-medium text-amber-800 dark:text-amber-300">Importações em andamento: </span>
          <span className="text-amber-700 dark:text-amber-400">
            {s.imports.processing} processando · {s.imports.pending} aguardando · {s.imports.completed} concluídas ·{' '}
            {s.imports.failed} falharam
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
