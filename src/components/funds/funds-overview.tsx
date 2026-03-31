'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetch-json';
import { API_V1 } from '@/lib/types/rails-entities';
import type { FundsDashboard } from '@/lib/types/investment-domain';
import { formatBrlFromCents } from '@/lib/format';
import { StatCard } from '@/components/crud/stat-card';
import { FundsStatusChart } from '@/components/funds/funds-status-chart';
import { useTUI } from '@/i18n/client';
import { investmentRiskRiskType, t } from '@/lib/i18n/status';

export function FundsOverview() {
  const tu = useTUI();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['funds', 'dashboard'],
    queryFn: () => fetchJson<FundsDashboard>(`${API_V1}/funds/dashboard`),
    staleTime: 15_000,
  });

  if (isLoading || !data) {
    return (
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        {tu('funds.overview.loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {tu('funds.overview.errorPrefix')} {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  const dashboard = data;
  const risks = dashboard.risks_for_funds;

  return (
    <div className="mb-6 space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tu('funds.overview.sectionLedger')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard label={tu('funds.overview.statRegisteredFunds')} value={dashboard.funds_count} />
          <StatCard
            label={tu('funds.overview.statTotalCommitment')}
            value={formatBrlFromCents(dashboard.totals.total_commitment_cents)}
          />
          <StatCard
            label={tu('funds.overview.statAllocated')}
            value={formatBrlFromCents(dashboard.totals.total_allocated_cents)}
          />
          <StatCard
            label={tu('funds.overview.statAvailableSum')}
            value={formatBrlFromCents(dashboard.totals.total_available_cents)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {tu('funds.overview.sectionInvestments')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label={tu('funds.overview.statPositionsCount')} value={dashboard.investments_via_funds.count} />
          <StatCard
            label={tu('funds.overview.statVolume')}
            value={formatBrlFromCents(dashboard.investments_via_funds.total_amount_cents)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {tu('funds.overview.sectionRisks')}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{tu('funds.overview.risksHelp')}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={tu('funds.overview.statRiskEvaluations')} value={risks.count} />
          <StatCard
            label={tu('funds.overview.statAvgScore')}
            value={risks.avg_risk_score != null ? risks.avg_risk_score.toFixed(2) : t(null)}
            sub={tu('funds.overview.statAvgScoreSub')}
          />
          <StatCard
            label={tu('funds.overview.statPendingMitigation')}
            value={risks.pending_mitigation_count}
            sub={tu('funds.overview.statPendingMitigationSub')}
          />
        </div>
        {Object.keys(risks.by_risk_type).length > 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {tu('funds.overview.byRiskType')}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {Object.entries(risks.by_risk_type).map(([riskType, count]) => (
                <li
                  key={riskType}
                  className="rounded-full bg-zinc-100 px-3 py-1 tabular-nums dark:bg-zinc-800"
                >
                  {investmentRiskRiskType[riskType] ?? riskType}: <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <FundsStatusChart byStatus={dashboard.by_status} />
      </div>
    </div>
  );
}
