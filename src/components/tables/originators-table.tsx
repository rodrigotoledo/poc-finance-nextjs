'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type Originator } from '@/lib/types/rails-entities';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { formatDate, formatCnpj } from '@/lib/format';
import { useServerEvents } from '@/hooks/use-server-events';
import { DataTable } from '@/components/ui/data-table';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { tUI } from '@/lib/i18n/ui';
import { ExportCsvControl } from '@/components/ui/export-csv';

const col = createColumnHelper<Originator>();

const columns = [
  col.accessor('id', {
    header: 'ID',
    cell: (i) => <span className="tabular-nums text-xs text-zinc-400">{i.getValue()}</span>,
  }),
  col.accessor('legal_name', { header: 'Razão Social' }),
  col.accessor('tax_id', {
    header: 'CNPJ',
    cell: (i) => <span className="font-mono text-xs">{formatCnpj(i.getValue())}</span>,
  }),
  col.accessor('created_at', {
    header: 'Criado',
    cell: (i) => <span className="text-xs text-zinc-500">{formatDate(i.getValue())}</span>,
  }),
];

export function OriginatorsTable({ initialPage }: { initialPage: PaginatedResponse<Originator> }) {
  useServerEvents(['originators']);

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
    queryKey: ['originators', pagination.pageIndex, pagination.pageSize, filters.qApplied],
    queryFn: () =>
      fetchPaginated<Originator>(`${API_V1}/originators`, {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        extra: { q: filters.qApplied || undefined },
      }),
    placeholderData: keepPreviousData,
    initialData: matchesInitial ? initialPage : undefined,
  });

  const pageCount = Math.max(1, data.meta.total_pages);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ExportCsvControl entity="originators" />
      </div>
      <TableFilters
        q={filters.q}
        onQChange={filters.setQ}
        onSearch={() => { filters.search(); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
        status=""
        onStatusChange={() => {}}
        statusOptions={[{ value: '', label: tUI('common.all') }]}
        qPlaceholder="Razão social ou CNPJ"
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage="Nenhum cedente."
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
