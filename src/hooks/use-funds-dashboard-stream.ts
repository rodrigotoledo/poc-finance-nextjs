'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '@/lib/api/fetch-json';
import { getEventsSocket } from '@/lib/api/events-socket';
import { API_V1 } from '@/lib/types/rails-entities';
import type { FundsDashboard } from '@/lib/types/investment-domain';

const DASHBOARD_ENTITIES = new Set(['funds', 'investments', 'investment_risks']);

/**
 * Agregados da página de fundos: carrega de Rails e atualiza quando o Nest emite
 * `entity_event` (origem: Redis stream `poc:events:stream`, não invalidação TanStack).
 */
export function useFundsDashboardStream() {
  const [data, setData] = useState<FundsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      const next = await fetchJson<FundsDashboard>(`${API_V1}/funds/dashboard`);
      setData(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const s = getEventsSocket();
    const handler = (event: { entity: string }) => {
      if (DASHBOARD_ENTITIES.has(event.entity)) {
        void load();
      }
    };
    s.on('entity_event', handler);
    return () => {
      s.off('entity_event', handler);
    };
  }, [load]);

  return { data, loading, error, reload: load };
}
