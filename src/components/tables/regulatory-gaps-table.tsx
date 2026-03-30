'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type RegulatoryGap } from '@/lib/types/rails-entities';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { formatDate } from '@/lib/format';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import { t } from '@/lib/i18n/status';
import { useServerEvents } from '@/hooks/use-server-events';
import { DataTable } from '@/components/ui/data-table';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { tUI } from '@/lib/i18n/ui';
import { ExportCsvControl } from '@/components/ui/export-csv';

const col = createColumnHelper<RegulatoryGap>();

const columns = [
  col.accessor('area', { header: 'Área', cell: (i) => <span className="font-medium">{i.getValue()}</span> }),
  col.accessor('code', {
    header: 'Código',
    cell: (i) => <span className="font-mono text-xs">{i.getValue() ?? '—'}</span>,
  }),
  col.accessor('severity', {
    header: 'Severidade',
    cell: (i) => <span className="text-xs">{t(i.getValue()) ?? '—'}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.getValue())}`}>
        {t(i.getValue())}
      </span>
    ),
  }),
  col.accessor('credit_operation_id', {
    header: 'Op. Crédito',
    cell: (i) => <span className="tabular-nums text-xs text-zinc-400">{i.getValue() ?? '—'}</span>,
  }),
  col.accessor('description', {
    header: 'Descrição',
    cell: (i) => (
      <span className="max-w-xs truncate block text-xs text-zinc-500">{i.getValue() ?? '—'}</span>
    ),
  }),
  col.accessor('updated_at', {
    header: 'Atualizado',
    cell: (i) => <span className="text-xs text-zinc-400">{formatDate(i.getValue())}</span>,
  }),
];

export function RegulatoryGapsTable({ initialPage }: { initialPage: PaginatedResponse<RegulatoryGap> }) {
  useServerEvents(['regulatory_gaps']);

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
    queryKey: ['regulatory_gaps', pagination.pageIndex, pagination.pageSize, filters.qApplied, filters.statusApplied],
    queryFn: () =>
      fetchPaginated<RegulatoryGap>(`${API_V1}/regulatory_gaps`, {
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
        <ExportCsvControl entity="regulatory_gaps" />
      </div>
      <TableFilters
        q={filters.q}
        onQChange={filters.setQ}
        onSearch={() => { filters.search(); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
        status={filters.status}
        onStatusChange={filters.setStatus}
        statusOptions={[
          { value: '', label: tUI('common.all') },
          { value: 'open', label: t('open') },
          { value: 'resolved', label: t('resolved') },
          { value: 'dismissed', label: t('dismissed') },
        ]}
        qPlaceholder="Área, código ou descrição"
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage="Nenhuma lacuna regulatória."
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
