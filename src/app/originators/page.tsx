import { PageHeader } from "@/components/page-header";
import { DataError } from "@/components/data-error";
import { fetchPaginated } from "@/lib/api/fetch-json";
import type { Originator } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import { OriginatorsTable } from "@/components/tables/originators-table";
import { OriginatorForm } from "@/components/forms/originator-form";

export default async function OriginatorsPage() {
  let initialPage: PaginatedResponse<Originator> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<Originator>(`${API_V1}/originators`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title="Originadores" />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Originadores"
        description="Registros ativos (soft delete excluídos da lista na API). Paginação: ?page=&per_page= na API Rails."
      />
      <OriginatorForm />
      <OriginatorsTable initialPage={initialPage} />
    </div>
  );
}
