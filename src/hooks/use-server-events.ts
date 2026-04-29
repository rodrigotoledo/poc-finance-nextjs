'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/api/config';
import type { RailsEvent } from '@/lib/types/rails-entities';

/**
 * Tempo real: Rails publica eventos e o Next consome via SSE (`GET /api/v2/events`).
 * Cada evento pode invalidar queries TanStack, mantendo a UI atualizada.
 */
export function useServerEvents(entities: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const url = `${getApiBaseUrl()}/api/v2/events`;
    const source = new EventSource(url);

    const handler = (event: RailsEvent) => {
      if (entities.includes(event.entity)) {
        void queryClient.invalidateQueries({ queryKey: [event.entity] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }
    };

    source.onmessage = (msg) => {
      try {
        handler(JSON.parse(msg.data) as RailsEvent);
      } catch {
        // Ignore malformed events to keep the stream resilient.
      }
    };

    return () => {
      source.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);
}
