'use client';

import { useState } from 'react';
import { requestExportCsv, type ExportEntity, type ExportRange } from '@/lib/api/exports';
import { tUI } from '@/lib/i18n/ui';

const ranges: { value: ExportRange; labelKey: string }[] = [
  { value: 'today', labelKey: 'exports.range.today' },
  { value: 'yesterday', labelKey: 'exports.range.yesterday' },
  { value: 'week', labelKey: 'exports.range.week' },
  { value: 'month', labelKey: 'exports.range.month' },
];

export function ExportCsvControl(props: { entity: ExportEntity }) {
  const [range, setRange] = useState<ExportRange>('today');
  const [loading, setLoading] = useState(false);

  async function onExport() {
    setLoading(true);
    try {
      await requestExportCsv({ entity: props.entity, range });
      // Alerts will appear via WebSocket event (exports.requested / exports.completed).
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {tUI('exports.action.label')}
        </label>
        <div className="mt-1 flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as ExportRange)}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {ranges.map((r) => (
              <option key={r.value} value={r.value}>
                {tUI(r.labelKey)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onExport}
            disabled={loading}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            title={tUI('exports.action.help')}
          >
            {loading ? tUI('exports.action.loading') : tUI('exports.action.button')}
          </button>
        </div>
      </div>
    </div>
  );
}

