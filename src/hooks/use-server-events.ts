'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getEventsSocket } from '@/lib/api/events-socket';

/**
 * Tempo real: Rails `Publishable` → `RedisPublisher` (stream `poc:events:stream`) → Nest
 * `EventsService` (XREADGROUP) → `EventsGateway` (socket.io `entity_event`) → invalidação React Query.
 *
 * O agregado GET /api/v1/funds/dashboard não usa TanStack; ver `useFundsDashboardStream`.
 */
export function useServerEvents(entities: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getEventsSocket();
    const handler = (event: { entity: string }) => {
      if (entities.includes(event.entity)) {
        void queryClient.invalidateQueries({ queryKey: [event.entity] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }
    };
    socket.on('entity_event', handler);
    return () => {
      socket.off('entity_event', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);
}
