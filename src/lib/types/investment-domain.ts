/** Entidades de investimentos / fundos (API Rails /api/v1). */

export interface Fund {
  id: number;
  name: string;
  fund_type: string | null;
  total_commitment_cents: number | null;
  allocated_amount_cents: number;
  available_amount_cents: number | null;
  inception_date: string | null;
  maturity_date: string | null;
  target_return_rate: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: number;
  legal_name: string;
  tax_id: string;
  investor_type: string | null;
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
}

/** GET /api/v1/funds/dashboard — agregados na API Rails (ledger completo, não só primeira página). */
export interface FundsDashboard {
  funds_count: number;
  by_status: Record<string, number>;
  totals: {
    total_commitment_cents: number;
    total_allocated_cents: number;
    total_available_cents: number;
  };
  investments_via_funds: {
    count: number;
    total_amount_cents: number;
  };
  risks_for_funds: {
    count: number;
    by_risk_type: Record<string, number>;
    avg_risk_score: number | null;
    pending_mitigation_count: number;
  };
}
