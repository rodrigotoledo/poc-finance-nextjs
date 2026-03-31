import { DataError } from "@/components/data-error";
import { ReceivableForm } from "@/components/forms/receivable-form";
import { PageHeader } from "@/components/page-header";
import { ReceivablesTable } from "@/components/tables/receivables-table";
import { fetchPaginated } from "@/lib/api/fetch-json";
import { tUI } from '@/lib/i18n/ui';
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import type { Receivable } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReceivablesPage({ searchParams }: PageProps) {
  const { q: rawQ, status: rawStatus } = await searchParams;
  const q = typeof rawQ === 'string' ? rawQ : '';
  const status = typeof rawStatus === 'string' ? rawStatus : '';

  let initialPage: PaginatedResponse<Receivable> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<Receivable>(`${API_V1}/receivables`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
      extra: {
        q: q || undefined,
        status: status || undefined,
      },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title={tUI('receivables.page.title')} />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={tUI('receivables.page.title')}
        description={tUI('receivables.page.description')}
      />
      <ReceivableForm />
      <ReceivablesTable initialPage={initialPage} initialFilters={{ q, status }} />
    </div>
  );
}
