import { DataError } from "@/components/data-error";
import { ImportForm } from "@/components/forms/import-form";
import { PageHeader } from "@/components/page-header";
import { ImportsTable } from "@/components/tables/imports-table";
import { fetchPaginated } from "@/lib/api/fetch-json";
import { tUI } from "@/lib/i18n/ui";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import type { ImportBatch } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";

export default async function ImportsPage() {
  let initialPage: PaginatedResponse<ImportBatch> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<ImportBatch>(`${API_V1}/imports`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title={tUI('imports.page.title')} />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={tUI('imports.page.title')}
        description={tUI('imports.page.description')}
      />
      <ImportForm />
      <ImportsTable initialPage={initialPage} />
    </div>
  );
}
