'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

/**
 * Tempo real: Rails `Publishable` → `RedisPublisher` (pub/sub + stream) → Nest `EventsService`
 * (consumer group) → `EventsGateway` (socket.io `entity_event`) → aqui invalidamos React Query.
 *
 * Use nas páginas de CRUD / visão geral cujos dados devem atualizar quando o domínio mudar no Rails.
 */
export function useServerEvents(entities: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nestUrl = process.env.NEXT_PUBLIC_NEST_URL ?? 'http://localhost:4000';
    const socket = io(nestUrl, { transports: ['websocket'] });

    socket.on('entity_event', (event: { entity: string }) => {
      if (entities.includes(event.entity)) {
        void queryClient.invalidateQueries({ queryKey: [event.entity] });
        // Dashboard usa duas chaves (StatsCards vs useDashboardStats) — manter alinhado.
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }
    });

    return () => { socket.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);
}
