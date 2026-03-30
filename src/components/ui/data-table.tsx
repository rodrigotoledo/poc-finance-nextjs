'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { tUI } from '@/lib/i18n/ui';

interface DataTableProps<TData> {
  // Colunas do TanStack têm TValue por coluna (number, string, …); misturar exige relaxar o genérico.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ColumnDef<T, TValue> heterogêneo
  columns: ColumnDef<TData, any>[];
  data: TData[];
  emptyMessage?: string;
  /** Paginação no servidor (alinhado a `meta.total_pages` da API). */
  manualPagination?: boolean;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  totalCount?: number;
}

export function DataTable<TData>({
  columns,
  data,
  emptyMessage = 'Nenhum registro.',
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
  totalCount,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(manualPagination && pagination ? { pagination } : {}),
    },
    onSortingChange: setSorting,
    ...(manualPagination && pageCount !== undefined && pagination && onPaginationChange
      ? {
          manualPagination: true,
          pageCount,
          onPaginationChange,
        }
      : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const showPager = manualPagination && pageCount !== undefined && pagination && onPaginationChange;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 select-none"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  <span className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-zinc-500">{emptyMessage}</p>
      )}
      {showPager && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            {totalCount != null ? (
              <>
                {tUI('table.pager.total')}: <span className="font-medium tabular-nums text-zinc-700 dark:text-zinc-300">{totalCount}</span>
                {' · '}
              </>
            ) : null}
            {tUI('table.pager.page')}{' '}
            <span className="tabular-nums font-medium text-zinc-700 dark:text-zinc-300">
              {pagination.pageIndex + 1}
            </span>{' '}
            {tUI('table.pager.of')} {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              {tUI('common.previous')}
            </button>
            <button
              type="button"
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              {tUI('common.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
