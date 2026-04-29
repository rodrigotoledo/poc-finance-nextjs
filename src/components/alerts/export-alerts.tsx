'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { RailsEvent } from '@/lib/types/rails-entities';
import { tUI } from '@/lib/i18n/ui';
import { getApiBaseUrl } from '@/lib/api/config';

type AlertItem = {
  key: number;
  kind: 'info' | 'success' | 'error';
  message: string;
};

function alertClasses(kind: AlertItem['kind']) {
  switch (kind) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100';
    case 'error':
      return 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100';
    default:
      return 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100';
  }
}

export function ExportAlerts() {
  const [items, setItems] = useState<AlertItem[]>([]);
  const keyRef = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const maxItems = 3;
  const ttlMs = 9_000;

  const rangeLabel = useMemo(
    () => ({
      today: tUI('exports.range.today'),
      yesterday: tUI('exports.range.yesterday'),
      week: tUI('exports.range.week'),
      month: tUI('exports.range.month'),
    }),
    [],
  );

  function pushAlert(a: Omit<AlertItem, 'key'>) {
    const key = ++keyRef.current;
    setItems((prev) => [{ ...a, key }, ...prev].slice(0, maxItems));

    const t = window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.key !== key));
      timers.current.delete(key);
    }, ttlMs);
    timers.current.set(key, t);
  }

  useEffect(() => {
    const timersMap = timers.current;
    const url = `${getApiBaseUrl()}/api/v2/events`;
    const source = new EventSource(url);

    source.onmessage = (msg) => {
      let ev: RailsEvent;
      try {
        ev = JSON.parse(msg.data) as RailsEvent;
      } catch {
        return;
      }

      if (ev.entity !== 'exports') return;
      const meta = (ev.meta ?? {}) as Record<string, unknown>;
      const entity = typeof meta.entity === 'string' ? meta.entity : undefined;
      const range = typeof meta.range === 'string' ? meta.range : undefined;
      const file = typeof meta.filename === 'string' ? meta.filename : undefined;
      const rows = typeof meta.row_count === 'number' ? meta.row_count : undefined;
      const error = typeof meta.error === 'string' ? meta.error : undefined;

      if (ev.action === 'requested') {
        pushAlert({
          kind: 'info',
          message:
            `${tUI('exports.alert.requested')}` +
            (entity ? ` · ${tUI(`exports.entity.${entity}`)}` : '') +
            (range ? ` · ${rangeLabel[range as keyof typeof rangeLabel] ?? range}` : ''),
        });
      }

      if (ev.action === 'completed') {
        pushAlert({
          kind: 'success',
          message:
            `${tUI('exports.alert.ready')}` +
            (entity ? ` · ${tUI(`exports.entity.${entity}`)}` : '') +
            (range ? ` · ${rangeLabel[range as keyof typeof rangeLabel] ?? range}` : '') +
            (rows != null ? ` · ${rows} ${tUI('exports.alert.rows')}` : '') +
            (file ? ` · ${file}` : ''),
        });
      }

      if (ev.action === 'failed') {
        pushAlert({
          kind: 'error',
          message: `${tUI('exports.alert.failed')}${error ? ` · ${error}` : ''}`,
        });
      }
    };

    return () => {
      source.close();
      for (const t of timersMap.values()) window.clearTimeout(t);
      timersMap.clear();
    };
  }, [rangeLabel]);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-3xl space-y-2">
        {items.map((a) => (
          <div
            key={a.key}
            className={`rounded-xl border px-4 py-2 text-sm shadow-sm ${alertClasses(a.kind)}`}
          >
            {a.message}
          </div>
        ))}
      </div>
    </div>
  );
}

