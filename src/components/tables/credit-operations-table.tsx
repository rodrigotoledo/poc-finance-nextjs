'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type CreditOperation } from '@/lib/types/rails-entities';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { formatDate } from '@/lib/format';
import { statusBadgeClass } from '@/lib/ui/status-badges';
import { t } from '@/lib/i18n/status';
import { useServerEvents } from '@/hooks/use-server-events';
import { DataTable } from '@/components/ui/data-table';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { tUI } from '@/lib/i18n/ui';
import { ExportCsvControl } from '@/components/ui/export-csv';

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const col = createColumnHelper<CreditOperation>();

const columns = [
  col.accessor('id', {
    header: 'ID',
    cell: (i) => <span className="tabular-nums text-xs text-zinc-400">{i.getValue()}</span>,
  }),
  col.accessor('funded_amount_cents', {
    header: 'Valor Financiado',
    cell: (i) => <span className="tabular-nums">{formatBRL(i.getValue())}</span>,
  }),
  col.accessor('rate', {
    header: 'Taxa',
    cell: (i) => <span className="tabular-nums">{i.getValue()}%</span>,
  }),
  col.accessor((row) => row.receivable?.reference_number ?? String(row.receivable_id), {
    id: 'receivable',
    header: 'Recebível',
    cell: (i) => <span className="font-mono text-xs">{i.getValue()}</span>,
  }),
  col.accessor((row) => row.originator?.legal_name ?? String(row.originator_id), {
    id: 'originator',
    header: 'Cedente',
    cell: (i) => <span className="text-xs text-zinc-500">{i.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.getValue())}`}>
        {t(i.getValue())}
      </span>
    ),
  }),
  col.accessor('created_at', {
    header: 'Criado',
    cell: (i) => <span className="text-xs text-zinc-500">{formatDate(i.getValue())}</span>,
  }),
];

export function CreditOperationsTable({ initialPage }: { initialPage: PaginatedResponse<CreditOperation> }) {
  useServerEvents(['credit_operations']);

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
    queryKey: ['credit_operations', pagination.pageIndex, pagination.pageSize, filters.qApplied, filters.statusApplied],
    queryFn: () =>
      fetchPaginated<CreditOperation>(`${API_V1}/credit_operations`, {
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
        <ExportCsvControl entity="credit_operations" />
      </div>
      <TableFilters
        q={filters.q}
        onQChange={filters.setQ}
        onSearch={() => { filters.search(); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
        status={filters.status}
        onStatusChange={filters.setStatus}
        statusOptions={[
          { value: '', label: tUI('common.all') },
          { value: 'draft', label: t('draft') },
          { value: 'approved', label: t('approved') },
          { value: 'settled', label: t('settled') },
          { value: 'cancelled', label: t('cancelled') },
        ]}
        qPlaceholder="Recebível (ref) ou cedente (nome/CNPJ)"
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage="Nenhuma operação de crédito."
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
