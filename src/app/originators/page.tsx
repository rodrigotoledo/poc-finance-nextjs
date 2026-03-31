import { DataError } from "@/components/data-error";
import { OriginatorForm } from "@/components/forms/originator-form";
import { PageHeader } from "@/components/page-header";
import { OriginatorsTable } from "@/components/tables/originators-table";
import { fetchPaginated } from "@/lib/api/fetch-json";
import { tUI } from "@/lib/i18n/ui";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import type { Originator } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";

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
        <PageHeader title={tUI('originators.page.title')} />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={tUI('originators.page.title')}
        description={tUI('originators.page.description')}
      />
      <OriginatorForm />
      <OriginatorsTable initialPage={initialPage} />
    </div>
  );
}
