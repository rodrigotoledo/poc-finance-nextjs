'use client';

import { formatBrlFromCentsHuman } from '@/lib/format';
import { FollowCursorTooltip } from '@/components/ui/follow-cursor-tooltip';

type Props = {
  cents: number | null | undefined;
  emptyLabel?: string;
};

/** Moeda a partir de centavos: ≥ R$ 1 bi em formato "bi"; valor exato num tooltip que segue o cursor. */
export function FormattedBrlCents({ cents, emptyLabel = '—' }: Props) {
  if (cents == null || !Number.isFinite(cents)) {
    return <span className="tabular-nums">{emptyLabel}</span>;
  }

  const c = formatBrlFromCentsHuman(cents);
  const hint = Boolean(c.title && c.display !== c.title);

  const inner = (
    <span
      className={`tabular-nums${
        hint
          ? ' cursor-help underline decoration-dotted decoration-zinc-400 underline-offset-2 dark:decoration-zinc-600'
          : ''
      }`}
    >
      {c.display}
    </span>
  );

  return hint ? <FollowCursorTooltip content={c.title}>{inner}</FollowCursorTooltip> : inner;
}
