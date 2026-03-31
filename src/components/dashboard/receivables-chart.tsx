'use client';

import { t } from '@/lib/i18n/status';
import { getFallbackColor, getStatusColor } from '@/lib/ui/status-colors';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function fallbackColor(index: number) {
  return getFallbackColor(index);
}

interface Props {
  by_status: Record<string, number>;
}

export function ReceivablesChart({ by_status }: Props) {
  const data = Object.entries(by_status)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      status,
      count,
      label: t(status),
      color: getStatusColor(status)
    }));

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Recebíveis por status
      </p>
      <p className="mt-0.5 text-xs text-zinc-400">{total} recebíveis</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [value, 'Quantidade']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}