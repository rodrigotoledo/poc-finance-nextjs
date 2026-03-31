import { getStatusTailwindClass } from './status-colors';

export function statusBadgeClass(status: string): string {
  return getStatusTailwindClass(status);
}
