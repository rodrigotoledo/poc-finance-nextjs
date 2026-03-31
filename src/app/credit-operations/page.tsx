import { DataError } from "@/components/data-error";
import { CreditOperationForm } from "@/components/forms/credit-operation-form";
import { PageHeader } from "@/components/page-header";
import { CreditOperationsTable } from "@/components/tables/credit-operations-table";
import { fetchPaginated } from "@/lib/api/fetch-json";
import { tUI } from "@/lib/i18n/ui";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import type { CreditOperation } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";

export default async function CreditOperationsPage() {
  let initialPage: PaginatedResponse<CreditOperation> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<CreditOperation>(`${API_V1}/credit_operations`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title={tUI('creditOperations.page.title')} />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={tUI('creditOperations.page.title')}
        description={tUI('creditOperations.page.description')}
      />
      <CreditOperationForm />
      <CreditOperationsTable initialPage={initialPage} />
    </div>
  );
}
