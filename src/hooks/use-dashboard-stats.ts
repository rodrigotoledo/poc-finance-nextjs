import { fetchNestJson } from '@/lib/api/fetch-nest';
import type { DashboardStats } from '@/lib/types/rails-entities';
import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchNestJson<DashboardStats>('/dashboard'),
    refetchInterval: 1_500, // refetch every 1.5s as fallback
    refetchOnWindowFocus: true,
  });
}