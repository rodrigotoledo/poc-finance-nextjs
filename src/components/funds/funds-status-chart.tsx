'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTUI } from '@/i18n/client';
import { t } from '@/lib/i18n/status';

export function FundsStatusChart({ byStatus }: { byStatus: Record<string, number> }) {
  const tu = useTUI();
  const data = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      status,
      count,
      label: t(status),
    }));

  if (data.length === 0) return null;

  const total = data.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {tu('funds.statusChart.title')}
      </p>
      <p className="mt-0.5 text-xs text-zinc-400">
        {tu('funds.statusChart.fundCount', { count: total })}
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} interval={0} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            formatter={(value) => {
              const quantity = typeof value === 'number' ? value : Number(value);
              return [Number.isFinite(quantity) ? quantity : 0, tu('common.quantity')];
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
