/**
 * Espelha o JSON da API Rails (via Nest BFF em /api/v1). Manter alinhado com
 * credito-poc-nestjs/src/domain/rails-entities.ts
 */
export interface Originator {
  id: number;
  legal_name: string;
  tax_id: string;
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
}

export interface OriginatorSummary {
  id: number;
  legal_name: string;
  tax_id: string;
}

export interface Receivable {
  id: number;
  originator_id: number;
  reference_number: string;
  amount_cents: number;
  due_on: string;
  status: string;
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
  originator?: OriginatorSummary;
}

export interface CreditOperation {
  id: number;
  originator_id: number;
  receivable_id: number;
  funded_amount_cents: number;
  rate: string;
  status: string;
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
  receivable?: Pick<
    Receivable,
    "id" | "reference_number" | "amount_cents" | "due_on" | "status"
  >;
  originator?: OriginatorSummary;
}

export interface RegulatoryGap {
  id: number;
  credit_operation_id: number | null;
  area: string;
  code: string | null;
  description: string | null;
  severity: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
}

export interface ImportRowError {
  row: number;
  errors: string[];
}

export interface ImportBatch {
  id: number;
  filename: string;
  file_type: string;
  originator_id: number | null;
  status: string;
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  error_sample: ImportRowError[];
  created_at: string;
  updated_at: string;
}

export const API_V1 = "/api/v1" as const;
export const API_V2 = "/api/v2" as const;

export interface DashboardStats {
  originators: { total: number };
  receivables: { total: number; total_amount_cents: number; by_status: Record<string, number> };
  credit_operations: { total: number; total_funded_cents: number; avg_rate: string; by_status: Record<string, number> };
  regulatory_gaps: { total: number; open: number };
  imports: { total: number; pending: number; processing: number; completed: number; failed: number };
}

export interface RailsEvent {
  entity: string;
  /**
   * Domain events published by Rails (via Redis Streams).
   * Most entities use: created/updated/discarded.
   * Some async workflows (e.g. exports) may publish: requested/completed/failed.
   */
  action: string;
  id?: number;
  meta?: Record<string, unknown>;
  time: string;
}
