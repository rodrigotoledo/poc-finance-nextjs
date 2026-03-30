'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { tUI } from '@/lib/i18n/ui';

export type TableFilterState = {
  q: string;
  status: string;
};

export function useTableFilters(initial?: Partial<TableFilterState>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Draft values — controlled by the inputs, not yet sent to the API.
  const [q, setQ] = useState(searchParams.get('q') ?? initial?.q ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? initial?.status ?? '');

  // Applied values — reflect what is actually being queried (from URL).
  const [qApplied, setQApplied] = useState(searchParams.get('q') ?? initial?.q ?? '');
  const [statusApplied, setStatusApplied] = useState(searchParams.get('status') ?? initial?.status ?? '');

  const hasFilters = qApplied !== '' || statusApplied !== '';

  const search = useCallback(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ''), { scroll: false });
    setQApplied(q);
    setStatusApplied(status);
  }, [q, status, router, pathname]);

  return useMemo(
    () => ({ q, setQ, status, setStatus, qApplied, statusApplied, hasFilters, search }),
    [q, status, qApplied, statusApplied, hasFilters, search],
  );
}

export function TableFilters(props: {
  q: string;
  onQChange: (v: string) => void;
  onSearch: () => void;
  status: string;
  onStatusChange: (v: string) => void;
  statusOptions: { value: string; label: string }[];
  qPlaceholder?: string;
}) {
  const showStatus = props.statusOptions.length > 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      {/* Search field — grows */}
      <div className="min-w-0 flex-1">
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {tUI('common.search')}
        </label>
        <input
          value={props.q}
          onChange={(e) => props.onQChange(e.target.value)}
          placeholder={props.qPlaceholder ?? tUI('common.searchPlaceholder')}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      {/* Status filter — fixed width */}
      {showStatus && (
        <div className="w-44 shrink-0">
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {tUI('common.status')}
          </label>
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {props.statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit button — always last, baseline-aligned */}
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {tUI('common.search')}
      </button>
    </form>
  );
}
