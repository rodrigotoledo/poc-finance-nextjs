'use client';

import { ExportCsvControl } from '@/components/ui/export-csv';
import { fetchJson } from '@/lib/api/fetch-json';
import { t } from '@/lib/i18n/status';
import { tUI } from '@/lib/i18n/ui';
import type { RailsEvent } from '@/lib/types/rails-entities';
import { getStatusTailwindClass } from '@/lib/ui/status-colors';
import { useQuery } from '@tanstack/react-query';

const FEED_LIMIT = 50;

const ACTION_COLORS: Record<string, string> = {
  created:   getStatusTailwindClass('approved'),
  updated:   'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  discarded: getStatusTailwindClass('cancelled'),
  changed:   getStatusTailwindClass('draft'),
};

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function eventSummary(ev: RailsEvent): string {
  const parts: string[] = [];
  const meta = ev.meta ?? {};
  if (meta.status)              parts.push(`${tUI('dashboard.feed.summary.status')}: ${t(String(meta.status))}`);
  if (meta.funded_amount_cents) parts.push(formatBRL(Number(meta.funded_amount_cents)));
  if (meta.amount_cents)        parts.push(formatBRL(Number(meta.amount_cents)));
  if (meta.rate)                parts.push(`${tUI('dashboard.feed.summary.rate')}: ${meta.rate}%`);
  if (meta.due_on)              parts.push(`${tUI('dashboard.feed.summary.dueOn')}: ${meta.due_on}`);
  if (meta.name && typeof meta.name === 'string') parts.push(meta.name);
  if (meta.allocated_amount_cents != null)
    parts.push(formatBRL(Number(meta.allocated_amount_cents)));
  return parts.join(' · ');
}

export function LiveFeed() {
  const { data: events = [], isLoading, isRefetching } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: async () => fetchJson<RailsEvent[]>('/api/v2/events'),
    refetchInterval: 1_500,
  });

  const active = !isLoading && !isRefetching;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tUI('dashboard.feed.title')}</h2>
          <ExportCsvControl entity="events" />
        </div>
        <span className={`flex items-center gap-1.5 text-xs ${!isLoading ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${!isLoading ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
          {!isLoading ? tUI('dashboard.feed.connected') : tUI('dashboard.feed.waiting')}
        </span>
      </div>

      <div className="relative">
        <div className="max-h-[420px] overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-900">
        {events.length === 0 && !isLoading && (
          <p className="px-4 py-6 text-center text-sm text-zinc-400">
            {tUI('dashboard.feed.empty')}
          </p>
        )}
        {events.map((ev, idx) => (
          <div key={`${ev.id}-${idx}`} className="flex items-start gap-3 px-4 py-2.5">
            <span className="mt-0.5 shrink-0 text-xs tabular-nums text-zinc-400">
              {new Date(ev.time).toLocaleTimeString('en-US')}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {tUI(`dashboard.feed.entity.${ev.entity}`)}
                  {ev.id ? <span className="ml-1 text-xs text-zinc-400">#{ev.id}</span> : null}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[ev.action] ?? ACTION_COLORS.changed}`}>
                  {tUI(`dashboard.feed.action.${ev.action}`)}
                </span>
              </div>
              {eventSummary(ev) && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {eventSummary(ev)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent dark:from-zinc-950" />
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <span>
          {events.length} {tUI('dashboard.feed.countSuffix')}
          <span className="ml-1 text-zinc-400">·</span>{' '}
          <span className="text-zinc-400">últimos {FEED_LIMIT}</span>
        </span>
      </div>
    </div>
  );
}
