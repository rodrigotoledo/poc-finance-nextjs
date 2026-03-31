'use client';

import { formatBrlFromCentsHuman } from '@/lib/format';
import { StatCard } from '@/components/crud/stat-card';
import { FundsStatusChart } from '@/components/funds/funds-status-chart';
import { useTUI } from '@/i18n/client';
import { investmentRiskRiskType, t } from '@/lib/i18n/status';
import { useFundsDashboardStream } from '@/hooks/use-funds-dashboard-stream';

export function FundsOverview() {
  const tu = useTUI();
  const { data, loading, error } = useFundsDashboardStream();

  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {tu('funds.overview.errorPrefix')} {error.message}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        {tu('funds.overview.loading')}
      </div>
    );
  }

  const dashboard = data;
  const risks = dashboard.risks_for_funds;

  const commitment = formatBrlFromCentsHuman(dashboard.totals.total_commitment_cents);
  const allocated = formatBrlFromCentsHuman(dashboard.totals.total_allocated_cents);
  const available = formatBrlFromCentsHuman(dashboard.totals.total_available_cents);
  const volume = formatBrlFromCentsHuman(dashboard.investments_via_funds.total_amount_cents);

  const statMoney = (c: { display: string; title: string }) =>
    c.title && c.display !== c.title ? { value: c.display, valueTitle: c.title } : { value: c.display };

  return (
    <div className="mb-6 space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tu('funds.overview.sectionLedger')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard label={tu('funds.overview.statRegisteredFunds')} value={dashboard.funds_count} />
          <StatCard label={tu('funds.overview.statTotalCommitment')} {...statMoney(commitment)} />
          <StatCard label={tu('funds.overview.statAllocated')} {...statMoney(allocated)} />
          <StatCard label={tu('funds.overview.statAvailableSum')} {...statMoney(available)} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {tu('funds.overview.sectionInvestments')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label={tu('funds.overview.statPositionsCount')} value={dashboard.investments_via_funds.count} />
          <StatCard label={tu('funds.overview.statVolume')} {...statMoney(volume)} />
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
