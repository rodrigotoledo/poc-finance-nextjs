'use client';

import { useServerEvents } from '@/hooks/use-server-events';

/**
 * Invalida listagens (TanStack) quando o stream Redis → Nest emite `entity_event`.
 * Os cartões agregados em `FundsOverview` usam `useFundsDashboardStream` (sem TanStack).
 */
export function FundsRealtime({ children }: { children: React.ReactNode }) {
  useServerEvents(['funds', 'investments', 'investment_risks']);
  return <>{children}</>;
}
