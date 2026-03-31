'use client';

import { createPortal } from 'react-dom';
import { useCallback, useState, type ReactNode } from 'react';

type Props = {
  content: string;
  children: ReactNode;
  /** Deslocamento em px a partir do cursor (evita tapar o ponteiro). */
  offset?: { x: number; y: number };
};

/**
 * Tooltip que acompanha o cursor (nativo `title` não faz isso).
 * Renderiza em `document.body` para não ser cortado por `overflow: hidden`.
 */
export function FollowCursorTooltip({ content, children, offset = { x: 14, y: 14 } }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const place = useCallback((clientX: number, clientY: number) => {
    const margin = 8;
    const estW = 300;
    const estH = 56;
    const x = Math.min(
      Math.max(margin, clientX + offset.x),
      (typeof window !== 'undefined' ? window.innerWidth : 1200) - estW - margin,
    );
    const y = Math.min(
      Math.max(margin, clientY + offset.y),
      (typeof window !== 'undefined' ? window.innerHeight : 800) - estH - margin,
    );
    return { x, y };
  }, [offset.x, offset.y]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      setPos(place(e.clientX, e.clientY));
    },
    [place],
  );

  const onEnter = useCallback(
    (e: React.MouseEvent) => {
      setOpen(true);
      setPos(place(e.clientX, e.clientY));
    },
    [place],
  );

  const tooltip =
    open && content.trim() !== '' ? (
      <div
        role="tooltip"
        className="pointer-events-none fixed z-[9999] max-w-[min(90vw,24rem)] rounded-lg border border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-zinc-50 shadow-xl ring-1 ring-black/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(0, 0)',
        }}
      >
        {content}
      </div>
    ) : null;

  return (
    <span
      className="inline-block"
      onMouseEnter={onEnter}
      onMouseLeave={() => setOpen(false)}
      onMouseMove={onMove}
    >
      {children}
      {typeof document !== 'undefined' && createPortal(tooltip, document.body)}
    </span>
  );
}
