import { PageHeader } from "@/components/page-header";
import { DataError } from "@/components/data-error";
import { fetchPaginated } from "@/lib/api/fetch-json";
import type { Receivable } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import { ReceivablesTable } from "@/components/tables/receivables-table";
import { ReceivableForm } from "@/components/forms/receivable-form";

export default async function ReceivablesPage() {
  let initialPage: PaginatedResponse<Receivable> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<Receivable>(`${API_V1}/receivables`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title="Recebíveis" />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Recebíveis"
        description="Valores em centavos na API; exibidos em BRL."
      />
      <ReceivableForm />
      <ReceivablesTable initialPage={initialPage} />
    </div>
  );
}
