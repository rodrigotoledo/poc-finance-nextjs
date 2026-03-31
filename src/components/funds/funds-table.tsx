'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1 } from '@/lib/types/rails-entities';
import type { Fund } from '@/lib/types/investment-domain';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { formatBrlFromCents } from '@/lib/format';
import { formatDate } from '@/lib/format';
import { DataTable } from '@/components/ui/data-table';
import { TableFilters, useTableFilters } from '@/components/ui/table-filters';
import { tUI } from '@/lib/i18n/ui';
import { fundStatus, t } from '@/lib/i18n/status';

const col = createColumnHelper<Fund>();

export function FundsTable({ initialPage }: { initialPage: PaginatedResponse<Fund> }) {
  const columns = useMemo(
    () => [
      col.accessor('name', {
        header: tUI('funds.table.columns.name'),
        cell: (i) => <span className="font-medium">{i.getValue()}</span>,
      }),
      col.accessor('fund_type', {
        header: tUI('funds.table.columns.type'),
        cell: (i) => (
          <span className="text-xs text-zinc-500">{i.getValue() ?? tUI('common.emDash')}</span>
        ),
      }),
      col.accessor('status', {
        header: tUI('funds.table.columns.status'),
        cell: (i) => (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{t(i.getValue())}</span>
        ),
      }),
      col.accessor('allocated_amount_cents', {
        header: tUI('funds.table.columns.allocated'),
        cell: (i) => <span className="tabular-nums">{formatBrlFromCents(i.getValue())}</span>,
      }),
      col.accessor('available_amount_cents', {
        header: tUI('funds.table.columns.available'),
        cell: (i) => {
          const v = i.getValue();
          return (
            <span className="tabular-nums">{v != null ? formatBrlFromCents(v) : tUI('common.emDash')}</span>
          );
        },
      }),
      col.accessor('created_at', {
        header: tUI('funds.table.columns.createdAt'),
        cell: (i) => <span className="text-xs text-zinc-500">{formatDate(i.getValue())}</span>,
      }),
    ],
    [],
  );
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
    queryKey: ['funds', pagination.pageIndex, pagination.pageSize, filters.qApplied, filters.statusApplied],
    queryFn: () =>
      fetchPaginated<Fund>(`${API_V1}/funds`, {
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
      <TableFilters
        q={filters.q}
        onQChange={filters.setQ}
        onSearch={() => {
          filters.search();
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        }}
        status={filters.status}
        onStatusChange={filters.setStatus}
        statusOptions={[
          { value: '', label: tUI('common.all') },
          { value: 'active', label: fundStatus.active },
          { value: 'closed', label: fundStatus.closed },
          { value: 'winding_up', label: fundStatus.winding_up },
        ]}
        qPlaceholder={tUI('funds.table.searchPlaceholder')}
      />
      <DataTable
        columns={columns}
        data={data.data}
        emptyMessage={tUI('funds.table.empty')}
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data.meta.total_count}
      />
    </div>
  );
}
