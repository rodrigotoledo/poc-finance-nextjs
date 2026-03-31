'use client';

import { FollowCursorTooltip } from '@/components/ui/follow-cursor-tooltip';

type Props = {
  label: string;
  value: string | number;
  sub?: string;
  /** Valor completo (ex.: moeda); tooltip segue o cursor quando abreviado. */
  valueTitle?: string;
};

export function StatCard({ label, value, sub, valueTitle }: Props) {
  const hint =
    valueTitle != null &&
    valueTitle !== "" &&
    String(value).trim() !== String(valueTitle).trim();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
        {hint && valueTitle ? (
          <FollowCursorTooltip content={valueTitle}>
            <span className="cursor-help underline decoration-dotted decoration-zinc-400 underline-offset-4 dark:decoration-zinc-600">
              {value}
            </span>
          </FollowCursorTooltip>
        ) : (
          value
        )}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-zinc-400">{sub}</p> : null}
    </div>
  );
}
