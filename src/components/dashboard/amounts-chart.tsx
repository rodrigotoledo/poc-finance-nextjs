'use client';

import { useTUI } from '@/i18n/client';
import { getStatusColor } from '@/lib/ui/status-colors';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function formatBRL(cents: number, emDash: string) {
  if (!Number.isFinite(cents)) {
    return emDash;
  }
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface Props {
  receivablesAmount: number;
  creditOpsAmount: number;
}

export function AmountsChart({ receivablesAmount, creditOpsAmount }: Props) {
  const tu = useTUI();
  const emDash = tu('common.emDash');
  const data = [
    {
      category: tu('dashboard.amountsChart.categoryReceivables'),
      amount: receivablesAmount,
      formatted: formatBRL(receivablesAmount, emDash),
      color: getStatusColor('eligible') // teal for receivables category
    },
    {
      category: tu('dashboard.amountsChart.categoryCredit'),
      amount: creditOpsAmount,
      formatted: formatBRL(creditOpsAmount, emDash),
      color: getStatusColor('approved') // emerald for credit category
    }
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {tu('dashboard.amountsChart.title')}
      </p>
      <p className="mt-0.5 text-xs text-zinc-400">{tu('dashboard.amountsChart.subtitle')}</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const cents = typeof value === 'number' ? value : Number(value);
              if (!Number.isFinite(cents)) return emDash;
              return `R$ ${(cents / 100_000).toFixed(0)}k`;
            }}
          />
          <Tooltip
            formatter={(value) => {
              const cents = typeof value === 'number' ? value : Number(value);
              return [formatBRL(cents, emDash), tu('dashboard.amountsChart.tooltipValue')];
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="formatted"
              position="top"
              style={{ fontSize: 11, fill: '#71717a' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}