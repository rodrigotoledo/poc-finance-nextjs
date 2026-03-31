'use client';

import { useServerEvents } from '@/hooks/use-server-events';

/**
 * Invalida listagens e o dashboard de fundos quando Rails publica em Redis
 * (fundos, investimentos ligados a fundos, riscos de investimento).
 */
export function FundsRealtime({ children }: { children: React.ReactNode }) {
  useServerEvents(['funds', 'investments', 'investment_risks']);
  return <>{children}</>;
}
