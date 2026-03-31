import { DataError } from "@/components/data-error";
import { RegulatoryGapForm } from "@/components/forms/regulatory-gap-form";
import { PageHeader } from "@/components/page-header";
import { RegulatoryGapsTable } from "@/components/tables/regulatory-gaps-table";
import { fetchPaginated } from "@/lib/api/fetch-json";
import { tUI } from "@/lib/i18n/ui";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import type { RegulatoryGap } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";

export default async function RegulatoryGapsPage() {
  let initialPage: PaginatedResponse<RegulatoryGap> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<RegulatoryGap>(`${API_V1}/regulatory_gaps`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title={tUI('regulatoryGaps.page.title')} />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={tUI('regulatoryGaps.page.title')}
        description={tUI('regulatoryGaps.page.description')}
      />
      <RegulatoryGapForm />
      <RegulatoryGapsTable initialPage={initialPage} />
    </div>
  );
}
