'use client';

import { io, type Socket } from 'socket.io-client';

/**
 * Uma conexão socket.io por separador (Nest `EventsGateway` ← Redis stream `poc:events:stream`).
 * Vários hooks podem subscrever `entity_event` sem abrir múltiplas ligações.
 */
let socket: Socket | null = null;

export function getEventsSocket(): Socket {
  if (typeof window === 'undefined') {
    throw new Error('getEventsSocket is client-only');
  }
  if (!socket) {
    const nestUrl = process.env.NEXT_PUBLIC_NEST_URL ?? 'http://localhost:4000';
    socket = io(nestUrl, { transports: ['websocket'] });
  }
  return socket;
}
