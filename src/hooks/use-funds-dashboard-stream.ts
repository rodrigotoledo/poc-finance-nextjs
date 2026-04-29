'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '@/lib/api/fetch-json';
import { getApiBaseUrl } from '@/lib/api/config';
import { API_V1 } from '@/lib/types/rails-entities';
import type { FundsDashboard } from '@/lib/types/investment-domain';

const DASHBOARD_ENTITIES = new Set(['funds', 'investments', 'investment_risks']);

/**
 * Agregados da página de fundos: carrega de Rails e atualiza via SSE (`/api/v2/events`).
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
    const url = `${getApiBaseUrl()}/api/v2/events`;
    const source = new EventSource(url);

    source.onmessage = (msg) => {
      try {
        const ev = JSON.parse(msg.data) as { entity?: string };
        if (ev.entity && DASHBOARD_ENTITIES.has(ev.entity)) {
          void load();
        }
      } catch {
        // Ignore malformed events.
      }
    };

    return () => {
      source.close();
    };
  }, [load]);

  return { data, loading, error, reload: load };
}
