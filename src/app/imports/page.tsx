import { PageHeader } from "@/components/page-header";
import { DataError } from "@/components/data-error";
import { fetchPaginated } from "@/lib/api/fetch-json";
import type { ImportBatch } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import { ImportsTable } from "@/components/tables/imports-table";
import { ImportForm } from "@/components/forms/import-form";

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
        <PageHeader title="Importações" />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Importações"
        description="Lotes ordenados por data (mais recentes primeiro). Envio multipart continua na API."
      />
      <ImportForm />
      <ImportsTable initialPage={initialPage} />
    </div>
  );
}
