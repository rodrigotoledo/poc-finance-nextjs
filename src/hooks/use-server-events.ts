'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

/**
 * Connects to NestJS WebSocket (socket.io) and invalidates TanStack Query
 * caches whenever Rails publishes a change for one of the given entity keys.
 * Used by every CRUD table page.
 */
export function useServerEvents(entities: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nestUrl = process.env.NEXT_PUBLIC_NEST_URL ?? 'http://localhost:4000';
    const socket = io(nestUrl, { transports: ['websocket'] });

    socket.on('entity_event', (event: { entity: string }) => {
      if (entities.includes(event.entity)) {
        void queryClient.invalidateQueries({ queryKey: [event.entity] });
        // Also refresh the dashboard aggregate when any entity changes
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    });

    return () => { socket.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);
}
