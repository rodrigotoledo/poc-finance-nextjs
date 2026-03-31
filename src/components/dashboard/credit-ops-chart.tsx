'use client';

import { useTUI } from '@/i18n/client';
import { t } from '@/lib/i18n/status';
import { getFallbackColor, getStatusColor } from '@/lib/ui/status-colors';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function fallbackColor(index: number) {
  return getFallbackColor(index);
}

interface Props {
  by_status: Record<string, number>;
  avg_rate: number | null;
}

export function CreditOpsChart({ by_status, avg_rate }: Props) {
  const tu = useTUI();
  const data = Object.entries(by_status)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({ status, count, label: t(status) }));

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  const avgRateStr =
    avg_rate != null ? `${avg_rate.toFixed(4)}%` : tu('common.emDash');

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {tu('dashboard.creditOpsChart.title')}
      </p>
      <p className="mt-0.5 text-xs text-zinc-400">
        {tu('dashboard.creditOpsChart.subtitle', { count: total, avgRate: avgRateStr })}
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.status}
                fill={getStatusColor(entry.status) ?? fallbackColor(index)}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name: string) => {
              const count = typeof value === 'number' ? value : Number(value);
              const safe = Number.isFinite(count) ? count : 0;
              const pct = total > 0 ? ((safe / total) * 100).toFixed(1) : '0.0';
              return [`${safe} (${pct}%)`, name];
            }}
            contentStyle={{
              fontSize: '12px',
              borderRadius: '8px',
              border: '1px solid #e4e4e7',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
