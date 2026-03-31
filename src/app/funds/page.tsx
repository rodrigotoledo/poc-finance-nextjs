import { PageHeader } from '@/components/page-header';
import { DataError } from '@/components/data-error';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1 } from '@/lib/types/rails-entities';
import type { Fund } from '@/lib/types/investment-domain';
import type { PaginatedResponse } from '@/lib/types/pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/types/pagination';
import { FundForm } from '@/components/funds/fund-form';
import { FundsOverview } from '@/components/funds/funds-overview';
import { FundsRealtime } from '@/components/funds/funds-realtime';
import { FundsTable } from '@/components/funds/funds-table';
import { tUI } from '@/lib/i18n/ui';

export default async function FundsPage() {
  let initialPage: PaginatedResponse<Fund> | null = null;
  let error: string | null = null;
  try {
    initialPage = await fetchPaginated<Fund>(`${API_V1}/funds`, {
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    });
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }

  if (error || !initialPage) {
    return (
      <>
        <PageHeader title={tUI('funds.page.title')} />
        <DataError message={error ?? tUI('common.invalidResponse')} />
      </>
    );
  }

  return (
    <FundsRealtime>
      <div>
        <PageHeader
          title={tUI('funds.page.title')}
          description={tUI('funds.page.description')}
        />
        <FundForm />
        <FundsOverview />
        <FundsTable initialPage={initialPage} />
      </div>
    </FundsRealtime>
  );
}
