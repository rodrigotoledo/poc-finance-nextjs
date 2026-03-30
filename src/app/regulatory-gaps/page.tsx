import { PageHeader } from "@/components/page-header";
import { DataError } from "@/components/data-error";
import { fetchPaginated } from "@/lib/api/fetch-json";
import type { RegulatoryGap } from "@/lib/types/rails-entities";
import { API_V1 } from "@/lib/types/rails-entities";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/types/pagination";
import { RegulatoryGapsTable } from "@/components/tables/regulatory-gaps-table";
import { RegulatoryGapForm } from "@/components/forms/regulatory-gap-form";

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
        <PageHeader title="Gaps regulatórios" />
        <DataError message={error ?? "Resposta inválida"} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Gaps regulatórios"
        description="Modelo Compliance::RegulatoryGap no Rails."
      />
      <RegulatoryGapForm />
      <RegulatoryGapsTable initialPage={initialPage} />
    </div>
  );
}
