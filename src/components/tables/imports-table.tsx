'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type ImportBatch } from '@/lib/types/rails-entities';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { formatDate } from '@/lib/format';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import { t } from '@/lib/i18n/status';
import { useServerEvents } from '@/hooks/use-server-events';
import { DataTable } from '@/components/ui/data-table';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { tUI } from '@/lib/i18n/ui';
import { ExportCsvControl } from '@/components/ui/export-csv';

const col = createColumnHelper<ImportBatch>();

const columns = [
  col.accessor('filename', {
    header: 'Ficheiro',
    cell: (i) => <span className="font-mono text-xs">{i.getValue()}</span>,
  }),
  col.accessor('file_type', { header: 'Tipo' }),
  col.accessor('status', {
    header: 'Estado',
    cell: (i) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.getValue())}`}>
        {t(i.getValue())}
      </span>
    ),
  }),
  col.display({
    id: 'rows',
    header: 'Linhas',
    cell: ({ row }) => (
      <span className="tabular-nums text-xs">
        {row.original.processed_rows}/{row.original.total_rows}
      </span>
    ),
  }),
  col.accessor('failed_rows', {
    header: 'Falhas',
    cell: (i) => (
      <span className="tabular-nums text-red-600 dark:text-red-400">{i.getValue()}</span>
    ),
  }),
  col.accessor('updated_at', {
    header: 'Atualizado',
    cell: (i) => <span className="text-xs text-zinc-500">{formatDate(i.getValue())}</span>,
  }),
];

export function ImportsTable({ initialPage }: { initialPage: PaginatedResponse<ImportBatch> }) {
  useServerEvents(['imports']);

  const filters = useTableFilters();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPage.meta.page - 1,
    pageSize: initialPage.meta.per_page,
  });

  const matchesInitial =
    !filters.hasFilters &&
    pagination.pageIndex === initialPage.meta.page - 1 &&
    pagination.pageSize === initialPage.meta.per_page;

  const { data = initialPage } = useQuery({
    queryKey: ['imports', pagination.pageIndex, pagination.pageSize, filters.qApplied, filters.statusApplied],
    queryFn: () =>
      fetchPaginated<ImportBatch>(`${API_V1}/imports`, {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        extra: {
          q: filters.qApplied || undefined,
          status: filters.statusApplied || undefined,
        },
      }),
    placeholderData: keepPreviousData,
    initialData: matchesInitial ? initialPage : undefined,
  });

  const pageCount = Math.max(1, data.meta.total_pages);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ExportCsvControl entity="imports" />
      </div>
      <TableFilters
        q={filters.q}
        onQChange={filters.setQ}
        onSearch={() => { filters.search(); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
        status={filters.status}
        onStatusChange={filters.setStatus}
        statusOptions={[
          { value: '', label: tUI('common.all') },
          { value: 'pending', label: t('pending') },
          { value: 'processing', label: t('processing') },
          { value: 'completed', label: t('completed') },
          { value: 'failed', label: t('failed') },
        ]}
        qPlaceholder="Nome do arquivo"
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage="Nenhum lote de importação."
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
