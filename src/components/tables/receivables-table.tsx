'use client';

import { DataTable } from '@/components/ui/data-table';
import { ExportCsvControl } from '@/components/ui/export-csv';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { useServerEvents } from '@/hooks/use-server-events';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { formatDate } from '@/lib/format';
import { t } from '@/lib/i18n/status';
import { tUI } from '@/lib/i18n/ui';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { API_V1, type Receivable } from '@/lib/types/rails-entities';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const col = createColumnHelper<Receivable>();

const columns = [
  col.accessor('reference_number', {
    header: 'Referência',
    cell: (i) => <span className="font-mono text-xs">{i.getValue()}</span>,
  }),
  col.accessor((row) => row.originator?.legal_name ?? String(row.originator_id), {
    id: 'originator',
    header: 'Cedente',
    cell: (i) => <span className="text-xs text-zinc-500">{i.getValue()}</span>,
  }),
  col.accessor('amount_cents', {
    header: 'Valor',
    cell: (i) => <span className="tabular-nums">{formatBRL(i.getValue())}</span>,
  }),
  col.accessor('due_on', {
    header: 'Vencimento',
    cell: (i) => <span className="text-xs">{formatDate(i.getValue())}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.getValue())}`}>
        {t(i.getValue())}
      </span>
    ),
  }),
];

export function ReceivablesTable({ initialPage, initialFilters }: { initialPage: PaginatedResponse<Receivable>, initialFilters?: { q?: string, status?: string } }) {
  useServerEvents(['receivables']);

  const filters = useTableFilters(initialFilters);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPage.meta.page - 1,
    pageSize: initialPage.meta.per_page,
  });

  const matchesInitial =
    !filters.hasFilters &&
    pagination.pageIndex === initialPage.meta.page - 1 &&
    pagination.pageSize === initialPage.meta.per_page;

  const { data = initialPage } = useQuery({
    queryKey: ['receivables', pagination.pageIndex, pagination.pageSize, filters.qApplied, filters.statusApplied],
    queryFn: () =>
      fetchPaginated<Receivable>(`${API_V1}/receivables`, {
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
        <ExportCsvControl entity="receivables" />
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
          { value: 'eligible', label: t('eligible') },
          { value: 'advanced', label: t('advanced') },
          { value: 'cancelled', label: t('cancelled') },
        ]}
        qPlaceholder="Referência, cedente (nome/CNPJ)"
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage="Nenhum recebível."
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
