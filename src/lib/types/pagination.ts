/** Metadados de paginação da API Rails (Pagy), alinhados com TanStack Table manualPagination. */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Alinhado a `Pagy::DEFAULT[:items]` no Rails (config/initializers/pagy.rb). */
export const DEFAULT_PAGE_SIZE = 20;
